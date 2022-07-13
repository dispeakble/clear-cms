import * as React from 'react';
import {useAuthentication} from "../../../../context/AuthContext";
import Layout from "../../components/Layout";
import {useTranslations} from "next-intl";
import {
    ButtonsContainer, ChangeDetailsText,
    Container, DiscardButton,
    EditClientMainInfos,
    EditOuter, EditProfileContainer, EditProfileFormContainer,
    EditProfileMainInfosContainer,
    EditProfilePicture, EditProfileText,
    EditWrapper, ErrorText, FormGroup, InputGroup, InputLabel, PhoneFieldsContainer,
    ProfilePicture, StyledField, SubmitButton, TextInput
} from "./styled";
import {
    ClientGreetings,
    Text
} from "../styled";
import ProfileDefault from "../../assets/img/accounts/profile-default.png";
import ChangeIcon from "../../assets/img/accounts/changePicture-icon.svg";

import {useRouter} from "next/router";
import Image from "next/image";
import {Field, Form, Formik} from 'formik';
import UseAuth from "../../../../auth/auth";
import jwtDecode from "jwt-decode";

const EditPage = ({ websiteName, colorScheme }: any) => {

    const {user, isAuthenticated, isLoading, setIsLoading} = useAuthentication()

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    const t = useTranslations()
    const router = useRouter();

    const redirect = (path: string) => {
        setIsLoading(true)
        router.push(path).then(() => setIsLoading(false))
    }

    const checkTokens = async () => {
        try{
            const getTokens: string = localStorage.getItem('tokens') as string
            const tokens = JSON.parse(getTokens)

            const isExpired = (token: string) => {
                const decodedToken:{exp: any} = jwtDecode(token)
                const currentDate = new Date()

                return decodedToken?.exp * 1000 < currentDate.getTime();
            }

            let response: any;

            if(tokens) {
                if (isExpired(tokens['access_token'])) {
                    response = await UseAuth.useRefreshToken(tokens['refresh_token'])
                    if(response && response?.status === 200){
                        return JSON.parse(localStorage.getItem('tokens') as string)['access_token']
                    }
                }
            }

            return tokens['access_token']
        } catch(err){
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    // @ts-ignore
    const useUpdate = async (values: any) => {
        try{
            const token = await checkTokens()
            if(token){
                await UseAuth.updateUser(token, values)
                return redirect(router.asPath)
            }

            return redirect('/')
        }catch(err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    }

    return(
        isLoading ? (
                <>
                    <h3>{t('global.loading')}</h3>
                </>
            ) :
            ((isAuthenticated && user) ?
                (
                    <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin>
                        <EditWrapper>
                            <EditOuter>
                                <EditClientMainInfos>
                                    <EditProfileMainInfosContainer>
                                        <div>
                                            <EditProfilePicture>
                                                <div>
                                                    <ProfilePicture
                                                        src={ProfileDefault}
                                                        alt="profile-picture"
                                                        layout="fill"
                                                        objectFit="contain"
                                                    />
                                                </div>
                                                <div className="profilePictureOnHover">
                                                    <Image src={ChangeIcon} alt={"change-icon"}/>
                                                    <p>
                                                        {t('clientArea.edit.uploadAvatar')}
                                                    </p>
                                                </div>
                                            </EditProfilePicture>
                                            <div>
                                                <ClientGreetings>
                                                    {t('clientArea.greetings', {name: user.firstName})}
                                                </ClientGreetings>
                                                <Text>
                                                    {t('clientArea.edit.updateInfos')}
                                                </Text>
                                            </div>
                                        </div>
                                    </EditProfileMainInfosContainer>
                                    <EditProfileContainer>
                                        <EditProfileText>
                                            {t('clientArea.editProfile')}
                                        </EditProfileText>
                                    </EditProfileContainer>
                                    <EditProfileFormContainer>
                                        <ChangeDetailsText>
                                            {t('clientArea.edit.changeDetails')}
                                        </ChangeDetailsText>
                                        <Formik
                                            initialValues={{
                                                firstName: user.firstName || "",
                                                lastName: user.lastName || "",
                                                email: user.email || "",
                                                phoneNumber: user.phoneNumber || "",
                                                prefix: user.phonePrefix || "+91",
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

                                                if (!values.firstName) {
                                                    errors.firstName = 'First name required!';
                                                } else if(values.firstName && values.firstName.length < 1) {
                                                    errors.firstName = 'First name should be at least 1 character!';
                                                }

                                                if (!values.lastName) {
                                                    errors.lastName = 'Last name required!';
                                                } else if(values.lastName && values.lastName.length < 1) {
                                                    errors.lastName = 'Last name should be at least 1 character!';
                                                }
                                                return errors;
                                            }
                                            }
                                            onSubmit={async (values, actions) => {
                                                actions.setSubmitting(true)
                                                await useUpdate(values)
                                                actions.setSubmitting(false)
                                            }}
                                        >
                                            {({errors, isSubmitting, resetForm}: any) => (
                                                <Form style={{width: "100%"}}>
                                                    <Container>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.firstName')}
                                                                </InputLabel>
                                                                <Field name={`firstName`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.firstName')}
                                                                                   type="text"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {(errors && errors.firstName) &&
                                                                    <ErrorText>
                                                                        {errors.firstName}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.lastName')}
                                                                </InputLabel>
                                                                <Field name={`lastName`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.lastName')}
                                                                                   type="text"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {(errors && errors.lastName) &&
                                                                    <ErrorText>
                                                                        {errors.lastName}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.email')}
                                                                </InputLabel>
                                                                <Field name={`email`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.email')}
                                                                                   type="email"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {(errors && errors.email) &&
                                                                    <ErrorText>
                                                                        {errors.email}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.phoneNumber')}
                                                                </InputLabel>
                                                                <PhoneFieldsContainer>
                                                                    <StyledField name={`prefix`} defaultValue="+91" required as="select">
                                                                        <option value="+91">+91</option>
                                                                        <option value="+212">+212</option>
                                                                        <option value="+1">+1</option>
                                                                    </StyledField>
                                                                    <Field name={`phoneNumber`}>
                                                                        {({field}: any) => (
                                                                            <TextInput {...field} required
                                                                                       placeholder={'9120000000'}
                                                                                       type="phone"
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </PhoneFieldsContainer>
                                                            </InputGroup>
                                                        </FormGroup>

                                                        <ButtonsContainer>
                                                            <SubmitButton role="submit" disabled={isSubmitting}>
                                                                {t('clientArea.edit.saveChanges')}
                                                            </SubmitButton>
                                                            <DiscardButton onClick={resetForm}>
                                                                {t('clientArea.edit.discardChanges')}
                                                            </DiscardButton>
                                                        </ButtonsContainer>

                                                    </Container>
                                                </Form>
                                            )}
                                        </Formik>
                                    </EditProfileFormContainer>
                                </EditClientMainInfos>
                            </EditOuter>
                        </EditWrapper>
                    </Layout>
                ) : (<>
                    <h3>{t('global.redirecting')}</h3>
                </>))
    )
}

export default EditPage