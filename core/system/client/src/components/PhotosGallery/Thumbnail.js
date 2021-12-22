import React, {Component} from "react";
import imageHelper from "../../helpers/image.helper";
import PropTypes from "prop-types";

class TumbnailComponent extends Component {

    state = {
        src: "",
        previewLeft: 0,
        previewTop: 0,
        showPreview: false
    };

    componentDidMount() {
        this.renderComponent();
    }

    renderComponent() {
        if (this.props.rowData.file) {
            imageHelper.toBase64(this.props.rowData.file).then((string) => {
                this.setState({
                    src: string
                }, () => {
                });
            })
        } else {
            this.setState({
                src: this.props.rowData.name
            }, () => {
            })
        }
    }

    thumbProps = {
        onMouseEnter: () => {
            this.setState({
                showPreview: true
            })
        },
        onMouseLeave: () => {
            this.setState({
                showPreview: false
            })
        },
        onMouseMove: (event) => {
            this.setState({
                previewLeft: event.nativeEvent.offsetX,
                previewTop: event.nativeEvent.offsetY,
            })
        }
    };

    render() {
        return (<>
            <div {...this.thumbProps}
                 style={{
                     width: '50px',
                     height: '50px',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundImage: `url(${this.state.src})`,
                 }}>&nbsp;</div>
            { this.state.showPreview &&
                <div style={{
                    width: '266px',
                    height: '150px',
                    position: 'absolute',
                    zIndex: 9999,
                    marginTop: '-100px',
                    marginLeft: '70px',
                    border: '2px solid #efefef',
                    boxShadow: 'rgba(0,0,0,0.3) 5px 5px 15px 5px',
                    borderRadius: '10px',
                    backgroundSize: '200%',
                    backgroundPosition: `${this.state.previewLeft}% ${this.state.previewTop}%`,
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${this.state.src})`
                }}>&nbsp;</div>
            }
        </>);
    }

}

export default TumbnailComponent;

TumbnailComponent.propTypes = {
    rowData: PropTypes.object,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseMove: PropTypes.func,
};