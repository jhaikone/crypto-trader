import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import "./UiTable.scss";

const styles = theme => ({
  tableRoot: {
    width: "100%",
    overflowX: "auto",
    backgroundColor: "#1E2735",
    borderColor: "green",
    borderTopWidth: 1,
    padding: 0
  },
  table: {
    minWidth: 650,
    [theme.breakpoints.down("sm")]: {
      minWidth: 350
    }
  },
  header: {
    color: "#9a9b9c",
    borderColor: "#181E2B",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12
    }
  },
  column: {
    color: "#2aa4cc",
    borderColor: "#181E2B",
    backgroundColor: "#1C2230",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12
    }
  },
  hideOnSmallDevices: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }
});

const UiTable = ({ data, classes }) => {
  return (
    <Paper className={classes.tableRoot}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {data.labels.map((x, i) => (
              <React.Fragment key={`header-${i}`}>
                {i === 0 ? (
                  <TableCell className={classes.header}>{x.name}</TableCell>
                ) : (
                  <TableCell
                    className={classes.header}
                    align={i === data.labels.length - 1 ? "right" : "left"}
                  >
                    {x.name}
                  </TableCell>
                )}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row, i) => (
            <TableRow key={`${row}-${i}`}>
              {row.map((column, ci) => (
                <React.Fragment key={`${column}-${ci}`}>
                  {ci === 0 ? (
                    <TableCell
                      className={classes.column}
                      component="th"
                      scope="row"
                    >
                      {column}
                    </TableCell>
                  ) : column === "BUY" || column === "SELL" ? (
                    <TableCell className={classes.column} align="left">
                      <div className={`column-${column}`}>{column}</div>
                    </TableCell>
                  ) : (
                    <TableCell
                      className={classes.column}
                      align={ci === row.length - 1 ? "right" : "left"}
                    >
                      {column}
                    </TableCell>
                  )}
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(UiTable);

UiTable.defaultProps = {
  data: {
    rows: [],
    labels: []
  }
};
