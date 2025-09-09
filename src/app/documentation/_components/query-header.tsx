import { Badge } from "~/components/ui/badge";

interface QueryHeaderProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
}

export default function QueryHeader({ method, endpoint }: QueryHeaderProps) {
  const basicUrl = "api/trpc/";
  let color;
  switch (method) {
    case "GET":
      color = "emerald";
      break;
    case "POST":
      color = "rose";
      break;
    case "PUT":
      color = "amber";
      break;
    case "DELETE":
      color = "red";
      break;
    default:
      color = "esmerald";
  }

  return (
    <div className="flex w-full items-center gap-3 text-left">
      <Badge
        variant="secondary"
        className={`bg-${color}-500 font-mono text-xs text-white`}
      >
        {method}
      </Badge>
      <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
        {`${basicUrl}/${endpoint}`}
      </code>
    </div>
  );
}
