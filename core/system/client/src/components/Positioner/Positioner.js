import React, { Component } from "react";
import {withStyles, withTheme} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "../../assets/jss/clear-crm/components/Positioner";

class Positioner extends Component {
    render(){
        const vert = ["top", "center", "bottom"];
        const horiz = ["left", "center", "right"];
        const icons = ["↖","↑","↗","←","☉","→","↙","↓","↘"];

        let buttons = [];
        let i = 0;

        vert.map((v, vi) => {
            horiz.map((h, hi) => {
                buttons.push(<button key={`positioner-${hi}-${vi}`} onClick={() => {
                    this.props.onChange(`${h} ${v}`)
                }} className={this.props.selected === `${h} ${v}` ? 'selected' : ''}>
                    {icons[i]}
                </button>);
                i++;
                return h;
            })
            return v;
        })

        return <div className={this.props.classes.PositionerHolder}>{buttons}</div>;
    }
}

export default withTheme(withStyles(styles)(Positioner));

Positioner.propTypes = {
    onChange: PropTypes.func,
    selected: PropTypes.string
}