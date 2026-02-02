---
name: suggest-missions
description: >-
  Analyzes logged signals from Digital Hobonichi daily notes over a specified
  time period and suggests missions to create based on patterns, recurring
  themes, and priorities.
---

# Suggest Missions from Signals Skill

## Prerequisites
- Read SYSTEM/_ai/Agents/README.md for universe context
- Read SYSTEM/_ai/Agents/MISSION_PROTOCOLS.md for mission creation workflow
- Read SYSTEM/_ai/Agents/UNIVERSE_STRUCTURE.md for INBOX routing rules

## Workflow

1. **Ask for Time Period**
   Prompt user to choose:
   - Last week (7 days)
   - Last 2 weeks (14 days)
   - Last month (30 days)
   - Last 3 months (90 days)
   - Custom date range (user provides dates)

2. **Locate Daily Stars**
   Navigate to Digital Hobonichi directory:
   - Path pattern: `Digital Hobonichi/YYYY/MM-MonthName/YYYY-MM-DD.md`
   - Example: `Digital Hobonichi/2026/01-January/2026-01-15.md`
   - Read all daily notes within specified date range

3. **Extract Signals**
   From each daily note's `## :LiCalendarClock: Daily Log` section:
   - Parse lines matching: `- [X] HH:MM [am|pm] // signal text`
   - Capture signal type (prefix letter/emoji), timestamp, and content
   - Common signal types:
     - `[i]` = ideas/insights
     - `[o]` = Obsidian/Universe work
     - `[h]` = happy moments/wins
     - `[B]` = blocked/frustrated
     - `[c]` = creative work
     - `[S]` = system setup/config
     - `[j]` = journaling
     - `[m]` = messages/communication
     - `[P]` = personal admin

4. **Identify Patterns**
   Analyze all extracted signals for:
   - **Recurring themes** (topics mentioned 3+ times)
   - **Urgency indicators** (frustrated language, repeated attempts, `[B]` blockers)
   - **Related signals** (signals that connect or build on each other)
   - **Energy signals** (excitement from `[h]`, passion from `[c]`)
   - **Progress threads** (ongoing efforts across multiple days)
   - **Problem clusters** (multiple `[B]` signals about same issue)

5. **Generate Mission Suggestions**
   Create 5-10 mission suggestions that:
   - Group 3+ related signals into coherent projects
   - Address recurring themes and blockers
   - Balance priority based on frequency and urgency
   - Align with expressed interests and energy
   - Have clear, actionable scope

   For each mission provide:
   - **Title**: Action-oriented using cosmic metaphor
   - **Rationale**: Why this matters (cite signal count)
   - **Related Signals**: 3-5 specific examples with dates
   - **Scope**: What's included
   - **Impact**: Why it matters based on patterns
   - **Priority**: High/Medium/Low
   - **Suggested Sub-INBOX**: Where this should go (based on routing rules)

6. **Present Results**
   ```
   🌠 Mission Suggestions from [Time Period]
   Analyzed [X] signals from [start] to [end]

   ═══════════════════════════════════════
   ⭐ HIGH PRIORITY MISSIONS
   ═══════════════════════════════════════

   **Mission 1: [Title]**
   📊 Based on [X] signals
   🎯 Sub-INBOX: [XX_NAME]
   
   Why: [Rationale]
   
   Related signals:
   • Jan 15 @ 09:23 am: [excerpt]
   • Jan 18 @ 05:18 pm: [excerpt]  
   • Jan 22 @ 06:07 pm: [excerpt]
   
   Scope: [What this includes]
   Impact: [Why this matters]

   ───────────────────────────────────────

   [Repeat for each high priority mission...]

   ═══════════════════════════════════════
   🌟 MEDIUM PRIORITY MISSIONS
   ═══════════════════════════════════════
   [Same format...]

   ═══════════════════════════════════════
   ✨ LOW PRIORITY MISSIONS
   ═══════════════════════════════════════
   [Same format...]

   ═══════════════════════════════════════
   🌌 THEMES IDENTIFIED
   ═══════════════════════════════════════
   • **[Theme 1]**: [X] signals (Jan 15, 18, 20, 22)
   • **[Theme 2]**: [X] signals (Jan 16, 19, 21)
   
   🔴 Recurring Blockers:
   • **[Blocker 1]**: [dates]
   ```

7. **User Interaction**
   After presenting suggestions:
   - Ask: "Convert any to missions? (y/n/select)"
   - If yes: For each selected mission
     - Confirm sub-INBOX routing (auto-suggest based on content)
     - Infer tag from mission content (confirm with user)
     - Ask for due date (optional)
     - Ask for priority marker (optional: ⏫/🔼/🔽)
     - Format as Tasks plugin mission
     - Add to appropriate sub-INBOX
   - Offer to show full signal excerpts if needed
   - Offer to analyze different time period
   - Offer to export suggestions to new note

## Tag Routing Rules
Reference MISSION_PROTOCOLS.md for complete map:
- #obsidian → 08_UNIVERSE
- #chores → 02_CHORES
- #personal, #reading, #scripting, #gaming, #gospel, #personal/* → 01_PERSONAL
- #finances, #finances/* → 03_FINANCES
- #writing, #writing/*, #5th-of-june, #5oJ, #5thofjune → 04_WRITING
- #coloringthecosmos, #coloring-the-cosmos, #coloring, #coloring/*, #coloringbooks, #coloringbooks/* → 05_COLORING
- #family, #family/*, #friends, #friends/* → 06_FAMILY-FRIENDS
- #work → prompt user
- Unknown → prompt user, offer to remember routing

## Mission Format
Use Tasks plugin syntax:
```
- [ ] mission description #tag 📅 YYYY-MM-DD ⏫
```

## Edge Cases
- **No signals found**: Suggest expanding time range or checking if daily notes exist
- **Too many signals (50+)**: Suggest narrowing time period or focusing on specific signal types
- **All signals scattered**: Group by broader themes or note this indicates exploratory phase
- **Missing daily notes**: Note gaps in date range and adjust analysis
- **Parsing errors**: Fall back to asking user for key themes they remember

## Example Output

```
🌠 Mission Suggestions from Last 2 Weeks
Analyzed 47 signals from Jan 8 to Jan 22

═══════════════════════════════════════
⭐ HIGH PRIORITY MISSIONS
═══════════════════════════════════════

**Mission 1: Fix Git Sparse Checkout for Mobile Sync**
📊 Based on 5 signals (4 blockers!)
🎯 Sub-INBOX: 08_UNIVERSE

Why: You've been repeatedly blocked trying to set up mobile access. This is causing frustration and preventing you from using Universe on the go.

Related signals:
• Jan 15 @ 06:07 pm: "working with claude code to diagnose a git issue"
• Jan 18 @ 03:22 pm: "still can't get git sparse checkout working ugh" [B]
• Jan 20 @ 08:45 am: "tried again with mobile sync, same error" [B]
• Jan 22 @ 02:10 pm: "maybe i should just give up on mobile for now" [B]

Scope: Research git sparse checkout properly, test with a small subset of files, document working solution for future reference

Impact: Unblocks mobile access to Universe, reduces daily frustration, enables on-the-go note taking

Convert to mission? (y/n): _
```

## Notes
- Look for both explicit `[i]` idea signals AND implicit ideas in other signal types
- Pay special attention to `[B]` blocked signals - they indicate real pain points
- Check "What's On My Mind?" journal sections for additional context
- Respect Andrea's reactive workflow - suggest don't dictate
- Use cosmic metaphors when naming missions (galaxies, stars, nebulae, etc.)
- Keep mission descriptions actionable and specific
