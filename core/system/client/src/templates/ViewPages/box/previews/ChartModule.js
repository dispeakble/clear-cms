import React, { Component } from "react";
import Chart from "react-google-charts";
import PropTypes from "prop-types";

class ChartModule extends Component {
  state = { chartType: "", data: [] };

  componentDidMount(){
      const {moduleOptions} = this.props;
      this.setState({
          chartTitle: moduleOptions.chartTitle || '',
          chartType: moduleOptions.chartType || '',
          data: moduleOptions.data || [],
      });
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
          <h4>{this.state.chartTitle}</h4>
        <Chart
          chartType={this.state.chartType}
          width="100%"
          height="400px"
          legendToggle
          data={this.state.data.rows}
        />
      </div>
    );
  }
}

ChartModule.propTypes = {
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
}

export default ChartModule;
