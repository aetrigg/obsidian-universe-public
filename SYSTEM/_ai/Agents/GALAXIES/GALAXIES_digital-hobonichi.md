# Digital Hobonichi Galaxy

**Status:** Active  
**Dedicated Nebula:** Yes (Digital Hobonichi folder)  
**Primary Focus:** Daily/weekly/monthly planning and logging system based on analog Hobonichi

---

## 🌌 Overview

The Digital Hobonichi galaxy is Andrea's digital recreation of her beloved analog Hobonichi planner system. In 2024, Andrea purchased a Hobonichi HON and journaled every single day for the first time since 2014. The weekly setup was the only successful task management system that ever worked for her.

When her 2025 Hobonichi arrived with paper issues, Andrea discovered Obsidian and began recreating the system digitally. This galaxy represents her daily life - where planning, logging, tracking, and journaling all come together.

---

## 📖 System Components

The Digital Hobonichi galaxy consists of four main components:

1. **Daily Stars** - Daily notes with rapid logging and tracking
2. **Weekly Overviews** - Weekly planning canvases/dashboards with task columns
3. **Monthly Overviews** - Monthly summaries with visualizations and analytics
4. **Yearly Overviews** - Yearly tracking and habit analysis

All notes are generated using the **Journals plugin** with custom Templater templates.

---

## ⭐ Daily Stars

**File Naming:** `YYYY-MM-DD`  
**Generation:** Journals plugin with custom Templater template  
**Purpose:** Daily rapid logging, tracking, and journaling

### Daily Star Structure

Each daily star includes:

