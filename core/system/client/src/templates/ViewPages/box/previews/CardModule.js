import React, { Component } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";



class CardModule extends Component {

    state = {

        cardTitle:'',
        cardLink:'',
        textData:'',
        cardBackgroundLink:'',
        cardBinary:'',
        files:[],
        number: 1,
        expireDate:'',
        expireTime:''



    };
    componentDidMount(){
        const {moduleOptions} = this.props;

        this.setState({
            cardTitle: moduleOptions.cardTitle || '',
            cardLink: moduleOptions.cardLink || '',
            textData: moduleOptions.textData || '',
            cardBackgroundLink: moduleOptions.cardBackgroundLink || '',
            cardBinary: moduleOptions.cardBinary || '',
            files: moduleOptions.files || [],
            number: moduleOptions.number || '',
            expireDate: moduleOptions.expireDate || '',
            expireTime: moduleOptions.expireTime || '',

        });




    }


    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }




    render() {
        const text = this.props.moduleOptions.textData;

        return (

            <>
                <h3>{this.state.cardTitle}</h3>


                <img src={this.state.cardLink}  width="200" height="100" />
                <img src={this.state.cardBackgroundLink}  width="200" height="100" />



                <h3>{this.state.number}</h3>
                <h3>{this.state.expireDate} - {this.state.expireTime}</h3>





                <div
                    key={this.props.i}
                    style={this.props.style}
                >
                    {(text && text.length) ? parse(text) : ""}
                </div>



            </>
        );
    }
}

export default CardModule;
CardModule.propTypes = {
    moduleOptions: PropTypes.object,

};