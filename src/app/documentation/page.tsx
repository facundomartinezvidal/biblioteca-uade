"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import QuerySection from "./_components/query-section";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export default function DocumentationPage() {
  const {
    data: groups,
    isLoading,
    error,
  } = api.documentation.groups.useQuery();

  const buildPrintableHtml = (
    title: string,
    sections: {
      group: string;
      endpoints: {
        method: string;
        endpoint: string;
        description: string;
        request?: Record<string, unknown>;
        body?: Record<string, unknown>;
        response?: Record<string, unknown>;
      }[];
    }[],
  ): string => {
    const stringify = (obj: unknown) =>
      JSON.stringify(obj ?? {}, null, 2)
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const buildGetUrl = (
      endpoint: string,
      request?: Record<string, unknown>,
    ) => {
      const base = `api/trpc${endpoint}`;
      const search = new URLSearchParams();
      const req = request ?? {};
      Object.entries(req).forEach(([k, v]) => {
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
                ? ((item as { values?: unknown }).values as unknown[])
                : [];
              if (fvalues.length === 0) {
                search.append(fk, "");
              } else {
                fvalues.forEach((val) => {
                  const keyStr =
                    typeof keyCandidate === "string" ? keyCandidate : "";
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
    };

    const createdAt = new Date().toLocaleString();
    const sectionsHtml = sections
      .map(
        (s) => `
      <section style="margin-bottom:24px;">
        <h2 style="font-size:16px;margin:0 0 8px 0;">${s.group}</h2>
        ${s.endpoints
          .map((ep) => {
            const exampleRequest =
              ep.method === "GET"
                ? buildGetUrl(ep.endpoint, ep.request)
                : `api/trpc${ep.endpoint}`;
            const bodyBlock =
              ep.method === "GET"
                ? ""
                : `
              <div style=\"font-weight:600;margin:12px 0 6px;\">Example Body</div>
              <pre style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px;white-space:pre-wrap;\">${stringify(
                ep.body ?? ep.request ?? {},
              )}</pre>`;
            return `
              <div style=\"padding:12px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;\">
                <div style=\"display:flex;gap:8px;align-items:center;margin-bottom:6px;\">
                  <span style=\"font-weight:700;\">${ep.method}</span>
                  <span style=\"font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;\">${ep.endpoint}</span>
                </div>
                <div style=\"font-size:12px;color:#4b5563;margin-bottom:8px;\">${ep.description}</div>
                <div style=\"font-weight:600;margin:6px 0;\">Example Request</div>
                <pre style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px;white-space:pre-wrap;\">${exampleRequest}</pre>
                ${bodyBlock}
                <div style=\"font-weight:600;margin:12px 0 6px;\">Example Response</div>
                <pre style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px;white-space:pre-wrap;\">${stringify(
                  ep.response ?? {},
                )}</pre>
              </div>`;
          })
          .join("")}
      </section>`,
      )
      .join("");

    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @media print { body { -webkit-print-color-adjust: exact; } }
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", "Noto Sans", "Liberation Sans", sans-serif; margin: 24px; color: #111827; }
          h1 { font-size: 20px; margin: 0 0 12px 0; }
          .meta { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Generado: ${createdAt}</div>
        ${sectionsHtml}
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>`;
  };

  const handleDownloadPdf = (type: "query" | "error") => {
    if (!groups) return;
    const filtered =
      type === "query"
        ? groups.filter((g) => g.group !== "Errors")
        : groups.filter((g) => g.group === "Errors");

    const sections = filtered.map((g) => ({
      group: g.group,
      endpoints: g.endpoints.map((ep) => ({
        method: ep.method,
        endpoint: ep.endpoint,
        description: ep.description,
        request: (ep as unknown as { request?: Record<string, unknown> })
          .request,
        body: (ep as unknown as { body?: Record<string, unknown> }).body,
        response: (ep as unknown as { response?: Record<string, unknown> })
          .response,
      })),
    }));

    const html = buildPrintableHtml(
      type === "query"
        ? "API Documentation - Queries"
        : "API Documentation - Errors",
      sections,
    );
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };
  return (
    <div className="relative mt-5 grid place-items-center">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Documentacion API</CardTitle>
          <CardDescription>
            Documentacion de los endpoints disponibles en la API tRPC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownloadPdf("query")}
                >
                  Descargar PDF
                </Button>
              </div>
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="bg-muted h-4 w-40 animate-pulse rounded" />
                      <div className="bg-muted h-24 w-full animate-pulse rounded-md" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {!groups
                    ? null
                    : groups
                        .filter((group) => group.group !== "Errors")
                        .map((group) => (
                          <div key={group.group} className="space-y-2">
                            <h3 className="text-base font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                              {group.group}
                            </h3>
                            {group.endpoints.map((ep, idx) => (
                              <QuerySection
                                key={`${group.group}-${idx}`}
                                title={ep.endpoint}
                                data={ep}
                              />
                            ))}
                          </div>
                        ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="error">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownloadPdf("error")}
                >
                  Descargar PDF
                </Button>
              </div>
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="bg-muted h-4 w-40 animate-pulse rounded" />
                      <div className="bg-muted h-24 w-full animate-pulse rounded-md" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                String(error.message ?? "Unknown error")
              ) : (
                <div className="space-y-8">
                  {!groups
                    ? null
                    : groups
                        .filter((group) => group.group === "Errors")
                        .map((group) => (
                          <div key={group.group} className="space-y-2">
                            <h3 className="text-base font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                              {group.group}
                            </h3>
                            {group.endpoints.map((ep, idx) => (
                              <QuerySection
                                key={`${group.group}-${idx}`}
                                title={ep.endpoint}
                                data={ep}
                              />
                            ))}
                          </div>
                        ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
