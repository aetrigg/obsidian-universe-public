# Mission Protocols

This document explains Andrea's task management system, including mission capture, routing, organization, and the Claude Code commands that automate mission workflows.

---

## 📖 Core Concepts

### What Are Missions?
**Missions** are Andrea's term for tasks - things that need to be done across various galaxies and life areas.

### What Are Idea Signals?
**Idea signals** are logged entries marked with `[i]` in daily stars - thoughts, inspirations, or tasks-to-be that need processing before becoming formal missions.

### What Are Captured Ideas?
**Captured ideas** are unstructured thoughts and tasks mentioned in the "What's On My Mind?" journal section at the bottom of daily stars. Unlike idea signals which use the `[i]` glyph, these are just natural journal entries that sometimes contain actionable items.

Example from a daily star:
```markdown
- [i] 09:42 pm // considering adding a COLLECTIONS nebula that simply holds lists like:
    - movies/tv series/anime to watch
    - books/manga to read
    - bucket lists

## What's On My Mind?
I've been thinking about how to better organize my 5th of June research. 
Maybe I should try using NotebookLM to sort through all the ChatGPT exports? 
Also need to remember to update the habit tracker with that translucent effect.
```

Both idea signals and captured ideas get lost easily if not processed, which is why the `/process-ideas` command exists.

---

## 📥 INBOX Structure

Missions live in the **INBOX Nebula** organized into sub-INBOXes by category:

### Sub-INBOX Breakdown

**00_MAIN**
- Aggregated view showing ALL open missions from all sub-INBOXes
- Currently uses Tasks plugin codeblocks (performance being optimized with Datacore)
- Not for adding missions directly - missions go into specific sub-INBOXes

**01_PERSONAL**
- Personal life missions
- Routes: `#personal`, `#reading`, `#scripting`, `#gaming`, `#gospel`, `#personal/*`

**02_CHORES**
- Household tasks
- Routes: `#chores`

**03_FINANCES**
- Financial missions and bill-related tasks
- Routes: `#finances`, `#finances/*`

**04_WRITING**
- Writing projects (including 5th of June galaxy)
- Routes: `#writing`, `#writing/*`, `#5th-of-june`, `#5oJ`, `#5thofjune`

**05_COLORING**
- Coloring the Cosmos content missions
- Routes: `#coloringthecosmos`, `#coloring-the-cosmos`, `#coloring`, `#coloring/*`, `#coloringbooks`, `#coloringbooks/*`

**06_FAMILY-FRIENDS**
- Social and family missions
- Routes: `#family`, `#family/*`, `#friends`, `#friends/*`

**07_RECURRING**
- Templates for recurring missions and scheduled events
- Contains: Work meetings (with `[<]` scheduled glyph), weekly recurring tasks (e.g., laundry every Monday)
- **Important:** This holds TEMPLATES, not active missions

**08_UNIVERSE**
- Obsidian development and universe improvement missions
- Routes: `#obsidian`

**09_UNSORTED**
- Landing zone for QuickAdd captured missions
- Missions here need routing to appropriate sub-INBOXes
- Should be empty most of the time (auto-sorted by `/daily-pull`)

---

## ✅ Mission Format

Andrea uses the **Tasks plugin** format for missions. This keeps formatting clean and leverages Tasks plugin query capabilities.

### Basic Mission Format
```markdown
- [ ] mission description #tag
```

### With Optional Metadata (when needed)
```markdown
- [ ] mission description #tag 📅 2025-01-25
- [ ] mission description #tag 📅 2025-01-25 ⏫
- [ ] mission description #tag 📅 2025-01-25 🔼 ⏳ 2h
```

### Tasks Plugin Emoji Meanings
- `📅 YYYY-MM-DD` = due date
- `⏫` = highest priority (critical)
- `🔼` = high priority (important)
- `🔽` = low priority
- `⏳ Xh/Xd` = time estimate (e.g., `⏳ 2h`, `⏳ 1d`)

### Special Mission Types
- `[x]` = completed
- `[-]` = cancelled
- `[/]` = in progress
- `[<]` = scheduled event (with date/time like `03/04/26 @ 11:15 am`)
- `[>]` = rescheduled event
- `[i]` = idea signal (idea to be processed)

### Key Principles
- **Most missions don't need metadata** - only add due dates/priorities when actually time-sensitive
- **Keep it simple** - Andrea writes missions naturally; metadata is optional enhancement
- **Tags are essential** - they enable automatic routing to correct sub-INBOXes

---

## 🔄 Mission Workflow

### The Daily Reactive Workflow

Andrea doesn't plan far into the future. Her workflow is **daily reactive execution**:

