module.exports = async () => {
    const today = new Date();
    const date = today.getDate();
  
    const tasks = {
      1: ["- [ ] Remind Taran to pay the electricity bill"],
      8: [
        "- [ ] iCloud+ subscription due",
        "- [ ] Send Taran $500 for rent"
      ],
      10: ["- [ ] Discord Nitro due"],
      13: [
        "- [ ] ChatGPT Plus due",
        "- [ ] Suno Pro due"
      ],
      16: ["- [ ] Peacock subscription due"],
      21: ["- [ ] Netflix subscription due"],
      24: [
        "- [ ] Pay Visible bill",
        "- [ ] Send Taran $500 for rent"
      ]
    };
  
    const file = app.workspace.getActiveFile();
    if (!file) {
      console.error("🚨 No active file found!");
      return;
    }
  
    let content = await app.vault.read(file);
    let lines = content.split("\n");
  
    const headingIndex = lines.findIndex(line =>
      line.trim().toLowerCase() === "- ### finances"
    );
  
    if (headingIndex === -1) {
      console.error("🚨 Could not find '- ### Finances' heading.");
      return;
    }
  
    // wipe existing content under Finances until next section/empty line
    let insertIndex = headingIndex + 1;
    while (
      insertIndex < lines.length &&
      lines[insertIndex].trim() !== "" &&
      !lines[insertIndex].startsWith("- ###") &&
      !lines[insertIndex].startsWith("## ")
    ) {
      lines.splice(insertIndex, 1);
    }
  
    const todayTasks = tasks[date];
  
    if (todayTasks) {
      lines.splice(insertIndex, 0, ...todayTasks);
      console.log("💸 Injected today's bill tasks.");
    } else {
      lines.splice(insertIndex, 0, "No bills due today");
      console.log("🛏 No bills today — added placeholder.");
    }
  
    const updated = lines.join("\n");
    await app.vault.modify(file, updated);
  };
  
  