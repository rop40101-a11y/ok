import React, { useState, useEffect } from 'react';
import './App.css';

export function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [noPosition, setNoPosition] = useState<{x: number, y: number} | null>(null);
  const [hearts, setHearts] = useState<Array<{id: number, left: number, animationDelay: number}>>([]);
  const [popHearts, setPopHearts] = useState<Array<{id: number, left: number, delay: number, char: string}>>([]);

  useEffect(() => {
    const heartsArray = [];
    for (let i = 0; i < 20; i++) {
      heartsArray.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5
      });
    }
    setHearts(heartsArray);
    
    // Create pop hearts for success screen
    const popArray = [];
    const chars = ['❤️', '💖', '💝', '💕', '💗'];
    for(let i=0; i<30; i++) {
      popArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        char: chars[Math.floor(Math.random() * chars.length)]
      });
    }
    setPopHearts(popArray);
  }, []);

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  const handleNoInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    // Get viewport dimensions safely
    const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);

    // Button dimensions
    const btnWidth = 140; 
    const btnHeight = 70; 
    const padding = 20;

    // Calculate boundaries
    const minX = padding;
    const maxX = viewportWidth - btnWidth - padding;
    const minY = padding;
    const maxY = viewportHeight - btnHeight - padding;

    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    const randomX = Math.floor(Math.random() * (safeMaxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (safeMaxY - minY + 1)) + minY;
    
    setNoPosition({ x: randomX, y: randomY });
  };

  if (showSuccess) {
    return (
      <div className="success-container">
        {popHearts.map(heart => (
          <div 
            key={heart.id}
            className="pop-heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`
            }}
          >
            {heart.char}
          </div>
        ))}

        <div className="graffiti graffiti-1" style={{"--rotation": "-15deg"} as React.CSSProperties}>
          LOVE YOU!
        </div>
        <div className="graffiti graffiti-2" style={{"--rotation": "15deg"} as React.CSSProperties}>
          FOREVER
        </div>
        <div className="graffiti graffiti-3" style={{"--rotation": "-10deg"} as React.CSSProperties}>
          SUMAIYA
        </div>
        <div className="graffiti graffiti-4" style={{"--rotation": "10deg"} as React.CSSProperties}>
          CUTIE SIS
        </div>

        <div className="dancing-container">
          <img 
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" 
            alt="Cute Bears Kissing" 
            className="dancing-gif"
          />
        </div>
        
        <div className="main-message">
          I KNEW YOU<br/>LOVE ME!
        </div>
        <div className="sub-message">
          Best Valentine Ever! ❤️
        </div>
      </div>
    );
  }

  return (
    <div className="valentine-container">
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.animationDelay}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>
      
      <div className="content">
        <h1 className="question">PREETI, WILL YOU BE MY VALENTINE?</h1>
        
        <div className="button-container">
          <button 
            className="btn btn-yes"
            onClick={handleYesClick}
          >
            YES
          </button>
          
          <button 
            className="btn btn-no"
            style={noPosition ? {
              position: 'fixed',
              left: `${noPosition.x}px`,
              top: `${noPosition.y}px`,
              transition: 'none',
              zIndex: 100
            } : {}}
            onMouseEnter={handleNoInteraction}
            onTouchStart={handleNoInteraction}
            onClick={handleNoInteraction}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
