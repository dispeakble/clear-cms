import {useTranslations} from "next-intl";
import {
    FormGroup,
    PassengerDetails,
    PassengerHeader,
    PassengerHeaderContainer,
    PassengerItem, InputGroup,
    InputLabel, TextInput, DottedLines, ButtonsContainer, CustomButton, ErrorText, DottedLinesContainer
} from "../styled";
import {useEffect, useState} from "react";
import * as React from "react";
import {Formik, Form, ErrorMessage} from "formik";
import CustomSwitch from "../../components/CustomSwitch";

const SecondStep = ({passengers,
                        setPassengers, contactDetails,
                        setContactDetails, setCurrentStep,
                        currentStep, invoiceDetails,
                        setInvoiceDetails, passengersCount}: any) => {

    const t = useTranslations();
    const [useContactDetails, setUseContactDetails] = useState<boolean>(false)

    useEffect(() => {
        const clearInvoiceDetails = () => {
            setInvoiceDetails((prev:any) => {
                return{
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    emailAddress: '',
                    country: '',
                    address: '',
                    city: '',
                    zipCode: ''
                }
            })
        }


        if(!useContactDetails){
            clearInvoiceDetails()
        } else{
            Object.keys(contactDetails).map((key: any) => {
                setInvoiceDetails((prev:any) => {
                    return{
                        ...prev,
                        [key]: contactDetails[key]
                    }
                })
            })
        }
    }, [useContactDetails])


    return (
        <PassengerDetails>
            <Formik
                initialValues={{
                    passengers: passengers,
                    contact: contactDetails,
                    invoice: invoiceDetails
                }}
                enableReinitialize

                validate={(values) => {
                    const errors:any = {};
                    if (!values.contact.emailAddress) {
                        errors.contactEmail = 'Email required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.contact.emailAddress)
                    ) {
                        errors.contactEmail = 'Invalid email address';
                    }

                    if (!values.invoice.emailAddress) {
                        errors.invoiceEmail = 'Email required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.invoice.emailAddress)
                    ) {
                        errors.invoiceEmail = 'Invalid email address';
                    }
                    return errors;
                }
                }
                onSubmit={
                    (values, actions) => {
                        actions.setSubmitting(true)
                        setPassengers(values.passengers)
                        setContactDetails(values.contact)
                        setInvoiceDetails(values.invoice)
                        setCurrentStep((prev: number) => prev + 1)
                        setTimeout(() => {
                            actions.setSubmitting(false);
                        }, 1000);
                    }
                }
            >
                {({errors, touched, isSubmitting}: any) => (
                    <Form>
                        {
                            passengers.map((passenger: any, index: number) =>
                                (
                                    <PassengerItem key={index}>
                                        <PassengerHeaderContainer>
                                            <PassengerHeader>
                                                {passenger.isAdult ?
                                                    t('flightsCheckout.main.adult')
                                                    :
                                                    t('flightsCheckout.main.child')
                                                } {
                                                passenger.isAdult ? index +1 : index +1 - passengersCount.adults
                                            }
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
                                                    required
                                                    name={`passengers[${index}].firstName`}
                                                />
                                            </InputGroup>
                                            <DottedLinesContainer>
                                                <DottedLines />
                                            </DottedLinesContainer>
                                            <InputGroup>
                                                <InputLabel>
                                                    {t('flightsCheckout.main.lastName')}
                                                </InputLabel>
                                                <TextInput
                                                    type="text"
                                                    placeholder="E.G. Smith (Last Name)"
                                                    name={`passengers[${index}].lastName`}
                                                    required
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
                                                        name={`passengers[${index}].age`}
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormGroup>
                                        }
                                    </PassengerItem>
                                )
                            )
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
                                        name={`contact.firstName`}
                                        required
                                    />
                                </InputGroup>
                                <DottedLinesContainer>
                                    <DottedLines />
                                </DottedLinesContainer>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.lastName')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. Smith (Last Name)"
                                        name={`contact.lastName`}
                                        required
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
                                        name={`contact.phoneNumber`}
                                        required
                                    />
                                </InputGroup>
                                <DottedLinesContainer>
                                    <DottedLines />
                                </DottedLinesContainer>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.emailAddress')}
                                    </InputLabel>
                                    <TextInput
                                        type="email"
                                        placeholder="E.G. john.smith@example.com"
                                        name={`contact.emailAddress`}
                                        required
                                    />
                                    {
                                        errors.contactEmail &&
                                        <ErrorText>{errors.contactEmail}</ErrorText>
                                    }
                                </InputGroup>
                            </FormGroup>

                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.country')}
                                    </InputLabel>
                                    <TextInput name={`contact.country`} required as="select" style={{background: "none"}}>
                                        <option style={{color: "#ADADAD"}} disabled value="">E.G. United Kingdom</option>
                                        <option value="spain">Spain</option>
                                        <option value="morocco">Morocco</option>
                                        <option value="romania">Romania</option>
                                    </TextInput>
                                </InputGroup>
                            </FormGroup>

                        </PassengerItem>

                        <PassengerItem>
                            <PassengerHeaderContainer>
                                <PassengerHeader>
                                    {(t('flightsCheckout.main.invoiceDetails'))}
                                </PassengerHeader>
                            </PassengerHeaderContainer>

                            {/*
                                <FormGroup>
                                <CustomSwitch
                                    label={t('flightsCheckout.main.sameAsContact')}
                                    state={useContactDetails}
                                    setState={setUseContactDetails}
                                />
                            </FormGroup>
                               */
                            }

                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.firstName')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. John (Given Name)"
                                        name={`invoice.firstName`}
                                        required
                                    />
                                </InputGroup>
                                <DottedLinesContainer>
                                    <DottedLines />
                                </DottedLinesContainer>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.lastName')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. Smith (Last Name)"
                                        name={`invoice.lastName`}
                                        required
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
                                        name={`invoice.phoneNumber`}
                                        required
                                    />
                                </InputGroup>
                                <DottedLinesContainer>
                                    <DottedLines />
                                </DottedLinesContainer>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.emailAddress')}
                                    </InputLabel>
                                    <TextInput
                                        type="email"
                                        placeholder="E.G. john.smith@example.com"
                                        name={`invoice.emailAddress`}
                                        required
                                    />
                                    {
                                        errors.invoiceEmail &&
                                        <ErrorText>{errors.invoiceEmail}</ErrorText>
                                    }
                                </InputGroup>
                            </FormGroup>

                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.country')}
                                    </InputLabel>
                                    <TextInput name={`invoice.country`} required as="select" style={{background: "none"}}>
                                        <option style={{color: "#ADADAD"}} disabled value="">E.G. United Kingdom</option>
                                        <option value="spain">Spain</option>
                                        <option value="morocco">Morocco</option>
                                        <option value="romania">Romania</option>
                                    </TextInput>
                                </InputGroup>
                            </FormGroup>

                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.address')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. 64 Notley Street"
                                        name={`invoice.address`}
                                        required
                                    />
                                </InputGroup>
                                <DottedLinesContainer>
                                    <DottedLines />
                                </DottedLinesContainer>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.city')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. London"
                                        name={`invoice.city`}
                                        required
                                    />
                                </InputGroup>
                            </FormGroup>

                            <FormGroup>
                                <InputGroup>
                                    <InputLabel>
                                        {t('flightsCheckout.main.zipCode')}
                                    </InputLabel>
                                    <TextInput
                                        type="text"
                                        placeholder="E.G. 40741"
                                        name={`invoice.zipCode`}
                                        required
                                    />
                                </InputGroup>
                            </FormGroup>
                        </PassengerItem>
                        <ButtonsContainer>
                            <CustomButton onClick={() => setCurrentStep((prev: number) => prev - 1)}>
                                {t('flightsCheckout.main.previousStep')}
                                <span>
                                    {currentStep-1}
                                </span>
                            </CustomButton>
                            <CustomButton type="submit" isActive disabled={isSubmitting}>
                                {t('flightsCheckout.main.nextStep')}
                                <span>
                                    {currentStep+1}
                                </span>
                            </CustomButton>
                        </ButtonsContainer>
                    </Form>
                )}
            </Formik>
        </PassengerDetails>
    )
}

export default SecondStep