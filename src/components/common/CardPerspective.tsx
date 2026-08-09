'use client';

import React, { useRef, useState } from 'react';

interface CardPerspectiveProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
}

export const CardPerspective: React.FC<CardPerspectiveProps> = ({
  children,
  className = '',
  intensity = 10,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2; // -1 a 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 a 1

    setRotateX(-yPct * intensity);
    setRotateY(xPct * intensity);
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="perspective-viewport w-full" onClick={onClick}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          transition: rotateX === 0 ? 'transform 0.5s ease-out' : 'none'
        }}
        className={`perspective-card relative overflow-hidden rounded-xl ${className}`}
      >
        {/* Camada de Brilho Reflexivo 3D */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(0, 189, 125, ${glarePosition.opacity}), transparent 60%)`
          }}
        />
        {children}
      </div>
    </div>
  );
};
