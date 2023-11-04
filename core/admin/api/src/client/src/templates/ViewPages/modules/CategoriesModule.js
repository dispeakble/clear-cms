import React, { Component } from "react";

import {Pagination} from "@material-ui/lab";
import {Card, CardContent, Typography} from "@material-ui/core";
import styles from "assets/jss/clear-crm/views/categoriesModule";
import {withStyles} from "@material-ui/core/styles";
import Link from "next/link"

class CategoriesModule extends Component {

    services = this.props.services;
    messageCallbacks = {};

    state = {
        categories:[],
        currentPage: 1,
        totalCategories: 0,
        displayType: this.props.element.moduleOptions.displayType,
        categoriesPerPage: this.props.element.moduleOptions.categoriesPerPage
    };

    constructor(props) {
        super(props);

        const categories = this.props.dependencies.categories;

        this.state.totalCategories = categories.length;
        this.state.categories = categories;
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async getCategories(pageNumber) {

        const categories = this.props.control.listCategories();

        this.setState({
            totalCategories: categories.length,
            categories: categories
        })

    }

    render() {
        const classes = this.props.classes;
        return (
            <div style={this.props.style}>
                <div>
                    {this.state.displayType === "card" && <div className={classes.backgroundView}>
                        {this.state.categories && this.state.categories.map((category, index) => {
                            return <Card key={index}
                                         style={{
                                             background: `center / cover no-repeat url(${"/files/categories/" + category.id + "/" + category.backgroundImage})`
                                         }}>
                                <CardContent>
                                    <Link href="/">
                                        <h3>{category.title}</h3>
                                        <Typography className={classes.description}>{category.description}</Typography>
                                    </Link>
                                </CardContent>
                            </Card>
                        })}
                    </div>}
                    {this.state.displayType === "list" && <div className={classes.thumbnailView}>
                        {this.state.categories && this.state.categories.map((category, index) => {
                            return <Card key={index}>
                                <CardContent classes={{ root: classes.cardWrapper }}>
                                    <Link href="/">
                                        <img alt={category.title} className={classes.thumbnailImg} src={"/files/categories/" + category.id + "/" + category.backgroundImage} />
                                        <span style={{display: "block", flexGrow: 1, paddingLeft: 10, width: 1}}>
                                                <h3 style={{marginTop: 0}}>{category.title}</h3>
                                                <Typography className={classes.description}>{category.description}</Typography>
                                            </span>
                                    </Link>
                                </CardContent>
                            </Card>
                        })}
                    </div>}
                    <Pagination
                        count={Math.floor(this.state.totalCategories / this.state.categoriesPerPage)}
                        page={this.state.currentPage}
                        onChange={async (event, value) => {
                            this.getCategories(value - 1);
                            this.setState({
                                currentPage: value
                            })
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CategoriesModule);
