module.exports = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("default", { month: "2-digit" });
    const monthName = now.toLocaleString("default", { month: "long" });
    const day = now.toLocaleString("default", { day: "2-digit" });
  
    return `${year}/${month}-${monthName}/${year}-${month}-${day}`;
  };
  