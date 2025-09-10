import { Badge } from "~/components/ui/badge";

interface QueryHeaderProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
}

function getMethodBgClass(method: "GET" | "POST" | "PUT" | "DELETE") {
  switch (method) {
    case "GET":
      return "bg-emerald-500";
    case "POST":
      return "bg-rose-500";
    case "PUT":
      return "bg-amber-500";
    case "DELETE":
      return "bg-red-500";
    default:
      return "bg-emerald-500";
  }
}

export default function QueryHeader({ method, endpoint }: QueryHeaderProps) {
  const basicUrl = "api/trpc";

  return (
    <div className="flex w-full items-center gap-3 text-left">
      <Badge
        className={`${getMethodBgClass(method)} font-mono text-xs text-white`}
      >
        {method}
      </Badge>
      <code className="rounded px-2 py-1 font-mono text-sm">
        {`${basicUrl}${endpoint}`}
      </code>
    </div>
  );
}
