# Code with Claude Tokyo Schedule Planner

Unofficial local-first session planner for Code with Claude Tokyo / Extended Tokyo 2026.

## What It Does

- Shows both event days in a single page
- Switches between Day 1 and Day 2 with tabs
- Displays a desktop timeline by stage
- Displays a mobile-friendly chronological list
- Lets you check sessions you plan to attend
- Saves checks only in your browser with `localStorage`
- Shows session descriptions from the official event pages

## Files

- `index.html` - production page
- `10June.md` - source reference for Day 1 schedule data
- `11June.md` - source reference for Day 2 schedule data
- `REQUIREMENTS.md` - requirements and implementation notes
- `archive/` - earlier prototypes kept for reference

## Run Locally

Open `index.html` directly in a browser, or serve the directory with any static file server.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

This is an unofficial personal tool. Session titles and descriptions are based on the official Code with Claude event pages. Please refer to the official schedule for the latest information.

Checked sessions are stored only on the current device and browser. There is no database, account, or cross-device sync.
