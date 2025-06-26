'use client';

import React, { useState, useEffect, useRef } from 'react';
import './animated.css';

interface AnimatedTemplateProps {
  toName: string;
  fromName: string;
  message: string;
  imageUrl?: string | null;
}

const AnimatedTemplate: React.FC<AnimatedTemplateProps> = ({ toName, fromName, message }) => {
  const [stage, setStage] = useState(0); // 0: start, 1: card, 2: candles blown, 3: fireworks
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const nameChars = React.useMemo(() => toName.split(''), [toName]);

  useEffect(() => {
    const audio = new Audio('/audios/happy-birthday.mp3');
    audio.preload = 'auto';
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setStage(1);
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const handleBlowOut = () => {
    setStage(2);
    setTimeout(() => {
        setStage(3);
    }, 1000);
  };
  
  if (stage === 0) {
    return (
      <div className="birthday-body">
        <div className="stars" data-ai-hint="twinkling stars night sky"></div>
        <div className="moon" data-ai-hint="bright full moon"></div>
        <div className="start-container">
          <button className="start-button" onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="birthday-body" data-ai-hint="celebration party night">
      <div className="stars" data-ai-hint="twinkling stars night sky"></div>
      <div className="moon" data-ai-hint="bright full moon"></div>
      
      <div className="balloon" data-ai-hint="red balloon"></div>
      <div className="balloon" data-ai-hint="green balloon"></div>
      <div className="balloon" data-ai-hint="blue balloon"></div>
      <div className="balloon" data-ai-hint="yellow balloon"></div>

      {stage >= 1 && (
        <div className={`birthday-card ${stage > 1 ? 'fade-out' : 'fade-in'}`}>
            <h1>Happy Birthday</h1>
            <h2>{toName}!</h2>
            <p className="message-text">{message}</p>
            <p className="from-name">- {fromName}</p>
            <div className="cake-container">
                <div className="cake">
                    <div className="plate"></div>
                    <div className="layer layer-bottom"></div>
                    <div className="layer layer-middle"></div>
                    <div className="layer layer-top"></div>
                    <div className="icing"></div>
                    <div className="drip drip1"></div>
                    <div className="drip drip2"></div>
                    <div className="drip drip3"></div>
                    <div className="candle">
                        <div className={`flame ${stage === 1 ? 'lit' : ''}`}></div>
                    </div>
                </div>
            </div>
             {stage === 1 && (
                <button className="wish-button" onClick={handleBlowOut}>
                    Make a wish & blow out the candle!
                </button>
            )}
        </div>
      )}

      {stage === 3 && (
         <div className="fireworks-container">
            <div className="wish-text">Hope all your wishes come true!</div>
            <div className="fireworks-name">
                {nameChars.map((char, index) => (
                     <div className="firework" key={index} style={{'--i': index} as React.CSSProperties}>
                        {char === ' ' ? '\u00A0' : char}
                    </div>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};

export default AnimatedTemplate;
