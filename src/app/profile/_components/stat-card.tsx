import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel: string;
  ariaLabel: string;
  title: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  ariaLabel,
  title,
  bgColor,
  textColor,
  onClick,
}: StatCardProps) {
  const baseClasses = `rounded-md ${bgColor} p-4`;
  const interactiveClasses = onClick
    ? "cursor-pointer transition-all hover:scale-105 hover:shadow-md"
    : "";

  return (
    <div
      className={`${baseClasses} ${interactiveClasses}`}
      role="region"
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={`flex items-center justify-center gap-2 text-sm font-medium ${textColor}`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className={`mt-2 text-center text-2xl font-bold ${textColor}`}>
        {value}
      </p>
      <p className={`text-center text-sm ${textColor}/80`}>{sublabel}</p>
    </div>
  );
}
