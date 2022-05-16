import {
    PackageDetailContainer,
    FlightInformation,
    FlightInputs,
    FlightTakeOffIcon,
    FlightTakeOffInput,
    DropdownIcon,
    TitleText,
    BookingDetailContainer,
    ParaTextBold,
    BookingCard,
    BookingHeadingText,
    BookingMutedText,
    BookingPriceText,
    BookingButton,
    PackageCharterContainer,
    BookingConditionsContainer,
    CustomHeading,
    QuotedPara,
    CustomSection
} from './styled';
import { Packages } from '../HomeSearch/SearchForms/Packages'
import React from "react";


const PackageDetailCard = () => {

    return(
        <PackageDetailContainer>
            <TitleText>Package Details</TitleText>
            <Packages />
           {/* <FlightInformation>
                <label>Flight information</label>
                <FlightInputs>
                    <FlightTakeOffInput>
                        <FlightTakeOffIcon />
                        <input placeholder="Bucharest"
                               style={{cursor: 'pointer'}}/>
                        <DropdownIcon />
                    </FlightTakeOffInput>
                    <input placeholder="Bucharest"
                           style={{cursor: 'pointer'}}/>
                </FlightInputs>
            </FlightInformation>*/}

            <BookingDetailContainer>
                <TitleText>Booking Details</TitleText>
                <ParaTextBold style={{textAlign: 'center'}}>Available prices for Jun 16 2022 - 7 nights</ParaTextBold>

                <BookingCard>
                    <div style={{ flexBasis: '15%'}}>
                        <BookingHeadingText>Single room</BookingHeadingText>
                        <BookingHeadingText>All Inclusive</BookingHeadingText>
                    </div>
                    <div style={{display: 'flex', flexBasis: '55%'}}>
                        <BookingMutedText>8 days / 7 nights</BookingMutedText>
                        <BookingMutedText style={{marginLeft: '35px'}}>1 adults, 0 children</BookingMutedText>
                    </div>
                    <div style={{display: 'flex', flexBasis: '30%'}}>
                        <BookingPriceText style={{marginRight: '30px'}}>409€</BookingPriceText>
                        <BookingButton>Book Now</BookingButton>
                    </div>
                </BookingCard>

                <BookingCard>
                    <div style={{ flexBasis: '15%'}}>
                        <BookingHeadingText>Double room</BookingHeadingText>
                        <BookingHeadingText>All Inclusive</BookingHeadingText>
                    </div>
                    <div style={{display: 'flex', flexBasis: '55%'}}>
                        <BookingMutedText>8 days / 7 nights</BookingMutedText>
                        <BookingMutedText style={{marginLeft: '35px'}}>2 adults, 4 children</BookingMutedText>
                    </div>
                    <div style={{display: 'flex', flexBasis: '30%'}}>
                        <BookingPriceText style={{marginRight: '30px'}}>1409€</BookingPriceText>
                        <BookingButton>Book Now</BookingButton>
                    </div>
                </BookingCard>
            </BookingDetailContainer>

            <PackageCharterContainer>
                <CustomHeading>Package Charter for Hotel Victoria</CustomHeading>
                <QuotedPara>
                    Specially Curated Holiday for your soulmate, Enjoy dinner in a romantic set-up at Barefoot Resort - Havelock, Thrilling Seakart Activity, Visit Elephant beach and enjoy water sports. Comfortable private transfers, Choice of Hotels, Inter-island travel on a private ferry...
                </QuotedPara>
            </PackageCharterContainer>

            <BookingConditionsContainer>
                <CustomHeading>Booking Conditions</CustomHeading>
                <QuotedPara>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu dolor efficitur, ullamcorper lectus id, consectetur purus. Cras consequat dapibus aliquam. Aenean hendrerit convallis ultrices. Praesent scelerisque orci vel arcu tincidunt, eu facilisis massa pellentesque. Ut facilisis sem ipsum, vitae porta enim dignissim consequat. Etiam nec placerat nibh. Aliquam posuere auctor lacus vitae sollicitudin. Quisque facilisis accumsan sapien ac efficitur. Etiam eget urna vulputate, faucibus ipsum et, imperdiet ipsum. Nam eu nunc a erat tincidunt feugiat sit amet id lacus. Nunc id risus vitae neque dictum eleifend eu quis felis.
                    </p>

                    <p>
                        Vestibulum sed rutrum nunc. Ut fringilla interdum neque, in sagittis tellus maximus vitae. Phasellus non diam volutpat est mattis vulputate. Nulla non interdum purus, ut suscipit purus. Sed sit amet pulvinar nunc. Praesent porttitor, risus convallis scelerisque rhoncus, ex est blandit dui, id facilisis erat libero eu ex. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris nibh tellus, egestas quis semper non, vulputate ac enim. Duis tempus nisl non dolor elementum varius. Praesent nec quam vitae elit vestibulum venenatis eget vel magna. Nulla luctus euismod faucibus. Aliquam ut lacus nec elit mattis ultrices vel sit amet orci. Nullam dignissim congue risus, at sagittis velit tempor sit amet. Cras a molestie leo, ut consequat neque. In ullamcorper auctor nisi, a scelerisque magna semper eu.
                    </p>
                </QuotedPara>
            </BookingConditionsContainer>
        </PackageDetailContainer>
    )
}

export default PackageDetailCard;