1. **Morning (Optional):** Run `/daily-pull` for mission suggestions, or manually select from sub-INBOXes
2. **Add to today's canvas column** in the Weekly Overview
3. **Throughout the day:** Work through missions, check them off as completed
4. **Evening (if needed):** Run `/rollover` to move incomplete missions to tomorrow, or do it manually
5. **Weekly (when motivated):** Run `/triage-inbox` to flag what matters this week with `#this-week`
6. **Ongoing:** Run `/process-ideas` to process idea signals and captured ideas from daily stars

### Mission Lifecycle

```
Idea Signal or Captured Idea in Daily Star
    ↓
/process-ideas (processes idea)
    ↓
Mission added to appropriate sub-INBOX
    ↓
(Optional) Tagged with #this-week during triage
    ↓
Pulled into Weekly Overview canvas
    ↓
Executed and checked off
    ↓
(If incomplete) Rolled over to next day
    ↓
Completed missions stay in canvas as record
```

---

## 🗓️ Weekly Overview Structure

Andrea's weekly overview uses a **canvas file** (or will eventually become a Datacore dashboard) with a specific template structure.

### Canvas Column Layout
- 8 columns total
- Week starts on Monday (Hobonichi style)
- Columns: "Floating This Week" + 7 day columns (Mon-Sun)

### Daily Column Template
Each day has three sections using a custom callout:

```markdown
> [!cc-header] <h2>:LiListChecks: <u><i>Tue, Jan 20</i></u></h2>

### :LiCalendarDays: Events
- [<] Weekly Trends Meeting @ 10:00 a.m. #work

### :LiBanknote: Bills Due
No bills due

### :LiCheckSquare: Tasks
- [ ] mission description #tag
- [ ] another mission #tag
```

### Sunday Night Routine
Every Sunday night, Andrea:
1. Generates the canvas for the upcoming week using a template
2. Template auto-scans bills/subscription tracker (.bases file) and populates "Bills Due" sections
3. Template adds recurring work meetings from RECURRING sub-INBOX
4. Template auto-scans all INBOXes and pulls all missions tagged `#this-week` into "Floating This Week" column
5. Manually adds holidays to "Events" sections (planned enhancement: auto-scan holidays.json)
6. Manually adds appointments and events (planned enhancement: auto-scan for scheduled items)
7. Manually adds missions from sub-INBOXes to appropriate daily columns

**Note:** Claude Code helps suggest mission distribution but doesn't automate the Sunday night canvas generation itself.

---

## 🤖 Claude Code Commands

These commands help automate mission management while working WITH Andrea's reactive daily workflow.

### `/process-ideas`
**Purpose:** Scans recent daily stars for `[i]` idea signals AND "What's On My Mind?" journal sections, then processes them into missions

**Flow:**
1. Searches daily stars from the last week for:
   - Uncaptured `[i]` idea signals
   - Mentions of tasks/ideas in "What's On My Mind?" journal sections
2. Presents each idea with context (date, time, surrounding text)
3. For each idea, prompts for:
   - Convert to mission? (y/n/later)
   - Which sub-INBOX? (auto-suggests based on context)
   - Tag (inferred from context when possible)
   - Due date (optional)
   - Priority (optional)
4. Formats as proper mission and adds to appropriate sub-INBOX

**Example Output:**
```
Found 2 ideas in recent daily stars:

📅 2025-01-22 @ 05:55 pm (idea signal)
"i should call my individual tasks 'missions' from now on
 i should update NORTH STAR's glossary to include that"

Convert to mission? (y/n/later): y
Mission: "update NORTH STAR glossary to include missions terminology"
Which INBOX? (UNIVERSE/PERSONAL/etc): UNIVERSE
Tag: #obsidian (inferred, correct?): y
Due date? (optional): none

✓ Added to 08_UNIVERSE:
- [ ] update NORTH STAR glossary to include missions terminology #obsidian
```

---

### `/daily-pull`
**Purpose:** Morning command that auto-sorts UNSORTED and suggests missions for today

**Flow:**
1. **Auto-sort UNSORTED:** Checks 09_UNSORTED for any missions, routes them to correct sub-INBOXes based on tags
2. **Show #this-week missions:** Lists all missions tagged with `#this-week`
3. **Show yesterday's incomplete missions:** Pulls from yesterday's canvas column
4. **Show recurring events for today:** Pulls from RECURRING (work meetings, etc.)
5. **Suggest daily distribution:** Formats suggested missions for today's canvas

