import React, { Component } from "react";

import * as shortId from "shortid";
import {Pagination} from "@material-ui/lab";

class SitemapModule extends Component {
    services = this.props.services;
    messageCallbacks = {};

    state = {
        displayOptions: [{
            label: "Display as Complete List",
            value: "displayAsCompleteList"
        }, {
            label: "Display as Categories and Pages",
            value: "displayAsCategoriesAndPages"
        }],
        displayType: "displayAsCompleteList",
        usePagination: false,
        numberOfLinksPerPage: 0,
        modalTitle: "Sitemap content",
        currentPage: 0
    }

    setAsyncState = (newState) =>
        new Promise((resolve) => this.setState(newState, resolve));

    async componentDidMount() {
        const {displayType,usePagination,numberOfLinksPerPage  } = this.props.element.moduleOptions;
        await this.setAsyncState({
            displayType: displayType,
            usePagination: usePagination,
            numberOfLinksPerPage: numberOfLinksPerPage
        })

        if(this.state.usePagination) {
            await this.setAsyncState({
                currentPage: 1
            });
        }

        await this.services.ws.subscribe({
            channel: 'sitemap-module',
            callbacks: {
                message: (response) => this.onMessage(response)
            }
        });

        const categories = await this.getCategoriesList();
        await this.setAsyncState({
            categories: categories
        })

        await this.getAllCategories();

        if(this.state.displayType === "displayAsCompleteList") {
            await this.updatePages(this.state.currentPage);
        }

    }

    onMessage(params) {
        try {
            this.messageCallbacks[params.id](params.data);
        } catch (err) {
            console.log(err);
        }
        console.log('got message in sitemap module', params);
    }

    sendMessage(params) {
        return new Promise((resolve_send) => {
            const uniqueId = shortId.generate();
            this.messageCallbacks[uniqueId] = resolve_send;
            this.services.ws.emit({
                id: uniqueId,
                channel: 'sitemap-module',
                module: params.module,
                api: params.api,
                act: params.act,
                payload: params.payload
            });
        });
    }

    async updatePages(pageNumber) {
        const pagesInfo = await this.getPages({page: pageNumber, numberOfLinksPerPage: this.state.numberOfLinksPerPage});

        await this.setAsyncState({
            pages: pagesInfo.pages,
            totalPages: pagesInfo.totalPages
        })
    }

    async updateCategoryPages(categoryId) {
        const pagesInfo = await this.getPagesByCategory({id: categoryId, page: this.state.currentPage, numberOfLinksPerPage: this.state.numberOfLinksPerPage});

        await this.setAsyncState({
            currentCategoryId: categoryId,
            pages: pagesInfo.pages,
            totalPages: pagesInfo.totalPages
        })
    }

    async getPages(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "sitemap",
            act: "getPages",
            payload: params
        });
        if (response) {
            return response;
        }
        return null;
    }

    async getCategoriesList(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "sitemap",
            act: "listCategories",
            payload: params
        });
        if (response) {
            return response;
        }
        return null;
    }

    async getPagesByCategory(params) {
        const response = await this.sendMessage({
            module: "system",
            api: "sitemap",
            act: "pagesByCategory",
            payload: params
        });
        if (response) {
            return response;
        }
        return null;
    }

    getAllCategories = async () => {
        let result = [];

        if (this.state.categories.length) {
            let links = this.state.categories;
            links.map((el) => {
                let linkName = el.title;
                if (el.parentid) {
                    linkName = this.getCategoriesNested(el.parentid) + "/" + el.title;
                }
                result.push({
                    id: el.id,
                    label: linkName,
                });
                return el;
            });

            await this.setAsyncState({
                flatCategories: result,
            });
        }
    };

    getCategoriesNested(id) {
        let result = "";
        let link = this.state.categories.find((el) => el.id === id);
        result = link.title;
        if (link && link.parentid) {
            result = this.getCategoriesNested(link.parentid) + "/" + result;
        }
        return result;
    }

    renderPageLink(page, key) {
        return <li key={key}>
            <div>
                <a href={page.cat_id ? this.state.flatCategories.find(cat => cat.id === page.cat_id).label + page.pagelink : page.pagelink}>{page.title}</a> {page.cat_id ? "Category Name:" + this.getCategoriesNested(page.cat_id) : ""}
            </div>
        </li>
    }

    render() {
        return (
            <div
                key={this.props.i}
                data-grid={this.props.element}
                style={this.props.style}
            >
                {this.state.displayType === "displayAsCompleteList" &&
                <>
                    <ul>
                        {this.state.pages && this.state.pages.map((page, index) => this.renderPageLink(page, index))}
                    </ul>
                    {this.state.pages && this.state.usePagination &&
                    <Pagination
                        count={Math.ceil(this.state.totalPages / this.state.numberOfLinksPerPage)}
                        page={this.state.currentPage}
                        onChange={async (event, value) => {
                            await this.setAsyncState({
                                currentPage: value
                            })
                            await this.updatePages(value);
                        }} />}
                </>
                }
                {this.state.displayType === "displayAsCategoriesAndPages" && this.state.flatCategories &&
                this.state.flatCategories.map((category, index) =>
                    <div onClick={async () => {
                        await this.updateCategoryPages(category.id);
                    }} key={index}>
                        <div>
                            {category.label}
                        </div>
                        {this.state.currentCategoryId === category.id &&
                        <>
                            <ul>
                                {this.state.pages && this.state.pages.map((page, index) => this.renderPageLink(page, index))}
                            </ul>
                            {this.state.pages.length > 0 && this.state.usePagination &&
                            <Pagination
                                count={Math.ceil(this.state.totalPages / this.state.numberOfLinksPerPage)}
                                page={this.state.currentPage}
                                onChange={async (event, value) => {
                                    await this.setAsyncState({
                                        currentPage: value
                                    })
                                    await this.updateCategoryPages(category.id);
                                }} />
                            }
                        </>
                        }
                    </div>)}
            </div>
        );
    }
}

export default SitemapModule;
