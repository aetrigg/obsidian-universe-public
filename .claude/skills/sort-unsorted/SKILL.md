---
name: sort-unsorted
description: Manually sort missions from UNSORTED inbox to appropriate sub-INBOXes based on tags.
---

# Sort Unsorted Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/MISSION_PROTOCOLS.md for routing rules
- Check INBOX/09_UNSORTED for missions

## Workflow

1. **Check UNSORTED**
   - Read INBOX/09_UNSORTED sub-INBOX file
   - Find all open missions `[ ]`

2. **For Each Mission:**
   - Parse the tag(s)
   - Suggest routing based on tag routing rules
   - If unknown tag, prompt user for destination

3. **Route Missions**
   - Move mission to appropriate sub-INBOX file
   - Remove from UNSORTED
   - Confirm each routing

4. **Handle Unknown Tags**
   - Present options: existing sub-INBOXes, keep in UNSORTED
   - Offer to remember routing for future

## Tag Routing Rules
```
#obsidian → 08_UNIVERSE
#chores → 02_CHORES
#personal, #reading, #scripting, #gaming, #gospel, #personal/* → 01_PERSONAL
#finances, #finances/* → 03_FINANCES
#writing, #writing/*, #5th-of-june, #5oJ, #5thofjune → 04_WRITING
#coloringthecosmos, #coloring-the-cosmos, #coloring, #coloring/*, #coloringbooks, #coloringbooks/* → 05_COLORING
#family, #family/*, #friends, #friends/* → 06_FAMILY-FRIENDS
#work → prompt user (rare, mostly meeting reminders)
[unknown] → prompt user
```

## Example Output

```
📥 Checking UNSORTED...

Found 3 unsorted missions:

1. "declutter office #chores"
   → Suggested: 02_CHORES ✓

2. "add React component for weekly view #obsidian"
   → Suggested: 08_UNIVERSE ✓

3. "research camera gear for IG videos #content"
   → Unknown tag #content
   → Options:
     a. 01_PERSONAL
     b. 05_COLORING
     c. Keep in UNSORTED
     d. Other

Route to suggested locations? (y/n/manual)
> y

✓ Routed to 02_CHORES: declutter office #chores
✓ Routed to 08_UNIVERSE: add React component for weekly view #obsidian

For #content tag, which INBOX?
> b

✓ Routed to 05_COLORING: research camera gear for IG videos #content

━━━━━━━━━━━━━━━━━━━━
UNSORTED is now empty!
```

## Notes
- This also runs automatically as part of /daily-pull
- Keep it fast - just route and confirm
- For unknown tags, suggest most likely based on context
- QuickAdd captures go here first, so run regularly
