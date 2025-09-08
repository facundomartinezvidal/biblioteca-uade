import { ArrowUpRight } from "lucide-react";
import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface StackCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  color?: string;
  website?: string;
  version?: string;
  gradient?: string;
}

export default function StackCard({
  title,
  content,
  icon,
  color = "bg-white/10 backdrop-blur-sm",
  website,
}: StackCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-white/5 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`rounded-xl p-3 ${color} shadow-lg transition-all duration-300 group-hover:scale-110`}
            >
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-white/90">
                {title}
              </CardTitle>
            </div>
          </div>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white/20"
            >
              <ArrowUpRight size={18} className="text-white" />
            </a>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        <p className="leading-relaxed text-white/80 transition-colors group-hover:text-white/90">
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
