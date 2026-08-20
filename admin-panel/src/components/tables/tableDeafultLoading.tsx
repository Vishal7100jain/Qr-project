import { TableCell, TableRow } from "../ui/table";
import { SkeletonTable } from "./SkeletonTable";

export const defaultLoadingState = (columns: number, rows: number) =>
  [...Array(rows)].map((_, i) => (
    <TableRow key={i} className="border-none">
      {[...Array(columns)].map((_, j) => (
        <TableCell key={j} className="p-1 md:p-2 lg:p-3">
          <SkeletonTable className="h-8 md:h-10 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
