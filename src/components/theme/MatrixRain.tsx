"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アァイィウゥエェオォカキクケコサシスセソタチツテトナニヌネノ0123456789";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasEl = canvas;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }

    const context = ctx;
    let animationId = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;

    function resize() {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      columns = Math.floor(canvasEl.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    }

    function draw() {
      if (document.hidden) {
        animationId = window.requestAnimationFrame(draw);
        return;
      }

      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);

      context.fillStyle = "rgba(0, 255, 65, 0.08)";
      context.font = `${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        context.fillText(char, x, y);

        if (y > canvasEl.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 1;
      }

      animationId = window.requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
