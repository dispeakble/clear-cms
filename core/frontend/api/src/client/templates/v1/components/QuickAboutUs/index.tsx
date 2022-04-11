import {
  StyledContactBtn,
  StyledDescription,
  StyledQuickAboutUs,
  StyledQuickAboutUsImage,
  StyledQuickAboutUsText,
  StyledTitle
} from "./styled";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import mainPic from "../../assets/img/hotels/small/hotel7.jpg";
import { useTranslations } from "next-intl";
import Link from "next/link";


const QuickAboutUs = () => {
  const t = useTranslations();

  return <StyledQuickAboutUs>
    <StyledQuickAboutUsImage src={mainPic.src} />
    <StyledQuickAboutUsText src={mainPic.src}>
      <StyledTitle>{t("home.about-us.title")}</StyledTitle>
      <StyledDescription>{t("home.about-us.description")}</StyledDescription>
      <Link href="/about-us">
        <StyledContactBtn href={"/about-us"}>{t("home.about-us.contact-us")}</StyledContactBtn>
      </Link>
    </StyledQuickAboutUsText>
  </StyledQuickAboutUs>;
};

export default QuickAboutUs;