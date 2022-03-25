import styled from "styled-components";
import {Star, StarHalf, StarOutline} from "@material-ui/icons";
import {Colors} from "../../../assets/design-set";


export const StarRatingContainer = styled.div`
  text-align: center;
`

export const StarRatingFilled = styled(Star)`
  font-size: 2.5rem !important;
  color: #FDC943;
`
export const StarRatingEmpty = styled(StarOutline)`
  font-size: 2.5rem !important;
  color: #FDC943;
`
export const StarRatingHalf = styled(StarHalf)`
  font-size: 2.5rem !important;
  color: #FDC943;
`
