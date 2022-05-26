import {useTranslations} from "next-intl";
import {
    FormGroup,
    PassengerDetails,
    PassengerHeader,
    PassengerHeaderContainer,
    PassengerItem, InputGroup,
    InputLabel, TextInput, CustomSelect, ButtonsContainer, CustomButton
} from "../styled";

const SecondStep = ({passengers, setPassengers, contactDetails,
                        setContactDetails, setCurrentStep}: any) => {

    const t = useTranslations();

    const handleInfosChange = (e: any, passenger: any, index: number) => {
        setPassengers((prev: any) => {
            return [
                ...prev.slice(0, index),
                {
                    ...passenger,
                    [e.target.name]: e.target.value,
                },
                ...prev.slice(1-index)
            ]
        })
    }

    const handleContactDetails = (e: any) => {
        setContactDetails((prev: any) => {
            return{
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }


    return (
        <PassengerDetails>
            {
                passengers.map((passenger: any, index: number) => {

                    return(
                        <PassengerItem>
                            <PassengerHeaderContainer>
                                <PassengerHeader>
                                    {passenger.isAdult ?
                                        t('flightsCheckout.main.adult')
                                            :
                                        t('flightsCheckout.main.child')}
                                </PassengerHeader>
                            </PassengerHeaderContainer>
                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.firstName')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder={t("flightsCheckout.main.firstNamePlaceHolder")}
                                        value={passenger.firstName}
                                        name="firstName"
                                        onChange={(e) =>
                                            handleInfosChange(e, passenger, index)}
                                    />
                                </InputGroup>

                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.lastName')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder={t("flightsCheckout.main.lastNamePlaceHolder")}
                                        value={passenger.lastName}
                                        name="lastName"
                                        onChange={(e) =>
                                            handleInfosChange(e, passenger, index)}
                                    />
                                </InputGroup>

                            </FormGroup>
                            {
                                !passenger.isAdult &&

                                <FormGroup>
                                    <InputGroup>
                                        <InputLabel>
                                            {t('flightsCheckout.main.childAge')}
                                        </InputLabel>
                                        <TextInput
                                            type="number"
                                            placeholder="E.G. 12"
                                            value={passenger.age}
                                            name="age"
                                            max={17}
                                            min={6}
                                            onChange={(e) =>
                                                handleInfosChange(e, passenger, index)}
                                        />
                                    </InputGroup>
                                </FormGroup>
                            }
                        </PassengerItem>
                    )
                })
            }
            <PassengerItem>
                <PassengerHeaderContainer>
                    <PassengerHeader>
                        {(t('flightsCheckout.main.contactDetails'))}
                    </PassengerHeader>
                </PassengerHeaderContainer>

                <FormGroup>
                    <InputGroup>
                        <InputLabel>
                            {t('flightsCheckout.main.firstName')}
                        </InputLabel>
                        <TextInput
                            type="text"
                            placeholder="E.G. John (Given Name)"
                            value={contactDetails.firstName}
                            name="firstName"
                            onChange={handleContactDetails}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLabel>
                            {t('flightsCheckout.main.lastName')}
                        </InputLabel>
                        <TextInput
                            type="text"
                            placeholder={t("flightsCheckout.main.lastNamePlaceHolder")}
                            value={contactDetails.firstName}
                            name="lastName"
                            onChange={handleContactDetails}
                        />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <InputGroup>
                        <InputLabel>
                            {t('flightsCheckout.main.phoneNumber')}
                        </InputLabel>
                        <TextInput
                            type="tel"
                            placeholder="E.G. +30 645 654 9850"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            value={contactDetails.phoneNumber}
                            name="phoneNumber"
                            onChange={handleContactDetails}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLabel>
                            {t('flightsCheckout.main.emailAddress')}
                        </InputLabel>
                        <TextInput
                            type="email"
                            placeholder="E.G. john.smith@example.com"
                            value={contactDetails.emailAddress}
                            name="emailAddress"
                            onChange={handleContactDetails}
                        />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <InputGroup>
                        <InputLabel>
                            {t('flightsCheckout.main.country')}
                        </InputLabel>
                        <CustomSelect>
                            <option style={{color: "#ADADAD"}} value="" disabled selected>E.G. {t("flightsCheckout.country.unitedKingdom")}</option>
                            <option value="spain">{t("flightsCheckout.country.spain")}</option>
                            <option value="morocco">{t("flightsCheckout.country.morocco")}</option>
                            <option value="romania">{t("flightsCheckout.country.romania")}</option>
                        </CustomSelect>
                    </InputGroup>
                </FormGroup>

            </PassengerItem>
            <ButtonsContainer>
                <CustomButton onClick={() => setCurrentStep((prev: number) => prev - 1)}>
                    {t('flightsCheckout.main.previousStep')}
                </CustomButton>
                <CustomButton isActive onClick={() => setCurrentStep((prev: number) => prev + 1)}>
                    {t('flightsCheckout.main.nextStep')}
                </CustomButton>
            </ButtonsContainer>
        </PassengerDetails>
    )
}

export default SecondStep