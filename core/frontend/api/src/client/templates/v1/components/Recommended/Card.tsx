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

const Card = ({ title, meal, details, price, img, dataTestid }: any) => {
  const t = useTranslations();
  return (
    <StyledCard data-testid={dataTestid}>
      <StyledStars stars={1} />
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