"use client";
import * as React from "react";

interface CountdownProps {
  target: Date;
  className?: string;
  onComplete?: () => void;
}

function getTimeParts(diffMs: number) {
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export const Countdown: React.FC<CountdownProps> = ({
  target,
  className = "",
  onComplete,
}) => {
  const [parts, setParts] = React.useState(() =>
    getTimeParts(target.getTime() - Date.now()),
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      const diff = target.getTime() - Date.now();
      const next = getTimeParts(diff);
      setParts(next);
      if (diff <= 0) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  const items: Array<{ label: string; value: number; aria: string }> = [
    { label: "DÍAS", value: parts.days, aria: `${parts.days} días` },
    { label: "HORAS", value: parts.hours, aria: `${parts.hours} horas` },
    {
      label: "MINUTOS",
      value: parts.minutes,
      aria: `${parts.minutes} minutos`,
    },
    {
      label: "SEGUNDOS",
      value: parts.seconds,
      aria: `${parts.seconds} segundos`,
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 gap-6 sm:grid-cols-4 ${className}`}
      role="timer"
      aria-live="polite"
    >
      {items.map((it) => (
        <div key={it.label} className="flex flex-col text-left">
          <span
            className="text-4xl font-bold tracking-tight md:text-5xl"
            aria-label={it.aria}
          >
            {String(it.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[11px] font-medium tracking-wide text-white/60">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
};
