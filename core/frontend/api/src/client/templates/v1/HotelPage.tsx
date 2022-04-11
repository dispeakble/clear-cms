import * as React from "react";
import {useTranslations} from "next-intl";
import Header from "./components/Header";
import HotelDetail from "./components/HotelDetail";
import HotelAbout from "./components/HotelAbout";
import {MainWrapper, GlobalStyle, StyledContentWrapper} from "./styled";
import Breadcrumbs from "./components/Breadcrumbs";
import HotelAvailable from "./components/HotelAvailable";
import {useState} from "react";
import moment from "moment";

export type HotelPageProps = {
    websiteName: string;
    websiteUrl: string;
    websiteSlogan: string;
}

const HotelPage = ({websiteName, websiteUrl, websiteSlogan}: HotelPageProps) => {
    const t = useTranslations();
    const [data, setData] = useState({
        hotel: '',
        checkin: new Date(),
        checkout: moment(new Date()).add(1, 'd'),
        passanger: {
            adults: 1,
            infants: 0,
            children: 0
        }

    })

    const handleChangeInput = (name: string, value: any) => {
        setData({
            ...data,
            [name]: value
        })

    }
    const handleAdultPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                adults: data.passanger.adults + 1
            }
        })

    }
    const handleAdultMinus = () => {
        if(Number(data.passanger.adults)>0){
            setData({
                ...data,
                passanger: {
                    ...data.passanger,
                    adults: data.passanger.adults - 1
                }
            })
        }


    }
    const handleInfantsPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                infants: data.passanger.infants + 1
            }
        })

    }
    const handleInfantsMinus = () => {
        if(Number(data.passanger.infants)>0){
            setData({
                ...data,
                passanger: {
                    ...data.passanger,
                    infants: data.passanger.infants - 1
                }
            })
        }


    }

    const handleChildrenPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                children: data.passanger.children + 1
            }
        })

    }
    const handleChildrenMinus = () => {
        if(Number(data.passanger.children)>0) {
            setData({
                ...data,
                passanger: {
                    ...data.passanger,
                    children: data.passanger.children - 1
                }
            })
        }



    }
    const handleHotelSearch =(hotelValue:any)=>{
        setData({
            ...data,
            hotel:hotelValue
        })

    }
    const handleSearch =(value:any)=>{
        setData({
            ...data,
            hotel:value
        })
    }

    return <MainWrapper data-testid="hotel-page-wrapper">
        <GlobalStyle/>
        <Header websiteName={websiteName}/>
        <StyledContentWrapper>
            <Breadcrumbs/>
            <HotelDetail
                data={data}
                         handleChildrenMinus={handleChildrenMinus}
                         handleChildrenPlus={handleChildrenPlus}
                         handleInfantsMinus={handleInfantsMinus}
                         handleInfantsPlus={handleInfantsPlus}
                         handleChangeInput={handleChangeInput}
                         handleAdultPlus={handleAdultPlus}
                         handleAdultMinus={handleAdultMinus}
                handleSearch={handleSearch}
                handleHotelSearch={handleHotelSearch}
            />
            <HotelAbout/>
            <HotelAvailable
                data={data}
                handleChildrenMinus={handleChildrenMinus}
                handleChildrenPlus={handleChildrenPlus}
                handleInfantsMinus={handleInfantsMinus}
                handleInfantsPlus={handleInfantsPlus}
                handleChangeInput={handleChangeInput}
                handleAdultPlus={handleAdultPlus}
                handleAdultMinus={handleAdultMinus}
            />
        </StyledContentWrapper>
    </MainWrapper>;
};

export default HotelPage;