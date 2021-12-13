import React, { Component, createRef } from "react";
import {Link} from "react-router-dom";

class SearchModule extends Component {
    state = {
        title: false,
        description: false,
        showSuggestions: false,
        showStartDate: false,
        showEndDate: false,
        _search: "",
        pageList: [],
        categoryList: [],
        productList: [],
        _searchSuggestions: [],
    };

    clearSearchBtn = createRef();
    suggestionsRef = createRef();

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
            pageList: await this.props.control.list(),
            categoryList: await this.props.control.listCategories()
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
                    if(object.pageConfig && object.pageConfig.publish){
                        const regex = new RegExp(`${this.state._search}`, "gi");
                        return object.pageConfig.pageTitle.match(regex)
                    }
                    else {
                        const regex = new RegExp(`${this.state._search}`, "gi");
                        return object.title.match(regex)
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
        if(e.keyCode == 8 && this.state._search.length < 2){
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
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" enableBackground="new 0 0 129 129">
                                    <g>
                                        <path d="M51.6,96.7c11,0,21-3.9,28.8-10.5l35,35c0.8,0.8,1.8,1.2,2.9,1.2s2.1-0.4,2.9-1.2c1.6-1.6,1.6-4.2,0-5.8l-35-35   c6.5-7.8,10.5-17.9,10.5-28.8c0-24.9-20.2-45.1-45.1-45.1C26.8,6.5,6.5,26.8,6.5,51.6C6.5,76.5,26.8,96.7,51.6,96.7z M51.6,14.7   c20.4,0,36.9,16.6,36.9,36.9C88.5,72,72,88.5,51.6,88.5c-20.4,0-36.9-16.6-36.9-36.9C14.7,31.3,31.3,14.7,51.6,14.7z"/>
                                    </g>
                                </svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                     className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18">
                                    </line>
                                    <line x1="6"
                                    y1="6"
                                    x2="18"
                                    y2="18"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div ref={this.suggestionsRef} className={this.state._searchSuggestions.length ? "search-suggestions" : "hide-suggestions"}>
                        <ul>
                        {this.state._searchSuggestions &&
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
                                                    {suggestion.pageConfig.pageTitle} <span>page</span>
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
