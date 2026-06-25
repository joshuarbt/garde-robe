"use client";

const SPARKLE_COUNT = 20;

const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 7) % 100}%`,
  top: `${(index * 23 + 11) % 100}%`,
  delay: `${(index * 0.37) % 3}s`,
  duration: `${1.5 + (index % 5) * 0.4}s`,
  color: index % 3 === 0 ? "#ffd700" : "#ffffff",
}));

export function BarbieSparkles() {
  return (
    <div className="theme-barbie-sparkles pointer-events-none fixed inset-0 z-0" aria-hidden>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="theme-barbie-sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
            backgroundColor: sparkle.color,
          }}
        />
      ))}
    </div>
  );
}
