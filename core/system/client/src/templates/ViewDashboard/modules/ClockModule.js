import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "../../../assets/jss/clear-crm/dashboard/activity";
import PropTypes from "prop-types";

import Clock from 'react-clock';

class ClockModule extends Component {

    state = {
        clockValue: new Date()
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                clockValue: new Date()
            })
        }, 1000)
    }

    render(){
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Clock
                    renderNumbers={true}
                    size={136}
                    value={this.state.clockValue} />
            </div>
        )
    }

}

export default withStyles(styles)(ClockModule);

ClockModule.propTypes = {
    classes: PropTypes.object,
    control: PropTypes.object,
    services: PropTypes.object,
    defaultTheme: PropTypes.object,
};