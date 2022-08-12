import * as React from "react";
import { ThemeProvider } from "styled-components";
import Header from "../components/Header";
import {
  GlobalStyle,
  MainWrapper,
  TopContentWrapper, Wrapper
} from "../styled";
import Breadcrumbs from "../components/Breadcrumbs";
import Luggage from "../assets/img/login/luggage.png";
import Image from "next/image";
import { getIcon } from "../helpers/icons";
import Footer from "../components/Footer";
import { useTranslations } from "next-intl";
import {
  FormGroup,
  InputContainer,
  InputGroup,
  LoginFormWrapper,
  LoginWrapper,
  StyledLoginTitle,
  ErrorText,
  InputLabel,
  TextInput,
  RememberMeContainer,
  StyledCheckboxLabel,
  ForgotPassword,
  ButtonContainer,
  ContinueButton,
  InformationText,
  ImageContainer,
  Container
} from "./styled";
import { Formik, Field, Form } from "formik";
import Link from "next/link";

const PasswordResetPage = ({ websiteName, colorScheme }: any) => {

  const t = useTranslations();

  const getIcons = (iconName: string) => {
    return getIcon(iconName);
  };

  const [resetEmail, setResetEmail] = React.useState("");

  const myTheme: any = { colors: colorScheme, icon: getIcons };


  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <MainWrapper data-testid="hotel-page-wrapper" isOrange>
        <TopContentWrapper>
          <Header websiteName={websiteName} />
        </TopContentWrapper>
        <Wrapper isBreadcrumb>
          <Breadcrumbs clientArea={"Client Area"} passwordReset={"Password Reset"} />
        </Wrapper>
        <Wrapper isLogin>
          <LoginWrapper>
            <ImageContainer>
              <Image src={Luggage} alt="luggage-login" className="loginImage" width={540} height={735} />
            </ImageContainer>
            <LoginFormWrapper>
              <StyledLoginTitle>
                {t("auth.passwordReset.title")}
              </StyledLoginTitle>
              <InputContainer>
                <Formik
                  initialValues={{
                    email: ""
                  }}
                  enableReinitialize
                  validate={(values) => {
                    const errors: any = {};
                    if (!values.email) {
                      errors.email = "Email required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                      errors.email = "Invalid email address";
                    }
                    return errors;
                  }
                  }
                  onSubmit={
                    (values, actions) => {
                      actions.setSubmitting(true);
                      setResetEmail(values.email);
                    }
                  }
                >
                  {({ errors, isSubmitting }: any) => (
                    <Form style={{ width: "100%" }}>
                      <Container>
                        <div>
                          <FormGroup>
                            <InputGroup>
                              <InputLabel>
                                {t("auth.login.email")}
                              </InputLabel>
                              <Field name={`email`}>
                                {({ field }: any) => (
                                  <TextInput {...field} required
                                             placeholder={t("input.placeholder.login.email")}
                                             icon="loginEmail"
                                             type="email"
                                             data-testid="test-email-resetPassword"
                                  />
                                )}
                              </Field>
                              {
                                errors.email &&
                                <ErrorText>{errors.email}</ErrorText>
                              }
                            </InputGroup>
                            <InputGroup>
                              <InformationText>
                                {t("auth.passwordReset.infos")}
                              </InformationText>
                            </InputGroup>
                          </FormGroup>
                        </div>
                        <div>
                          <ButtonContainer>
                            <ContinueButton disabled={isSubmitting} type="submit">
                              {t("auth.login.continue")}
                            </ContinueButton>
                          </ButtonContainer>
                          <InformationText>
                            {t("auth.login.dontHaveAccount")}
                            <Link href="/register">
                              {t("auth.login.registerHere")}
                            </Link>
                          </InformationText>
                        </div>
                      </Container>
                    </Form>
                  )}
                </Formik>
              </InputContainer>
            </LoginFormWrapper>
          </LoginWrapper>
        </Wrapper>
        <Footer />
      </MainWrapper>
    </ThemeProvider>
  );
};

export default PasswordResetPage;