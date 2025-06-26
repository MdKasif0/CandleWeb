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
    const audio = new Audio('/audios/Blue.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;

    // Cleanup audio on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current?.play().catch(error => console.error("Audio play failed:", error));
  };

  return (
    <div className="birthday-body-v2" data-ai-hint="night sky stars">
      <div className="moon-v2" data-ai-hint="glowing full moon">
         <Image 
            src="https://placehold.co/300x300.png" 
            alt="Moon" 
            width={200} 
            height={200}
            className="moon-image-v2"
        />
      </div>
      
      <div className="forest-silhouette-v2" data-ai-hint="forest silhouette"></div>
      
      {!isStarted && (
        <div className="start-container-v2">
            <button className="start-button-v2" onClick={handleStart}>
                START
            </button>
        </div>
      )}

      {isStarted && (
        <div className="wish-container-v2">
          <h1 className="title-hbd-v2">Happy Birthday</h1>
          <h2 className="title-name-v2">{toName}!</h2>
          <div className="message-box-v2">
            <p className="message-text-v2">{message}</p>
            <p className="from-name-v2">- {fromName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedTemplate;
