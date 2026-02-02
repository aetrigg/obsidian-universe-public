---
name: rollover
description: End-of-day command to handle incomplete missions from today's canvas column.
---

# Rollover Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/MISSION_PROTOCOLS.md for workflow details
- Locate current week's canvas file in Digital Hobonichi/YYYY/Weekly Overview/

## Workflow

1. **Find Today's Canvas Column**
   - Locate the current week's canvas file
   - Find today's column by date

2. **Identify Incomplete Missions**
   - Find missions marked `[ ]` (not started) or `[/]` (in progress)
   - Separate from completed `[x]` or cancelled `[-]` missions

3. **Present Summary**
   ```
   Thursday, January 23rd missions:
   ✓ 2 completed
   ⚠️ 1 incomplete
   ```

4. **For Each Incomplete Mission, Ask:**
   - Move to tomorrow?
   - Move back to INBOX? (route to appropriate sub-INBOX)
   - Cancel/delete?
   - Keep on today? (still working on it)

5. **Execute User's Choice**
   - Update canvas file accordingly
   - Confirm each action

## Example Output

```
📅 Thursday, January 23rd, 2026

Checking today's canvas column...

✓ 2 completed:
- [x] add Claude Pro to bill tracker #finances
- [x] reply to Bushido on discord #obsidian

⚠️ 1 incomplete:
- [ ] rework habit tracking to match discord example #obsidian

━━━━━━━━━━━━━━━━━━━━

For: rework habit tracking to match discord example #obsidian

Options:
1. Move to tomorrow (Friday, Jan 24)
2. Move back to INBOX (08_UNIVERSE)
3. Cancel/delete
4. Keep on Thursday (still working)

> 1

✓ Moved to Friday, January 24th

━━━━━━━━━━━━━━━━━━━━
Rollover complete!
```

## Canvas File Location
- Pattern: `Digital Hobonichi/YYYY/Weekly Overview/YYYY-WXX.canvas`
- Example: `Digital Hobonichi/2026/Weekly Overview/2026-W04.canvas`

## Notes
- This is an end-of-day routine
- Be quick and efficient - Andrea wants to wrap up, not plan
- Moving back to INBOX removes #this-week tag if present
- Keep context when moving (preserve tags, dates, priorities)
