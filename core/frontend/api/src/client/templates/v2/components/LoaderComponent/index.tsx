import * as React from "react"

import {Loader, LoaderText, LoaderContainer} from "./styled";

const LoaderComponent = (props: any) => {
    return(
        <LoaderContainer>
            <LoaderText>
                {props.text}
            </LoaderText>
            <Loader>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </Loader>
        </LoaderContainer>
    )
}

export default LoaderComponent