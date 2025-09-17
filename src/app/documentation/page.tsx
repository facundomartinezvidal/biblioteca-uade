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

export default function DocumentationPage() {
  const {
    data: groups,
    isLoading,
    error,
  } = api.documentation.groups.useQuery();
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
