<%*
// Weekly Canvas Generator for Obsidian
// This script generates a weekly overview canvas with tasks and bills

// ============================================
// CONFIGURATION
// ============================================
const INBOX_FOLDER = "INBOX";
const BILLS_FOLDER = "SYSTEM/_data/Bills";
const OUTPUT_BASE = "Digital Hobonichi";
const TASK_TAG = "#this-week";

// ============================================
// DATE UTILITIES
// ============================================
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function formatDate(date, format = "MMM DD") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    if (format === "MMM DD") {
        return `${months[date.getMonth()]} ${date.getDate()}`;
    } else if (format === "ddd, MMM DD") {
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
    }
    return date.toISOString().split('T')[0];
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// ============================================
// BILL CALCULATION (matching Bases logic)
// ============================================
function calculateNextPaymentDate(startDateStr, cycle) {
    const startDate = new Date(startDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!cycle) return null;
    
    let nextPayment = new Date(startDate);
    nextPayment.setHours(0, 0, 0, 0);
    
    if (cycle.endsWith('d')) {
        // Daily cycle (e.g., "28d")
        const days = parseInt(cycle);
        const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const cyclesPassed = Math.ceil(daysSinceStart / days);
        nextPayment.setDate(startDate.getDate() + (cyclesPassed * days));
    } else if (cycle.endsWith('M')) {
        // Monthly cycle (e.g., "1M")
        const months = parseInt(cycle);
        const monthsSinceStart = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                                  (today.getMonth() - startDate.getMonth());
        const cyclesPassed = Math.ceil(monthsSinceStart / months);
        nextPayment.setMonth(startDate.getMonth() + (cyclesPassed * months));
    } else if (cycle.endsWith('y')) {
        // Yearly cycle (e.g., "1y")
        const years = parseInt(cycle);
        const yearsSinceStart = today.getFullYear() - startDate.getFullYear();
        const cyclesPassed = Math.ceil(yearsSinceStart / years);
        nextPayment.setFullYear(startDate.getFullYear() + (cyclesPassed * years));
    }
    
    // If next payment is in the past, add one more cycle
    if (nextPayment < today) {
        if (cycle.endsWith('d')) {
            const days = parseInt(cycle);
            nextPayment.setDate(nextPayment.getDate() + days);
        } else if (cycle.endsWith('M')) {
            const months = parseInt(cycle);
            nextPayment.setMonth(nextPayment.getMonth() + months);
        } else if (cycle.endsWith('y')) {
            const years = parseInt(cycle);
            nextPayment.setFullYear(nextPayment.getFullYear() + years);
        }
    }
    
    nextPayment.setHours(0, 0, 0, 0);
    return nextPayment;
}

// ============================================
// RECURRING EVENTS AND TASKS PARSER
// ============================================
async function parseRecurringItems(weekStart, weekNum) {
    const recurringFilePath = `${INBOX_FOLDER}/07_RECURRING.md`;
    const recurringFile = app.vault.getAbstractFileByPath(recurringFilePath);
    
    if (!recurringFile) {
        console.log("07_RECURRING.md not found");
        return { events: {}, tasks: {} };
    }
    
    const content = await app.vault.cachedRead(recurringFile);
    const lines = content.split('\n');
    
    const weekEvents = {};
    const weekTasks = {};
    
    // Initialize arrays for each day
    for (let i = 0; i < 7; i++) {
        weekEvents[i] = [];
        weekTasks[i] = [];
    }
    
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Helper function to clean up event/task text
    function cleanRecurringText(text) {
        // Remove "every [day]" patterns
        let cleaned = text.replace(/every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '').trim();
        // Remove "every other [day]" patterns
        cleaned = cleaned.replace(/every other (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '').trim();
        // Remove "first [day] of the month" patterns
        cleaned = cleaned.replace(/(every )?first (monday|tuesday|wednesday|thursday|friday|saturday|sunday) of the month/gi, '').trim();
        // Remove "at" if it starts the line after cleaning
        cleaned = cleaned.replace(/^at\s+/i, '@ ');
        // Clean up extra spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        return cleaned;
    }
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // Check if it's an event ([<]) or task ([ ])
        const isEvent = trimmed.startsWith('- [<]');
        const isTask = trimmed.startsWith('- [ ]');
        const isLocation = trimmed.startsWith('- [l]');
        
        if (!isEvent && !isTask && !isLocation) continue;
        
        // Handle location lines (just store for next event)
        if (isLocation) {
            // Location lines will be handled with their parent event
            continue;
        }
        
        const lowerLine = trimmed.toLowerCase();
        
        // Check for week-specific items using dataview inline field [weeks:: 48,50,52]
        const weeksMatch = trimmed.match(/\[weeks::\s*([0-9,\s]+)\]/);
        if (weeksMatch) {
            const allowedWeeks = weeksMatch[1].split(',').map(w => parseInt(w.trim()));
            if (!allowedWeeks.includes(weekNum)) {
                continue; // Skip if not in allowed weeks
            }
        }
        
        // Parse "first [day] of the month"
        if (lowerLine.includes('first') && lowerLine.includes('of the month')) {
            for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
                if (lowerLine.includes(dayNames[dayIdx])) {
                    const date = new Date(weekStart);
                    date.setDate(weekStart.getDate() + dayIdx);
                    
                    // Check if this is the first occurrence of this weekday in the month
                    if (date.getDate() <= 7) {
                        const cleanedText = cleanRecurringText(trimmed);
                        if (isEvent) {
                            weekEvents[dayIdx].push(cleanedText);
                        } else {
                            weekTasks[dayIdx].push(cleanedText);
                        }
                    }
                    break;
                }
            }
            continue;
        }
        
        // Parse "every [day]" patterns
        for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
            const pattern = `every ${dayNames[dayIdx]}`;
            if (lowerLine.includes(pattern)) {
                const cleanedText = cleanRecurringText(trimmed);
                if (isEvent) {
                    weekEvents[dayIdx].push(cleanedText);
                } else {
                    weekTasks[dayIdx].push(cleanedText);
                }
                break;
            }
        }
    }
    
    console.log(`Parsed recurring items from 07_RECURRING.md`);
    return { events: weekEvents, tasks: weekTasks };
}

