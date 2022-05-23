import {Wrapper, ViewMoreButton, ViewMoreIcon, ViewMoreButtonContainer} from "./styled";
import HotelContent from './HotelContent';
import {useTranslations} from "next-intl";

const HotelResultsContent = () => {

const t = useTranslations();
    const hotelsContent = [
        {
            imgSrc: '../../../assets/img/hotelresults/card1.jpg',
            hotelName: t("hotelResult.hotelVictoria"),
            hotelLocation: t("hotelResult.victoriaHotelLocation"),
            averageStars: 4,
            price: 1409,
            noOfNights: 7,
            description:t("hotelResult.hotelVictoriaDescription")
        },
        {
            imgSrc: '../../../assets/img/hotelresults/card1.jpg',
            hotelName: t("hotelResult.hotelVictoria"),
            hotelLocation: t("hotelResult.victoriaHotelLocation"),
            averageStars: 4,
            price: 1409,
            noOfNights: 7,
            description:t("hotelResult.hotelVictoriaDescription")
        },
        {
            imgSrc: '../../../assets/img/hotelresults/card1.jpg',
            hotelName: t("hotelResult.hotelVictoria"),
            hotelLocation: t("hotelResult.victoriaHotelLocation"),
            averageStars: 4,
            price: 1409,
            noOfNights: 7,
            description:t("hotelResult.hotelVictoriaDescription")
        },
        {
            imgSrc: '../../../assets/img/hotelresults/card1.jpg',
            hotelName: t("hotelResult.hotelVictoria"),
            hotelLocation: t("hotelResult.victoriaHotelLocation"),
            averageStars: 4,
            price: 1409,
            noOfNights: 7,
            description:t("hotelResult.hotelVictoriaDescription")
        },
    ];


    return (
        <Wrapper>
            <div>
            {hotelsContent.map(hotelContent => <HotelContent
            imgSrc={hotelContent.imgSrc} hotelName={hotelContent.hotelName}
            hotelLocation={hotelContent.hotelLocation} averageStars={hotelContent.averageStars}
            price={hotelContent.price} noOfNights={hotelContent.noOfNights} description={hotelContent.description}
            />)}
            </div>

            <ViewMoreButtonContainer>
                <ViewMoreButton>
                    <span>t("hotelResult.viewMore")</span>
                    <ViewMoreIcon />
                </ViewMoreButton>
            </ViewMoreButtonContainer>
        </Wrapper>

    )
}


export default HotelResultsContent;