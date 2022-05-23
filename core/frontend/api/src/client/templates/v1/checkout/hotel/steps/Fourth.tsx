import PaymentRedirection from "../../../assets/img/paymentRedirection.png";
import PaymentError from "../../../assets/img/paymentError.png";
import ShoppingCart from "../../../assets/img/shoppingCart-icon.svg";

import * as React from "react";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {
    Payment,
    PaymentErrorText,
    PaymentStatusDetailsContainer,
    PaymentStatusImageContainer,
    PaymentStatusTitle
} from "../styled";
import Image from "next/image";

interface IProps {
    paymentError: boolean
}

const FourthStep = ({paymentError}: IProps) => {

    const t = useTranslations();
    return(
        <Payment>
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
                <PaymentErrorText>
                    {paymentError && (t('hotelCheckout.payment.error.insufficientFunds'))}
                </PaymentErrorText>
            </PaymentStatusDetailsContainer>
        </Payment>
    )
}

export default FourthStep