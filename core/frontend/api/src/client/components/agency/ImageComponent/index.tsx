import Image from "next/image";
import { HeroContainer, ImageContainer, InfoContainer } from "./styled";
import { useTranslations } from "next-intl";

const ImageComponent = ({ img }: any) => {
  const t = useTranslations("home");

  return (
    <HeroContainer data-testid="image-component">
      <ImageContainer>
        <Image src={img} alt={"background-img"} objectFit="contain" data-testid="image-item" />
      </ImageContainer>
      <InfoContainer data-testid="info-container">
        <h2>
          {t("info-box-title")}
        </h2>
        <h3>
          {t("info-box-description")}
        </h3>
        <p>
          {t("img-source")} <a href="https://unsplash.com/" target="_blank">Unsplash</a></p>
      </InfoContainer>
    </HeroContainer>
  );
};

export default ImageComponent;