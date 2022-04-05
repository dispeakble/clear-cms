import styled from "styled-components";
import { Star, StarOutline } from "@material-ui/icons";

export const StarRatingContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
`;

export const StarRatingFilled = styled(Star)`
  font-size: 2.5rem !important;
  color: #FDC943;
`;
export const StarRatingEmpty = styled(StarOutline)`
  font-size: 2.5rem !important;
  color: #FDC943;
`;


export const ImageWrapper = styled.div`
  height:52px;
  width:50px;
  padding:5px;
`;
export const Image = styled.img`
  height: 100%;
  width:auto;
  object-fit: cover;
`;
