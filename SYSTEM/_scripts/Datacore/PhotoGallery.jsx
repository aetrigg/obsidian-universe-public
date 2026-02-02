const PhotoGallery = ({ year, month, monthName }) => { 
  const MONTH_FOLDER = month + "-" + monthName; 
  const FOLDER_PATH = "Digital Hobonichi/" + year + "/" + MONTH_FOLDER; 

  const [photos, setPhotos] = dc.useState([]); 
  const [loading, setLoading] = dc.useState(true); 
  const [selectedPhoto, setSelectedPhoto] = dc.useState(null); 

  dc.useEffect(() => { 
    const loadPhotos = async () => { 
      const files = app.vault.getMarkdownFiles().filter(f => 
        f.path.startsWith(FOLDER_PATH) && /\d{4}-\d{2}-\d{2}\.md$/.test(f.name) 
      ); 

      const allPhotos = []; 

      for (const file of files) { 
        const content = await app.vault.read(file); 

        // Get banner (Simplified)
        let bannerFile = null;
        const bannerMatch = content.match(/^banner:\s*(.*)$/m);
        if (bannerMatch) {
            let bText = bannerMatch[1].trim();
            // Remove quotes and brackets loosely
            bText = bText.replace(/['"\[\]!]/g, ""); 
            if (bText.includes("|")) bText = bText.split("|")[0];
            bannerFile = bText.trim();
        }

        // 1. Markdown Images: ![alt](url)
        // Match ! followed by [anything] then (anything)
        const mdRegex = /!\[(.*?)\]\((.*?)\)/g;
        let mdMatch; 
        while ((mdMatch = mdRegex.exec(content)) !== null) { 
          const url = mdMatch[2]; 
          // Check extensions
          if (/\.(png|jpg|jpeg|gif|webp|svg)/i.test(url) || url.includes("imgur") || url.includes("i.redd")) {
            allPhotos.push({ 
              src: url, 
              alt: mdMatch[1] || "Photo", 
              date: file.basename, 
              file, 
              type: "external" 
            }); 
          }
        } 

        // 2. Obsidian Embeds: ![[filename]]
        // Match ![[ followed by anything until ]]
        const obsRegex = /!\[\[(.*?)\]\]/g;
        let obsMatch;
        while ((obsMatch = obsRegex.exec(content)) !== null) { 
          const rawContent = obsMatch[1]; // e.g. "image.png|100"
          const imageName = rawContent.split("|")[0];
          
          // Verify it's an image file
          if (!/\.(png|jpg|jpeg|gif|webp|svg)/i.test(imageName)) continue; 

          // Exclude banner
          if (bannerFile && imageName.includes(bannerFile)) continue; 

          const imageFile = app.metadataCache.getFirstLinkpathDest(imageName, file.path); 
          if (imageFile) { 
            const resourcePath = app.vault.getResourcePath(imageFile); 
            allPhotos.push({ 
              src: resourcePath, 
              alt: imageName, 
              date: file.basename, 
              file, 
              type: "internal" 
            }); 
          } 
        } 
      } 

      allPhotos.sort((a, b) => b.date.localeCompare(a.date)); 
      setPhotos(allPhotos); 
      setLoading(false); 
    }; 
    loadPhotos(); 
  }, []); 

  const cardStyle = { 
    background: "rgba(20, 20, 20, 0.1)", 
    borderRadius: "12px", 
    padding: "16px 20px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    backdropFilter: "blur(2.5px)" 
  }; 

  const getGlowStyle = (color) => `0 0 12px ${color}99, 0 0 24px ${color}99`;

  const shortMonth = monthName.slice(0, 3); 

  if (loading) return ( 
    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", animation: "fadeIn 0.5s ease" }}> 
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>✨</div> 
      <div style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Aligning Stars...</div> 
    </div> 
  ); 

  if (photos.length === 0) { 
    return ( 
      <div style={{ ...cardStyle, textAlign: "center", padding: "30px" }}> 
        <p style={{ margin: 0, color: "var(--text-muted)", fontStyle: "italic" }}> 
          No photos located in the daily stars for this month. 
        </p> 
        {/* Debug info */}
        <p style={{ fontSize: "10px", color: "var(--text-faint)", marginTop: "10px" }}>
           Scanned path: {FOLDER_PATH}
        </p>
      </div> 
    ); 
  } 

  return ( 
    <div style={{ fontFamily: "var(--font-interface)" }}> 
      <style>{` 
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .glow-text { 
          color: #ffffff !important; 
          transition: all 0.3s ease;
          text-shadow: 0 0 4px rgba(138, 108, 245, 0.3);
        }
        .glow-text:hover { 
          text-shadow: 0 0 8px #8A6CF5, 0 0 14px #BA9FFF, 0 0 24px #C3B1FF !important; 
          transform: scale(1.05);
        }
      `}</style> 

      {/* Photo count */} 
      <div style={{ ...cardStyle, marginBottom: "20px", textAlign: "center", animation: "fadeInUp 0.4s ease-out both" }}> 
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-accent)", marginBottom: "4px" }}>{photos.length}</div> 
        <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>Photos This Month</div> 
      </div> 

      {/* Gallery Grid */} 
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
        gap: "25px", 
        animation: "fadeInUp 0.4s ease-out 0.1s both" 
      }}> 
        {photos.map((photo, idx) => ( 
          <div 
            key={idx} 
            onClick={() => setSelectedPhoto(photo)} 
            style={{ 
              position: "relative", 
              borderRadius: "10px", 
              cursor: "pointer", 
              aspectRatio: "1", 
              background: "rgba(20, 20, 20, 0.1)", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              transition: "all 0.2s ease-in-out", 
              animation: "fadeInUp 0.4s ease-out " + (0.1 + idx * 0.03) + "s both", 
              backdropFilter: "blur(2.5px)" 
            }} 
            onMouseEnter={e => { 
              e.currentTarget.style.transform = "scale(1.05)"; 
              e.currentTarget.style.boxShadow = getGlowStyle("#8A6CF5");
              e.currentTarget.style.borderColor = "#8A6CF5";
            }} 
            onMouseLeave={e => { 
              e.currentTarget.style.transform = ""; 
              e.currentTarget.style.boxShadow = ""; 
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }} 
          > 
            <div style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
              <img 
                src={photo.src} 
                alt={photo.alt} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover" 
                }} 
              /> 
              <div style={{ 
                position: "absolute", 
                bottom: 0, 
                left: 0, 
                right: 0, 
                padding: "8px", 
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))", 
                fontSize: "11px", 
                color: "#fff", 
                textAlign: "right" 
              }}> 
                {shortMonth} {parseInt(photo.date.slice(-2))} 
              </div> 
            </div>
          </div> 
        ))} 
      </div> 

      {/* Lightbox Modal */} 
      {selectedPhoto && ( 
        <div 
          onClick={() => setSelectedPhoto(null)} 
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: "rgba(0,0,0,0.9)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 1000, 
            cursor: "pointer", 
            animation: "fadeIn 0.2s ease-out both" 
          }} 
        > 
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", textAlign: "center" }}> 
            <img 
              src={selectedPhoto.src} 
              alt={selectedPhoto.alt} 
              style={{ 
                maxWidth: "90vw", 
                maxHeight: "80vh", 
                objectFit: "contain", 
                borderRadius: "8px" 
              }} 
            /> 
            <div style={{ 
              marginTop: "16px", 
              color: "#fff", 
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center"
            }}> 
              <div 
                className="glow-text" 
                onClick={(e) => { e.stopPropagation(); app.workspace.openLinkText(selectedPhoto.file.path, "", false); setSelectedPhoto(null); }} 
                style={{ cursor: "pointer", fontSize: "16px", fontWeight: "600" }} 
              > 
                {shortMonth} {parseInt(selectedPhoto.date.slice(-2))}, {year} 
              </div> 
              <div style={{ opacity: 0.5, fontSize: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Click anywhere to close
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}
return { PhotoGallery };