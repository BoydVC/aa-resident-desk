# AA Resident Desk

One-screen **Anne Arundel County** resident desk for the Boyd household in Millersville — trash/recycling tips (EXAMPLE schedule labeled), AACPL branch cards with real aacpl.net links, parks (Kinder Farm, Quiet Waters, …), and verified public county pages. Clean municipal blue/teal UI. TokenMax burn build.

## Screens

1. **Home** — quick jumps  
2. **Trash & recycling** — EXAMPLE reminders + real waste-management links  
3. **Library** — Severna Park, Broadneck, Odenton, Busch Annapolis  
4. **Parks** — Kinder Farm, Quiet Waters, Downs, Beverly Triton  
5. **Links** — grouped public URLs  
6. **About** — print / clear favorites  

Hash routes: `#home` · `#trash` · `#library` · `#parks` · `#links` · `#about`

## Run

```bash
./run.sh          # build + serve http://127.0.0.1:4322/
./run.sh --shots  # + screenshots/
```

Offline single file: `dist/aa-resident-desk.html`

## Layout

- `web/` — index.html, app.css, app.js  
- `data/desk.json` — tips, branches, parks, links (embedded into dist)  
- `build.py` / `server.py` / `tests/screenshot.sh`


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/aa-resident-desk` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
- Personal details (emails, phone numbers, home street address) were replaced with `[redacted-…]` placeholders.
