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
}: StatCardProps) {
  return (
    <div
      className={`rounded-md ${bgColor} p-4`}
      role="region"
      aria-label={ariaLabel}
      title={title}
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
