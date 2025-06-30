'use client';

import React, { useState, useEffect } from 'react';
import './particles.css';

interface Particle {
  id: number;
  left: string;
  width: string;
  height: string;
  animationName: string;
  animationDelay: string;
  animationDuration: string;
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleCount = 75;

  useEffect(() => {
    // This code now runs only on the client, after the component has mounted,
    // which prevents a hydration mismatch between server and client.
    const generatedParticles = Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.floor(Math.random() * 3) + 2; // 2 to 4px
      const animationName = `float-${Math.floor(Math.random() * 4) + 1}`;
      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        width: `${size}px`,
        height: `${size}px`,
        animationName: animationName,
        animationDelay: `-${Math.random() * 20}s`, // Negative delay
        animationDuration: `${Math.random() * 10 + 15}s`, // 15 to 25s
      };
    });
    setParticles(generatedParticles);
  }, []); // Empty dependency array ensures this runs once on mount.

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div id="particles-js">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationName: p.animationName,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleBackground;
