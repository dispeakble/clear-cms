import React, {Component} from "react";
import Link from "next/link"


class PagelistModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages : [],
        }
    }




    async componentDidMount() {
        this.setState({
            pages: this.props.control.pageList
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
                        this.state.pages.filter((page) => (page.pageConfig.pageLink || page.pageConfig.defaultPage) && page.pageConfig.publish)
                        .map((page, index) =>
                            <li key={index} className="clear-crm_pagelist-list--item">

                                <Link
                                    as={`/${page.pageConfig.pageLink}`}
                                    href={{
                                    pathname: `/${page.pageConfig.pageLink}`,
                                    query: {
                                        slug: page.pageConfig.pageLink
                                    }
                                }}
                                >

                                    <a>
                                        {page.pageConfig.pageTitle}
                                    </a>
                                </Link>
                            </li>
                        )}
                </ul>

            </div>
        )
    }

}

export default PagelistModule;