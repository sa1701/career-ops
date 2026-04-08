# Mode: AU Internship Evaluation

<!-- 
  Load this mode for: Australian internship-specific evaluations
  Loaded by: SKILL.md when archetype is intern-* AND location is AU
  Reads: modes/_shared.md + modes/_profile.md + cv.md + config/profile.yml
-->

## When This Mode Applies

Use this mode (or incorporate these rules) when:
- The JD is for an internship, vacation work, or cadetship in Australia
- The company is based in Australia
- The role mentions "intern", "graduate", "vacation work", "placement", "cadet"

---

## AU Internship Evaluation Framework

### Block A: Role Classification

Identify and state clearly:

| Field | Value |
|-------|-------|
| **Type** | Internship / Graduate / Vacation Work / Cadetship |
| **Duration** | (if stated) Summer 10-12 weeks / Ongoing part-time / etc. |
| **Paid** | Yes / No / Not stated |
| **Window** | Summer (Dec-Feb) / Winter (Jun-Jul) / Ongoing |
| **Visa compatible** | Yes / No / Unclear (student visa = 48hr/fortnight during semester) |
| **Work rights** | AU citizen only / PR / Any valid visa |
| **Location** | On-site / Hybrid / Remote — CBD or suburbs |

### Block B: Intern-Adjusted CV Match

Evaluate match against cv.md with intern expectations, not senior benchmarks:

**Relevant from Seif's CV:**
- Full-stack delivery: Recipe app (Node.js + MySQL + auth + RBAC)
- AI/ML: Generative AI subject (79D), RAG, prompt engineering, Ollama, CNNs
- Databases: PostgreSQL (PL/pgSQL), MongoDB, MySQL
- Systems: UML, OOP, design patterns (C++ simulation)
- Algorithms & data structures (subject)
- Languages: Python, JavaScript, C++, SQL

**Match scale for interns:**
- 4+ = Strong match (3+ relevant skills/subjects directly map to JD)
- 3 = Decent match (2 relevant areas, some upskilling needed)
- 2 = Stretch (1 relevant area, significant gap)
- 1 = Poor fit

### Block C: Learning Quality Assessment

For internships, this replaces "comp research" as the primary evaluation block:

Rate each factor 1-5:

| Factor | What to check |
|--------|---------------|
| **Real project work** | Will you build/ship something? Or admin/support tasks? |
| **Mentorship structure** | Dedicated mentor? Regular check-ins? Team exposure? |
| **Tech stack quality** | Modern/relevant stack vs legacy? Will it add to CV? |
| **Grad pipeline** | Do they hire interns into grad roles? Past precedent? |
| **Team size & culture** | Small team = more ownership; big team = better process |
| **Duration** | 10-12 weeks ideal for summer; shorter = less impact |

### Block D: Company & Role Research

WebSearch for:
1. "{{COMPANY}} internship review" OR "{{COMPANY}} intern experience" — Glassdoor, LinkedIn
2. "{{COMPANY}} graduate program" — do they run a formal program?
3. "{{COMPANY}} internship 2025 OR 2026" — any announcements, LinkedIn posts
4. Check if company is AU-listed / AU-founded (cultural bonus) vs overseas office

### Block E: AU-Specific Compliance Checks

Flag any of these as automatic negatives:

| Red Flag | Score Impact |
|----------|-------------|
| Unpaid + no academic credit | -2.0 |
| "3+ years experience required" for intern | -1.5 |
| Requires AU citizen/PR only (student visa excluded) | Discard immediately |
| JD is for "admin support", "reception", "general duties" | -2.0 |
| No mention of actual technical work | -1.0 |
| "Must be available 5 days/week during semester" (no flexibility) | -0.5 |

**Fair Work note:** Under AU law, most for-profit businesses cannot have unpaid interns (Fair Work Act 2009). If unpaid, flag this and note it may be non-compliant.

**Availability check:** Cross-reference the role's required timing against profile.yml:
- Summer internship (Dec-Feb): ✅ Available full-time
- Winter placement (Jun-Jul): ✅ Available full-time  
- Semester part-time (ongoing): ✅ Up to 2 days/week or 48hr/fortnight
- Full-time during semester with no flexibility: ⚠️ Flag — potential visa/study conflict

### Block F: Interview Prep (Intern Edition)

For intern applications, include:

**Common AU intern interview questions:**
1. "Tell us about yourself and why you want to intern here" — Use: AI specialisation + relevant project + specific company reason
2. "Tell me about a project you're proud of" — Lead with: Recipe app (full delivery) or DB project (technical depth)
3. "What do you want to learn from this internship?" — Answer: Specific to their tech stack, name tools/methods in the JD
4. "Where do you see yourself in 5 years?" — Answer: Honest but ambitious — "working as a full-time engineer in AI/ML, ideally having started as a graduate at a place like this"
5. "Do you have any questions for us?" — Always ask: "What does a typical week look like for the intern team?" and "Do you have a graduate conversion pathway?"

**STAR story to use for "tell me about a challenge":**
Use the UML team project — led a 4-person team, navigated scope creep, scored 85 HD.

---

## Score Calculation (Intern Weights)

| Dimension | Weight |
|-----------|--------|
| Learning quality (Block C) | 25% |
| CV match (Block B) | 20% |
| Mentorship & culture (Block D) | 20% |
| Company reputation | 15% |
| Location / availability fit | 10% |
| Compensation | 5% |
| Red flag deductions (Block E) | Applied directly |
| Role clarity / real work | 5% |

**Final label:**
- 4.5+ → Apply immediately — prioritise
- 4.0-4.4 → Strong candidate, apply
- 3.5-3.9 → Decent, apply if stack aligns
- Below 3.5 → Skip or proceed with specific reason

---

## Output Format

### AU Internship Report Header

```
**Arquetipo:** {{intern-swe | intern-ai-ml | intern-data | intern-fullstack}}
**Score:** {{X.X}}/5
**Grade:** {{A | B | C | D | F}}
**URL:** {{job listing URL}}
**TL;DR:** {{1-line summary}}
**Paid:** {{Yes | No | Unconfirmed}}
**Window:** {{Summer Dec-Feb | Winter Jun-Jul | Ongoing | Semester part-time}}
**Visa:** {{Compatible | Incompatible | Unclear}}
**PDF:** {{✅ | ❌}}
```

### Tracker TSV
Write to `batch/tracker-additions/` as usual. Use `Evaluated` as initial status.

---

## AU Internship Application Tips (include in every evaluation)

Always append a "Next Steps" section to the report:

```
## Next Steps

- [ ] Check if visa is compatible (confirm work rights in JD or on company FAQ)
- [ ] Note application deadline (many AU summer programs close Mar-May)
- [ ] Tailor cover letter paragraph 2 to this specific JD
- [ ] State availability clearly: "Available full-time Dec-Feb 2026"
- [ ] Connect with a current/former intern on LinkedIn before applying (boosts response rate)
- [ ] Check GradConnection for company reviews from past interns
```
