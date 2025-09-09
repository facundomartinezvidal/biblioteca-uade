import { Badge } from "~/components/ui/badge";

interface QueryHeaderProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
}

export default function QueryHeader({ method, endpoint }: QueryHeaderProps) {
  const basicUrl = "api/trpc/";
  return (
    <div className="flex w-full items-center gap-3 text-left">
      <Badge
        variant="secondary"
        className="bg-emerald-100 font-mono text-xs text-emerald-700"
      >
        {method}
      </Badge>
      <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
        {`${basicUrl}/${endpoint}`}
      </code>
    </div>
  );
}
