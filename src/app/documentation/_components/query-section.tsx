import { Separator } from "@radix-ui/react-separator";
import QueryCard from "./query-card";
import type { QueryCardProps } from "./types";
import type { RouterOutput } from "~/server/api/root";

export default function QuerySection({
  title,
  data,
}: {
  title: string;
  data?: RouterOutput["documentation"]["books"]["getAll"];
}) {
  return (
    <div>
      <h2 className="text-lg font-medium">{title}</h2>
      <Separator />
      {!data ? null : (
        <QueryCard
          method={data.method as QueryCardProps["method"]}
          endpoint={data.endpoint}
          description={data.description}
          exampleResponse={data.response as unknown as Record<string, unknown>}
        />
      )}
    </div>
  );
}
