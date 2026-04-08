#!/usr/bin/env node
/**
 * notion-sync.mjs
 *
 * Syncs career-ops tracker data → Notion Career Pipeline database.
 * Reads data/applications.md, parses each entry, creates or updates
 * pages in the Notion "Career Pipeline" database.
 *
 * Usage:
 *   node scripts/notion-sync.mjs          # sync all entries
 *   node scripts/notion-sync.mjs --dry    # dry run (no writes)
 *   node scripts/notion-sync.mjs --since 2026-01-01  # sync entries after date
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────

const NOTION_TOKEN = process.env.NOTION_TOKEN;
if (!NOTION_TOKEN) {
  console.error('Error: NOTION_TOKEN environment variable is required.');
  console.error('Set it in .env or export NOTION_TOKEN=your_token');
  process.exit(1);
}
const CAREER_PIPELINE_DB = process.env.CAREER_PIPELINE_DB || '33c6830e-8422-810b-9298-f005c60b56d4';
const DRY_RUN = process.argv.includes('--dry');
const SINCE = process.argv.find(a => a.startsWith('--since'))?.split('=')[1];

// ── Notion API ────────────────────────────────────────────────────────────────

function notionRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.notion.com',
      path: `/v1/${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ── Parser: applications.md ───────────────────────────────────────────────────

/**
 * Parse the markdown table in data/applications.md.
 * Expected columns: # | Date | Company | Role | Score | Status | PDF | Report | Notes
 */
function parseTracker(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const entries = [];

  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('---') || line.toLowerCase().includes('| # |')) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 8) continue;

    const [num, date, company, role, score, status, pdf, report, ...notesParts] = cols;
    if (!company || company === 'Company') continue;

    // Extract URL from report link: [num](reports/...)
    const reportMatch = report?.match(/\[.*?\]\((.*?)\)/);
    const reportPath = reportMatch ? reportMatch[1] : null;

    // Extract score as number
    const scoreNum = parseFloat(score?.replace('/5', '') || '0') || null;

    // Map status to Notion status
    const statusMap = {
      'evaluated': 'Evaluating',
      'applied': 'Applied',
      'responded': 'Interview',
      'interview': 'Interview',
      'offer': 'Offer',
      'rejected': 'Rejected',
      'discarded': 'Withdrawn',
      'skip': 'SKIP',
    };
    const notionStatus = statusMap[status?.toLowerCase()] || 'Discovered';

    // Grade from score
    let grade = 'F';
    if (scoreNum >= 4.5) grade = 'A';
    else if (scoreNum >= 4.0) grade = 'B';
    else if (scoreNum >= 3.5) grade = 'C';
    else if (scoreNum >= 3.0) grade = 'D';

    entries.push({
      num: parseInt(num) || 0,
      date: date || null,
      company: company || '',
      role: role || '',
      score: scoreNum,
      grade,
      status: notionStatus,
      pdf: pdf === '✅',
      reportPath,
      notes: notesParts.join(' | ').trim(),
    });
  }

  return entries;
}

// ── Sync: existing Notion pages ───────────────────────────────────────────────

async function getExistingPages() {
  const existing = new Map(); // key: "company|role" → page_id
  let cursor = null;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const res = await notionRequest('POST', `databases/${CAREER_PIPELINE_DB}/query`, body);
    if (res.object === 'error') {
      console.error('Error fetching existing pages:', res.message);
      return existing;
    }

    for (const page of res.results || []) {
      const company = page.properties?.Company?.rich_text?.[0]?.plain_text || '';
      const name = page.properties?.Name?.title?.[0]?.plain_text || '';
      const key = `${company.toLowerCase()}|${name.toLowerCase()}`;
      existing.set(key, page.id);
    }

    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);

  return existing;
}

// ── Build Notion page properties ──────────────────────────────────────────────

function buildProperties(entry) {
  const props = {
    'Name': { title: [{ text: { content: entry.role } }] },
    'Company': { rich_text: [{ text: { content: entry.company } }] },
    'Status': { select: { name: entry.status } },
    'Grade': { select: { name: entry.grade } },
    'PDF Generated': { checkbox: entry.pdf },
  };

  if (entry.score !== null) {
    props['Score'] = { number: entry.score };
  }
  if (entry.date) {
    props['Applied Date'] = { date: { start: entry.date } };
  }
  if (entry.notes) {
    props['Notes'] = { rich_text: [{ text: { content: entry.notes.substring(0, 2000) } }] };
  }

  return props;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const trackerPath = path.join(ROOT, 'data', 'applications.md');
  const entries = parseTracker(trackerPath);

  if (entries.length === 0) {
    console.log('No entries in tracker. Nothing to sync.');
    return;
  }

  // Filter by date if --since
  const filtered = SINCE
    ? entries.filter(e => e.date && e.date >= SINCE)
    : entries;

  console.log(`Found ${entries.length} tracker entries, syncing ${filtered.length}${DRY_RUN ? ' (DRY RUN)' : ''}...`);

  if (DRY_RUN) {
    filtered.forEach(e => console.log(`  [DRY] ${e.num}. ${e.company} — ${e.role} (${e.grade} ${e.score}/5 ${e.status})`));
    return;
  }

  // Get existing Notion pages for dedup
  const existing = await getExistingPages();
  console.log(`  ${existing.size} existing pages in Notion`);

  let created = 0, updated = 0, skipped = 0;

  for (const entry of filtered) {
    const key = `${entry.company.toLowerCase()}|${entry.role.toLowerCase()}`;
    const existingId = existing.get(key);
    const props = buildProperties(entry);

    try {
      if (existingId) {
        // Update existing page
        await notionRequest('PATCH', `pages/${existingId}`, { properties: props });
        console.log(`  ✓ Updated: ${entry.company} — ${entry.role}`);
        updated++;
      } else {
        // Create new page
        await notionRequest('POST', 'pages', {
          parent: { database_id: CAREER_PIPELINE_DB },
          properties: props,
        });
        console.log(`  + Created: ${entry.company} — ${entry.role} (${entry.grade})`);
        created++;
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${entry.company} — ${entry.role}:`, err.message);
      skipped++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nSync complete: ${created} created, ${updated} updated, ${skipped} failed`);
}

main().catch(console.error);
