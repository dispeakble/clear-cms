import * as React from "react";
import { ThemeProvider } from "styled-components";
import Header from "../components/Header";
import {
    GlobalStyle,
    MainWrapper,
    TopContentWrapper, Wrapper
} from "../styled";
import Breadcrumbs from "../components/Breadcrumbs";
import Luggage from "../assets/img/login/luggage.png"
import ShowPassword from "../assets/img/login/showPassword-icon.svg"
import Image from "next/image"
import { getIcon } from "../helpers/icons";
import Footer from "../components/Footer";
import {useTranslations} from "next-intl";
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
    ImageContainer, Container, ShowPasswordIcon, ShowPasswordContainer
} from "./styled";
import {Formik, Field, Form} from "formik";
import Link from "next/link";
import useAuth from "../auth/useAuth";
import {ILoginCredentials} from "../types/types";
import {useAuthentication} from "../context/auth.context";

const LoginPage = ({ websiteName, colorScheme }: any) => {

    const t = useTranslations()

    const getIcons = (iconName: string) => {
        return getIcon(iconName);
    };

    const [showPassword, setShowPassword] = React.useState<boolean>(false)

    const myTheme: any = { colors: colorScheme, icon: getIcons };

    const useLogin = async (values: ILoginCredentials) => {
        console.log("useLogin values:", values)
        try{
            const response = await useAuth.login(values);
            if(response && response.data.user) {
                console.log("new")
            } else if(response && response.data.error){
                return;
            }
        }catch(err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }


    return (
        <ThemeProvider theme={myTheme}>
            <GlobalStyle />
            <MainWrapper data-testid="hotel-page-wrapper" isOrange>
                <TopContentWrapper>
                    <Header websiteName={websiteName} />
                </TopContentWrapper>
                <Wrapper isBreadcrumb>
                    <Breadcrumbs clientArea={"Client Area"} login={"Log in"} />
                </Wrapper>
                <Wrapper isLogin>
                    <LoginWrapper>
                        <ImageContainer>
                            <Image src={Luggage} alt="luggage-login" className="loginImage" width={540} height={735} />
                        </ImageContainer>
                        <LoginFormWrapper>
                            <StyledLoginTitle>
                                {t('auth.login.title')}
                            </StyledLoginTitle>
                            <InputContainer>
                                <Formik
                                    initialValues={{
                                        email: "",
                                        password: "",
                                        rememberMe: false
                                    }}
                                    enableReinitialize
                                    validate={(values) => {
                                            const errors: any = {};
                                            if (!values.email) {
                                                errors.email = 'Email required';
                                            } else if (
                                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                            ) {
                                                errors.email = 'Invalid email address';
                                            }

                                            if (!values.password) {
                                                errors.password = 'Password required';
                                            }
                                            return errors;
                                        }
                                    }
                                    onSubmit={
                                        async (values, actions) => {
                                            actions.setSubmitting(true)
                                            console.log("values")
                                            actions.setSubmitting(false)
                                        }
                                    }
                                >
                                    {({errors, isSubmitting}: any) => (
                                        <Form style={{width: "100%"}}>
                                            <Container>
                                                <div>
                                                    <FormGroup>
                                                        <InputGroup>
                                                            <InputLabel>
                                                                {t('auth.login.email')}
                                                            </InputLabel>
                                                            <Field name={`email`}>
                                                                {({field}: any) => (
                                                                    <TextInput {...field} required
                                                                               placeholder={t('input.placeholder.login.email')}
                                                                               icon="loginEmail"
                                                                               type="email"
                                                                               data-testid="test-email-login"
                                                                    />
                                                                )}
                                                            </Field>
                                                            {
                                                                errors.email &&
                                                                <ErrorText>{errors.email}</ErrorText>
                                                            }
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputLabel>
                                                                {t('auth.login.password')}
                                                            </InputLabel>
                                                            <Field name={`password`}>
                                                                {({field}: any) => (
                                                                    <TextInput {...field} required
                                                                               className={`passwordInput`}
                                                                               data-testid="test-password-login"
                                                                               placeholder={t('input.placeholder.login.password')} icon="loginPassword" type={showPassword ? `text` : `password`} />
                                                                )}
                                                            </Field>
                                                            <ShowPasswordContainer onClick={() => setShowPassword(!showPassword)} data-testid={"test-toggle-password-visibilty"} >
                                                                <ShowPasswordIcon src={ShowPassword} alt={"show-password"} width={20} height={18} />
                                                            </ShowPasswordContainer>

                                                            {
                                                                errors.password &&
                                                                <ErrorText>{errors.password}</ErrorText>
                                                            }
                                                        </InputGroup>
                                                    </FormGroup>
                                                    <RememberMeContainer>
                                                        <StyledCheckboxLabel data-testid="test-rememberMe-login" >
                                                            <Field type="checkbox" name="rememberMe" />
                                                            {t('auth.login.rememberMe')}
                                                        </StyledCheckboxLabel>
                                                        <ForgotPassword href="/passwordReset">
                                                            {t('auth.login.forgotPassword')}
                                                        </ForgotPassword>
                                                    </RememberMeContainer>
                                                </div>
                                                <div>
                                                    <ButtonContainer>
                                                        <ContinueButton data-testid="test-login-button" disabled={isSubmitting} type="submit" role="submit">
                                                            {t('auth.login.continue')}
                                                        </ContinueButton>
                                                    </ButtonContainer>
                                                    <InformationText>
                                                        {t('auth.login.dontHaveAccount')}
                                                        <Link href="/register">
                                                            {t('auth.login.registerHere')}
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

export default LoginPage;