import QueryCard from "./query-card";
import type { QueryCardProps } from "./types";

type DocResponse = {
  method: string;
  endpoint: string;
  description: string;
  request?: Record<string, unknown>;
  body?: Record<string, unknown>;
  response?: Record<string, unknown>;
};

export default function QuerySection({
  // title left for API compatibility; unused in UI
  title: _title,
  data,
}: {
  title: string;
  data?: DocResponse;
}) {
  const inferType = (value: unknown): string => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const inner = inferType(value[0] as unknown);
        return `${inner}[]`;
      }
      return "array";
    }
    if (value === null) return "null";
    const t = typeof value;
    if (t === "object") return "object";
    return t;
  };

  const sourceParams =
    data?.method === "GET" ? data?.request : (data?.body ?? data?.request);

  const parameters = sourceParams
    ? Object.entries(sourceParams).map(([field, example]) => {
        let exampleString = JSON.stringify(example);
        if (
          field === "filters" &&
          Array.isArray(example) &&
          example.length > 0 &&
          typeof example[0] === "object" &&
          example[0] !== null &&
          "values" in (example[0] as Record<string, unknown>)
        ) {
          const first = example[0] as { key?: string; values?: unknown };
          const values = (first.values as unknown[]) ?? [];
          exampleString = values.length > 0 ? String(values[0]) : "";
        }
        return {
          field,
          type: inferType(example),
          example: exampleString,
          required: false,
        };
      })
    : [];

  const responseFields = data?.response
    ? Object.entries(data.response).map(([field, example]) => ({
        field,
        type: inferType(example),
      }))
    : [];

  return (
    <div>
      {!data ? null : (
        <QueryCard
          method={data.method as QueryCardProps["method"]}
          endpoint={data.endpoint}
          description={data.description}
          parameters={parameters}
          exampleRequest={
            data.method === "GET"
              ? (() => {
                  const base = `api/trpc${data.endpoint}`;
                  const request = data.request ?? {};
                  const search = new URLSearchParams();
                  Object.entries(request).forEach(([k, v]) => {
                    if (v === undefined || v === null) return;
                    if (k === "filters" && Array.isArray(v)) {
                      v.forEach((item) => {
                        if (
                          item &&
                          typeof item === "object" &&
                          "key" in (item as Record<string, unknown>)
                        ) {
                          const keyCandidate = (item as { key?: unknown }).key;
                          const fk = "filter";
                          const fvalues = Array.isArray(
                            (item as { values?: unknown }).values as unknown[],
                          )
                            ? ((item as { values?: unknown })
                                .values as unknown[])
                            : [];
                          if (fvalues.length === 0) {
                            search.append(fk, "");
                          } else {
                            fvalues.forEach((val) => {
                              const keyStr =
                                typeof keyCandidate === "string"
                                  ? keyCandidate
                                  : "";
                              const valueStr =
                                typeof val === "string" ||
                                typeof val === "number" ||
                                typeof val === "boolean"
                                  ? String(val)
                                  : JSON.stringify(val);
                              const payload =
                                keyStr && keyStr !== "filters"
                                  ? `${keyStr}:${valueStr}`
                                  : valueStr;
                              search.append(fk, payload);
                            });
                          }
                        }
                      });
                    } else if (Array.isArray(v)) {
                      const containsObject = v.some(
                        (item) => typeof item === "object" && item !== null,
                      );
                      if (containsObject) {
                        search.set(k, JSON.stringify(v));
                      } else {
                        v.forEach((item) => search.append(k, String(item)));
                      }
                    } else if (typeof v === "object") {
                      search.set(k, JSON.stringify(v));
                    } else if (
                      typeof v === "string" ||
                      typeof v === "number" ||
                      typeof v === "boolean"
                    ) {
                      search.set(k, String(v));
                    } else {
                      search.set(k, "");
                    }
                  });
                  const qs = search.toString();
                  return qs ? `${base}?${qs}` : base;
                })()
              : `api/trpc${data.endpoint}`
          }
          exampleBody={
            data.method !== "GET" ? (data.body ?? data.request ?? {}) : null
          }
          responseFields={responseFields}
          exampleResponse={data.response ?? {}}
        />
      )}
    </div>
  );
}
