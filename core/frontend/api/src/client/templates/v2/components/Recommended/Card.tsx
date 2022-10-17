import {
  StyledActionButton,
  StyledCard,
  StyledDetails,
  StyledLunch,
  StyledPrice,
  StyledTitle,
  StyledZoomImg
} from "./styled";
import { useTranslations } from "next-intl";
import { StyledStars } from "../Styled/stars";

const Card = ({ title, meal, details, price, img, stars, dataTestid }: any) => {
  const t = useTranslations();
  return (
    <StyledCard data-testid={dataTestid}>
      <StyledStars stars={stars} />
      <StyledTitle>{title}</StyledTitle>
      <StyledLunch>{meal}</StyledLunch>
      <StyledDetails>{details}</StyledDetails>
      <StyledPrice>{price}</StyledPrice>
      <StyledActionButton>{t("home.recommended.book-now")}</StyledActionButton>
      <StyledZoomImg src={img}/>
    </StyledCard>
  );
};

export default Card;