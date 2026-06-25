"use client";

const clouds = [
  { id: 1, top: "12%", width: 120, height: 48, duration: "35s", delay: "0s" },
  { id: 2, top: "22%", width: 160, height: 56, duration: "45s", delay: "-8s" },
  { id: 3, top: "8%", width: 100, height: 40, duration: "55s", delay: "-15s" },
  { id: 4, top: "18%", width: 140, height: 52, duration: "50s", delay: "-22s" },
];

export function GhibliClouds() {
  return (
    <div className="theme-ghibli-clouds pointer-events-none fixed inset-0 z-0" aria-hidden>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="theme-ghibli-cloud"
          style={{
            top: cloud.top,
            width: cloud.width,
            height: cloud.height,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
          }}
        />
      ))}
    </div>
  );
}
