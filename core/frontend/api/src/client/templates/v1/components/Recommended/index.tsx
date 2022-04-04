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


const Recommended = () => {
    const cardProps = {
        title: "Hotel 1",
        meal: "Accommodation and full breakfast\n",
        details: "Flight + Hotel 3 nights\n",
        price: "199$",
        img: hotel1.src
    };

    const t = useTranslations();

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <>
            <StyledTabs>
                <StyledTabBtn onClick={() => setSelectedTab(0)} className={selectedTab === 0 ? 'selected' : ''}>{t('home.recommended.tabs.popular')}</StyledTabBtn>
                <StyledTabBtn onClick={() => setSelectedTab(1)} className={selectedTab === 1 ? 'selected' : ''}>{t('home.recommended.tabs.adventure')}</StyledTabBtn>
                <StyledTabBtn onClick={() => setSelectedTab(2)} className={selectedTab === 2 ? 'selected' : ''}>{t('home.recommended.tabs.relax')}</StyledTabBtn>
            </StyledTabs>
            <Wrapper>

                <Card {...cardProps} />
                <Card {...cardProps} />
                <Card {...cardProps} />
            </Wrapper>
        </>
    )
}

export default Recommended;