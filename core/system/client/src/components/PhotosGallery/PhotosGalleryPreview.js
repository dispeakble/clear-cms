import React, { Component } from "react";
import ReactImageMagnify from "react-image-magnify";

import { createTheme } from "@material-ui/core/styles";

import ImageGallery from "react-image-gallery";

class MyReactImageMagnify extends Component {
    render() {
        return <ReactImageMagnify {...this.props} />;
    }
}

class PhotosGalleryPreview extends Component {
    state = {
        gallery: {
            showBullets: false,
            showThumbnails: true,
            infinite: true,
            showFullscreenButton: true,
            showPlayButton: true,
            showNav: true,
            showIndex: false,
            slideOnThumbnailOver: true,
            slideInterval: 2000,
            slideDuration: 450,
        },
    };

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
        });
    };

    componentDidMount() {
        if(this.props.configuration){
            const gall = this.props.configuration;
            let gallery =  {
                showBullets: gall.bullets,
                showThumbnails: gall.thumbnails,
                infinite: gall.infiniteSliding,
                showFullscreenButton: gall.fullscreenButton,
                showPlayButton: gall.playButton,
                showNav: gall.navigation,
                showIndex: gall.index,
                slideOnThumbnailOver: gall.tbnSliding,
                slideInterval: gall.playInterval,
                slideDuration: gall.slideDuration,
            }
            this.setState({
                gallery,
            })
        }
    }

    renderZoom(args) {
        return (
            <MyReactImageMagnify
                {...{
                    smallImage: {
                        alt: "Wristwatch by Ted Baker London",
                        isFluidWidth: true,
                        src: `${args.thumbnail}`,
                    },
                    largeImage: {
                        width: this.width,
                        height: this.height,
                        src: `${args.original}`,
                    },
                    enlargedImagePortalId: "myPortal",
                }}
            />
        );
    }

    getImgSizes(url) {
        return new Promise((resolve) => {
            let img = new Image();
            let res = {
                width: 0,
                height: 0,
            };

            img.onload = function () {
                res.width = this.width;
                res.height = this.height;
                resolve(res);
            };

            img.src = url;
        });
    }

    render() {
        //let galleryType = "Carousel";
        console.log("preview", this.props, this.state)
        let imgs = []
        if(this.props.imageSources){
            imgs = this.props.imageSources.map(el => {
                return {
                    title:  el?.title || "",
                    description: el?.description || "",
                    original: `${el.file}`,
                    thumbnail: `${el.file}`,
                    link: el?.link,
                }
            })
        }

        return (
            <React.Fragment>
                <div id="myPortal" style={{position: "absolute", top: 0, left: 0}} />
                <ImageGallery
                    {...this.state.gallery}
                    renderItem={(...args) => {
                        return this.renderZoom(args[0]);
                    }}
                    items={imgs}
                />
            </React.Fragment>
        );

    }
}

export default PhotosGalleryPreview;