// ============================================
// ONE-OFF EVENTS PARSER (from 06_FAMILY & FRIENDS)
// ============================================
async function parseOneOffEvents(weekStart, weekEnd) {
    const familyFilePath = `${INBOX_FOLDER}/06_FAMILY & FRIENDS.md`;
    const familyFile = app.vault.getAbstractFileByPath(familyFilePath);
    
    if (!familyFile) {
        console.log("06_FAMILY & FRIENDS.md not found");
        return {};
    }
    
    const content = await app.vault.cachedRead(familyFile);
    const lines = content.split('\n');
    
    const weekEvents = {};
    for (let i = 0; i < 7; i++) {
        weekEvents[i] = [];
    }
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match events: - [<] or - [g] or - [>]
        if (!line.match(/^- \[(<|g|>)\]/)) continue;
        
        // Extract date from "on MM/DD/YYYY" or "on MM/DD"
        const dateMatch = line.match(/on (\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
        if (!dateMatch) continue;
        
        const month = parseInt(dateMatch[1]);
        const day = parseInt(dateMatch[2]);
        const year = dateMatch[3] ? parseInt(dateMatch[3]) : weekStart.getFullYear();
        
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0);
        
        // Check if event falls within this week
        if (eventDate >= weekStart && eventDate <= weekEnd) {
            const dayIndex = Math.floor((eventDate - weekStart) / (1000 * 60 * 60 * 24));
            
            // Add the event
            weekEvents[dayIndex].push(line);
            
            // Check if next line is a location
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith('- [l]')) {
                weekEvents[dayIndex].push('\t' + lines[i + 1].trim());
            }
        }
    }
    
    console.log(`Parsed one-off events from 06_FAMILY & FRIENDS.md`);
    return weekEvents;
}

