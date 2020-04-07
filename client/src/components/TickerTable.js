import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";

function createData(ticker, cexio, bitfinex) {
  return { ticker, cexio, bitfinex };
}

const rows = [
  createData("BTC-USD", 7009.93, 7002),
  createData("ETH-USD", 150, 151),
];

export default function TickerTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tickers</TableCell>
            <TableCell align="right">Cexio</TableCell>
            <TableCell align="right">Bitfinex</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow hover role="checkbox" key={row.ticker}>
              <TableCell component="th" scope="row">
                {row.ticker}
              </TableCell>
              <TableCell align="right">{row.cexio}</TableCell>
              <TableCell align="right">{row.bitfinex}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