1. **Matching Banner** - Visual header (pixel art gifs from Andrea's collection)
2. **Date Greeter** - Formatted date display
3. **Custom Weather Template** - Visual Crossing Weather plugin integration
4. **Navigation** - Links to previous/next daily stars, weekly/monthly/yearly overviews
5. **Random Daily Quote** - Generated via Dataviewjs
6. **Habit & Hobby Tracking** - Metabind toggles and inputs
7. **Daily Log** - Rapid logging with custom checkboxes (see [[SIGNAL GUIDE]])
8. **Spending Log** - Financial tracking with custom checkboxes
9. **File Activity Tables** - Dataview tables showing files created/edited that day
10. **"What's On My Mind?"** - Journal section for brain dumps and reflections
11. **"Today's Snapshots"** - Photos from Google Photos with polaroid styling and custom captions

**Planned Enhancement:** Andrea plans to rename section headings to follow cosmic terminology for better thematic consistency throughout the universe.

### Rapid Logging with Glyphs

Andrea uses custom checkboxes for rapid logging throughout the day. These glyphs (detailed in [[SIGNAL GUIDE]]) include:

- `[i]` - Idea signals (thoughts to process into missions)
- `[<]` - Scheduled events with date/time
- `[>]` - Rescheduled events
- `[x]` - Completed missions
- `[-]` - Cancelled missions
- `[/]` - In-progress missions
- Many more for different types of logged signals

### Habit & Hobby Tracking

Daily stars include Metabind toggles/inputs for tracking:
- Daily habits (sex, brushed teeth, sleep/wake times)
- Hobbies and activities
- Mood

This data feeds into monthly and yearly visualizations.

### "What's On My Mind?" Journal Section

At the bottom of each daily star is an open journal section where Andrea can:
- Brain dump thoughts and feelings
- Reflect on the day
- Capture unstructured ideas (these become "captured ideas" - see [[MISSION_PROTOCOLS]])

Unlike idea signals marked with `[i]`, these are natural journal entries that sometimes contain actionable thoughts worth extracting.

### "Today's Snapshots" Photo Section

Below the journal is a photo section where Andrea captures visual memories:
- Uses **QuickAdd command** to select photos from Google Photos Picker
- Photos imported via Google Photos Picker plugin
- **Custom CSS snippet** styles photos as polaroids with captions
- Adds personal visual documentation to daily stars
- **Photos aggregated into gallery** in monthly overviews for visual month-at-a-glance

This section transforms daily notes into multimedia journals with both written and visual reflections.

---

## 📅 Weekly Overviews

**File Naming:** `YYYY-[W]WW`  
**Format:** Canvas file (potential future: Datacore dashboard)  
**Generation:** Journals plugin with Templater template that generates canvas JSON  
**Purpose:** Weekly planning and daily task execution  
**Week Start:** Monday (Hobonichi style)

### Weekly Canvas Structure

8 columns total:
1. **"Floating This Week"** - Missions tagged `#this-week` that can be done any day
2. **Monday through Sunday** - Individual day columns (7 columns)

### Daily Column Template

Each day column uses this structure:

```markdown
> [!cc-header] <h2>:LiListChecks: <u><i>Tue, Jan 20</i></u></h2>

### :LiCalendarDays: Events
- [<] scheduled events with date/time
- [<] Holidays from holidays.json (future enhancement)

### :LiBanknote: Bills Due
- [ ] Bills auto-populated from bills/subscription tracker

### :LiCheckSquare: Tasks
- [ ] missions for the day #tag
- [ ] more missions #tag
```

### Sunday Night Routine

Every Sunday night, Andrea generates the upcoming week's canvas using a template that:

1. **Auto-populates from data:**
   - Bills/subscriptions from tracker (.bases file) → "Bills Due" sections
   - Recurring work meetings from RECURRING sub-INBOX → "Events" sections
   - Missions tagged `#this-week` from all INBOXes → "Floating This Week" column

2. **Manual additions:**
   - Holidays to "Events" sections (planned: auto-scan holidays.json)
   - Appointments and personal events (planned: auto-scan for scheduled items)
   - Missions from sub-INBOXes distributed across daily columns

### Daily Workflow

Throughout the week, Andrea:
- Reviews today's column in weekly overview
- Works through missions, checking them off as completed
- Manually rolls over incomplete missions to the next day (or uses `/rollover` command)
- Adds new missions as they come up

The weekly overview is Andrea's primary workspace for reactive daily execution.

---

## 📊 Monthly Overviews

**File Naming:** `MMMM YYYY` (e.g., `January 2026`)  
**Generation:** Journals plugin with custom template  
**Purpose:** Monthly summaries, visualizations, and reflection

### Monthly Overview Structure

Each monthly overview includes:

1. **QuickLinks Component** - Custom navigation helper at top (custom Datacore component)
2. **Navigation** - Previous/next month links, yearly overview link, dynamic "Today" link, auto-generated week links
3. **Action Buttons** - Banner image changer
4. **Signal Calendar** - Visual calendar showing daily activity signals (custom Datacore component)
5. **Signal Breakdown** - Analytics/charts of signal patterns and time distribution (custom Datacore component)
6. **Weather Dashboard** - Temperature and weather pattern visualization (custom Datacore component)
7. **Photo Gallery** - Month's photos/memories aggregated from daily notes (custom Datacore component)

All components are parameterized React modules accepting `year`, `month`, and `monthName` for easy replication across months.

### Visualizations & Components

Andrea has fully transitioned to custom **Datacore React components** for all monthly visualizations. Each component is:
- **Parameterized** - Accepts `year`, `month`, and `monthName` parameters
- **Reusable** - Easy to replicate across all monthly overviews
- **Performance-optimized** - Built with Datacore for fast querying

The component architecture allows for sophisticated analytics like signal pattern analysis, time distribution charts, and dynamic calendars that show daily activity at a glance.

**Planned Enhancement:** The parameterized component system makes it easy to add additional visualization modules in the future as new tracking needs emerge.

---

## 📆 Yearly Overviews

**File Naming:** `YYYY Yearly Overview`  
**Status:** Work in Progress  
**Purpose:** Annual tracking and year-in-review

### Planned Components

- **"Year in Pixels" Mood Tracking Heatmap** - Visual representation of daily mood throughout the year
- **Contribution Heatmaps** - Showing daily activity/engagement
- **Annual Reflection** - Year-end summary and goals

**Note:** Habit tracking and financial tracking will live in their own dedicated observatories rather than in the yearly overview.

---

## 🔗 Integration with Other Systems

### Mission Management

Missions in the Digital Hobonichi galaxy flow through the INBOX system:

- **Personal daily life missions** → 01_PERSONAL sub-INBOX
- **Obsidian/universe development missions** → 08_UNIVERSE sub-INBOX
- **Chores, finances, etc.** → Respective sub-INBOXes

Missions are pulled from INBOXes into the weekly overview for execution.

See [[MISSION_PROTOCOLS]] for complete mission management workflow.

### Level 10 Life Integration (Planned)

Andrea plans to implement **Level 10 Life assessment** across ten color-coded life areas:

1. **Health/Fitness** (red) - Physical & mental health, medical, fitness
2. **Home/Physical Environment** (orange) - Home and physical surroundings
3. **Spirituality** (yellow) - Faith and Christianity
4. **Finances** (green) - Budgeting, expenses, income
5. **Family/Friends** (teal) - Relationships with family members and friends
6. **Parenting** (cyan) - Raising Theo & future children
7. **Career** (blue) - Writing career advancement and current job at ITV
8. **Leisure (Fun & Creative)** (light purple) - Fun, creativity, enrichment activities (gaming, coding, Obsidian, traveling, coloring, drawing, singing, ukulele, etc.)
9. **Personal Development** (purple) - Time-management, productivity skills, reading
10. **Marriage** (pink) - Relationship with her husband

This assessment will bridge planning intentions with reality tracking, creating a comprehensive balance tracking system across all life areas.

### Tracking Data Flow

```
Daily Stars (Metabind inputs)
    ↓
Data aggregated
    ↓
Monthly Overviews (visualizations)
    ↓
Yearly Overviews (analysis)
    ↓
Level 10 Life Assessment (balance check)
```

---

## 🎨 Visual Design

Andrea's front-end development background means aesthetics are a top priority:

- **Pixel art banners** - Vast collection of cozy pixel art gifs
- **Custom CSS styling** - Cosmic theming throughout
- **Color-coded systems** - Life areas, tags, graph nodes all color-coordinated
- **React components** - Custom visualizations for sleep, mood, contribution graphs
- **Responsive layouts** - MCL multicolumn for organized visual hierarchy

The Digital Hobonichi galaxy is not just functional - it's beautiful.

---

## 🛠️ Technical Implementation

### Plugins Used

- **Journals** - Daily/weekly/monthly/yearly note generation
- **Templater** - Custom templates with complex scripts
- **Metabind** - Interactive inputs and toggles for tracking
- **Datacore** - Queries, data aggregation, and custom React components (primary)
- **Reactive Notes** - Backup React component plugin (fallback if Datacore fails)
- **Visual Crossing Weather** - Weather data integration
- **Tasks** - Mission management (see [[MISSION_PROTOCOLS]])
- **MCL Multi Column** - Layout organization
- **Google Photos Picker** - Photo imports for Today's Snapshots
- **QuickAdd** - Rapid capture for photos, missions, and signals

### Custom Code

- **Templater scripts** - Weekly canvas automation, daily star generation
- **Datacore queries** - File activity tables, random quotes, aggregations, data analysis
- **React components** - Built with Datacore for signal calendars, weather dashboards, photo galleries, and analytics
- **CSS snippets** - Cosmic theming, polaroid photo styling, custom visual polish

### Performance Considerations

Andrea has fully embraced **Datacore** as her primary tool for:
- Fast queries and data aggregation
- Custom React component development
- Monthly overview visualizations
- Analytics and pattern analysis

Reactive Notes plugin is installed as a backup in case Datacore encounters issues, but Datacore is the preferred and actively used solution.

Andrea is actively phasing out **Dataview** in favor of **Datacore** throughout her vault for improved performance and consistency.

---

## 🚀 Future Enhancements

### Planned Improvements

1. **Weekly Overview Conversion** - Potentially convert canvas to Datacore dashboard for better automation
2. **Holiday Auto-Population** - Template auto-scan holidays.json for events
3. **Appointment Auto-Scan** - Template detect and populate scheduled items
4. **Mobile Optimization** - Better mobile access (husband is working on something)
5. **Advanced Visualizations** - More React components for tracking data

### Claude Code Integration

Claude Code commands that interact with Digital Hobonichi:

- **`/process-ideas`** - Scans daily stars for idea signals and "What's On My Mind?" entries
- **`/daily-pull`** - Suggests missions for today's weekly overview column
- **`/rollover`** - Moves incomplete missions from today to tomorrow

See [[MISSION_PROTOCOLS]] for complete command documentation.

---

## 💡 Design Philosophy

The Digital Hobonichi galaxy embodies Andrea's core principles:

### Reactive, Not Prescriptive
- No rigid future planning required
- Daily execution with optional weekly context
- System adapts to natural workflow

### Aesthetics First
- Beautiful visuals enhance engagement
- Pixel art banners bring joy to daily, weekly, monthly, and yearly notes
- Color-coding creates intuitive navigation

### Comprehensive Tracking
- Captures habits, mood, spending, weather, activities
- Visualizations reveal patterns over time
- Data feeds into life balance assessments

### Sustainable System
- Works WITH Andrea's ADHD patterns, not against them
- Automation reduces friction
- Manual elements only where they add value

---

## 📋 Related Documentation

- [[MISSION_PROTOCOLS]] - Task management integration
- [[SIGNAL GUIDE]] - Custom checkbox reference
- [[NORTH STAR]] - Cosmic terminology and color codes
- [[UNIVERSE_STRUCTURE]] - How this galaxy fits in the larger vault

---

**Last Updated:** January 22, 2026  
**Maintained By:** Andrea
