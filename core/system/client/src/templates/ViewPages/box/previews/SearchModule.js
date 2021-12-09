import React, { Component } from "react";

class SearchModule extends Component {
    state = {
        title: false,
        description: false,
        showSuggestions: false,
        showStartDate: false,
        showEndDate: false
    };
    componentDidMount() {
        if(this.props.element.moduleOptions) {
            const {title, description, showSuggestions, showStartDate, showEndDate} = this.props.element.moduleOptions;
            this.setState({
                title,
                description,
                showSuggestions,
                showStartDate,
                showEndDate,
            });
        }
    }
    render() {
        let richText = this.props.element.moduleOptions;
        return (
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}
            >
                <h4>{this.state.title ? 'Search Module' : 'No Title'}</h4>
            </div>
        );
    }
}

export default SearchModule;
