import {CardWrapper, ImageContainer} from "../../styled";
import Image from "next/image"

interface IProps{
    img: string;
}

const PackageCard = ({img}: IProps) => {
    return(
        <CardWrapper>
            <ImageContainer>
                <Image src={img} objectFit="cover" />
            </ImageContainer>
        </CardWrapper>
    )
}

export default PackageCard;