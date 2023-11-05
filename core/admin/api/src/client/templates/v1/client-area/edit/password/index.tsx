import * as React from 'react';
import {useAuthentication} from "../../../../../context/AuthContext";
import Layout from "../../../components/Layout";
import {useTranslations} from "next-intl";
import {
    ButtonsContainer, ChangeDetailsText,
    Container, DiscardButton,
    EditClientMainInfos,
    EditOuter, EditProfileContainer, EditProfileFormContainer,
    EditProfileMainInfosContainer,
    EditProfilePicture, EditProfileText,
    EditWrapper, ErrorText, FatalErrorText, FormGroup, InputGroup, InputLabel,
    ProfilePicture, SubmitButton, SuccessText, TextInput
} from "../styled";
import {
    ClientGreetings,
    Text
} from "../../styled";
import ProfileDefault from "../../../assets/img/accounts/profile-default.png";
import ChangeIcon from "../../../assets/img/accounts/changePicture-icon.svg";

import {useRouter} from "next/router";
import Image from "next/image";
import {Field, Form, Formik} from 'formik';
import UseAuth from "../../../../../auth/auth";
import jwtDecode from "jwt-decode";

const EditPage = ({ websiteName, colorScheme, websiteSlogan }: any) => {

    const {user, isAuthenticated, isLoading, setIsLoading} = useAuthentication()

    const breadcrumbs = {
        clientArea: "Client Area"
    }

    const t = useTranslations()
    const router = useRouter();

    const [err, setErr] = React.useState<string>('')
    const [success, setSuccess] = React.useState<string>('')

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
    const useUpdatePassword = async (oldPassword: string, newPassword: string) => {
        try{
            const token = await checkTokens()
            if(token){
                const response = await UseAuth.useCheckPassword(token, oldPassword)
                if(response && response.status === 200){
                    if(response.data.isMatch === true){
                        const update_response = await UseAuth.useUpdatePassword(token, newPassword)
                        if(update_response && update_response.status === 200){
                            if(update_response.data.updated === true){
                                setSuccess('Password has been updated successfully.')
                                return true;
                            }
                            else{
                                setErr(t('global.errors.passwordUpdateError'))
                            }
                        } else{
                            setErr(t('global.errors.passwordUpdateError'))
                        }
                    }
                    else{
                        setErr(t('global.errors.passwordMismatch'))
                    }
                }
                else{
                    setErr(t('global.errors.passwordUpdateError'))
                }
                return false;
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
                    <Layout websiteName={websiteName} websiteSlogan={websiteSlogan} colorScheme={colorScheme} breadcrumbs={breadcrumbs} isLogin>
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
                                                    {t('clientArea.edit.password.updateInfos')}
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
                                            {t('clientArea.edit.password.changePassword')}
                                        </ChangeDetailsText>
                                        <Formik
                                            initialValues={{
                                                oldPassword: "",
                                                newPassword: "",
                                                newPasswordConfirm: "",
                                            }}
                                            onSubmit={async (values, actions) => {
                                                actions.setSubmitting(true)
                                                setErr('')
                                                setSuccess('')
                                                if(values.newPassword === values.newPasswordConfirm && values.oldPassword){
                                                    const res = await useUpdatePassword(values.oldPassword, values.newPassword)
                                                    if(res){
                                                        actions.resetForm()
                                                    }
                                                }
                                                actions.setSubmitting(false)
                                            }}
                                            enableReinitialize
                                            validate={(values) =>
                                                {
                                                    const errors: any = {};
                                                    if (!values.oldPassword) {
                                                        errors.oldPassword = 'Current Password required.';
                                                    } else if(!values.newPassword){
                                                        errors.newPassword = 'New Password required.';
                                                    } else if(values.newPassword && values.newPassword.length < 8){
                                                        errors.newPassword = 'Password should be at least 8-16 characters long.';
                                                    } else if(values.newPassword &&
                                                        values.newPassword.length > 8 &&
                                                        values.newPasswordConfirm !== values.newPassword){
                                                        errors.newPasswordConfirm = 'Password must match.';
                                                    }

                                                    return errors;
                                                }
                                            }
                                        >
                                            {({errors, isSubmitting, resetForm}: any) => (
                                                <Form style={{width: "100%"}}>
                                                    <Container>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.edit.password.currentPassword')}
                                                                </InputLabel>
                                                                <Field name={`oldPassword`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.edit.password.currentPassword')}
                                                                                   type="password"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {
                                                                   ( errors && errors.oldPassword) &&
                                                                    <ErrorText>
                                                                        {errors.oldPassword}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.edit.password.newPassword')}
                                                                </InputLabel>
                                                                <Field name={`newPassword`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.edit.password.newPassword')}
                                                                                   type="password"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {
                                                                    ( errors && errors.newPassword) &&
                                                                    <ErrorText>
                                                                        {errors.newPassword}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <InputGroup>
                                                                <InputLabel>
                                                                    {t('clientArea.edit.password.newPasswordConfirm')}
                                                                </InputLabel>
                                                                <Field name={`newPasswordConfirm`}>
                                                                    {({field}: any) => (
                                                                        <TextInput {...field} required
                                                                                   placeholder={t('clientArea.edit.password.newPasswordConfirm')}
                                                                                   type="password"
                                                                        />
                                                                    )}
                                                                </Field>
                                                                {
                                                                    ( errors && errors.newPasswordConfirm) &&
                                                                    <ErrorText>
                                                                        {errors.newPasswordConfirm}
                                                                    </ErrorText>
                                                                }
                                                            </InputGroup>
                                                        </FormGroup>
                                                        {
                                                            err.length > 0 &&
                                                            <FatalErrorText>
                                                                {err}
                                                            </FatalErrorText>
                                                        }
                                                        {
                                                            success.length > 0 &&
                                                            <SuccessText>
                                                                {success}
                                                            </SuccessText>
                                                        }
                                                        <ButtonsContainer>
                                                            <SubmitButton type="submit" role="submit" disabled={isSubmitting}>
                                                                {t('clientArea.edit.saveChanges')}
                                                            </SubmitButton>
                                                            <DiscardButton type={"button"} onClick={resetForm}>
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