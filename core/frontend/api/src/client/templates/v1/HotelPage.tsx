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

export type HomePageProps = {
    websiteName: string;
    websiteUrl: string;
    websiteSlogan: string;
}

const HomePage = ({websiteName, websiteUrl, websiteSlogan}: HomePageProps) => {
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

    const handleCahngeInput = (name: string, value: any) => {
        setData({
            ...data,
            [name]: value
        })

    }
    const hanldeAdultPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                adults: data.passanger.adults + 1
            }
        })

    }
    const hanldeAdultMinus = () => {
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
    const hanldeInfantsPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                infants: data.passanger.infants + 1
            }
        })

    }
    const hanldeInfantsMinus = () => {
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

    const hanldeChildrenPlus = () => {
        setData({
            ...data,
            passanger: {
                ...data.passanger,
                children: data.passanger.children + 1
            }
        })

    }
    const hanldeChildrenMinus = () => {
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

    return <MainWrapper>
        <GlobalStyle/>
        <Header websiteName={websiteName}/>
        <StyledContentWrapper>
            <Breadcrumbs/>
            <HotelDetail
                data={data}
                         hanldeChildrenMinus={hanldeChildrenMinus}
                         hanldeChildrenPlus={hanldeChildrenPlus}
                         hanldeInfantsMinus={hanldeInfantsMinus}
                         hanldeInfantsPlus={hanldeInfantsPlus}
                         handleCahngeInput={handleCahngeInput}
                         hanldeAdultPlus={hanldeAdultPlus}
                         hanldeAdultMinus={hanldeAdultMinus}
                handleSearch={handleSearch}
                handleHotelSearch={handleHotelSearch}
            />
            <HotelAbout/>
            <HotelAvailable
                data={data}
                hanldeChildrenMinus={hanldeChildrenMinus}
                hanldeChildrenPlus={hanldeChildrenPlus}
                hanldeInfantsMinus={hanldeInfantsMinus}
                hanldeInfantsPlus={hanldeInfantsPlus}
                handleCahngeInput={handleCahngeInput}
                hanldeAdultPlus={hanldeAdultPlus}
                hanldeAdultMinus={hanldeAdultMinus}
            />
        </StyledContentWrapper>
    </MainWrapper>;
};

export default HomePage;