/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ProjectWithAbi } from "@/config/projects";
import { OffsetData, OffsetMetrics, Vintage, VintageStatus } from "@/types/projects";
import { formatDecimal } from "@/utils/starknet";
import { Alert, Button, Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useMemo, useState } from "react";
import { useAccount, useNetwork } from "@starknet-react/core";
import OffsetRequestModal from "./OffsetRequest";

interface VintagesTableProps {
  vintages: Vintage[];
  offsettorData: any[];
  project: ProjectWithAbi;
  isLoadingOffsettorData: boolean;
  refetchOffsettor: () => void;
  refetchVintages: () => void;
}

export default function VintagesTable({ 
  vintages, 
  offsettorData, 
  project,
  refetchOffsettor,
  refetchVintages,
}: VintagesTableProps) {
  const { isConnected } = useAccount();
  const columns = [
    "Year", 
    "My supply",
    "Offsetting fullfiled",
    "Offsetting requests",
    "Total supply",
    "Created",
    "Failed",
    "Status",
    "Actions"
  ];
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(vintages.length / rowsPerPage);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { chain } = useNetwork();

  const paginatedVintages = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return vintages.slice(start, end);
  }, [page, vintages, rowsPerPage]);

  // Calculate offsetting requests for each vintage
  const calculateOffsetMetrics = (offsettorData: OffsetData[], targetVintage: number): OffsetMetrics => {
    if (!offsettorData || offsettorData.length === 0) {
      return { requested: BigInt(0), fulfilled: BigInt(0) };
    }
  
    return offsettorData.reduce(
      (acc, request) => {
        if (request.vintage === BigInt(targetVintage)) {
          return {
            requested: acc.requested + request.amount,
            fulfilled: acc.fulfilled + request.filled
          };
        }
        return acc;
      },
      { requested: BigInt(0), fulfilled: BigInt(0) }
    );
  };
  
  const getOffsetRequested = (offsettorData: OffsetData[], index: number, page: number): string => {
    if (!offsettorData || offsettorData.length === 0) return '0';
    
    const targetVintage = index + 1 + ((page - 1) * rowsPerPage);
    const metrics = calculateOffsetMetrics(offsettorData, targetVintage);
    
    return formatDecimal(metrics.requested, project.decimals, 5);
  };
  
  const getOffsetFulfilled = (offsettorData: OffsetData[], index: number, page: number): string => {
    if (!offsettorData || offsettorData.length === 0) return '0';
    
    const targetVintage = index + 1 + ((page - 1) * rowsPerPage);
    const metrics = calculateOffsetMetrics(offsettorData, targetVintage);
    
    return formatDecimal(metrics.fulfilled, project.decimals, 5);
  };

  const realStatus = (status: VintageStatus) => {
    if (status.variant.Audited !== undefined) return "Audited";
    if (status.variant.Confirmed !== undefined) return "Confirmed";
    if (status.variant.Projected !== undefined) return "Projected";
    if (status.variant.Unset !== undefined) return "Unset";
    return "Unknown";
  }

  const statusColorMap: { [key: string]: "success" | "primary" | "secondary" | "danger" | "default" } = {
    Audited: "success",
    Confirmed: "primary",
    Projected: "secondary",
    Unset: "danger",
    Unknown: "default",
  };

  return (
    <div>
      {displayAlert && (
        <div className="mt-4">
          <Alert
            color="success" 
            title="Transaction sent successfully" 
            endContent={
              <Button color="success" size="sm" variant="flat" onPress={() => setDisplayAlert(false)}>
                Close
              </Button>
            }
          >
            <a 
              href={`https://${chain.name === 'Starknet Sepolia Testnet' ? 'sepolia.' : ''}voyager.online/tx/${txHash}`} 
              target="_blank" 
              rel="noreferrer"
            >
              View on explorer
            </a>
          </Alert>
        </div>
      )}
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
              <TableCell>
                {project.userBalance 
                  ? formatDecimal(project.userBalance[index + ((page - 1) * rowsPerPage)], project.decimals, 5) 
                  : '0'}
              </TableCell>
              <TableCell>{getOffsetFulfilled(offsettorData, index, page)}</TableCell>
              <TableCell>{getOffsetRequested(offsettorData, index, page)}</TableCell>
              <TableCell>{formatDecimal(vintage.supply, project.decimals, 5)}</TableCell>
              <TableCell>{formatDecimal(vintage.created, project.decimals, 5)}</TableCell>
              <TableCell>{formatDecimal(vintage.failed, project.decimals, 5)}</TableCell>
              <TableCell>
                <Chip color={statusColorMap[realStatus(vintage.status)]} size="sm">
                  {realStatus(vintage.status)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="text-neutral-300 flex items-center gap-2">
                  <OffsetRequestModal 
                    maxAmount={project.userBalance ? project.userBalance[index] : 0} 
                    vintage={BigInt(index + 1 + ((page - 1) * rowsPerPage))} 
                    buttonDisabled={!isConnected}
                    decimals={project.decimals}
                    project={project}
                    setDisplayAlert={setDisplayAlert}
                    setTxHash={setTxHash}
                    refetchOffsettor={refetchOffsettor}
                    refetchVintages={refetchVintages}
                  />
                </div>
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
          color="default"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}