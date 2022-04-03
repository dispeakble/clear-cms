import * as React from 'react';
import CardsContainer from "../CardsContainer";
import {WrapperContainer,TaglineDescription,TopHeadingContainer,TaglineHeading} from './styled'

const UpcomingOffers = () => {

    return (
        <WrapperContainer data-testid='upcoming-offer-wrapper'>
            <TopHeadingContainer>
                <TaglineDescription data-testid='upcoming-offer-tagline'>Would you explore nature paradise in the world <br />
                    Find the best destination in world with us.</TaglineDescription>
                <TaglineHeading data-testid='upcoming-offer-tagline-heading'>Special Upcoming Offers</TaglineHeading>
            </TopHeadingContainer>
            <CardsContainer />
        </WrapperContainer>
    )
}

export default UpcomingOffers;


