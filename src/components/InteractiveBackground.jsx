import React, { useEffect, useRef } from 'react';

const INTENSITY_CONFIG = {
  hero: { particleRange: [90, 120], glowOpacity: 0.18, connections: true },
  medium: { particleRange: [60, 80], glowOpacity: 0.14, connections: true },
  subtle: { particleRange: [30, 40], glowOpacity: 0.1, connections: false },
};

const lerp = (from, to, amount) => from + (to - from) * amount;
const randomBetween = (min, max) => min + Math.random() * (max - min);

const InteractiveBackground = ({ intensity = 'medium', className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const config = INTENSITY_CONFIG[intensity] || INTENSITY_CONFIG.medium;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const interactive = !reduceMotion && !isMobile;
    const particleCount = Math.max(
      1,
      Math.round(randomBetween(config.particleRange[0], config.particleRange[1]) * (isMobile ? 0.5 : 1)),
    );
    const particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame;
    let resizeTimeout;
    let startTime = performance.now();
    let lastFrameTime = startTime;

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      previousX: 0,
      previousY: 0,
      activity: 0,
      targetActivity: 0,
    };

    const resize = () => {
      const bounds = canvas.parentElement?.getBoundingClientRect();
      width = bounds?.width || window.innerWidth;
      height = bounds?.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      particles.length = 0;
      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: randomBetween(1, 3),
          opacity: randomBetween(0.15, 0.35),
          vx: randomBetween(-0.08, 0.08),
          vy: randomBetween(-0.08, 0.08),
        });
      }
    };

    const drawGrid = (parallaxX, parallaxY) => {
      if (!config.connections) return;
      context.fillStyle = 'rgba(255, 255, 255, 0.06)';
      const offsetX = ((parallaxX % 40) + 40) % 40;
      const offsetY = ((parallaxY % 40) + 40) % 40;
      for (let x = -40 + offsetX; x < width + 40; x += 40) {
        for (let y = -40 + offsetY; y < height + 40; y += 40) {
          context.beginPath();
          context.arc(x, y, 1, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const drawBackground = (parallaxX, parallaxY) => {
      const gradient = context.createLinearGradient(
        -width * 0.2 + parallaxX,
        -height * 0.2 + parallaxY,
        width * 1.2 + parallaxX,
        height * 1.2 + parallaxY,
      );
      gradient.addColorStop(0, 'rgba(10, 14, 39, 0.35)');
      gradient.addColorStop(0.5, 'rgba(15, 21, 51, 0.16)');
      gradient.addColorStop(1, 'rgba(10, 14, 39, 0.35)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const drawGlow = (glowX, glowY, time, activity) => {
      if (!interactive) return;
      const pulse = (Math.sin(time / 5000) + 1) / 2;
      const radius = 350 + activity * 150;
      const opacity = config.glowOpacity * (0.82 + pulse * 0.18) + activity * 0.04;
      const gradient = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.min(opacity + 0.04, 0.22)})`);
      gradient.addColorStop(0.12, `rgba(102, 126, 234, ${Math.min(opacity, 0.22)})`);
      gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const drawParticles = (parallaxX, parallaxY, delta, activity) => {
      const particlePush = activity * 0.012;
      particles.forEach((particle) => {
        if (interactive && activity > 0) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 180 && distance > 0) {
            const force = (1 - distance / 180) * particlePush;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        particle.vx = lerp(particle.vx, Math.max(-0.12, Math.min(0.12, particle.vx)), 0.01);
        particle.vy = lerp(particle.vy, Math.max(-0.12, Math.min(0.12, particle.vy)), 0.01);
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const x = particle.x + parallaxX;
        const y = particle.y + parallaxY;
        context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
    };

    const drawConnections = (parallaxX, parallaxY, activity) => {
      if (!config.connections) return;
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const a = particles[first];
          const b = particles[second];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= 130) continue;
          const opacity = ((1 - distance / 130) * 0.25) * (1 + activity * 0.5);
          context.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x + parallaxX, a.y + parallaxY);
          context.lineTo(b.x + parallaxX, b.y + parallaxY);
          context.stroke();
        }
      }
    };

    const render = (time, animate) => {
      const delta = Math.min((time - lastFrameTime) / 16.67, 3);
      lastFrameTime = time;
      const elapsed = time - startTime;
      context.clearRect(0, 0, width, height);

      const cursorOffsetX = interactive ? pointer.x - width / 2 : 0;
      const cursorOffsetY = interactive ? pointer.y - height / 2 : 0;
      const backgroundX = cursorOffsetX * 0.05;
      const backgroundY = cursorOffsetY * 0.05;
      const glowX = width / 2 + cursorOffsetX * 0.15;
      const glowY = height / 2 + cursorOffsetY * 0.15;
      const particleX = cursorOffsetX * 0.25;
      const particleY = cursorOffsetY * 0.25;
      const gridX = cursorOffsetX * 0.1;
      const gridY = cursorOffsetY * 0.1;

      drawBackground(backgroundX, backgroundY);
      drawGrid(gridX, gridY);
      drawGlow(glowX, glowY, elapsed, pointer.activity);
      drawParticles(particleX, particleY, delta, pointer.activity);
      drawConnections(particleX, particleY, pointer.activity);

      if (animate) {
        pointer.targetActivity *= 0.95;
        pointer.activity = lerp(pointer.activity, pointer.targetActivity, 0.08);
        pointer.x = lerp(pointer.x, pointer.targetX, 0.1);
        pointer.y = lerp(pointer.y, pointer.targetY, 0.1);
        animationFrame = requestAnimationFrame((nextTime) => render(nextTime, true));
      }
    };

    const handleMouseMove = (event) => {
      if (!interactive) return;
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const dx = x - pointer.previousX;
      const dy = y - pointer.previousY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.targetActivity = Math.min(1, pointer.targetActivity + speed / 80);
      pointer.previousX = x;
      pointer.previousY = y;
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        resize();
        createParticles();
        if (!animationFrame) render(performance.now(), false);
      }, 100);
    };

    resize();
    createParticles();
    pointer.x = width / 2;
    pointer.y = height / 2;
    pointer.targetX = width / 2;
    pointer.targetY = height / 2;
    pointer.previousX = width / 2;
    pointer.previousY = height / 2;
    render(performance.now(), !reduceMotion);

    window.addEventListener('resize', handleResize);
    if (interactive) window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`interactive-background ${className}`.trim()}
      aria-hidden="true"
    />
  );
};

export default InteractiveBackground;
