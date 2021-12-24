import React, {Component} from "react";
import Chart from "react-google-charts";

// for the modal
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import CustomInput from "components/CustomInput/CustomInput.js";

import {TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {DropzoneArea} from "material-ui-dropzone";

class ChartModule extends Component {
    state = {
        chartTypes: [
            {label: "AreaChart"},
            {label: "BarChart"},
            {label: "BubbleChart"},
            {label: "Calendar"},
            {label: "CandlestickChart"},
            {label: "Column"},
            {label: "ScatterChart"},
            {label: "ColumnChart"},
            // {label: "Donut"},
            {label: "Gantt"},
            {label: "Gauge"},
            {label: "GeoChart"},
            {label: "Histogram"},
            {label: "LineChart"},
            {label: "Material Bar"},
            {label: "Material Line"},
            {label: "OrgChart"},
            {label: "PieChart"},
            {label: "Sankey"},
            {label: "ScatterChart"},
            {label: "SteppedAreaChart"},
            {label: "Table"},
            {label: "Timeline"},
            {label: "TreeMap"},
            // {label: "Waterfall"},
            {label: "WordTree"},
        ],
        chartType: "",
        bgImage: "",
        columns: [
            {
                type: "number",
                label: "year",
            },
            {
                label: "AttentionSpan",
                type: "number",
            },
        ],
        data: [],
        enableChart: true,
    };

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    componentDidMount() {
        const {moduleOptions} = this.props;
        this.setState({
            chartTitle: moduleOptions.chartTitle || '',
            chartType: moduleOptions.chartType || '',
            data: moduleOptions.data || [],
        })
    }

    handleEdit = async (id) => {
        await this.setAsyncState({
            itemModuleEditId: id,
            showModuleOptionsModal: true,
        });
    };

    closeModuleOptionsModal() {
        this.setState({showModuleOptionsModal: false});
    }

    handleInputChange = async (event) => {
        switch (event.target.id) {
            case "chartTitle":
                await this.setAsyncState({chartTitle: String(event.target.value)});
                this.props.onUpdate(this.state);
                break;
            default:
                break;
        }
    };

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    toStr(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    handleUploadedFile = async (event) => {
        if (event.length) {
            let strings = await Promise.all(event.map((file) => this.toStr(file)));

            await this.setAsyncState({
                data: JSON.parse(strings[0]),
                enableChart: false,
            });
            this.props.onUpdate(this.state);
            setTimeout(() => {
                this.setState({enableChart: true});
            }, 30);
        }
    };

    render() {
        return (
            <React.Fragment>
                <CustomInput
                    labelText="Title"
                    id="chartTitle"
                    required="required"
                    formControlProps={{
                        fullWidth: true,
                        onChange: (event) => this.handleInputChange(event),
                    }}
                    inputProps={{
                        value: this.state.chartTitle,
                        type: "text",
                    }}
                />
                <Autocomplete
                    style={{margin: "5% 0"}}
                    id="moduleDropdown"
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    inputValue={this.state.chartType}
                    onInputChange={async (event, newInputValue) => {
                        await this.setAsyncState({chartType: newInputValue});
                        this.props.onUpdate(this.state);
                    }}
                    options={this.state.chartTypes}
                    renderInput={(params) => (
                        <TextField {...params} label="Type" variant="outlined"/>
                    )}
                />{" "}
                <Typography id="discrete-slider" gutterBottom>
                    Data File Upload(only JSON format accepted)
                    <DropzoneArea
                        maxFileSize={Math.pow(1024, 3)}
                        clearOnUnmount={true}
                        acceptedFiles={["application/json"]}
                        filesLimit={1}
                        onChange={this.handleUploadedFile.bind(this)}
                    />
                </Typography>
                <div style={{height: "400px"}}>
                    {this.state.enableChart ? (
                        <Chart
                            chartType={this.state.chartType || 'AreaChart'}
                            width="100%"
                            height="400px"
                            legendToggle
                            data={this.state.data.rows}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </React.Fragment>
        );
    }
}

ChartModule.propTypes = {
    onUpdate: PropTypes.func,
    moduleOptions: PropTypes.object,
}

export default ChartModule;
