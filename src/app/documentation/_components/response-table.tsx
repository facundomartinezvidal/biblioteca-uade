import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type ResponseField } from "./types";

interface ResponseTableProps {
  responseFields: ResponseField[];
}

export default function ResponseTable({ responseFields }: ResponseTableProps) {
  if (!responseFields || responseFields.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        No response fields documented
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Field</TableHead>
          <TableHead className="w-20">Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {responseFields.map((field, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
              {field.field}
            </TableCell>
            <TableCell className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {field.type}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
