import Image from "next/image"
import {HeroContainer, ImageContainer, InfoContainer} from './styled';

const ImageComponent = ({img}: any) => {
    return (
        <HeroContainer data-testid="image-component">
            <ImageContainer>
                <Image src={img} alt={"background-img"} objectFit="contain" data-testid="image-item" />
            </ImageContainer>
            <InfoContainer data-testid="info-container">
                <h2>Adventure</h2>
                <h3>Holidays and tours</h3>
                <p>Image from <a href="https://unsplash.com/" target="_blank">Unsplash</a></p>
            </InfoContainer>
        </HeroContainer>
    )
}

export default ImageComponent