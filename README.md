# US State-to-State Migration Explorer (ACS 2024)

Static Leaflet app for **GPHY 284 Lab 3 Part 2**.

**Live:** https://andrew-msu.github.io/gphy284-state-migration/  
**Repo:** https://github.com/Andrew-MSU/gphy284-state-migration

## Data
- U.S. Census Bureau *State-to-State Migration Flows: 2024* (ACS/PRCS 1-year, residence 1 year ago)
- https://www.census.gov/data/tables/time-series/demo/geographic-mobility/state-to-state-migration.html

## Local preview
Serve the site root over HTTP (`file://` blocks fetch):

```bash
python3 -m http.server 8000
```

## Yearly refresh
1. Download the new Census T13 xlsx
2. Run `scripts/build_flows.py path/to.xlsx`
3. Commit `data/flows_*.json` and bump `data/meta.json`
