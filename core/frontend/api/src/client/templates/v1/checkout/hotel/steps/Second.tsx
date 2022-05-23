import {useTranslations} from "next-intl";
import {
    FormGroup,
    PassengerDetails,
    PassengerHeader,
    PassengerHeaderContainer,
    PassengerItem, InputGroup,
    InputLabel, TextInput, CustomSelect, ButtonsContainer, CustomButton
} from "../styled";
import {useEffect, useState} from "react";

const SecondStep = ({passengers, setPassengers, contactDetails,
                        setContactDetails, setCurrentStep}: any) => {

    const t = useTranslations();
    const [isFormValid, setIsFormValid] = useState<boolean>(false)

    useEffect(() => {
        const checkFormValidity = () => {
            passengers.map((passenger: any, index: number) => {
                if(passenger.firstName.length > 0
                    && passenger.lastName.length > 0 &&
                    contactDetails.firstName.length > 0 &&
                    contactDetails.lastName.length > 0 &&
                    contactDetails.phoneNumber.length > 0 &&
                    contactDetails.country.length > 0 &&
                    contactDetails.emailAddress.match(
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )

                ){
                    setIsFormValid(true)
                } else {
                    setIsFormValid(false)
                }
            })
        }

        checkFormValidity()
    }, [passengers, contactDetails])

    const handleInfosChange = (e: any, passenger: any, index: number) => {
        setPassengers((prev: any) => {
            return [
                ...prev.slice(0, index),
                {
                    ...passenger,
                    [e.target.name]: e.target.value,
                },
                ...(index !== prev.length-1 ? prev.slice(index +1 -prev.length) : [])
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
                                        placeholder="E.G. John (Given Name)"
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
                                        placeholder="E.G. Smith (Last Name)"
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
                            placeholder="E.G. Smith (Last Name)"
                            value={contactDetails.lastName}
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
                        <CustomSelect name="country" onChange={handleContactDetails}>
                            <option style={{color: "#ADADAD"}} value="" disabled selected>E.G. United Kingdom</option>
                            <option value="spain">Spain</option>
                            <option value="morocco">Morocco</option>
                            <option value="romania">Romania</option>
                        </CustomSelect>
                    </InputGroup>
                </FormGroup>

            </PassengerItem>
            <ButtonsContainer>
                <CustomButton onClick={() => setCurrentStep((prev: number) => prev - 1)}>
                    {t('flightsCheckout.main.previousStep')}
                </CustomButton>
                <CustomButton isActive onClick={() => setCurrentStep((prev: number) => prev + 1)} disabled={!isFormValid}>
                    {t('flightsCheckout.main.nextStep')}
                </CustomButton>
            </ButtonsContainer>
        </PassengerDetails>
    )
}

export default SecondStep