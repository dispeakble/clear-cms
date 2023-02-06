import {
  StyledActionButton, StyledCard,
  StyledDetails,
  StyledLunch,
  StyledPrice,
  StyledTitle,
  StyledZoomImg, StyledZoomPopup
} from "./styled";
import { useTranslations } from "next-intl";
import { StyledStars } from "../Styled/stars";

const Card = ({ title, meal, details, price, img }: any) => {
  const t = useTranslations();
  return (
    <StyledCard>
      <StyledStars stars={3} size='small' />
      <StyledTitle>{title}</StyledTitle>
      <StyledLunch>{meal}</StyledLunch>
      <StyledDetails>{details}</StyledDetails>
      <StyledPrice>{price}</StyledPrice>
      <StyledActionButton>{t("home.recommended.book-now")}</StyledActionButton>
      <StyledZoomImg src={img}>
        <StyledZoomPopup src={img} />
      </StyledZoomImg>
    </StyledCard>
  );
};

export default Card;