// ============================================
// ROLLOVER TASKS FROM PREVIOUS WEEK
// ============================================
async function getPreviousWeekSundayTasks(currentWeekNum, currentYear) {
    const prevWeekNum = currentWeekNum - 1;
    const prevYear = prevWeekNum < 1 ? currentYear - 1 : currentYear;
    const weekNumStr = prevWeekNum < 1 ? 52 : prevWeekNum; // Handle week 0 edge case
    
    const prevCanvasPath = `${OUTPUT_BASE}/${prevYear}/Weekly Overview/${prevYear}-W${String(weekNumStr).padStart(2, '0')}.canvas`;
    
    try {
        const prevCanvas = app.vault.getAbstractFileByPath(prevCanvasPath);
        if (!prevCanvas) {
            console.log(`Previous week canvas not found: ${prevCanvasPath}`);
            return [];
        }
        
        const canvasContent = await app.vault.cachedRead(prevCanvas);
        const canvasData = JSON.parse(canvasContent);
        
        // Find the Sunday node by looking for "Sun," in the heading
        // It could have id "day-6" (from script) or a random ID (from manual creation)
        const sundayNode = canvasData.nodes.find(n => 
            n.type === "text" && n.text && n.text.includes("Sun,")
        );
        if (!sundayNode) {
            console.log("Sunday node not found in previous week's canvas");
            return [];
        }
        
        console.log(`Found Sunday node: ${sundayNode.text.split('\n')[0]}`);
        
        // Extract uncompleted tasks from Sunday's node
        const text = sundayNode.text;
        const lines = text.split('\n');
        const uncompletedTasks = [];
        
        let inTasksSection = false;
        for (const line of lines) {
            if (line.includes('### :LiCheckSquare: Tasks')) {
                inTasksSection = true;
                continue;
            }
            
            // Stop if we hit another section or end
            if (inTasksSection && line.startsWith('###')) {
                break;
            }
            
            // Collect uncompleted tasks (not [x] and not empty)
            if (inTasksSection && line.trim().startsWith('- [') && !line.includes('- [x]')) {
                uncompletedTasks.push(line.trim());
            }
        }
        
        console.log(`Found ${uncompletedTasks.length} uncompleted tasks from last Sunday`);
        return uncompletedTasks;
        
    } catch (err) {
        console.log(`Could not read previous week's canvas: ${err.message}`);
        return [];
    }
}

// ============================================
// DATA COLLECTION
// ============================================
async function collectTasks() {
    const tasks = [];
    
    // Get all files in INBOX folder
    const inboxFolder = app.vault.getAbstractFileByPath(INBOX_FOLDER);
    if (!inboxFolder || !inboxFolder.children) {
        new Notice("⚠️ INBOX folder not found!");
        return [];
    }
    
    // Filter for files that start with "0" and end with ".md"
    const inboxFiles = inboxFolder.children.filter(f => 
        f.name.startsWith("0") && f.extension === "md"
    );
    
    for (const file of inboxFiles) {
        try {
            const content = await app.vault.cachedRead(file);
            const lines = content.split('\n');
            
            for (const line of lines) {
                if (line.includes(TASK_TAG) && /^- \[.\]/.test(line.trim())) {
                    tasks.push(line.trim());
                }
            }
        } catch (err) {
            console.error(`Error reading ${file.name}:`, err);
        }
    }
    
    console.log(`Total tasks found with ${TASK_TAG}: ${tasks.length}`);
    return tasks;
}

async function collectBills(weekStart, weekEnd) {
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
        console.log("Dataview not available for bills");
        return {};
    }
    
    const billFiles = dv.pages(`"${BILLS_FOLDER}"`);
    const billsThisWeek = {};
    
    console.log(`Checking ${billFiles.length} bill files...`);
    
    // Initialize empty arrays for each day
    for (let i = 0; i < 7; i++) {
        billsThisWeek[i] = [];
    }
    
    for (const bill of billFiles) {
        // Skip if no startDate or cycle, or if it has an endDate (inactive)
        if (!bill.startDate || !bill.cycle) {
            console.log(`Skipping ${bill.file.name}: missing startDate or cycle`);
            continue;
        }
        if (bill.endDate) {
            console.log(`Skipping ${bill.file.name}: has endDate (inactive)`);
            continue;
        }
        
        // Calculate next payment date
        const nextPayment = calculateNextPaymentDate(bill.startDate, bill.cycle);
        if (!nextPayment) {
            console.log(`Skipping ${bill.file.name}: couldn't calculate next payment`);
            continue;
        }
        
        console.log(`${bill.file.name}: next payment ${nextPayment.toISOString().split('T')[0]}`);
        
        // Check if next payment falls within this week
        if (nextPayment >= weekStart && nextPayment <= weekEnd) {
            // Find which day of the week
            const dayIndex = Math.floor((nextPayment - weekStart) / (1000 * 60 * 60 * 24));
            
            // Determine bill type from tags
            const billType = bill.tags?.includes('subscription') ? 'subscription' : 'bill';
            
            console.log(`✓ ${bill.file.name} due on day ${dayIndex} (${billType})`);
            
            billsThisWeek[dayIndex].push({
                name: bill.file.name,
                type: billType
            });
        }
    }
    
    return billsThisWeek;
}

