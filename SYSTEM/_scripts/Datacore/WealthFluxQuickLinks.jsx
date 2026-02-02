const WealthFluxQuickLinks = () => { 
  const handleScroll = (e, id) => { 
    const container = e.target.closest(".markdown-preview-view") || e.target.closest(".cm-scroller");
    if (!container) return;

    let targetEl = container.querySelector("#" + id);
    if (!targetEl) targetEl = document.getElementById(id);

    if (targetEl) {
      const headerOffset = 0;
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      
      // Calculate exact position to scroll to
      const scrollPos = currentScroll + (targetRect.top - containerRect.top) - headerOffset;

      container.scrollTo({
        top: scrollPos,
        behavior: "smooth" 
      });
    } else {
        console.warn(`WealthFluxQuickLinks: Target "${id}" not found.`);
    }
  }; 

  return ( 
    <div className="quick-links-dropdown glow-purple"> 
      <div className="quick-links-dropdown-header"> 
        <span>☰</span> Quick Links 
      </div> 
      <div className="quick-links-dropdown-options"> 
        <div className="quick-links-dropdown-panel"> 
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "category-target")}>Spending by Category</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "pie-target")}>Pie Chart</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "trends-target")}>Daily Trends</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "totals-target")}>Totals</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "log-target")}>Expense Log</div>
        </div> 
      </div> 
    </div> 
  ); 
} 
return { WealthFluxQuickLinks };