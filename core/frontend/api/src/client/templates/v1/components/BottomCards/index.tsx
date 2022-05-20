import {
    Wrapper,
} from "./styled";

import hotel1 from "../../assets/img/hotels/small/hotel8.jpg";
import Card from "./Card";
import * as React from "react";


const BottomCards = () => {
    const cardProps = {
        title: "Hotel 1",
        meal: "Accommodation and full breakfast\n",
        details: "Flight + Hotel 3 nights\n",
        price: "199$",
        img: hotel1.src
    };

    return (
        <>
            <Wrapper>

                <Card {...cardProps} />
                <Card {...cardProps} />
                <Card {...cardProps} />
            </Wrapper>
        </>
    )
}

export default BottomCards;