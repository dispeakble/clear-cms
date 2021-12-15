import React, { Component, createRef } from "react";
import Link from "next/link"

//import parse from "html-react-parser";

import SearchIcon from "../../../assets/icons/search.svg"
import ClearIcon from "../../../assets/icons/clear.svg"


class SearchModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: false,
            description: false,
            showSuggestions: false,
            showStartDate: false,
            showEndDate: false,
            _search : "",
            pageList: [],
            categoryList: [],
            productList: [],
            _searchSuggestions: [],
        };

        this.clearSearchBtn = createRef();
        this.suggestionsRef = createRef();
    }

    async componentDidMount() {

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

        await this.setState({
            pageList: await this.props.control.pageList,
            categoryList: await this.props.control.categoryList
        });


    }



    onChangeHandler = (e) => {
        let matches = [];

        this.setState({
            _search: e.target.value
        })

        if(this.state._search.length > 0){
            matches = [...this.state.pageList].concat(this.state.categoryList).filter(
                (object) => {
                    const regex = new RegExp(`${this.state._search}`, "gi");
                    if(object?.pageConfig && object?.pageConfig.publish){
                        return object?.pageConfig?.pageTitle.match(regex)
                    }
                    else {
                        if(this.state.title && this.state.description) return object.description.match(regex) || object.title.match(regex)
                        return this.state.description ? object.description.match(regex) : object.title.match(regex)
                    }
                }
            )
        }

        this.setState({
            _searchSuggestions: matches
        })


        if(this.state._search.length > 0)
            this.clearSearchBtn.current.classList.add('show-clear');
        else this.clearSearchBtn.current.classList.remove('show-clear');
    }

    clearSearch = () => {
        this.setState({
            _search: "",
            _searchSuggestions: []
        })
        this.clearSearchBtn.current.classList.remove('show-clear');
    }

    onKeyDownHandler = (e) => {
        if(e.keyCode == 8 && (this.state._search.length < 2 || (window.getSelection() && window.getSelection().toString().length === this.state._search.length))
            || (window.getSelection() && window.getSelection().toString().length === this.state._search.length) ){
            this.setState({
                _search: "",
                _searchSuggestions: []
            })
            this.clearSearchBtn.current.classList.remove('show-clear');
        }
    }

    render() {
        //let richText = this.props.element.moduleOptions;


        return (
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}

            >
                <div style={{position: "relative"}}>
                    <div className="clear-crm_search-bar">
                        <div className="clear-crm_search-bar--search">
                            <div className="search-icon">
                                <SearchIcon />
                            </div>
                            <div className="search-input">
                                <form style={{height: '100%'}}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={this.state._search}
                                        onChange={this.onChangeHandler}
                                        onKeyDown={this.onKeyDownHandler}
                                        onBlur={() =>{
                                            setTimeout(() => {
                                                this.suggestionsRef?.current?.classList?.add("hide-suggestions")
                                            },100)
                                        }}
                                        onFocus={() => {
                                            setTimeout(() => {
                                                if(this.state._searchSuggestions.length){
                                                    this.suggestionsRef?.current?.classList?.remove("hide-suggestions")
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
                    <div ref={this.suggestionsRef} className={(this.state._searchSuggestions.length && this.state.showSuggestions) ? "search-suggestions" : "hide-suggestions"}>
                        <ul>
                            {(this.state._searchSuggestions && this.state.showSuggestions) &&
                                this.state._searchSuggestions.map((suggestion, index) =>
                                    {
                                        if(suggestion.pageConfig){
                                            return(
                                                <li key={index}>
                                                    <Link
                                                        as={`/${suggestion.pageConfig.pageLink}`}
                                                        href={{
                                                            pathname: `/${suggestion.pageConfig.pageLink}`,
                                                            query: {
                                                                slug: suggestion.pageConfig.pageLink
                                                            }
                                                        }}
                                                    >
                                                        <a>{suggestion.pageConfig.pageTitle} <span>page</span></a>
                                                    </Link>
                                                </li>
                                            )
                                        } else return <li key={index}>{suggestion.title} <span>category</span></li>
                                    }
                                )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchModule;
