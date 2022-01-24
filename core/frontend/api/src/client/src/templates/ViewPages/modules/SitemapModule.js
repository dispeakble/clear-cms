import React, {Component} from "react";
import Link from "next/link"

class SitemapModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pages : [],
        }
    }

    componentDidMount() {
        this.setState({
            pages: this.props.allPages
        })
    }

    render() {

        return(
            <div
                key={this.props.i}
                style={this.props.style}
            >
                <ul className="clear-crm_sitemap-list">
                    {this.state.pages &&
                        this.state.pages.filter((page) => (page.pageConfig.pageLink || page.pageConfig.defaultPage) && page.pageConfig.publish)
                            .map((page, index) => <li key={index} className="clear-crm_sitemap-list--item">
                                <Link href={`/${page.pageConfig.pageLink}`}>
                                    <a>
                                        {page.pageConfig.pageTitle}
                                    </a>
                                </Link>
                            </li>)
                    }
                </ul>

            </div>
        )
    }

}

export default SitemapModule;