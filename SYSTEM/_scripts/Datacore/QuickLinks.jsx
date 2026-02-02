const QuickLinks = () => { 
  const handleScroll = (e, id) => { 
    const container = e.target.closest(".markdown-preview-view") || e.target.closest(".cm-scroller");
    if (!container) return;

    let targetEl = container.querySelector("#" + id + "-target");
    if (!targetEl) targetEl = document.getElementById(id + "-target");
    if (!targetEl) targetEl = container.querySelector("#" + id);
    if (!targetEl) targetEl = document.getElementById(id);

    if (targetEl) {
      const headerOffset = 0;
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      
      const scrollPos = currentScroll + (targetRect.top - containerRect.top) - headerOffset;

      container.scrollTo({
        top: scrollPos,
        behavior: "smooth" 
      });
    } else {
        console.warn(`QuickLinks: Target "${id}" not found.`);
    }
  }; 

  return ( 
    <div className="quick-links-dropdown"> 
      <div className="quick-links-dropdown-header"> 
        <span>☰</span> Quick Links 
      </div> 
      <div className="quick-links-dropdown-options"> 
        <div className="quick-links-dropdown-panel"> 
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "signal-calendar")}>Signal Calendar</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "signals-breakdown")}>Signal Breakdown</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "weather")}>Weather Dashboard</div>
            <div className="quick-links-dropdown-option" onClick={(e) => handleScroll(e, "gallery")}>Photo Gallery</div>
        </div> 
      </div> 
    </div> 
  ); 
} 

return { QuickLinks };