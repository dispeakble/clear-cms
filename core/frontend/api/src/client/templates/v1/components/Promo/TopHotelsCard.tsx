import {
  SmallBookNow,
  StyledCard,
  StyledCardImage,
  StyledCardImageHolder,
  StyledDestination,
  StyledFeaturedPrices,
  StyledFirstRow,
  StyledGrayLabel,
  StyledLightLabel,
  StyledPrice
} from "./styled";
import * as React from "react";

type TopHotelPriceProp = {
  destination: string;
  value: string;
}

type TopHotelsCardProps = {
  src: any;
  tag: string;
  details: string;
  action: string;
  prices: TopHotelPriceProp[]
}

export const TopHotelsCard = ({ src, tag, details, action, prices }: TopHotelsCardProps) => {
  return (
    <StyledCard>
      <StyledCardImageHolder>
        <StyledCardImage src={src} />
      </StyledCardImageHolder>
      <StyledFirstRow>
        <StyledLightLabel>{tag}</StyledLightLabel>
        <StyledGrayLabel>{details}</StyledGrayLabel>
        <SmallBookNow>{action}</SmallBookNow>
      </StyledFirstRow>
      {prices && prices.map((price, i) => (
        <StyledFeaturedPrices key={`${price.destination}-${price.value}`}>
          <StyledDestination>{price.destination}</StyledDestination>
          <StyledPrice>{price.value}</StyledPrice>
        </StyledFeaturedPrices>
      ))}
    </StyledCard>
  );
};