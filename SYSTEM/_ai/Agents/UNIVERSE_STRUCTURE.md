# Universe Structure

This document explains the organizational structure of "The Universe of Andrea" - how folders (nebulae) are organized, what each root nebula contains, and how galaxies (projects) relate to the overall structure.

---

## 📖 Terminology Reference

For a complete glossary of cosmic terminology, color codes, and constellation (tag) meanings, see **[[NORTH STAR]]**.

For custom checkbox glyphs used throughout the universe, see **[[SIGNAL GUIDE]]**.

---

## 🌌 Galaxies vs. Root Nebulae

### Galaxies (Projects)
Galaxies are **major projects or areas of interest** that ebb and flow with Andrea's current hyperfixations. A topic must be hyperfixated on for a minimum of 3 months before becoming a galaxy to prevent galaxy sprawl.

**Active Galaxies:**
- **Digital Hobonichi** - Daily/weekly/monthly planning and logging system (based on analog Hobonichi)
- **5th of June** - Boy band novel series (10-year project)
- **@coloringthecosmos** - Instagram/TikTok cozy coloring content account
- **Obsidian** - Learning and developing the universe itself (meta-galaxy; does not have its own dedicated nebula as it's about organizing the universe as a whole)

Each galaxy (except Obsidian) has its own dedicated nebula (folder) in the root of the universe.

### Root Nebulae (System Folders)
Root nebulae are **organizational folders** that serve specific system-level purposes. They are not projects themselves but support the entire universe's functionality.

---

## 🗂️ Root Nebulae Breakdown

### 📥 INBOX Nebula
**Purpose:** Long-term mission (task) storage and organization

**Structure:**
- **00_MAIN** - Aggregated view showing all open missions from all sub-INBOXes (currently slow, being optimized with Datacore)
- **01_PERSONAL** - Personal missions ( #personal, #reading, #scripting, #gaming, #gospel, #personal/*)
- **02_CHORES** - Household tasks ( #chores)
- **03_FINANCES** - Financial missions ( #finances, #finances/*)
- **04_WRITING** - Writing projects ( #writing, #writing/*, #5th-of-june, #5oJ, #5thofjune)
- **05_COLORING** - Coloring content missions ( #coloringthecosmos, #coloring-the-cosmos, #coloring, #coloring/*, #coloringbooks, #coloringbooks/*)
- **06_FAMILY-FRIENDS** - Social and family missions ( #family, #family/*, #friends, #friends/*)
- **07_RECURRING** - Templates for recurring missions and scheduled events (work meetings, weekly chores)
- **08_UNIVERSE** - Obsidian development missions ( #obsidian)
- **09_UNSORTED** - Landing zone for QuickAdd captured missions that need routing

**Key Notes:**
- Sub-INBOXes are for staging missions, not active daily work
- Missions move from INBOX → Weekly Overview when ready to execute
- RECURRING holds templates, not active missions (e.g., "laundry every Monday")
- See [[MISSION_PROTOCOLS]] for detailed routing rules

---

### ⚙️ SYSTEM Nebula
**Purpose:** Vault infrastructure and utilities

**Contains:**
- `_templates` (daily, weekly, monthly, yearly notes)
- `_data` files (.bases files, JSON configs like holidays.json)
- `_media` (images, gifs, banners)
- `_scripts` (Templater scripts, custom JS)
- `_snippets` (HTML widgets, classes for CSS snippets)
- Launchpads (quick links to frequently accessed stars)
- `_ai/` folder (agent documentation, prompts, skills)

**Key Notes:**
- This is where vault "machinery" lives

---

### ✍️ MUSINGS Nebula
**Purpose:** Drafting content NOT dedicated to 5th of June galaxy

**Organization:**
- Categorized by where Andrea plans to share/post content
- Sub-nebula for source notes related to musings
- Examples: Discord posts, blog drafts, social media content

**Key Notes:**
- Writing for 5th of June goes in that galaxy, not here
- This is more for meta-content about her universe, social posts, etc.

---

### 📚 SOURCES Nebula
**Purpose:** Anything Andrea wants to reference or source later

**Organization:**
- Organized by source origin (website, article, video, etc.)
- Currently using Obsidian Web Clipper to capture content
- May eventually merge with BOOKMARKS nebula

**Key Notes:**
- This is for research material and references
- Different from MUSINGS which is Andrea's own drafts

---

### 🔖 BOOKMARKS Nebula
**Purpose:** Chrome bookmarks imported via Obsidian Bookmarks plugin

**Organization:**
- Direct import from Google Chrome
- May eventually combine with SOURCES nebula for simplification

---

### 🔭 OBSERVATORIES Nebula
**Purpose:** Any "view" of other parts of the universe

**Contains:**
- Dashboards (visual overviews)
- .bases files (database-like structures for tracking and organization)
- Datacore components (dynamic queries and visualizations)

**Examples:**
- Bills & Subscription Tracker (.bases file)
- Frequency Scanner for signals (Datacore component)
- Coloring Books Observatory (.bases file)
- Wealth Flux Report (Datacore component)

**Key Notes:**
- Observatories provide perspectives on data living elsewhere
- Think of these as "control panels" for different aspects of the universe
- Not all .bases files live in OBSERVATORIES - some live in SYSTEM (like launchpads which use .bases files in card view/layout to link to other stars/planets)

---

### 🕳️ THE BLACK HOLE Nebula
**Purpose:** Archive folder

**Status:** "Basically a mess lol" - Andrea's words

**Key Notes:**
- Where old/inactive stars go
- Not heavily organized or maintained
- Out of sight, out of mind

---

## 🌟 Nuclear Star Clusters (MOCs & Indexes)

**Definition:** Nuclear star clusters are the densest stellar systems nestled in the center of their galaxy - a perfect metaphor for Maps of Content (MOCs) and indexes.

**Implementation:**
- All MOCs are generated using the Folder Overview plugin
- Auto-update as new stars are added to their galaxy/nebula
- Serve as navigation hubs within each galaxy

---

## 🗺️ Graph View (Star Charts)

Andrea loves the graph view in Obsidian and maintains a permanent local star chart in her left sidebar.

**Configuration:**
- Each node is color-coded by placement (see [[NORTH STAR]] for color codes)
- Uses folders2graph plugin with backlinks enabled
- Constellations (tags) are also color-coded (see [[NORTH STAR]])

**Satellites:**
- Previously referred to orphan notes in graph view
- Since using folders2graph, satellites don't occur anymore
- The metaphor is kept in case they appear again

---

## 🎯 Organizational Principles

### Galaxy Formation
- Requires 3 months minimum of consistent hyperfixation
- Prevents galaxy sprawl
- Each galaxy gets its own root nebula folder

### Constellation (Tag) Usage
- Tags categorize stars across galaxies
- Hierarchical tags supported (e.g., #family/Theo)
- Color-coded in graph view (see [[NORTH STAR]])
- Used for mission routing (see [[MISSION_PROTOCOLS]])

### Folder Philosophy
- Nebulae (folders) provide structure but not rigidity
- Stars can connect across nebulae via links and tags
- Graph view shows organic connections

### Mission Flow
- Capture → INBOX → Weekly Planning → Execution → Archive/Completion
- See [[MISSION_PROTOCOLS]] for detailed workflow

---

## 🔄 Relationship Between Systems

```
Galaxies (Projects)
    ↓
Have dedicated root nebulae (folders)
    ↓
Contain stars (notes) tagged with constellations
    ↓
Galaxies generate missions that live in INBOX
    ↓
Missions flow to Weekly Overview
    ↓
Completed missions get archived
    ↓
System observes via dashboards in OBSERVATORIES
```

---

**Last Updated:** January 22, 2026
**Maintained By:** Andrea
