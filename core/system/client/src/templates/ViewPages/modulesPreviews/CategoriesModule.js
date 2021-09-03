import React, { Component } from "react";

import * as shortId from "shortid";
import {Pagination} from "@material-ui/lab";
import {Card, CardContent, Paper, Typography} from "@material-ui/core";
import styles from "assets/jss/clear-crm/views/categoriesModule";
import {withStyles} from "@material-ui/core/styles";

class CategoriesModule extends Component {

    services = this.props.services;
    messageCallbacks = {};

    state = {
        displayType: "background",
        categoriesPerPage: "4",
        categories:[],
        currentPage: 1
    };

    async componentDidMount() {
        await this.setAsyncState({
            displayType: this.props.element.moduleOptions.data.displayType,
            categoriesPerPage: this.props.element.moduleOptions.data.categoriesPerPage
        })

        await this.services.ws.subscribe({
            channel: 'categories-module',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

        await this.updateCategoryPage(this.state.currentPage);
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in Categories module', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'categories-module',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    async updateCategoryPage(pageNumber) {
        const categoriesInfo = await this.getCategories({page: pageNumber, categoriesPerPage: this.state.categoriesPerPage});

        await this.setAsyncState({
            categories: categoriesInfo.data,
            totalCategories: categoriesInfo.totalCategories
        });
    }

    async getCategories(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "categories",
            act: "list",
            payload: params
        });
        if (response) {
            return response;
        }
        return null;
    }

    render() {
        const classes = this.props.classes;
        return (
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}
            >
                <div>
                    {this.state.displayType === "background" && <div className={classes.backgroundView}>
                        {this.state.categories && this.state.categories.map((category, index) => {
                            return <Card
                                key={index}
                                style={{display: "block", background: `url(${"/files/categories/category-" + category.id + "/" + category.backgroundimage})`}}
                            >
                                <CardContent>
                                    <Typography>Title: {category.title}</Typography>
                                </CardContent>
                             </Card>
                        })}
                    </div>}
                    <Pagination
                        count={Math.ceil(this.state.totalCategories / parseInt(this.state.categoriesPerPage))}
                        page={this.state.currentPage}
                        onChange={async (event, value) => {
                            await this.setAsyncState({
                                currentPage: value
                            })
                            await this.updateCategoryPage(value);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CategoriesModule);