**Example Output:**
```
⚡ Checking UNSORTED...
Found 1 unsorted mission:
- "declutter office #chores"
  → Routing to: 02_CHORES ✓

📅 Today is Tuesday, January 21st, 2026

🗓️ Recurring Events for Tuesday:
- Weekly Trends Meeting @ 10:00 a.m. #work (from RECURRING)

💰 Bills Due Today:
- None found

📋 Missions tagged #this-week:
- reply to Bushido on discord #obsidian (UNIVERSE)
- add Claude Pro to bill tracker #finances (FINANCES)
- cancel Google AI Pro plan #finances (FINANCES)

🔍 Yesterday's incomplete missions:
- rework habit tracking to match discord example #obsidian [/] (UNIVERSE)

Suggested for today's canvas:
━━━━━━━━━━━━━━━━━━━━
📅 Events:
- Weekly Trends Meeting @ 10:00 a.m. #work

💰 Bills Due:
No bills due

✅ Tasks:
- rework habit tracking [/] #obsidian (rollover from Monday)
- reply to Bushido on discord #obsidian (quick)
- add Claude Pro to bill tracker #finances (quick)

━━━━━━━━━━━━━━━━━━━━

Copy to today's canvas? (y/n/custom)
```

---

### `/triage-inbox`
**Purpose:** Review sub-INBOXes and flag what matters this week

**Flow:**
1. Shows mission counts for each sub-INBOX
2. Asks which area needs attention
3. Lists missions in that sub-INBOX
4. User selects which missions matter this week
5. Tags selected missions with `#this-week`

**Example Output:**
```
You have 15 missions in UNIVERSE, 4 in PERSONAL, 2 in FINANCES.

Which area needs attention this week?
1. UNIVERSE (15 missions)
2. PERSONAL (4 missions)
3. FINANCES (2 missions)
4. Show me all

You: 1

UNIVERSE missions:
1. add frequency scanner to main universe #obsidian
2. rename GLYPH GUIDE to Signal Guide #obsidian
3. figure out task management with Claude Code #obsidian
4. reply to Bushido on discord #obsidian
[... 11 more]

Which ones matter this week? (comma-separated numbers)
You: 3,4

✓ Tagged with #this-week:
- figure out task management with Claude Code #obsidian
- reply to Bushido on discord #obsidian
```

---

### `/rollover`
**Purpose:** End-of-day command to handle incomplete missions

**Flow:**
1. Checks today's canvas column for incomplete missions
2. For each incomplete mission, asks:
   - Move to tomorrow?
   - Move back to INBOX?
   - Cancel/delete?
   - Keep on today (still working on it)?
3. Updates canvas accordingly

**Example Output:**
```
Thursday, January 22nd missions:
✓ 1 completed
⚠️ 1 incomplete

Incomplete mission:
- [ ] reply to Bushido on discord #obsidian

Options:
1. Move to tomorrow (Friday)
2. Move back to INBOX (08_UNIVERSE)
3. Cancel/delete
4. Keep on Thursday (still working on it)

Your choice: 1

✓ Moved to Friday, January 23rd
```

---

### `/sort-unsorted`
**Purpose:** Manually trigger sorting of UNSORTED missions (also auto-runs in `/daily-pull`)

**Flow:**
1. Checks 09_UNSORTED sub-INBOX
2. For each mission, suggests routing based on tags
3. Prompts for unknown tags
4. Moves missions to appropriate sub-INBOXes

**Example Output:**
```
Found 3 unsorted missions:

1. "declutter office #chores"
   → Suggested INBOX: 02_CHORES

2. "add React component for weekly view #obsidian"
   → Suggested INBOX: 08_UNIVERSE

3. "research camera gear for IG videos #content"
   → Suggested INBOX: ??? (unknown tag)
   → Options: PERSONAL / COLORING / Create new sub-INBOX / Keep in UNSORTED

Route to suggested locations? (y/n/manual)
```

---

### `/inbox-summary`
**Purpose:** Quick overview of mission counts across all sub-INBOXes (useful for optimized 00_MAIN view)

**Example Output:**
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
📋 UNSORTED: 0 missions

Total: 35 missions | 5 flagged #this-week
```

---

## 🗺️ Tag → Sub-INBOX Routing Rules

This mapping determines where missions automatically route when using `/sort-unsorted` or `/daily-pull`:

```
#obsidian → 08_UNIVERSE

#chores → 02_CHORES

#personal, #reading, #scripting, #gaming, #gospel, #personal/* → 01_PERSONAL

#finances, #finances/* → 03_FINANCES

#writing, #writing/*, #5th-of-june, #5oJ, #5thofjune → 04_WRITING

#coloringthecosmos, #coloring-the-cosmos, #coloring, #coloring/*, 
#coloringbooks, #coloringbooks/* → 05_COLORING

#family, #family/*, #friends, #friends/* → 06_FAMILY-FRIENDS

#work → prompt for routing (rare, mostly just meeting reminders)

