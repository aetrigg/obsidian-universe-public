---
name: inbox-summary
description: Quick overview of mission counts across all sub-INBOXes.
---

# Inbox Summary Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/UNIVERSE_STRUCTURE.md for INBOX structure

## Workflow

1. **Count Missions in Each Sub-INBOX**
   - Read each sub-INBOX file (01-09)
   - Count open missions `[ ]` and in-progress `[/]`
   - Count how many are tagged #this-week

2. **Display Summary**
   - Use icons for each category
   - Show total count and #this-week count
   - Calculate grand total

## Sub-INBOX Icons
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
| 09 | UNSORTED | 📥 |

## Example Output

```
📊 Mission Control Overview
━━━━━━━━━━━━━━━━━━━━
🌟 UNIVERSE: 12 missions (2 #this-week)
👤 PERSONAL: 4 missions (0 #this-week)
🧹 CHORES: 3 missions (0 #this-week)
💰 FINANCES: 2 missions (2 #this-week)
✍️ WRITING: 7 missions (0 #this-week)
🎨 COLORING: 5 missions (1 #this-week)
👨‍👩‍👧 FAMILY-FRIENDS: 2 missions (0 #this-week)
🔁 RECURRING: 8 templates
📥 UNSORTED: 0 missions

━━━━━━━━━━━━━━━━━━━━
Total: 35 missions | 5 flagged #this-week
```

## Notes
- This is a quick read-only overview
- 07_RECURRING contains templates, not active missions - label accordingly
- Useful for optimized 00_MAIN view while Datacore migration is in progress
- Keep output concise - just the numbers
