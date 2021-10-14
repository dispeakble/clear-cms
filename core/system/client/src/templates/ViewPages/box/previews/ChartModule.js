import React, { Component } from "react";
import Chart from "react-google-charts";

class ChartModule extends Component {
  state = { chartType: "", data: { rows: "", columns: "" } };
  render() {
    return (
      <div style={{ width: "100%" }}>
        <Chart
          chartType={this.state.chartType}
          width="100%"
          height="400px"
          legendToggle
          rows={this.state.data.rows}
          columns={this.state.data.columns}
        />
      </div>
    );
  }
}

export default ChartModule;