// ============================================
// CANVAS GENERATION
// ============================================
function generateCanvasJSON(weekStart, tasks, bills, mondayRolloverTasks = [], recurringEvents = {}, recurringTasks = {}, oneOffEvents = {}) {
    const nodes = [];
    const colors = ["1", "2", "3", "4", "5", "#25116f", "6", "#a12172"];
    
    // Floating tasks card
    const floatingTasks = tasks.length > 0 ? tasks.join('\n') : "";
    nodes.push({
        id: "floating-this-week",
        type: "text",
        text: `> [!cc-header] <h2>:LiListChecks: <u><i>Floating This Week</i></u></h2>\n\n${floatingTasks}`,
        x: -1020,
        y: -540,
        width: 420,
        height: 1060,
        color: "1"
    });
    
    // Daily cards
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = formatDate(date, "ddd, MMM DD");
        
        // Events section
        let eventsText = "";
        const allEvents = [
            ...(recurringEvents[i] || []),
            ...(oneOffEvents[i] || [])
        ];
        
        if (allEvents.length > 0) {
            eventsText = allEvents.join('\n');
        } else {
            eventsText = "No events today";
        }
        
        // Bills section
        let billsText = "No bills due";
        if (bills[i] && bills[i].length > 0) {
            billsText = bills[i].map(b => `- [ ] ${b.name} ${b.type} due #finances/${b.type}`).join('\n');
        }
        
        // Tasks section
        let tasksText = "";
        const allTasks = [
            ...(recurringTasks[i] || [])
        ];
        
        // Add rollover tasks to Monday (day 0)
        if (i === 0 && mondayRolloverTasks.length > 0) {
            allTasks.push(...mondayRolloverTasks);
        }
        
        if (allTasks.length > 0) {
            tasksText = allTasks.join('\n');
        }
        
        const nodeText = `> [!cc-header] <h2>:LiListChecks: <u><i>${dateStr}</i></u></h2>

### :LiCalendarDays: Events
${eventsText}
### :LiBanknote: Bills Due
${billsText}
### :LiCheckSquare: Tasks
${tasksText}`;
        
        nodes.push({
            id: `day-${i}`,
            type: "text",
            text: nodeText,
            x: -580 + (i * 440),
            y: -540,
            width: 420,
            height: 1060,
            color: colors[i + 1]
        });
    }
    
    return {
        nodes: nodes,
        edges: [],
        metadata: {
            version: "1.0-1.0",
            frontmatter: {}
        }
    };
}

// ============================================
// MAIN EXECUTION
// ============================================

try {
    // Get the Monday of the current week
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    
    // Smart mode: If it's Fri/Sat/Sun, generate next week
    let targetDate = new Date(today);
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        // Add days to get to next Monday
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
        targetDate.setDate(today.getDate() + daysUntilMonday);
    }
    
    const monday = getMonday(targetDate);
    monday.setHours(0, 0, 0, 0);
    const weekNum = getWeekNumber(monday);
    const year = monday.getFullYear();
    
    // Calculate week end (Sunday)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    console.log(`Week range: ${monday.toISOString()} to ${sunday.toISOString()}`);
    
    new Notice(`🔄 Generating week ${weekNum} (${formatDate(monday)} - ${formatDate(sunday)})...`);
    
    // Collect data
    const tasks = await collectTasks();
    const bills = await collectBills(monday, sunday);
    const rolloverTasks = await getPreviousWeekSundayTasks(weekNum, year);
    const recurring = await parseRecurringItems(monday, weekNum);
    const oneOffEvents = await parseOneOffEvents(monday, sunday);
    
    new Notice(`📋 Found ${tasks.length} tasks with ${TASK_TAG}`);
    if (rolloverTasks.length > 0) {
        new Notice(`↩️ Rolling over ${rolloverTasks.length} tasks from last Sunday`);
    }
    
    // Generate canvas
    const canvasData = generateCanvasJSON(monday, tasks, bills, rolloverTasks, recurring.events, recurring.tasks, oneOffEvents);
    
    // Create filename and dynamic output folder
    const filename = `${year}-W${String(weekNum).padStart(2, '0')}.canvas`;
    const outputFolder = `${OUTPUT_BASE}/${year}/Weekly Overview`;
    const filepath = `${outputFolder}/${filename}`;
    
    // Check if file exists
    const existingFile = app.vault.getAbstractFileByPath(filepath);
    if (existingFile) {
        new Notice(`⚠️ ${filename} already exists! Delete it first or the script will overwrite.`);
        // Uncomment the next line if you want to allow overwrites
        // await app.vault.delete(existingFile);
    }
    
    // Save canvas file
    await app.vault.create(filepath, JSON.stringify(canvasData, null, 2));
    new Notice(`✅ Created ${filename}!`);
    
} catch (err) {
    new Notice(`❌ Error: ${err.message}`);
    console.error("Weekly Canvas Generator Error:", err);
}
_%>