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
import {ILoginCredentials} from "../types/types";
import {useAuthentication} from "../context/auth.context";
import useWsContext from "../../../context/SocketContext";
import {useCallback} from "react";
import {useRouter} from "next/router";
import Layout from "../components/Layout";

const LoginPage = ({ websiteName, colorScheme }: any) => {

    const t = useTranslations()

    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")

    const {ws} = useWsContext();
    const {user, setUser} = useAuthentication();
    const router = useRouter();

    const breadcrumbs = {
        login: "Log in"
    }

    const useLogin = useCallback(async (values: ILoginCredentials) => {
        try{
            const response = await ws.sendMessage({
                api: "auth",
                act: "login",
                payload: {
                    data: {
                        email: values.email,
                        password: values.password
                    }
                }
            });

            if(response){
                if(response.token){
                    await setProfile(response)
                } else {
                    setError(response.error)
                }
            }

        }catch(err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }, [ws])

    const setProfile = async (_user: any) => {
        setUser(_user)
        if(localStorage){
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(_user))
        }
        await router.push('/client-area')
    }

    React.useEffect(() => {
        if((user || user.token != "") && user.token){
            router.push('/client-area')
        }
    }, [])

    return (
        <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin isOrange>
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
                                    await useLogin(values)
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
                                            {
                                                error &&
                                                <ErrorText>{error}</ErrorText>
                                            }
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
        </Layout>
    );
};

export default LoginPage;