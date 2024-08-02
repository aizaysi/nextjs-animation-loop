// components/Animation.js
"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';

const SCATTER_TIME = 300;
const SCATTER_NUMBER = 100;
const CONDENSE_TIME = 3000;
const INTERVAL_TIME = 300;
const COIN_PNG = "/coin.png";
const COIN_WIDTH = 50;

const Animation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [objects, setObjects] = useState([]);

  const viewportWidth = window.innerWidth - COIN_WIDTH;
  const viewportHeight = window.innerHeight - COIN_WIDTH;

  const scatterObjects = () => {
    const startX = viewportWidth / 2;
    const startY = viewportHeight / 2;
    for (let i = 0; i < SCATTER_NUMBER; i++) {

      const obj = document.createElement('img');
      obj.src = COIN_PNG;
      obj.width = COIN_WIDTH;
      obj.height = COIN_WIDTH;
      obj.className = 'object';
      document.body.appendChild(obj);

      const angle = Math.random() * 2 * Math.PI;
      const distance = COIN_WIDTH + Math.sqrt((startX + COIN_WIDTH / 2) * (startX + COIN_WIDTH / 2) + (startY + COIN_WIDTH / 2) * (startY + COIN_WIDTH / 2));
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);

      const duration = (1 + Math.random()) * SCATTER_TIME;
      obj.style.left = `${startX}px`;
      obj.style.top = `${startY}px`;

      obj.animate([
        { transform: 'translate(0, 0)' },
        { transform: `translate(${x}px, ${y}px)` },
      ], {
        duration,
        fill: 'forwards'
      }).onfinish = () => {
        obj.remove();
      };

      setObjects(prev => [...prev, obj]);
    }

    const condenserInterval = setInterval(() => {
      if (!isAnimating) {
        clearInterval(condenserInterval);
      } else {
        createCondensingObjects();
      }
    }, INTERVAL_TIME)
  };

  const createCondensingObjects = () => {
    const startX = viewportWidth / 2;
    const startY = viewportHeight / 2;

    const obj = document.createElement('img');
    obj.src = COIN_PNG;
    obj.width = COIN_WIDTH;
    obj.height = COIN_WIDTH;
    obj.className = 'object';
    document.body.appendChild(obj);

    const angle = Math.random() * 2 * Math.PI;
    // const distance = COIN_WIDTH + Math.sqrt(startX * startX + startY * startY);
    const distance = COIN_WIDTH + Math.sqrt((startX + COIN_WIDTH / 2) * (startX + COIN_WIDTH / 2) + (startY + COIN_WIDTH / 2) * (startY + COIN_WIDTH / 2));
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);

    const duration = (1 + Math.random()) * CONDENSE_TIME;
    obj.style.left = `${startX}px`;
    obj.style.top = `${startY}px`;

    obj.animate([
      { transform: `translate(${x}px, ${y}px) scale(1)` },
      { transform: 'translate(0, 0) scale(0.5)' },
    ], {
      duration,
      fill: 'forwards'
    }).onfinish = () => {
      obj.remove();
    };

    setObjects(prev => [...prev, obj]);
  };

  useEffect(() => {
    if (isAnimating) {
      scatterObjects();
    } else {
      objects.forEach(obj => obj.remove());
      setObjects([]);
    }
    return () => {
      objects.forEach(obj => obj.remove());
    };
  }, [isAnimating]);

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="circle rounded-full z-10">
        <Image src="/coin.png" alt="Coin Icon" width={150} height={150}/>
      </div>
      <button
        className="absolute top-32 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsAnimating(!isAnimating)}
      >
        {isAnimating ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default Animation;
