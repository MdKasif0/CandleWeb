'use client';

import React, { useState, useEffect } from 'react';
import './animated.css';
import Image from 'next/image';

interface AnimatedTemplateProps {
  toName: string;
  fromName: string;
  message: string;
  imageUrl?: string | null;
}

const AnimatedTemplate: React.FC<AnimatedTemplateProps> = ({ toName, fromName, message }) => {
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A more celebratory audio track might fit this theme better
    const audio = new Audio('/audios/happy-birthday.mp3'); // Assuming an appropriate audio file exists
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Audio play failed. User may need to interact with the page first.", error));
    }
  };
  
  if (!isStarted) {
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

      <div className="birthday-card">
        <h1>Happy Birthday</h1>
        <h2>{toName}!</h2>
        <p className="message-text">{message}</p>
        <p className="from-name">- {fromName}</p>
      </div>

      <div className="birthday-assets">
        <div className="cake">
            <Image
                src="https://placehold.co/200x200.png"
                alt="Birthday Cake"
                width={100}
                height={100}
                data-ai-hint="birthday cake"
            />
        </div>
        <div className="gift">
             <Image
                src="https://placehold.co/200x200.png"
                alt="Gift Box"
                width={100}
                height={100}
                data-ai-hint="gift box"
            />
        </div>
      </div>
    </div>
  );
};

export default AnimatedTemplate;
