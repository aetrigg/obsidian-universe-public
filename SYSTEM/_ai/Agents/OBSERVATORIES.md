# Observatories

This document explains the observatory system in "The Universe of Andrea" - dashboards and views that provide perspectives on data living elsewhere in the universe.

---

## 📖 Terminology Reference

For a complete glossary of cosmic terminology, color codes, and constellation (tag) meanings, see **[[NORTH STAR]]**.

---

## 🔭 What Are Observatories?

**Observatories** are dashboards, views, and interfaces that observe and analyze data from other parts of the universe. They don't store the original data themselves - instead, they query, aggregate, and visualize information that lives in daily stars, tracking files, and other sources across the vault.

Think of observatories as "control panels" that give Andrea different perspectives on her universe's activity, finances, hobbies, and patterns.

---

## 📊 Observatory Types

### Activity Tracking
Observatories that monitor vault activity and engagement patterns.

### Financial Observatories
Dashboards focused on expense tracking, budget monitoring, and financial insights.

### Hobby & Interest Tracking
Observatories for specific hobbies and collections (coloring books, media consumption, etc.).

### Signal Analysis
Tools for analyzing patterns in daily logging and rapid logging signals.

---

## 🌟 Individual Observatories

### Activity Observatory
**File:** `Activity Observatory.md`  
**Type:** Activity Tracking  
**Plugin:** Daily Activity plugin

**Purpose:**  
Activity tracking dashboard generated using the Daily Activity plugin. Monitors vault engagement and file activity patterns.

---

### Coloring Book Observatory
**File:** `Coloring Book Observatory.base`  
**Type:** Hobby & Interest Tracking  
**Format:** .bases file

**Purpose:**  
Tracks Andrea's coloring book collection and progress. Monitors:
- Book titles and publishers
- Total pages
- Completed pages
- Purchase dates
- Physical vs. digital format

**Planned Enhancement:** Enriching coloring book tracking stars with more meaningful content beyond basic metadata.

---

### Frequency Scanner
**File:** `Frequency Scanner.md`  
**Type:** Signal Analysis

**Purpose:**  
Scans all signals within a specified time period with filtering capabilities. Analyzes patterns in daily logging, identifies trends in activities, and provides insights into how Andrea spends her time.

**Key Features:**
- Time period selection
- Signal type filtering
- Pattern analysis
- Frequency visualization

---

## 💰 Financial Observatories

Andrea maintains three distinct financial observatories, each serving a different purpose in her financial tracking system:

### Expenses Observatory
**File:** `Expenses Observatory.md`  
**Type:** Financial - Quick Check-In Dashboard  
**Primary Use:** At-a-glance spending overview

**Purpose:**  
This is Andrea's at-a-glance financial dashboard for quick spending check-ins.

**Components:**
1. **Stat Cards (Top):**
   - Total spent
   - Transaction count
   - Daily average
   - Top spending category

2. **Two-Column Layout:**
   - Donut chart for spending distribution
   - Bar chart showing monthly or weekly breakdowns (filter-dependent)

3. **Spending Trajectory:**
   - Line graph tracking daily patterns over time
   - Quick-link to full version in Wealth Flux Report

4. **Recent Transactions:**
   - Last 8 purchases
   - Link to full Expenses Log

5. **Filters:**
   - Year selection
   - Month selection

**Use Case:**  
"How much have I spent this month?" or "What's my top spending category this week?"

---

### Wealth Flux Report
**File:** `Wealth Flux Report.md`  
**Type:** Financial - Comprehensive Analysis  
**Primary Use:** Deep dive into spending patterns

**Purpose:**  
This is where Andrea goes when she wants the full financial picture. Provides comprehensive spending analysis with detailed breakdowns and pattern visualization.

**Components:**
1. **Category Progress Bars:**
   - Exact dollar amounts
   - Percentage breakdowns

2. **Pie Chart:**
   - Visual spending distribution
   - Detailed legend

3. **Daily Spending Trend Chart (Multi-line):**
   - Total spending over time
   - Individual category tracking
   - Pattern identification (weekend splurges, subscription hits, etc.)

