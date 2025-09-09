import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import QueryHeader from "./query-header";

export default function QueryCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-3 text-lg font-semibold">
      <h1>{title}</h1>
      <Separator className="mb-2" />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="endpoint" className="border-0">
          <div className="border-border overflow-hidden rounded-lg border">
            <AccordionTrigger className="border-b-0 px-6 py-4 hover:no-underline">
              <QueryHeader method="GET" endpoint="hello" />
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <div className="pb-2">
                  <p className="text-sm">{description}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Parameters</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Field</TableHead>
                        <TableHead className="w-20">Type</TableHead>
                        <TableHead>Example</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono text-xs">
                          name
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          string
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          &quot;John Doe&quot;
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-xs">age</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          number
                        </TableCell>
                        <TableCell className="font-mono text-xs">30</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Example Request</h4>
                  <div className="bg-muted rounded-md p-3">
                    <pre className="overflow-x-auto font-mono text-xs">
                      {JSON.stringify({ name: "John Doe", age: 30 }, null, 2)}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Response</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Field</TableHead>
                        <TableHead className="w-20">Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono text-xs">
                          message
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          string
                        </TableCell>
                        <TableCell className="text-xs">
                          Mensaje de saludo personalizado
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-xs">
                          timestamp
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          string
                        </TableCell>
                        <TableCell className="text-xs">
                          Fecha y hora de la respuesta
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Example Response</h4>
                  <div className="bg-muted rounded-md p-3">
                    <pre className="overflow-x-auto font-mono text-xs">
                      {JSON.stringify(
                        {
                          message: "¡Hola John Doe! Tienes 30 años.",
                          timestamp: "2025-09-08T10:30:00Z",
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
