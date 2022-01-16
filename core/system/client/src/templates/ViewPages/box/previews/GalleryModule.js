import React, { Component } from "react";
import ReactImageMagnify from "react-image-magnify";
import ImageGallery from "react-image-gallery";
import { createTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import imageHelper from "../../../../helpers/image.helper";

class GalleryModule extends Component {
    state = {
        gallery: {
            showBullets: false,
            showThumbnails: true,
            infinite: true,
            showFullscreenButton: true,
            zoom: false,
            showPlayButton: true,
            autoPlay: true,
            showNav: true,
            showIndex: false,
            slideOnThumbnailOver: true,
            slideInterval: 2000,
            slideDuration: 450,
        },
        images: []
    };

    createDefaultTheme = () => {
        return createTheme({
            palette: this.props.defaultTheme,
        });
    };

    async componentDidMount() {
        if(this.props.moduleOptions){
            const mo = this.props.moduleOptions;
            let gallery =  {
                showBullets: mo.bullets,
                showThumbnails: mo.thumbnails,
                infinite: mo.infiniteSliding,
                showFullscreenButton: mo.fullscreenButton,
                zoom: mo.zoom,
                autoPlay: mo.autoPlay,
                showPlayButton: mo.playButton,
                showNav: mo.navigation,
                showIndex: mo.index,
                slideOnThumbnailOver: mo.tbnSliding,
                slideInterval: mo.slideInterval,
                slideDuration: mo.slideDuration,
            }

            let images = [];
            if(this.props.moduleOptions?.files){
                images = await Promise.all(this.props.moduleOptions.files.map(async (img) => {

                    const imgObject = {
                        title:  img?.title || "",
                        description: img?.description || "",
                        original: `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.boxId}/module/${img?.name}`,
                        thumbnail: `/files/pages/page-${this.props.pageOptions.page_id}/box-${this.props.boxId}/module/${img?.name}`,
                        link: img?.link,
                    };

                    if(img.file) {
                        const imgString = await imageHelper.toBase64(img.file);

                        imgObject.original = imgString;
                        imgObject.thumbnail = imgString;
                    }

                    imgObject.renderItem = (box) => {
                        const style = {
                            background: `url(${box.original}) no-repeat center center`,
                            backgroundSize: 'cover',
                            display: 'block',
                            height: '100%'
                        };

                        if(box.link.length) {
                            return <a href={box.link} style={style}>&nbsp;</a>
                        }
                        return <div style={style}>&nbsp;</div>
                    }

                    return imgObject;
                }))
            }

            this.setState({
                gallery,
                images: images
            })
        }
    }

    renderZoom(args) {
        return (
            <ReactImageMagnify
                {...{
                    smallImage: {
                        alt: args.title,
                        isFluidWidth: true,
                        src: `${args.thumbnail}`,
                    },
                    largeImage: {
                        width: 300,
                        height: 300,
                        src: `${args.original}`,
                    },
                    enlargedImagePortalId: `${this.props.boxId}-enlargeImage`,
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

        const galleryProps = {
            autoPlay: this.state.gallery.autoPlay,
            showBullets: this.state.gallery.showBullets,
            showThumbnails: this.state.gallery.showThumbnails,
            infinite: this.state.gallery.infinite,
            showFullscreenButton: this.state.gallery.showFullscreenButton,
            showPlayButton: this.state.gallery.showPlayButton,
            showNav: this.state.gallery.showNav,
            showIndex: this.state.gallery.showIndex,
            slideOnThumbnailOver: this.state.gallery.slideOnThumbnailOver,
            slideInterval: this.state.gallery.slideInterval,
            slideDuration: this.state.gallery.slideDuration,
            boxes: this.state.images,
        };

        if(this.state.gallery.zoom) {
            galleryProps.renderItem = (...args) => {
                return this.renderZoom(args[0]);
            }
        }

        return (
            <React.Fragment>
                <ImageGallery
                    {...galleryProps}
                />
                { this.state.gallery.zoom && <div id={`${this.props.boxId}-enlargeImage`} /> }
            </React.Fragment>
        );

    }
}

export default GalleryModule;

GalleryModule.propTypes = {
    boxId: PropTypes.number,
    classes: PropTypes.object,
    moduleOptions: PropTypes.object,
    pageOptions: PropTypes.object,
    defaultTheme: PropTypes.object
};