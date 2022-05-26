import BookingConfirmedIllustration from "../../assets/img/bookingConfirmed.svg"
import {BookingConfirmedContainer, ConfirmedText, CustomButton, FinalStep, SuccessText} from "../styled";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { EmailDetailsText } from "../styled";

const BookingConfirmed = () => {

    const t = useTranslations();

    return(
        <BookingConfirmedContainer>
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
                    <CustomButton isActive>
                        {t('hotelCheckout.paymentConfirmed.backHome')}
                    </CustomButton>
                </ConfirmedText>
            </FinalStep>
        </BookingConfirmedContainer>
    )
}

export default BookingConfirmed