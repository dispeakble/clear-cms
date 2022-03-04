import Image from "next/image"
import {HeroContainer, ImageContainer, InfoContainer} from './styled';

const Hero = ({img}: any) => {
    return (
        <HeroContainer>
            <ImageContainer>
                <Image src={img} alt={"background-img"} objectFit="contain" />
            </ImageContainer>
            <InfoContainer>
                <h2>Adventure</h2>
                <h3>Holidays and tours</h3>
                <p>Image from <a href="https://unsplash.com/" target="_blank">Unsplash</a></p>
            </InfoContainer>
        </HeroContainer>
    )
}

export default Hero