4. **Monthly/Weekly Totals Bar Chart:**
   - Aggregate spending by time period
   - Average spending line overlay

5. **Complete Paginated Expense Table:**
   - Full Expenses Log embedded
   - Category filtering

**Technical Feature:**  
localStorage trick allows the Expenses Observatory to link directly to specific sections of this report while preserving filter settings.

**Use Case:**  
"What are my spending patterns this quarter?" or "Which categories am I overspending in?"

---

### Expenses Log
**File:** `Expenses Log.md`  
**Type:** Financial - Transaction Database  
**Primary Use:** Searchable transaction history

**Purpose:**  
Searchable database of every transaction logged in daily stars. Pulls spending data from markdown tables in Digital Hobonichi entries and displays them in a clean, paginated interface.

**Components:**
1. **Transaction Table:**
   - Date
   - Item
   - Category
   - Cost

2. **Search Functionality:**
   - Search for specific purchases
   - Category dropdown filter
   - Pagination controls (10-100 items per page)

3. **Color-Coded Category Tags:**
   - Clickable tags
   - Instant filtering

**Data Source:**  
Spending data logged in daily stars' spending log sections.

**Use Case:**  
"When did I buy that thing?" or "How much have I spent on groceries?"

---

### Bills & Subscriptions Overview
**File:** `Bills & Subscriptions Overview.md`  
**Type:** Financial - Recurring Payments  
**Primary Use:** Tracking recurring financial obligations

**Purpose:**  
Overview of recurring bills and subscriptions. Helps Andrea track:
- Subscription services
- Recurring bills
- Due dates
- Payment amounts

**Integration:**  
Data from this observatory auto-populates into weekly overview "Bills Due" sections.

---

## 🔄 How Observatories Integrate with Other Systems

### Data Flow
```
Daily Stars (source data)
    ↓
Observatories (query & visualize)
    ↓
Insights & Analysis
```

### Financial Observatory Relationship
```
Daily Stars (spending logs)
    ↓
Expenses Log (searchable database)
    ↓
Expenses Observatory (quick check-in)
    ↓
Wealth Flux Report (deep analysis)
```

### Weekly Planning Integration
```
Bills & Subscriptions Observatory
    ↓
Weekly Overview (auto-populated bills)
```

---

## 🛠️ Technical Implementation

### Tools Used
- **Datacore** - Primary querying and React component development
- **Daily Activity Plugin** - Activity Observatory generation
- **Bases Plugin** - .bases file observatories (Coloring Book Observatory)
- **Custom React Components** - Financial visualizations
- **localStorage** - Cross-observatory navigation and filter persistence

### Key Principles
- **Query, Don't Store** - Observatories pull data from original sources
- **Multiple Perspectives** - Same data, different views for different needs
- **Performance-Optimized** - Datacore queries for fast loading
- **Visual-First** - Charts, graphs, and dashboards over raw data

---

## 📋 Creating New Observatories

When Andrea wants to create a new observatory:

1. **Identify the data source** - Where does the data live?
2. **Define the purpose** - Quick check-in, deep analysis, or searchable database?
3. **Choose the format** - Datacore dashboard, .bases file, or custom component?
4. **Build queries** - Pull relevant data from sources
5. **Design visualizations** - Charts, tables, stats cards
6. **Add to OBSERVATORIES nebula** - File lives in OBSERVATORIES folder
7. **Document here** - Add to this file for reference

---

## 🌟 Future Observatory Ideas

Potential observatories Andrea may build:

- **Habit Tracking Observatory** - Annual habit analysis from daily stars
- **Media Consumption Observatory** - Books, movies, TV shows tracking
- **Level 10 Life Dashboard** - Balance assessment across 10 life areas
- **Signal Pattern Analysis** - Deep dive into rapid logging patterns
- **Writing Progress Observatory** - 5th of June project tracking
- **Contribution Graph Observatory** - Vault engagement heatmaps

---

**Last Updated:** February 1, 2026  
**Maintained By:** Andrea
