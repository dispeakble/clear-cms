import React, {Component} from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import {MoreVert, MoreHoriz, ChevronRight, ChevronLeft} from "@material-ui/icons";

class MoreMenu extends Component {
    state = {
        opened: false,
        force: false,
        moreIcon: <MoreVert/>,
        tooltipPlacement: "left"
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    toggleState(status) {
        this.setState({
            opened: status,
        });
    }

    componentDidMount() {
        if (this.props.icon) {
            switch (this.props.icon) {
                default:
                    this.setState({
                        moreIcon: <MoreVert/>
                    })
                    break;
                case 'horizontal':
                    this.setState({
                        moreIcon: <MoreHoriz/>,
                        tooltipPlacement: "top"
                    })
                    break;
                case 'arrowHorizontal':
                    this.setState({
                        moreIcon: <ChevronRight/>,
                        tooltipPlacement: "top"
                    })
                    break;
            }
        }
    }

    render() {
        return (
            <SpeedDial
                FabProps={{size: "small"}}
                direction={this.props.direction || "down"}
                ariaLabel="Module Speed Dial"
                icon={this.state.moreIcon}

                onClick={() => {
                    if (!this.state.force) {
                        this.toggleState(!this.state.opened);
                    }
                    this.setState({
                        force: false,
                    });
                    if (this.props.icon === 'arrowHorizontal') {
                        this.setState({
                            moreIcon: this.state.opened ? <ChevronRight/> : <ChevronLeft/>
                        })
                    }
                }}
                open={this.state.opened}
            >
                {this.props.itemActions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipPlacement={this.state.tooltipPlacement}
                        onClick={() => {
                            this.setState({
                                force: true,
                            });
                            this.toggleState(false);
                            action.callback();
                        }}
                    />
                ))}
            </SpeedDial>
        );
    }
}

export default MoreMenu;
