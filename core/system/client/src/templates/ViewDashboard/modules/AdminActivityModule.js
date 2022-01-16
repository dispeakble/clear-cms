import React, {Component} from "react";

import {withStyles} from "@material-ui/core/styles";
import styles from "assets/jss/clear-crm/dashboard/activity";

import PropTypes from "prop-types";
import Chart from "react-google-charts";

class AdminActivityModule extends Component {
    state = {
        chartType: "",
        act_data: [],
        data: [],
        intervalId: null
    };

    ls_key = 'act_';

    options = {
        title: `Admin activity ${(new Date()).getDate()}/${((new Date()).getMonth()+1)}/${((new Date()).getFullYear())}`,
        hAxis: {title: "Today", titleTextStyle: {color: "#333"}, viewWindowMode: 'maximized'},
        vAxis: {minValue: 0},
        chartArea: {width: "100%", height: "70%"},
        legend: {'position': 'bottom'}
    };

    mapState = {
        mm: "Mouse moved",
        mc: "Mouse clicks",
        kt: "Keys pressed",
        f: "Tab focused"
    };

    componentDidMount() {
        this.setState({
            columns: [
                {type: 'string', role: 'domain'},
                ...Object.keys(this.mapState).map(key => this.mapState[key])
            ]
        })

        this.startPolling();
    }

    startPolling() {

        let date = new Date();

        const date_m = date.getMonth() + 1;
        const date_d = date.getDate();

        const info = localStorage.getItem(`${this.ls_key}_${date_m}_${date_d}`);

        if (info) {
            try {
                const data = JSON.parse(info);

                const payload = [];

                const mapped = Object.keys(this.mapState);

                Object.keys(data).map((hour) => {
                    //for every hour
                    let hour_data = [`${hour}:00`];
                    const act_data = mapped.map(() => 0);
                    Object.keys(data[hour]).map(min => {
                        //for every minute
                        mapped.map((key, index) => {
                            act_data[index] += data[hour][min][key];
                            return key;
                        })
                        return min;
                    });

                    hour_data = hour_data.concat(act_data);

                    payload.push(hour_data);

                    return hour;
                });

                this.setState({
                    data: payload
                });

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
            <div style={{width: "100%"}}>
                <h4>{this.state.chartTitle}</h4>
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="580px"
                    legendToggle
                    options={this.options}
                    rows={this.state.data}
                    columns={this.state.columns}
                />
            </div>
        );
    }
}

export default withStyles(styles)(AdminActivityModule);

AdminActivityModule.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    defaultTheme: PropTypes.object,
};
