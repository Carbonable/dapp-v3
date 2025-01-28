import { Project } from "@/config/projects";
import Title from "../common/Title";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

interface ImpactReportsProps {
  project: Project;
}

export default function ImpactReports({ project }: ImpactReportsProps) {
  return (
    <>
      <Title title={"Impact reports"} />
      <Table aria-label="Impact reports" className="mt-4">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>LAST UPDATE</TableColumn>
          <TableColumn>DOWNLOAD</TableColumn>
        </TableHeader>
        <TableBody>
          {project.impact_reports.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.name}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>
                <a href={report.link} target="_blank" rel="noreferrer" className="hover:underline">
                  Download
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}