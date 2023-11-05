import * as React from 'react';
import Luggage from '../assets/img/login/luggage.png';
import ShowPassword from '../assets/img/login/showPassword-icon.svg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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
  Container,
  ShowPasswordIcon,
  ShowPasswordContainer,
} from './styled';
import { Formik, Field, Form } from 'formik';
import Link from 'next/link';
import { ILoginCredentials } from '../../../types/types';
import { useAuthentication } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import UseAuth from '../../../auth/auth';
import ReCAPTCHA from 'react-google-recaptcha';
import { ContentWrapper, PaperWrapper } from '../styled';

const LoginPage = ({
  websiteName,
  websiteSlogan,
  colorScheme,
  recaptchaKey,
}: any) => {
  const t = useTranslations();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const { isLoading, isAuthenticated, setIsAuthenticated } =
    useAuthentication();
  const router = useRouter();
  const reCAPTCHARef =
    React.useRef<ReCAPTCHA>() as React.MutableRefObject<ReCAPTCHA>;

  const breadcrumbs = {
    login: 'Log in',
  };

  const useLogin = async (values: ILoginCredentials) => {
    try {
      const response = await UseAuth.useLogin(values);
      if (response && response?.status === 200) {
        setProfile(response.data);
      } else {
        setError(t('global.errors.credentialsMismatch'));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const setProfile = (tokens: any) => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    router.push('/client-area').then(() => {
      setIsAuthenticated(true);
    });
  };

  const isHuman = async (token: string) => {
    try {
      const response = await UseAuth.useValidateHuman(token);
      if (response && response?.status === 200) {
        return response.data;
      } else {
        setError(t('global.errors.recaptchaError'));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return isLoading ? (
    <>
      <h3>{t('global.loading')}</h3>
    </>
  ) : !isAuthenticated ? (
    <>
      <ReCAPTCHA sitekey={recaptchaKey} size="invisible" ref={reCAPTCHARef} />
      <Layout
        websiteName={websiteName}
        websiteSlogan={websiteSlogan}
        colorScheme={colorScheme}
        breadcrumbs={breadcrumbs}
        isLogin
      >
        <PaperWrapper>
          <ContentWrapper>
            <LoginWrapper>
              <ImageContainer>
                <Image
                  src={Luggage}
                  alt="luggage-login"
                  className="loginImage"
                  width={540}
                  height={735}
                />
              </ImageContainer>
              <LoginFormWrapper>
                <StyledLoginTitle>{t('auth.login.title')}</StyledLoginTitle>
                <InputContainer>
                  <Formik
                    initialValues={{
                      email: '',
                      password: '',
                      rememberMe: false,
                    }}
                    enableReinitialize
                    validate={(values) => {
                      const errors: any = {};
                      if (!values.email) {
                        errors.email = 'Email required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email,
                        )
                      ) {
                        errors.email = 'Invalid email address';
                      }

                      if (!values.password) {
                        errors.password = 'Password required';
                      }
                      return errors;
                    }}
                    onSubmit={async (values, actions) => {
                      try {
                        actions.setSubmitting(true);
                        const token =
                          await reCAPTCHARef?.current.executeAsync();

                        if (token) {
                          const verify = await isHuman(token);
                          if (verify) {
                            await useLogin(values as ILoginCredentials);
                          } else {
                            setError(t('global.errors.recaptchaError'));
                          }
                        } else {
                          setError(t('global.errors.errorOccurred'));
                        }
                        reCAPTCHARef.current.reset();
                        actions.setSubmitting(false);
                      } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error(err);
                      }
                    }}
                  >
                    {({ errors, isSubmitting }: any) => (
                      <Form style={{ width: '100%' }}>
                        <Container>
                          <div>
                            <FormGroup>
                              <InputGroup>
                                <InputLabel>{t('auth.login.email')}</InputLabel>
                                <Field name={`email`}>
                                  {({ field }: any) => (
                                    <TextInput
                                      {...field}
                                      required
                                      placeholder={t(
                                        'input.placeholder.login.email',
                                      )}
                                      icon="loginEmail"
                                      type="email"
                                      data-testid="test-email-login"
                                    />
                                  )}
                                </Field>
                                {errors.email && (
                                  <ErrorText>{errors.email}</ErrorText>
                                )}
                              </InputGroup>
                              <InputGroup>
                                <InputLabel>
                                  {t('auth.login.password')}
                                </InputLabel>
                                <Field name={`password`}>
                                  {({ field }: any) => (
                                    <TextInput
                                      {...field}
                                      required
                                      className={`passwordInput`}
                                      data-testid="test-password-login"
                                      placeholder={t(
                                        'input.placeholder.login.password',
                                      )}
                                      icon="loginPassword"
                                      type={showPassword ? `text` : `password`}
                                    />
                                  )}
                                </Field>
                                <ShowPasswordContainer
                                  onClick={() => setShowPassword(!showPassword)}
                                  data-testid={'test-toggle-password-visibilty'}
                                >
                                  <ShowPasswordIcon
                                    src={ShowPassword}
                                    alt={'show-password'}
                                    width={20}
                                    height={18}
                                  />
                                </ShowPasswordContainer>

                                {errors.password && (
                                  <ErrorText>{errors.password}</ErrorText>
                                )}
                              </InputGroup>
                            </FormGroup>
                            {error && <ErrorText>{error}</ErrorText>}
                            <RememberMeContainer>
                              <StyledCheckboxLabel data-testid="test-rememberMe-login">
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
                              <ContinueButton
                                data-testid="test-login-button"
                                disabled={isSubmitting}
                                type="submit"
                                role="submit"
                              >
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
          </ContentWrapper>
        </PaperWrapper>
      </Layout>
    </>
  ) : (
    <>
      <h3>{t('global.redirecting')}</h3>
    </>
  );
};

export default LoginPage;
