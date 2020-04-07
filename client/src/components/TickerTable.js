import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import _ from "lodash";
import { getTickers, updateTicker } from "../actions/ticker";
import { onTickerUpdated } from "../updateTickerWS";
import AnimateOnChange from "react-animate-on-change";

class TickerTable extends Component {
  componentDidMount() {
    this.props.getTickers();
    onTickerUpdated(ticket => {
      this.props.updateTicker(ticket);
    });
  }

  render() {
    const { tickers, pairs, exchanges } = this.props;
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tickers</TableCell>
              {exchanges.map(exchange => (
                <TableCell align="right" key={exchange}>
                  {_.capitalize(exchange)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pairs.map(pair => (
              <TableRow hover role="checkbox" key={pair}>
                <TableCell component="th" scope="row">
                  {pair}
                </TableCell>
                {exchanges.map(exchange => (
                  <TableCell align="right" key={exchange}>
                    {tickers[exchange][pair]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    tickers: state.tickers,
    exchanges: _.keys(state.tickers),
    pairs: _.keys(state.tickers[_.keys(state.tickers)[0]])
  };
};

export default connect(mapStateToProps, { getTickers, updateTicker })(
  TickerTable
);
