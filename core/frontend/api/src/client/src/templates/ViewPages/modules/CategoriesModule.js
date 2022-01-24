import React, {Component} from "react"


class CategoriesModule extends Component{

    constructor(props) {
        super(props);

        this.state = {
            categories : [],
        }
    }

    componentDidMount() {
        //TODO: initialize categories state

        this.setState({
            categories: this.props.allCategories
        })
    }

    render(){
        return(
            <div
                key={this.props.i}
                style={this.props.style}
            >
                {this.state.categories &&
                    this.state.categories.map((category, index) => {
                        return (
                            <p>{category}</p>
                        )
                    })
                }

            </div>
        );
    }

}

export default CategoriesModule;