import React from "react";
import {Checkbox, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";


class ViewBoxesFromTemplate extends React.PureComponent {

    state = {
        selectedTemplate: "",
        templates: [],
        boxList: []
    };

    async componentDidMount() {
        let temps = await this.props.control.listTemplates();
        let templates = [];
        if(temps && temps.length) {
            templates = temps.map((temp) => {
                return {
                    id: temp.id,
                    label: temp.pageConfig.title,
                };
            });
        }
        await this.setAsyncState({
            templates,
            selectedTemplate: "",
            boxList: []
        })
    }

    setAsyncState = (newState) => new Promise((resolve) => this.setState(newState, resolve));

    render() {
        return (
            <div>
                <Autocomplete
                    id="templateList"
                    onChange={async (event, value) =>  {
                        if(value) {
                            const template = await this.props.control.get({id: value.id});
                            if(template.boxes && template.boxes.length > 0) {
                                await this.setAsyncState({
                                    boxList: template.boxes
                                })
                            }
                            await this.setAsyncState({
                                selectedTemplate: value
                            })
                        }
                    }}
                    className={this.props.classes.option}
                    options={this.state.templates}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    // value={this.state.template}
                    renderInput={(params) => (
                        <TextField
                            className={this.props.classes.textfield}
                            {...params}
                            label="Select a template"
                            variant="outlined"
                        />
                    )}
                />
                {this.state.selectedTemplate && this.state.boxList.length > 0 && this.state.boxList.map((box, index) => {
                    return (
                        <div key={index} style={{ marginLeft: "-10px" }}>
                            <Checkbox
                                checked={this.state.boxList[index].checked}
                                onChange={async (event, checked) => {
                                    const boxList = [...this.state.boxList];
                                    boxList[index].checked = checked
                                    await this.setAsyncState(prevState => ({
                                        ...prevState,
                                        boxList: boxList
                                    }));
                                    this.props.updateBoxList(boxList
                                        .filter(box => box.checked)
                                        .map(box => ({
                                            ...box,
                                            templateUsed: this.state.selectedTemplate.id,
                                            resizeHandles: []
                                        })));
                                }}
                            />
                            <span>{box.title}</span>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default ViewBoxesFromTemplate;
