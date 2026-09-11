# US State-to-State Migration Explorer (ACS 2024)

Static Leaflet app for **GPHY 284 Lab 3 Part 2**.

## Data
- U.S. Census Bureau *State-to-State Migration Flows: 2024* (ACS/PRCS 1-year, residence 1 year ago)
- https://www.census.gov/data/tables/time-series/demo/geographic-mobility/state-to-state-migration.html

## Local preview
Serve the `app/` folder over HTTP (file:// will block fetch):

```bash
cd app && python3 -m http.server 8000
```

## GitHub Pages
Publish the contents of `app/` (or repo root if files live at root) via Pages.

## Yearly refresh
1. Download the new Census T13 xlsx
2. Run `scripts/build_flows.py`
3. Commit `data/flows_*.json` + bump `data/meta.json`
