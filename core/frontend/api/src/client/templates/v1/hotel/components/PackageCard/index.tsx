import {
    CardWrapper,
    ImageContainer,
    PackageDetails,
    PackageDetailsWrapper,
    PackageTitle,
    AddressText,
    RatingContainer,
    PackageItems,
    ItemContainer,
    ItemText,
    PricingDetailsWrapper,
    StartingPriceContainer,
    StartingPriceText,
    AdultNightText,
    TaxText,
    ButtonContainer,
    BookNowButton,
    PriceTextContainer,
    DetailsContainer,
    ServicesTextContainer,
    ServicesDescriptionText,
    PackageMain,
    PackageMainContainer,
    PackageDetailsContainer,
    PackageDescriptionContainer, PackageDescription, PackageServicesContainer
} from "../../styled";
import Image from "next/image"
import YellowStar from "../../../assets/img/starYellowImage.png"
import GrayStar from "../../../assets/img/starGrayImage.png"
import {useTranslations} from "next-intl";
import {useState} from "react";


interface IProps{
    _package: any;
}

const PackageCard = ({_package}: IProps) => {

    const t = useTranslations();
    const [isExpanded, setIsExpanded] = useState<string>('')

    const handleDetails = (value: string) => {
        setIsExpanded((prev: any) => {
            return prev === value ? '' : value
        })
    }

    return(
        <CardWrapper>
            <ImageContainer>
                <Image src={_package.image}
                       objectFit="cover"
                       layout="fill"
                       className="package-image"
                />
            </ImageContainer>
            <PackageMain>
                <PackageMainContainer>
                    <PackageDetailsWrapper>
                        <PackageDetailsWrapper>
                            <PackageDetails>
                                <PackageTitle>
                                    {_package.title}
                                </PackageTitle>
                                <AddressText>
                                    {_package.address}
                                </AddressText>
                                <RatingContainer>
                                    {
                                        [...Array(_package.rating)]
                                            .map((value: undefined, index: number) =>
                                                (
                                                    <Image
                                                        src={YellowStar}
                                                        width={21}
                                                        height={20}
                                                        alt={"rating-positive"}
                                                    />
                                                ))
                                    }
                                    {
                                        _package.rating < 5 &&
                                        [...Array(5 - _package.rating)]
                                            .map((value: undefined, index: number) =>
                                                (
                                                    <Image
                                                        src={GrayStar}
                                                        width={21}
                                                        height={20}
                                                        alt={"rating-negative"}
                                                    />
                                                ))
                                    }
                                </RatingContainer>
                                <PackageItems>
                                    {
                                        _package.packages &&
                                        _package.packages.map((p: any, index: number) =>
                                            (
                                                <ItemContainer key={index}>
                                                    <Image src={p.icon} alt={p.type} />
                                                    <ItemText>
                                                        {p.type}
                                                    </ItemText>
                                                </ItemContainer>
                                            )
                                        )
                                    }
                                </PackageItems>
                                <DetailsContainer>
                                    <ServicesTextContainer
                                        onClick={() => handleDetails('services')}
                                        isExpanded={isExpanded === 'services'}
                                    >
                                        <ServicesDescriptionText>
                                            {t('packages.main.includedServices')}
                                        </ServicesDescriptionText>
                                    </ServicesTextContainer>
                                    <ServicesTextContainer
                                        onClick={() => handleDetails('description')}
                                        isExpanded={isExpanded === 'description'}
                                    >
                                        <ServicesDescriptionText>
                                            {t('packages.main.hotelDescription')}
                                        </ServicesDescriptionText>
                                    </ServicesTextContainer>
                                </DetailsContainer>
                            </PackageDetails>
                        </PackageDetailsWrapper>
                    </PackageDetailsWrapper>
                    <PricingDetailsWrapper>
                        <PriceTextContainer>
                            <StartingPriceContainer>
                                <p>{t('packages.main.from')}</p>
                                <StartingPriceText>
                                    {_package.startingPrice} €
                                </StartingPriceText>
                            </StartingPriceContainer>
                            <AdultNightText>
                                {_package.packageOfferType}
                            </AdultNightText>
                            <TaxText>
                                {t('packages.main.taxes')}
                            </TaxText>
                        </PriceTextContainer>

                        <ButtonContainer>
                            <BookNowButton>
                                {t('packages.main.bookNow')}
                            </BookNowButton>
                        </ButtonContainer>
                    </PricingDetailsWrapper>
                </PackageMainContainer>

                <PackageDetailsContainer>
                    {
                        isExpanded === "description" &&
                        <PackageDescriptionContainer>
                            <PackageDescription>
                                { _package.description }
                            </PackageDescription>
                        </PackageDescriptionContainer>
                    }

                    {
                        isExpanded === "services" &&
                        <PackageServicesContainer>

                        </PackageServicesContainer>
                    }

                </PackageDetailsContainer>
            </PackageMain>

        </CardWrapper>
    )
}

export default PackageCard;