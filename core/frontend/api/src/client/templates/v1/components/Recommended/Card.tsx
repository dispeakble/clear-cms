import {
  StyledActionButton,
  StyledCard,
  StyledDetails,
  StyledLunch,
  StyledPrice,
  StyledStars,
  StyledTitle,
  StyledZoomImg,
} from "./styled";
import { useTranslations } from "next-intl";

const Card = ({ title, meal, details, price, img }: any) => {
  const t = useTranslations();
  return (
    <StyledCard>
      <StyledStars stars={3} />
      <StyledTitle>{title}</StyledTitle>
      <StyledLunch>{meal}</StyledLunch>
      <StyledDetails>{details}</StyledDetails>
      <StyledPrice>{price}</StyledPrice>
      <StyledActionButton>{t("home.recommended.book-now")}</StyledActionButton>
      <StyledZoomImg src={img}>
{/*
        <StyledZoomPopup src={img} />
*/}
      </StyledZoomImg>
    </StyledCard>
  );
};

export default Card;