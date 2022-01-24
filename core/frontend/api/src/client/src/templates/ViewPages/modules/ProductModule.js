import React, {Component} from "react"


class ProductModule extends Component{

    constructor(props) {
        super(props);

        this.state = {
            product : {},
        }
    }

    componentDidMount() {
        //TODO: initialize categories state
    }

    render(){
        return(
            <div
                key={this.props.i}
                style={this.props.style}
            >
                product module
            </div>
        );
    }

}

export default ProductModule;