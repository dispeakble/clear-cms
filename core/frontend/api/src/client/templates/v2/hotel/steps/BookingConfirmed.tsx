import BookingConfirmedIllustration from "../../assets/img/bookingConfirmed.svg"
import {BookingConfirmedContainer, ConfirmedText, CustomButton, FinalStep, SuccessText} from "../styled";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { EmailDetailsText } from "../styled";
import { useRouter } from 'next/router'


const BookingConfirmed = () => {

    const t = useTranslations();

    const router = useRouter();
    const redirectHome = () => router.push('/');

    return(
        <BookingConfirmedContainer data-testid="test-hotel-checkout-confirmation">
            <FinalStep>
                <Image
                    src={BookingConfirmedIllustration}
                    width={710}
                    height={660}
                />
                <ConfirmedText>
                    <SuccessText>
                        {t('hotelCheckout.paymentConfirmed.successText')}
                    </SuccessText>
                    <EmailDetailsText>
                        {t('hotelCheckout.paymentConfirmed.emailDetails')}
                    </EmailDetailsText>
                    <CustomButton data-testid="test-home-button" isActive onClick={redirectHome}>
                        {t('hotelCheckout.paymentConfirmed.backHome')}
                    </CustomButton>
                </ConfirmedText>
            </FinalStep>
        </BookingConfirmedContainer>
    )
}

export default BookingConfirmed