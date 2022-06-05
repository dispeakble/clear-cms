import PaymentRedirection from "../../assets/img/paymentRedirection.png";
import PaymentError from "../../assets/img/paymentError.png";
import ShoppingCart from "../../assets/img/shoppingCart-icon.svg";

import * as React from "react";
import {useTranslations} from "next-intl";
import {
    ButtonsContainer,
    CustomButton,
    Payment,
    PaymentErrorText, PaymentInfoText,
    PaymentStatusDetailsContainer,
    PaymentStatusImageContainer,
    PaymentStatusTitle, PaymentStep,
    RedirectText
} from "../styled";
import Image from "next/image";
import Link from "next/link";

interface IProps {
    paymentError: boolean;
    currentStep: number;
    setCurrentStep: any;
}

const FourthStep = ({paymentError, currentStep,
                        setCurrentStep}: IProps) => {

    const t = useTranslations();
    return(
        <PaymentStep data-testid="test-package-fourth-step">
            <Payment isError={paymentError}>
                <PaymentStatusImageContainer>
                    <Image
                        src={paymentError ? PaymentError : PaymentRedirection }
                        width={500}
                        height={450}
                    />
                </PaymentStatusImageContainer>
                <PaymentStatusDetailsContainer>
                    <Image src={ShoppingCart} />
                    <PaymentStatusTitle>
                        {paymentError ? t('hotelCheckout.payment.error.title') : t('hotelCheckout.payment.success.title')}
                    </PaymentStatusTitle>
                    { paymentError &&
                        <PaymentErrorText>
                            ({t('hotelCheckout.payment.error.insufficientFunds')})
                        </PaymentErrorText>
                    }
                    <PaymentInfoText>
                        {paymentError ?
                            t('hotelCheckout.payment.error.tryAgain') :
                            t('hotelCheckout.payment.success.doNotCloseWindow')
                        }
                    </PaymentInfoText>
                    <PaymentInfoText>
                        ({t('hotelCheckout.payment.clickBackButton')})
                    </PaymentInfoText>

                    {
                        !paymentError &&
                        <RedirectText>
                            {t('hotelCheckout.payment.redirectText')} <Link href={'#'}>{t('hotelCheckout.payment.clickHere')}</Link>
                        </RedirectText>
                    }
                </PaymentStatusDetailsContainer>
            </Payment>
            {
                paymentError &&
                <ButtonsContainer hasOneChild>
                    <CustomButton data-testid="test-next-button" isActive onClick={() => setCurrentStep((prev: number) => prev + 1)}>
                        {t('flightsCheckout.main.nextStep')}
                        <span>
                            {currentStep+1}
                        </span>
                    </CustomButton>
                </ButtonsContainer>
            }
        </PaymentStep>
    )
}

export default FourthStep