import React, { Component, createRef } from "react";
import {Link} from "react-router-dom";
import {ReactComponent as SearchIcon} from "../../../../assets/icons/search.svg"
import {ReactComponent as ClearIcon} from "../../../../assets/icons/clear.svg"
import PropTypes from "prop-types";

class SearchModule extends Component {
    state = {
        title: false,
        description: false,
        showSuggestions: false,
        showStartDate: false,
        showEndDate: false,
        _search: "",
        _searchSuggestions: [],
    };

    clearSearchBtn = createRef();
    suggestionsRef = createRef();

    async componentDidMount() {
        if(this.props.moduleOptions) {
            const {title, description, showSuggestions, showStartDate, showEndDate} = this.props.moduleOptions;
            this.setState({
                title,
                description,
                showSuggestions,
                showStartDate,
                showEndDate,
            });
        }
    }

    onChangeHandler = (e) => {

        this.setState({
            _search: e.target.value
        })

        /*if(this.state._search.length > 0) {
            this.setState({
                _search: e.target.value
            })
            //TODO call an API for autocomplete
            this.setState({
            _searchSuggestions: matches
        })
        }*/

        if(e.target.value.length > 0) {
            this.clearSearchBtn.current.classList.add('show-clear');
        } else  {
            this.clearSearchBtn.current.classList.remove('show-clear');
        }
    }

    clearSearch = () => {
        this.setState({
            _search: "",
            _searchSuggestions: []
        })
        this.clearSearchBtn.current.classList.remove('show-clear');
    }

    onKeyDownHandler = (e) => {
        if(e.keyCode === 8) {
            this.setState({
                _search: "",
                _searchSuggestions: []
            })
            this.clearSearchBtn.current.classList.remove('show-clear');
        }
    }

    onSubmit(evt) {
        const searchValue = new URLSearchParams({value: evt.currentTarget[0].value});
        window.location.href="/search?" + searchValue.get('value');
    }

    render() {
        return (
            <div key={this.props.i} style={this.props.style}>
                <div style={{position: "relative"}}>
                    <div className="clear-crm_search-bar">
                        <div className="clear-crm_search-bar--search">
                            <div className="search-icon">
                                <SearchIcon />
                            </div>
                            <div className="search-input">
                                <form onSubmit={(evt) => {
                                    evt.preventDefault();
                                    evt.stopPropagation();
                                    this.onSubmit(evt);
                                }} style={{height: '100%'}}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={this.state._search}
                                        onChange={this.onChangeHandler}
                                        onKeyDown={this.onKeyDownHandler}
                                        onBlur={() =>{
                                            setTimeout(() => {
                                                return this.suggestionsRef?.current?.classList.add("hide-suggestions");
                                            },100)
                                        }}
                                        onFocus={() => {
                                            setTimeout(() => {
                                                if(this.state._searchSuggestions.length){
                                                    return this.suggestionsRef?.current?.classList.remove("hide-suggestions");
                                                }
                                            }, 100)
                                        }}
                                    />
                                </form>
                            </div>
                            <div className="search-clear" ref={this.clearSearchBtn} onClick={this.clearSearch}>
                                <ClearIcon />
                            </div>
                        </div>
                    </div>

                    {/*<div className={(this.state.showSuggestions) ? "search-suggestions" : "hide-suggestions"}
                         ref={this.suggestionsRef}
                    >
                        <ul>
                        {(this.state._searchSuggestions && this.state.showSuggestions) &&
                            this.state._searchSuggestions.map((suggestion, index) =>
                                {
                                    if(suggestion.pageConfig){
                                        return(
                                            <li key={index}>
                                                <Link
                                                    to={{
                                                        pathname: `/pages/preview/${suggestion.id}`
                                                    }}
                                                >
                                                    {suggestion.pageConfig.title} <span>page</span>
                                                </Link>
                                            </li>
                                        )
                                    } else return <li key={index}>{suggestion.title} <span>category</span></li>
                                }
                            )}
                        </ul>
                    </div>*/}
                </div>
            </div>
        );
    }
}

export default SearchModule;

SearchModule.propTypes = {
    boxId: PropTypes.number,
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
    defaultTheme: PropTypes.object
};