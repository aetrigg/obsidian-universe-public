---
name: daily-pull
description: Morning command that auto-sorts UNSORTED missions and suggests missions for today based on #this-week tags, yesterday's incomplete tasks, and recurring events.
---

# Daily Pull Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/MISSION_PROTOCOLS.md for workflow details
- Read SYSTEM/_ai/Agents/UNIVERSE_STRUCTURE.md for INBOX structure

## Workflow

1. **Auto-sort UNSORTED**
   - Check INBOX/09_UNSORTED for any missions
   - Route them to correct sub-INBOXes based on tags (see routing rules below)
   - Confirm each routing to user

2. **Show Today's Context**
   - Display today's date and day of week
   - Show recurring events for today from INBOX/07_RECURRING
   - Show bills due today (if bills tracker is accessible)

3. **Show #this-week Missions**
   - List all missions tagged with `#this-week` from all sub-INBOXes

4. **Show Yesterday's Incomplete Missions**
   - Check yesterday's canvas column for uncompleted `[ ]` or in-progress `[/]` missions
   - Present as rollover candidates

5. **Suggest Daily Distribution**
   - Format suggested missions for today's canvas column
   - Use the daily column template format:
   ```markdown
   ### :LiCalendarDays: Events
   - [<] Event @ time #tag

   ### :LiBanknote: Bills Due
   No bills due

   ### :LiCheckSquare: Tasks
   - [ ] mission description #tag
   ```

## Tag Routing Rules
- #obsidian → 08_UNIVERSE
- #chores → 02_CHORES
- #personal, #reading, #scripting, #gaming, #gospel, #personal/* → 01_PERSONAL
- #finances, #finances/* → 03_FINANCES
- #writing, #writing/*, #5th-of-june, #5oJ, #5thofjune → 04_WRITING
- #coloringthecosmos, #coloring-the-cosmos, #coloring, #coloring/*, #coloringbooks, #coloringbooks/* → 05_COLORING
- #family, #family/*, #friends, #friends/* → 06_FAMILY-FRIENDS
- #work → prompt user
- unknown → prompt user

## Example Output

```
⚡ Checking UNSORTED...
Found 1 unsorted mission:
- "declutter office #chores"
  → Routing to: 02_CHORES ✓

📅 Today is Thursday, January 23rd, 2026

🗓️ Recurring Events for Thursday:
- None found

💰 Bills Due Today:
- None found

📋 Missions tagged #this-week:
- reply to Bushido on discord #obsidian (UNIVERSE)
- add Claude Pro to bill tracker #finances (FINANCES)

🔍 Yesterday's incomplete missions:
- rework habit tracking to match discord example #obsidian [/]

━━━━━━━━━━━━━━━━━━━━
Suggested for today's canvas:

### :LiCalendarDays: Events
No events scheduled

### :LiBanknote: Bills Due
No bills due

### :LiCheckSquare: Tasks
- [/] rework habit tracking #obsidian (rollover)
- [ ] reply to Bushido on discord #obsidian
- [ ] add Claude Pro to bill tracker #finances
━━━━━━━━━━━━━━━━━━━━

Copy to today's canvas? (y/n/custom)
```

## Notes
- This is a morning routine command - keep it quick and actionable
- Don't overwhelm with too many suggestions
- Prioritize rollovers and #this-week items
- Remove "every Monday" frequency text from recurring templates
