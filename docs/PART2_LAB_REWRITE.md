# GPHY 284 Lab 3 — Part 2 rewrite (migration flows)

**Explorer (live after Pages):** https://andrew-traversemt.github.io/gphy284-state-migration/
**Repo:** https://github.com/Andrew-TraverseMT/gphy284-state-migration  
*(Transfer to Andrew-MSU when ready.)*

**Data:** U.S. Census Bureau *State-to-State Migration Flows: 2024* (ACS/PRCS 1-year, residence 1 year ago). Released Jan 21, 2026.  
https://www.census.gov/data/tables/time-series/demo/geographic-mobility/state-to-state-migration.html

Replace the old Minimal Gallery / IRS 2015–16 section with the following.

---

## Part 2 — State-to-state migration flows

Open the **US State-to-State Migration Explorer**:  
https://andrew-traversemt.github.io/gphy284-state-migration/

This map shows how many people moved from one U.S. state to another, based on where they lived one year earlier (Census ACS estimates). Flow lines are **schematic** (state centroid to centroid)—they are not actual travel paths. Line thickness scales with the number of movers. Each estimate has a 90% margin of error (MOE).

**How to use the explorer**
1. Click a state to select it.
2. Choose **Outflows** (people leaving the selected state) or **Inflows** (people arriving).
3. Use **Show top** to keep the map readable (start with 15).
4. Click a flow line or a row in the ranked table to see movers and ±MOE.

**Instructor-assigned states for this lab**
- Outflow / inflow focus: **Montana**
- Regional comparison: **Texas**
- Pair for asymmetry: **California ↔ Montana**

### Questions

**Q5.** Select **Texas** and set direction to **Outflows**. Which warm-climate destinations (e.g., Florida, Arizona, California, Nevada, New Mexico, Georgia, Louisiana, etc.) receive the most movers from Texas? List your top three destinations and the mover counts (from the table or popup).

**Q6.** Select **Montana** and **Outflows**. What is the #1 destination state for people leaving Montana, and about how many movers does that flow show?

**Q7.** Keep **Montana** selected and switch to **Inflows**. What is the largest source state into Montana, and how many movers?

**Q8.** Still on Montana inflows (or browse the table), find the **California → Montana** flow. Report the mover estimate and its ±MOE. In one sentence, what does a large MOE relative to the estimate imply about certainty?

**Q9 (new — asymmetry).** Compare **California → Montana** (inflows to MT) with **Montana → California** (outflows from MT). Which direction is larger, and by roughly how much?

---

### Answer key (ACS 2024 — for graders; do not publish to students)

- Q5 Texas warm outs (examples): CA 45,447; FL 45,259; GA 20,968; LA 19,850; NM 13,543; AZ 10,306 …
- Q6 Montana #1 outflow: **Washington** 6,291
- Q7 Montana #1 inflow: **California** 4,872
- Q8 CA→MT: **4,872** (± check live popup MOE)
- Q9: CA→MT 4,872 vs MT→CA 2,531 → CA→MT larger by ~2,300

### Canvas / PDF checklist for Super TA
- [ ] Remove Minimal Gallery outflow/inflow URLs (appids 586413c9… / f26ab172…)
- [ ] Insert explorer URL above
- [ ] Replace IRS 2015–16 / Distributive Flow Lines wording with Census ACS 2024
- [ ] Update Q5–Q8; add Q9 asymmetry
- [ ] Update answer key privately
