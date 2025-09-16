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
        {isLoading ? null : null}
        <CardContent className="space-y-8">
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <div className="space-y-8">
                {!groups
                  ? null
                  : groups.map((group) => (
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
            </TabsContent>
            <TabsContent value="error">
              {error ? String(error.message ?? "Unknown error") : ""}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