[unknown tag] → prompt user, offer to remember routing for future
```

---

## 📱 QuickAdd Integration

Andrea uses QuickAdd for rapid mission capture on-the-go.

### How It Works
1. Andrea has a random idea: "declutter office"
2. Opens QuickAdd, types: `declutter office #chores`
3. QuickAdd auto-adds to 09_UNSORTED:
   ```markdown
   - [ ] declutter office #chores
   ```
4. Next time `/daily-pull` runs, it auto-routes to 02_CHORES based on `#chores` tag

### Design Philosophy
- **Zero friction capture** - just type and submit
- **Automatic routing** - tags determine destination
- **No manual sorting required** - Claude Code handles it

---

## 🎯 Design Principles

### Work WITH Andrea's Workflow, Not Against It

**Andrea is a daily reactive executor, not a future planner.**

This system is designed to:
- ✅ Reduce manual sorting and organization
- ✅ Preserve natural mission writing style
- ✅ Automate the boring parts (routing, rollover, triage)
- ✅ Provide clear direction when needed (daily suggestions)
- ✅ Get out of the way when not needed

### Minimal Format Changes
- Most missions stay simple: `- [ ] description #tag`
- Metadata (dates, priorities) only added when actually needed
- No rigid future planning required

### Automation Without Rigidity
- Commands are suggestions, not requirements
- Andrea can always do things manually
- System adapts to her reactive daily flow

---

## 🔧 Technical Notes

### Recurring Tasks
The 07_RECURRING sub-INBOX holds templates like:
```markdown
## Recurring Work Meetings
- [<] Weekly Trends Meeting every Tuesday @ 10:00 a.m. #work

## Recurring Chores
- [ ] gather up dirty laundry every Monday #chores
- [ ] put clothes in washer every Monday #chores
- [ ] move clothes to dryer every Monday #chores
```

**Important:** When suggesting missions from RECURRING, remove the frequency text (e.g., "every Monday") from the mission description. 

Example:
- Template: `- [ ] gather up dirty laundry every Monday #chores`
- Suggested for canvas: `- [ ] gather up dirty laundry #chores`

### Bills & Subscriptions
Andrea has a separate bills/subscription tracker (.bases file) in OBSERVATORIES that her Sunday night canvas template scans to populate "Bills Due" sections automatically.

### Holidays
A `holidays.json` file in SYSTEM contains US federal holidays, observances, and seasonal changes. The Sunday night canvas template scans this to populate "Events" sections.

### Performance Optimization
The 00_MAIN aggregated view is being optimized from Tasks plugin queries to Datacore for better performance with many missions.

---

## 📋 Common Workflows

### Morning Routine
```
1. Open Obsidian
2. (Optional) Run /daily-pull
3. Review suggested missions
4. Add selected missions to today's canvas column
5. Start working
```

### Capturing Ideas Throughout the Day
```
1. Idea pops into head
2. Either:
   a. Add [i] signal to current daily star, OR
   b. Use QuickAdd to capture mission directly
3. Continue with day
4. Process signals/unsorted later
```

### Weekly Planning (Sundays)
```
1. Generate next week's canvas with template
2. Bills auto-populate from tracker
3. Recurring work meetings auto-populate from RECURRING
4. Missions tagged #this-week auto-populate in "Floating This Week" column
5. Manually add holidays (future: auto-scan holidays.json)
6. Manually add appointments/events (future: auto-scan scheduled items)
7. Manually distribute missions from sub-INBOXes across the week
8. (Optional) Run /triage-inbox beforehand to flag more #this-week missions
```

### Processing Ideas
```
1. Run /process-ideas (weekly or as needed)
2. Review each idea signal and captured idea
3. Decide: convert to mission, defer, or discard
4. Ideas become missions in appropriate sub-INBOXes
5. Ideas can be flagged #this-week if urgent
```

---

## 🚀 Getting Started

### For Claude Code
When Andrea runs a mission-related command:
1. Read this file (MISSION_PROTOCOLS)
2. Read [[UNIVERSE_STRUCTURE]] for vault organization context
3. Read [[SIGNAL GUIDE]] for understanding custom checkboxes
4. Execute the requested command following the flows above
5. Present suggestions/prompts in the format shown in examples
6. Respect Andrea's reactive workflow - suggest, don't dictate

### For Andrea
1. Set up QuickAdd for rapid capture
2. Run `/process-ideas` weekly to process idea signals and journal thoughts
3. Use `/daily-pull` on mornings when you want guidance
4. Use `/triage-inbox` when you feel motivated to plan ahead
5. Let the system adapt to your workflow, not the other way around

---

**Last Updated:** January 22, 2026
**Maintained By:** Andrea
