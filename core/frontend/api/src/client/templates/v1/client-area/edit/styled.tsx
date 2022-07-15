import styled from "styled-components";
import {size} from "../styled";
import Image from "next/image"
import {Field} from "formik";

export const EditWrapper = styled.div`
    padding: 64px;
    
    @media screen and (max-width: ${size.laptop}){
    padding: 0;
    }
`;

export const EditOuter = styled.div`
  border-radius: 12px;
  display: flex;
  gap: 20px;
  padding: 20px;

  @media screen and (max-width: ${size.tablet}){
    align-items: center;
    padding: 0;
  }
`

export const EditClientMainInfos = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  gap: 15px;

  @media screen and (max-width: ${size.tablet}){
    gap: 10px;
  }
`

export const EditProfileMainInfosContainer = styled.div`
  border-radius: 12px;
  width: 100%;
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  div:first-child {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
    align-items: stretch;
  }
`

export const EditProfilePicture = styled.div`
  width: 180px;
  height: 180px;
  min-width: 144px;
  border-radius: 50%;
  display:flex;
  align-items: center;
  position: relative;
  justify-content: center;
  padding: 8px;
  background: ${({theme}) => theme.colors.primaryLight};
  cursor: pointer;

  @media screen and (max-width: ${size.tablet}){
    width: 80px;
    height: 80px;
    min-width: 80px !important;
  }
  
  div{
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .profilePictureOnHover{
    position: absolute;
    width: 100%;
    height: 50%;
    opacity: 0;

    display: flex;
    
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    
    bottom: 0;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    background: rgba(0,0,0, .5);
    z-index: 10;

    @media screen and (max-width: ${size.tablet}){
      width: 100%;
      height: 100%;
      border-radius: 50% !important;
    }
    
    transition: .2s opacity ease-in-out;
    
    & > p{
      margin: 0;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 1.5;
      color: ${({theme}) => theme.colors.white};
      @media screen and (max-width: ${size.tablet}){
        display: none;
      }
    }
  }
  
  &:hover{
    .profilePictureOnHover{
      opacity: 1;
      transition: .2s opacity ease-in-out;
    }
  }

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  
`

export const ProfilePicture = styled(Image)`
  width: 100%;
  height: 100%;
`

export const EditProfileContainer = styled.div`
  
`

export const EditProfileText = styled.h3`
  padding-left: 16px;
  color: ${({theme}) => theme.colors.black};
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: clamp(18px, 5vw, 24px);
  line-height: 1.5;
  margin: 0;

  @media screen and (max-width: ${size.tablet}){
    padding-left: 0;
  }
`

export const EditProfileFormContainer = styled.div`
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  
  p{
    color: ${({theme}) => theme.colors.primaryColor};
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 1.25;
    margin: 0 0 25px 0;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  gap: 20px;
`

export const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  
  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
  }
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`

export const InputLabel = styled.label`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
  color: ${({theme}) => theme.colors.jetBlack};
`

export const TextInput = styled.input`
  width: 100%;
  outline: none;
  padding: 11px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  border: 1px ${({theme}) => theme.colors.greyBorder } solid;
  line-height: 1.5;
  color: ${({theme}) => theme.colors.jetBlack};
  box-shadow: -1px -1px 4px rgba(38, 184, 147, 0.2), 2px 2px 4px rgba(38, 184, 147, 0.1);
  border-radius: 8px;

  ::placeholder{
    color: #ADADAD;
  }
  
  :is(.passwordInput){
    position: relative;
  }
`

export const NewPasswordTextInput = styled.input<{isValid?: boolean}>`
  width: 100%;
  outline: none;
  padding: 11px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  border: 1px ${({theme, isValid}) => isValid ? theme.colors.greyBorder : theme.colors.primaryRed } solid;
  line-height: 1.5;
  color: ${({theme}) => theme.colors.jetBlack};
  box-shadow: -1px -1px 4px rgba(38, 184, 147, 0.2), 2px 2px 4px rgba(38, 184, 147, 0.1);
  border-radius: 8px;

  ::placeholder{
    color: #ADADAD;
  }

  :is(.passwordInput){
    position: relative;
  }
`

export const ButtonsContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 25px;

  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
    gap: 25px;
  }
`

export const StyledField= styled(Field)`
  outline: none;
  border: 1px solid ${({theme}) => theme.colors.greyBorder};
  border-radius: 10px;
  padding: 11px 5px;
  font-size: 18px;
  max-width: 75px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
  color: ${({theme}) => theme.colors.jetBlack};
  cursor: pointer;
`

export const ChangeDetailsText = styled.h4`
  font-family: 'Lexend', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 25px 0;
  
  color: ${({theme}) => theme.colors.primaryColor};
`

export const ErrorText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  margin:0;

  color: ${({theme}) => theme.colors.primaryRed};
`

export const SuccessText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.5;
  margin:0;
  padding: 8px 10px;
  border-radius: 5px;
  
  color: rgba(39, 174, 96,1.0);
  background: rgba(46, 204, 113,.3);
`

export const FatalErrorText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.5;
  margin:0;
  padding: 8px 10px;
  border-radius: 5px;

  color: rgba(192, 57, 43,1.0);
  background: rgba(231, 76, 60, .3);
`

export const SubmitButton = styled.button`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  border-radius: 50px;
  font-family: 'Lexend', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  color: ${({theme}) => theme.colors.white};
  cursor: pointer;
  border: none;
  outline: none;
  padding: 16px 36px;

  :is(:disabled){
    cursor: not-allowed;
    background: linear-gradient(180deg, #D0D0D0 0%, #919191 100%) !important;
  }
`

export const PhoneFieldsContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`

export const DiscardButton = styled.button`
  font-family: 'Lexend', sans-serif;
  border: none;
  outline: none;
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  background: none;
  
  color: ${({theme}) => theme.colors.primaryColor};
`