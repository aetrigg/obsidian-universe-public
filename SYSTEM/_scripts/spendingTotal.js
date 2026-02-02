module.exports = async (tp) => {
    const file = tp.file.find_tfile(tp.file.title);
    const content = await app.vault.read(file);
    const section = content.split("## :LiPiggyBank: Spending")[1] || "";
    const rows = section.match(/\|.*?\|.*?\|.*?\|/g) || [];
    let total = 0;
  
    for (let row of rows) {
      const cells = row.split("|").map((cell) => cell.trim());
      if (cells.length >= 4 && !isNaN(parseFloat(cells[1]))) {
        total += parseFloat(cells[1]);
      }
    }
  
    const formatted = total.toFixed(2);
    return total > 0
      ? `**Total Spent:** $${formatted}`
      : `**You spent $0 today!**`;
  };