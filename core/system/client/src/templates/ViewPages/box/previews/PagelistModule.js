import React, { Component } from "react";
import {Link} from "react-router-dom"


class PagelistModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages : [],
        }
    }




    async componentDidMount() {
        await this.setState({
            pages: await this.props.control.list()
        })
    }

    render() {

        return(
            <div
                key={this.props.i}
                style={this.props.style}
            >
                <ul className="clear-crm_pagelist-list">
                    {this.state.pages &&
                        this.state.pages.filter((page) => page.pageConfig.publish)
                            .map((page, index) =>
                                <li key={index} className="clear-crm_pagelist-list--item">
                                    <Link
                                        to={{
                                            pathname: `/pages/preview/${page.id}`
                                        }}
                                    >
                                        {page.pageConfig.pageTitle}
                                    </Link>
                                </li>
                            )}
                </ul>

            </div>
        )
    }

}

export default PagelistModule;
