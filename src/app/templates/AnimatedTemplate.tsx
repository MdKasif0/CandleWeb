'use client';

import React, { useEffect } from 'react';
import './animated.css';

interface AnimatedTemplateProps {
  toName: string;
  fromName: string;
  message: string;
  imageUrl?: string | null;
}

const AnimatedTemplate: React.FC<AnimatedTemplateProps> = ({ toName, fromName, message, imageUrl }) => {
  useEffect(() => {
    const ad = document.getElementById('ad') as HTMLAudioElement | null;
    const boton = document.getElementById('boton');
    const popup = document.getElementById('popup');
    const close = document.getElementById('close');

    const handleBotonClick = () => {
      popup?.classList.add('active');
      ad?.play().catch(error => console.error("Audio play failed:", error));
    };

    const handleCloseClick = () => {
      popup?.classList.remove('active');
      ad?.pause();
    };

    boton?.addEventListener('click', handleBotonClick);
    close?.addEventListener('click', handleCloseClick);

    return () => {
      boton?.removeEventListener('click', handleBotonClick);
      close?.removeEventListener('click', handleCloseClick);
    };
  }, []);

  const avatarUrl = imageUrl || '/images/avatar.jpg';

  return (
    <div className="birthday-body">
      <audio id="ad" src="/audios/Blue.mp3" preload="auto"></audio>

      <div className="moon"></div>
      <div className="tree"></div>

      <div className="wish-hbd">
        <h1 className="happy">Happy</h1>
        <h1 className="birthday">Birthday</h1>
        <h1 className="name">{toName}</h1>
      </div>

      <div className="cake">
        <div className="velas">
          <div className="fuego"></div>
          <div className="fuego"></div>
          <div className="fuego"></div>
          <div className="fuego"></div>
          <div className="fuego"></div>
        </div>
        <div className="cobertura"></div>
        <div className="bizcocho"></div>
      </div>

      <div id="boton" className="boton-abrir-popup">
        Click Me
      </div>

      <div id="popup" className="popup">
        <div className="container-popup">
          <div id="close" className="close"></div>
          <div className="avatar" style={{ backgroundImage: `url(${avatarUrl})` }} data-ai-hint="birthday person"></div>
          <h2 className="title-popup">A special message for you!</h2>
          <p className="des-popup">{message}</p>
          <p className="name-popup">- {fromName}</p>
        </div>
      </div>

      <div className="regalo" id="regalo">
        <div className="tapa">
          <span></span>
        </div>
        <div className="lazo"></div>
        <div className="caja"></div>
      </div>
    </div>
  );
};

export default AnimatedTemplate;
