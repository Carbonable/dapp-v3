'use client';
import { Vintage, VintageStatus } from "@/types/projects";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function VintagesTable({ vintages }: { vintages: Vintage[] }) {
  const columns = ["Year", "Supply", "Created", "Failed", "Status", "Actions"];
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(vintages.length / rowsPerPage);

  const paginatedVintages = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return vintages.slice(start, end);
    }, [page, vintages, rowsPerPage]);
  
  const realStatus = (status: VintageStatus) => {
    if (status.variant.Audited !== undefined) {
      return "Audited";
    }
    if (status.variant.Confirmed !== undefined) {
      return "Confirmed";
    }
    if (status.variant.Projected !== undefined) {
      return "Projected";
    }
    if (status.variant.Unset !== undefined) {
      return "Unset";
    }
    return "Unknown";
  }

  return (
    <div>
      <Table aria-label="Carbon distribution" className="mt-4">
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn key={index}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No carbon distribution found"}>
          {paginatedVintages.map((vintage, index) => (
            <TableRow key={index}>
              <TableCell>{vintage.year}</TableCell>
              <TableCell>{vintage.supply}</TableCell>
              <TableCell>{vintage.created}</TableCell>
              <TableCell>{vintage.failed}</TableCell>
              <TableCell>{realStatus(vintage.status)}</TableCell>
              <TableCell>
                <a href={"#"} target="_blank" rel="noreferrer" className="hover:underline">
                  Generate certificate
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 w-fit mx-auto">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}