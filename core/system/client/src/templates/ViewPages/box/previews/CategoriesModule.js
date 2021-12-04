import React, { Component } from "react";

import * as shortId from "shortid";
import {Pagination} from "@material-ui/lab";
import {Card, CardContent, Typography} from "@material-ui/core";
import styles from "assets/jss/clear-crm/views/categoriesModule";
import {withStyles} from "@material-ui/core/styles";

class CategoriesModule extends Component {

    services = this.props.services;
    messageCallbacks = {};

    state = {
        displayType: "background",
        categoriesPerPage: 10,
        categories:[],
        currentPage: 1
    };

    async componentDidMount() {
        await this.setAsyncState({
            displayType: this.props.moduleOptions.displayType,
            categoriesPerPage: this.props.moduleOptions.categoriesPerPage
        })

        await this.services.ws.subscribe({
            channel: 'categories-module',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

        await this.updateCategoryPage(this.state.currentPage - 1);
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
        await this.getTotalCategories(pageNumber);
        const categoriesInfo = await this.getCategories({
            where: {
                parentId: 0
            },
            limit: [pageNumber, this.state.categoriesPerPage || 10]
        });

        await this.setAsyncState({
            categories: categoriesInfo.data
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

    async getTotalCategories() {
        const response = await this.sendMessage({
            module: "system",
            api: "categories",
            act: "total",
            payload: {
                where: {
                    parentId: 0
                }
            }
        });
        if (response) {
            await this.setAsyncState({
                totalCategories: response.data.total
            })
        }
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
                                style={{color: 'inherit', width: '100%', display: "block", background: `url(${"/files/categories/category-" + category.id + "/" + category.backgroundimage})`}}
                            >
                                <CardContent>
                                    <h3>{category.title}</h3>
                                    <Typography className={classes.description}>{category.description}</Typography>
                                </CardContent>
                             </Card>
                        })}
                    </div>}
                    {this.state.displayType === "thumbnail" && <div className={classes.thumbnailView}>
                        {this.state.categories && this.state.categories.map((category, index) => {
                            return <Card
                                style={{color: 'inherit', width: '100%', display: "block"}}
                                key={index}
                            >
                                <CardContent classes={{ root: classes.cardWrapper }}>
                                    <div className={classes.cardContent}>
                                        <img alt={category.title} className={classes.thumbnailImg} src={"/files/categories/category-" + category.id + "/" + category.backgroundimage} />

                                        <div style={{flexGrow: 1, paddingLeft: 10, width: 1}}>
                                            <h3 style={{marginTop: 0}}>{category.title}</h3>
                                            <Typography className={classes.description}>{category.description}</Typography>
                                        </div>
                                    </div>
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
                            await this.updateCategoryPage(value - 1);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CategoriesModule);
