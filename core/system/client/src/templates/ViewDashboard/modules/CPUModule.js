import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/dashboard/activity";

import PropTypes from "prop-types";
import Chart from "react-google-charts";

class CPUModule extends Component {
    state = {
        data: [],
        intervalId: null
    };

    options = {
        width: 136,
        height: 136,
        redFrom: 90,
        redTo: 100,
        yellowFrom: 75,
        yellowTo: 90,
        minorTicks: 5,
    };

    componentDidMount() {

        this.setState({
            columns: ["Label", "Value"]
        })

        this.startPolling();

    }

    async startPolling() {

        const data = await this.props.control.getHardwareInfo({type: 'CPU'});

        if(!data) {
            return;
        }

        this.setState({
            data: data.currentLoad
        })

        setTimeout(() => {
            this.startPolling();
        }, 5000);
    }

    stopPolling() {

    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Chart
                    chartType="Gauge"
                    width="150px"
                    height="150px"
                    options={this.options}
                    data={[
                        ["Label", "Value"],
                        ["CPU", this.state.data],
                    ]}
                />
            </div>
        );
    }
}

export default withStyles(styles)(CPUModule);

CPUModule.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    defaultTheme: PropTypes.object,
};
