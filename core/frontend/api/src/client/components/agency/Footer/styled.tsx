import styled from "styled-components";
import {Colors, Widths} from "../../../assets/design-set";

export const FooterWrapper = styled.footer`
  margin-top: 120px;
`

export const TopSection = styled.section`
  background-color: ${Colors.primaryColor};
  padding: 24px 0px;
`

export const BottomSection = styled(TopSection)`
  background-color: ${Colors.white};
`

export const Container = styled.div` width: 90%;
  max-width: ${Widths.containerWidth};
  margin: 0 auto;
`

export const BottomSectionWrapper = styled.div`
  display: flex;
`

export const TermsHeading = styled.h5`
  margin: 8px 0px 0px 0px;
  font-size: 22px;
  text-transform: uppercase;
  font-weight: 300;
  color: ${Colors.white};
`
export const TermsDescription = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #ccc;
`

export const LinkList = styled.ul`
  flex: 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
`

export const LinkItem = styled.a`
  font-size: 23px;
  color: #868484;
  text-decoration: none;
  :hover {
    color: inherit;
  }
`

export const InputContainer = styled.div`
  display: flex;
  margin-top: 16px;
`
export const InputSearch = styled.input`
  height: 60px;
  width: 270px;
  border: 1px solid ${Colors.primaryColor};
  padding: 16px;
  outline: none;
`

export const InputSearchBtn = styled.button`
  margin: 0;
  outline: none;
  border: none;
  background-color: ${Colors.primaryColor};
  color: white;
  padding: 0px 24px;
  cursor:pointer;
`

export const FooterBottomBar = styled.div`
  padding-bottom: 24px;
  background-color: ${Colors.white};
`

export const FooterBarContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
`

export const SocialIconButton = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  color: ${Colors.primaryColor};
  cursor:pointer;

  span {
    margin-left: 10px;
    font-weight: 500;
    color: ${Colors.black};
  }
`

export const NewsLetterTitle = styled.h5`
  font-size: 25px;
  color: #868484;
  text-decoration: none;
  font-weight: 600;
  margin: 0;
`