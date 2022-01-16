import React, { Component } from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/dashboard/activity";

import PropTypes from "prop-types";
import Chart from "react-google-charts";

class FrontendActivityModule extends Component {
    state = {
        chartType: "",
        data: [],
        intervalId: null
    };

    ls_key = 'fact_';

    options = {
        title: "Admin activity",
        hAxis: { title: "Today", titleTextStyle: { color: "#333" } },
        vAxis: { minValue: 0 },
        chartArea: { width: "50%", height: "70%" },
    };

    mapState = {
        mm: "Mouse moved",
        mc: "Mouse clicked",
        kt: "Keyboard typed",
        f: "Tab focused"
    };

    componentDidMount(){
        this.startPolling();
    }

    startPolling() {

        let date = new Date();

        const date_m = date.getMonth() + 1;
        const date_d = date.getDate();

        const info = localStorage.getItem(`${this.ls_key}_${date_m}_${date_d}`);

        if(info) {
            try {
                const data = JSON.parse(info);

                const payload = [];

                const mapped = Object.keys(this.mapState);

                payload[0] = ["Today", ...mapped.map(key => this.mapState[key])];

                Object.keys(data).map((hour) => {
                    //for every hour
                    let hour_data = [hour];
                    const act_data = mapped.map(() => 0);
                    Object.keys(data[hour]).map(min => {
                        //for every minute
                        mapped.map((key, index) => {
                            act_data[index] += data[hour][min][key];
                            return key;
                        });

                        return min;

                    })

                    hour_data = hour_data.concat(act_data);

                    payload.push(hour_data);

                    return hour;

                });

                this.setState({
                    data: payload
                })

            } catch (err) {
                console.log(err);
            }
        }

        setTimeout(() => {
            this.startPolling();
        }, 5000);
    }

    stopPolling() {

    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                <h4>{this.state.chartTitle}</h4>
                <Chart
                    chartType="AreaChart"
                    width="100%"
                    height="400px"
                    legendToggle
                    options={this.options}
                    data={this.state.data}
                />
            </div>
        );
    }
}

export default withStyles(styles)(FrontendActivityModule);

FrontendActivityModule.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    defaultTheme: PropTypes.object,
};
