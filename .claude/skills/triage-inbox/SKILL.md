---
name: triage-inbox
description: Review sub-INBOXes and flag missions that matter this week with #this-week tag.
---

# Triage Inbox Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/MISSION_PROTOCOLS.md for workflow details
- Read SYSTEM/_ai/Agents/UNIVERSE_STRUCTURE.md for INBOX structure

## Workflow

1. **Show Mission Counts**
   - Count open missions in each sub-INBOX (01-08)
   - Display as overview:
   ```
   📊 Mission Control Overview
   ━━━━━━━━━━━━━━━━━━━━
   🌟 UNIVERSE: 12 missions (2 #this-week)
   👤 PERSONAL: 4 missions (0 #this-week)
   🧹 CHORES: 3 missions (0 #this-week)
   ...
   ```

2. **Ask Which Area Needs Attention**
   - Present numbered options for each sub-INBOX
   - Include "Show me all" option

3. **List Missions in Selected Area**
   - Show all open missions with numbers
   - Indicate any already tagged #this-week

4. **Flag Selected Missions**
   - User provides comma-separated numbers
   - Add #this-week tag to selected missions
   - Confirm additions

## Sub-INBOX Reference
| Code | Name | Icon |
|------|------|------|
| 01 | PERSONAL | 👤 |
| 02 | CHORES | 🧹 |
| 03 | FINANCES | 💰 |
| 04 | WRITING | ✍️ |
| 05 | COLORING | 🎨 |
| 06 | FAMILY-FRIENDS | 👨‍👩‍👧 |
| 07 | RECURRING | 🔁 |
| 08 | UNIVERSE | 🌟 |

## Example Output

```
📊 Mission Control Overview
━━━━━━━━━━━━━━━━━━━━
🌟 UNIVERSE: 15 missions (2 #this-week)
👤 PERSONAL: 4 missions (0 #this-week)
💰 FINANCES: 2 missions (2 #this-week)

Which area needs attention this week?
1. UNIVERSE (15 missions)
2. PERSONAL (4 missions)
3. FINANCES (2 missions)
4. Show me all

> 1

UNIVERSE missions:
1. add frequency scanner to main universe #obsidian
2. rename GLYPH GUIDE to Signal Guide #obsidian
3. figure out task management with Claude Code #obsidian ✓ #this-week
4. reply to Bushido on discord #obsidian ✓ #this-week
[... more]

Which ones matter this week? (comma-separated numbers, or 'done')
> 1,2

✓ Tagged with #this-week:
- add frequency scanner to main universe #obsidian
- rename GLYPH GUIDE to Signal Guide #obsidian
```

## Notes
- This is for weekly planning, typically done Sundays or when motivated
- Don't push - Andrea is a reactive executor, not a future planner
- Already-tagged items should show ✓ #this-week
- Missions in 07_RECURRING are templates, not active missions
