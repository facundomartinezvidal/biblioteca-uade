import { Separator } from "~/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import QueryHeader from "./query-header";
import ParametersTable from "./parameters-table";
import ResponseTable from "./response-table";
import CodeExample from "./code-example";
import { type QueryCardProps } from "./types";

export default function QueryCard({
  description,
  endpoint,
  method,
  parameters = [],
  responseFields = [],
  exampleRequest = null,
  exampleResponse = null,
}: QueryCardProps) {
  return (
    <div className="mt-3 text-lg font-semibold">
      <Separator className="mb-2" />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="endpoint" className="border-0">
          <div className="border-border overflow-hidden rounded-lg border">
            <AccordionTrigger className="border-b-0 px-6 py-4 hover:no-underline">
              <QueryHeader method={method} endpoint={endpoint} />
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <div className="pb-2">
                  <p className="text-sm">{description}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Parameters</h4>
                  <ParametersTable parameters={parameters} />
                </div>

                <Separator />

                <CodeExample
                  title="Example Request"
                  code={exampleRequest}
                  placeholder="No request example available"
                />

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Response</h4>
                  <ResponseTable responseFields={responseFields} />
                </div>

                <CodeExample
                  title="Example Response"
                  code={exampleResponse}
                  placeholder="No response example available"
                />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
