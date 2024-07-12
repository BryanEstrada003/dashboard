/* import * as React from 'react'; */

import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Config {
  rows: Array<{rangeHours: string; windDirection: string}>;
}

// El componente sigue igual, pero ahora TypeScript sabe qué esperar de cada [`row`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fmai_lavender%2FDesktop%2Fdashboard%2Fsrc%2Fcomponents%2FBasicTable.tsx%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fmai_lavender%2FDesktop%2Fdashboard%2Fsrc%2Fcomponents%2FBasicTable.tsx%22%2C%22path%22%3A%22%2Fhome%2Fmai_lavender%2FDesktop%2Fdashboard%2Fsrc%2Fcomponents%2FBasicTable.tsx%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A34%2C%22character%22%3A21%7D%5D "src/components/BasicTable.tsx")

export default function BasicTable(data: Config) {
  let [rows, setRows] = useState<Array<{rangeHours: string; windDirection: string}>>([]);

  useEffect(() => {
    (() => {
      setRows(data.rows);
    })();
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rango de horas</TableCell>
            <TableCell align="right">Dirección del viento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rangeHours}>
              <TableCell component="th" scope="row">
                {row.rangeHours}
              </TableCell>
              <TableCell align="right">{row.windDirection}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
