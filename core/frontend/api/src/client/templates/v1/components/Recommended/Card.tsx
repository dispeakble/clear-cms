import {
    StyledActionButton,
    StyledCard,
    StyledDetails,
    StyledLunch,
    StyledPrice,
    StyledStars,
    StyledTitle,
    StyledZoomImg, StyledZoomPopup,
} from "./styled";
import { useTranslations } from "next-intl";

const Card = ({ title, meal, details, price, img, dataTestid }: any) => {
  const t = useTranslations();
  return (
    <StyledCard data-testid={dataTestid} >
      <StyledStars stars={3} />
      <StyledTitle>{title}</StyledTitle>
      <StyledLunch>{meal}</StyledLunch>
      <StyledDetails>{details}</StyledDetails>
      <StyledPrice>{price}</StyledPrice>
      <StyledActionButton>{t("home.recommended.book-now")}</StyledActionButton>
      <StyledZoomImg src={img}>

        {/*<StyledZoomPopup src={img} />*/}

      </StyledZoomImg>
    </StyledCard>
  );
};

export default Card;