import {Wrapper, ViewMoreButton, ViewMoreIcon, ViewMoreButtonContainer} from "./styled";
import HotelContent from './HotelContent';

const hotelsContent = [
    {
        imgSrc: '../../../assets/img/hotelresults/card1.jpg',
        hotelName: 'Hotel Victoria',
        hotelLocation: 'Bischofshofen, 4, 38660 Adeje, Spain',
        averageStars: 4,
        price: 1409,
        noOfNights: 7,
        description: "Lorem ipsum dolor sit amet, " +
            "consectetur adipiscing elit. Integer eu dolor efficitur, " +
            "ullamcorper lectus id, consectetur purus. Cras consequat dapibus" +
            " aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt" +
            ", eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat." +
            " Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan" +
            " sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a " +
            "erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis."
    },
    {
        imgSrc: '../../../assets/img/hotelresults/card1.jpg',
        hotelName: 'Hotel Victoria',
        hotelLocation: 'Bischofshofen, 4, 38660 Adeje, Spain',
        averageStars: 4,
        price: 1409,
        noOfNights: 7,
        description: "Lorem ipsum dolor sit amet, " +
            "consectetur adipiscing elit. Integer eu dolor efficitur, " +
            "ullamcorper lectus id, consectetur purus. Cras consequat dapibus" +
            " aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt" +
            ", eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat." +
            " Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan" +
            " sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a " +
            "erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis."
    },
    {
        imgSrc: '../../../assets/img/hotelresults/card1.jpg',
        hotelName: 'Hotel Victoria',
        hotelLocation: 'Bischofshofen, 4, 38660 Adeje, Spain',
        averageStars: 4,
        price: 1409,
        noOfNights: 7,
        description: "Lorem ipsum dolor sit amet, " +
            "consectetur adipiscing elit. Integer eu dolor efficitur, " +
            "ullamcorper lectus id, consectetur purus. Cras consequat dapibus" +
            " aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt" +
            ", eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat." +
            " Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan" +
            " sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a " +
            "erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis."
    },
    {
        imgSrc: '../../../assets/img/hotelresults/card1.jpg',
        hotelName: 'Hotel Victoria',
        hotelLocation: 'Bischofshofen, 4, 38660 Adeje, Spain',
        averageStars: 4,
        price: 1409,
        noOfNights: 7,
        description: "Lorem ipsum dolor sit amet, " +
            "consectetur adipiscing elit. Integer eu dolor efficitur, " +
            "ullamcorper lectus id, consectetur purus. Cras consequat dapibus" +
            " aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt" +
            ", eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat." +
            " Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan" +
            " sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a " +
            "erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis."
    }
];

const HotelResultsContent = () => {
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
                    <span>View more</span>
                    <ViewMoreIcon />
                </ViewMoreButton>
            </ViewMoreButtonContainer>
        </Wrapper>

    )
}


export default HotelResultsContent;