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
        currentPage: 1,
        totalCategories: 0
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

        await this.getCategories(this.state.currentPage - 1);
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params);
        } catch (err) {
            console.log(err);
        }
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

    async getCategories(pageNumber) {
        const response = await this.sendMessage({
            module: "system",
            api: "categories",
            act: "list",
            payload: {
                where: {
                    parentId: 0
                },
                limit: [pageNumber, this.state.categoriesPerPage],
                order: {
                    title: 'asc'
                }
            }
        });

        await this.setAsyncState({
            totalCategories: response.data.count,
            categories: response.data.rows
        });
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
                                    <a href="/">
                                        <h3>{category.title}</h3>
                                        <Typography className={classes.description}>{category.description}</Typography>
                                    </a>
                                </CardContent>
                            </Card>
                        })}
                    </div>}
                    {this.state.displayType === "list" && <div className={classes.thumbnailView}>
                        {this.state.categories && this.state.categories.map((category, index) => {
                            return <Card key={index}>
                                <CardContent classes={{ root: classes.cardWrapper }}>
                                    <a href="/">
                                        <img alt={category.title} className={classes.thumbnailImg} src={"/files/categories/" + category.id + "/" + category.backgroundImage} />
                                        <span style={{display: "block", flexGrow: 1, paddingLeft: 10, width: 1}}>
                                                <h3 style={{marginTop: 0}}>{category.title}</h3>
                                                <Typography className={classes.description}>{category.description}</Typography>
                                            </span>
                                    </a>
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
