import {
    Wrapper,
} from "./styled";

import hotel1 from "../../assets/img/hotels/small/hotel8.jpg";
import hotel2 from "../../assets/img/hotels/small/hotel9.jpg";
import hotel3 from "../../assets/img/hotels/small/hotel10.jpg";
import {useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Card from "./Card";
import {StyledTabBtn, StyledTabs} from "../Promo/styled";
import * as React from "react";
import {useState} from "react";


const BottomCards = () => {
    const cardProps = {
        title: "Hotel 1",
        meal: "Accommodation and full breakfast\n",
        details: "Flight + Hotel 3 nights\n",
        price: "199$",
        img: hotel1.src
    };

    const t = useTranslations();

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