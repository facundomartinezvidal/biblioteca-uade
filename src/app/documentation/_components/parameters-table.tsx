import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { type Parameter } from "./types";

interface ParametersTableProps {
  parameters: Parameter[];
}

export default function ParametersTable({ parameters }: ParametersTableProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        No parameters required
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Field</TableHead>
          <TableHead className="w-32">Type</TableHead>
          <TableHead className="w-32">Required</TableHead>
          <TableHead>Example</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parameters.map((param, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
              {param.field}
            </TableCell>
            <TableCell className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {param.type}
            </TableCell>
            <TableCell>
              {param.required !== false ? (
                <Badge variant="destructive" className="rounded-full">
                  Required
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-full">
                  Optional
                </Badge>
              )}
            </TableCell>
            <TableCell className="font-mono text-xs text-gray-700 dark:text-gray-300">
              {param.example}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
