import { useTranslations } from "next-intl";
import {
  FormGroup,
  PassengerDetails,
  PassengerHeader,
  PassengerHeaderContainer,
  PassengerItem, InputGroup,
  InputLabel, TextInput, DottedLines, ButtonsContainer, CustomButton, ErrorText, DottedLinesContainer, StyledField
} from "../styled";
import * as React from "react";
import { Formik, Form, Field } from "formik";

const SecondStep = ({
                      passengers,
                      setPassengers, contactDetails,
                      setContactDetails, setCurrentStep,
                      currentStep, invoiceDetails,
                      setInvoiceDetails, passengersCount
                    }: any) => {

  const t = useTranslations();

  return (
    <PassengerDetails data-testid="test-flight-second-step">
      <Formik
        initialValues={{
          passengers: passengers,
          contact: contactDetails,
          invoice: invoiceDetails
        }}
        enableReinitialize

        validate={(values) => {
          const errors: any = {};
          if (!values.contact.emailAddress) {
            errors.contactEmail = "Email required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.contact.emailAddress)
          ) {
            errors.contactEmail = "Invalid email address";
          }

          if (!values.invoice.emailAddress) {
            errors.invoiceEmail = "Email required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.invoice.emailAddress)
          ) {
            errors.invoiceEmail = "Invalid email address";
          }
          return errors;
        }
        }
        onSubmit={
          (values, actions) => {
            actions.setSubmitting(true);
            setPassengers(values.passengers);
            setContactDetails(values.contact);
            setInvoiceDetails(values.invoice);
            setCurrentStep((prev: number) => prev + 1);
          }
        }
      >
        {({ errors, isSubmitting }: any) => (
          <Form>
            {
              passengers.map((passenger: any, index: number) =>
                (
                  <PassengerItem key={index}>
                    <PassengerHeaderContainer>
                      <PassengerHeader>
                        {passenger.isAdult ?
                          t("flightsCheckout.main.adult")
                          :
                          t("flightsCheckout.main.child")
                        } {
                        passenger.isAdult ? index + 1 : index + 1 - passengersCount[t("global.adults")]
                      }
                      </PassengerHeader>
                    </PassengerHeaderContainer>
                    <FormGroup>
                      <InputGroup>
                        <InputLabel>
                          {t("flightsCheckout.main.firstName")}
                        </InputLabel>
                        <Field name={`passengers[${index}].firstName`}>
                          {({ field }: any) => (
                            <TextInput {...field} required
                                       placeholder={t("input.placeholder.firstName")} type="text" />
                          )}
                        </Field>
                      </InputGroup>
                      <DottedLinesContainer>
                        <DottedLines />
                      </DottedLinesContainer>
                      <InputGroup>
                        <InputLabel>
                          {t("flightsCheckout.main.lastName")}
                        </InputLabel>
                        <Field name={`passengers[${index}].lastName`}>
                          {({ field }: any) => (
                            <TextInput {...field} required placeholder={t("input.placeholder.lastName")} type="text" />
                          )}
                        </Field>
                      </InputGroup>

                    </FormGroup>
                    {
                      !passenger.isAdult &&

                      <FormGroup>
                        <InputGroup>
                          <InputLabel>
                            {t("flightsCheckout.main.childAge")}
                          </InputLabel>
                          <Field name={`passengers[${index}].age`}>
                            {({ field }: any) => (
                              <TextInput {...field} required placeholder="E.G. 12" min={0} type="number" />
                            )}
                          </Field>
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
                  {(t("flightsCheckout.main.contactDetails"))}
                </PassengerHeader>
              </PassengerHeaderContainer>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.firstName")}
                  </InputLabel>
                  <Field name={`contact.firstName`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder={t("input.placeholder.firstName")} type="text" />
                    )}
                  </Field>
                </InputGroup>
                <DottedLinesContainer>
                  <DottedLines />
                </DottedLinesContainer>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.lastName")}
                  </InputLabel>
                  <Field name={`contact.lastName`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder={t("input.placeholder.lastName")} type="text" />
                    )}
                  </Field>
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.phoneNumber")}
                  </InputLabel>
                  <Field name={`contact.phoneNumber`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. +30 645 654 9850" type="tel" />
                    )}
                  </Field>
                </InputGroup>
                <DottedLinesContainer>
                  <DottedLines />
                </DottedLinesContainer>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.emailAddress")}
                  </InputLabel>
                  <Field name={`contact.emailAddress`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. john.smith@example.com" type="email" />
                    )}
                  </Field>
                  {
                    errors.contactEmail &&
                    <ErrorText>{errors.contactEmail}</ErrorText>
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.country")}
                  </InputLabel>
                  <StyledField name={`contact.country`} required as="select" style={{ background: "none" }}>
                    <option style={{ color: "#ADADAD" }} disabled value="">E.G. United Kingdom</option>
                    <option value="spain">Spain</option>
                    <option value="morocco">Morocco</option>
                    <option value="romania">Romania</option>
                  </StyledField>
                </InputGroup>
              </FormGroup>

            </PassengerItem>

            <PassengerItem>
              <PassengerHeaderContainer>
                <PassengerHeader>
                  {(t("flightsCheckout.main.invoiceDetails"))}
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
                    {t("flightsCheckout.main.firstName")}
                  </InputLabel>
                  <Field name={`invoice.firstName`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder={t("input.placeholder.firstName")} type="text" />
                    )}
                  </Field>
                </InputGroup>
                <DottedLinesContainer>
                  <DottedLines />
                </DottedLinesContainer>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.lastName")}
                  </InputLabel>
                  <Field name={`invoice.lastName`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder={t("input.placeholder.lastName")} type="text" />
                    )}
                  </Field>
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.phoneNumber")}
                  </InputLabel>
                  <Field name={`invoice.phoneNumber`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. +30 645 654 9850" type="tel" />
                    )}
                  </Field>
                </InputGroup>
                <DottedLinesContainer>
                  <DottedLines />
                </DottedLinesContainer>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.emailAddress")}
                  </InputLabel>
                  <Field name={`invoice.emailAddress`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. john.smith@example.com" type="email" />
                    )}
                  </Field>
                  {
                    errors.invoiceEmail &&
                    <ErrorText>{errors.invoiceEmail}</ErrorText>
                  }
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.country")}
                  </InputLabel>
                  <StyledField name={`invoice.country`} required as="select" style={{ background: "none" }}>
                    <option style={{ color: "#ADADAD" }} disabled value="">E.G. United Kingdom</option>
                    <option value="spain">Spain</option>
                    <option value="morocco">Morocco</option>
                    <option value="romania">Romania</option>
                  </StyledField>
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.address")}
                  </InputLabel>
                  <Field name={`invoice.address`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. 64 Notley Street" type="text" />
                    )}
                  </Field>
                </InputGroup>
                <DottedLinesContainer>
                  <DottedLines />
                </DottedLinesContainer>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.city")}
                  </InputLabel>
                  <Field name={`invoice.city`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. London" type="text" />
                    )}
                  </Field>
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup>
                  <InputLabel>
                    {t("flightsCheckout.main.zipCode")}
                  </InputLabel>
                  <Field name={`invoice.zipCode`}>
                    {({ field }: any) => (
                      <TextInput {...field} required placeholder="E.G. 40741" type="text" />
                    )}
                  </Field>
                </InputGroup>
              </FormGroup>
            </PassengerItem>
            <ButtonsContainer>
              <CustomButton data-testid="test-previous-button"
                            onClick={() => setCurrentStep((prev: number) => prev - 1)}>
                {t("flightsCheckout.main.previousStep")}
                <span>
                                    {currentStep - 1}
                                </span>
              </CustomButton>
              <CustomButton data-testid="test-next-button" type="submit" isActive disabled={isSubmitting}>
                {t("flightsCheckout.main.nextStep")}
                <span>
                                    {currentStep + 1}
                                </span>
              </CustomButton>
            </ButtonsContainer>
          </Form>
        )}
      </Formik>
    </PassengerDetails>
  );
};

export default SecondStep;