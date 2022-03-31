import React from 'react';

import {FooterWrapper,TopSection,BottomSection,FooterBarContainer,SocialIconButton,FooterBottomBar,BottomSectionWrapper,Container,TermsDescription,TermsHeading ,LinkList ,LinkItem,InputContainer,InputSearch,InputSearchBtn,NewsLetterTitle} from './styled'

import {Facebook, Instagram, Twitter} from '@material-ui/icons'

const Footer = ({sitemapLinks, impLinks}) => {
    return (
        <FooterWrapper data-testid="footer-wrapper">
            <TopSection data-testid='footer-top-section'>
                <Container>
                    <TermsHeading data-testid="footer-terms-heading">Terms and conditions:</TermsHeading>
                    <TermsDescription data-testid='footer-terms-description'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                        fringilla sapien libero, non malesuada nisi lacinia vel. Nam eu
                        varius justo. Phasellus laoreet sapien augue, a accumsan turpis
                        dapibus vitae. Curabitur ac nibh felis. Sed eu metus quis eros
                        egestas rhoncus. Mauris tristique nisl commodo risus volutpat
                        porttitor. In turpis turpis, ornare sed maximus eu, iaculis et
                        metus. Aliquam rutrum enim lacus. Integer quis tincidunt urna.
                        Quisque pretium fermentum felis vel porttitor lor sit amets egestas
                        rhoncus. Mauris tristique nisl commodo risus volutpat porttitor. In
                        turpis turpis, ornare sed maximus eu, iaculis et metus. Aliquam
                        rutrum enim lacus. Integer quis tincidunt urna. Quisque pretium
                        fermentum felis vel porttit
                    </TermsDescription>
                </Container>
            </TopSection>
            <BottomSection>
                <Container>
                    <BottomSectionWrapper>


                        <LinkList>
                            {
                                sitemapLinks.map((link, index) => <li key={`${index}`}><LinkItem href={link.linkURL}>{link.text}</LinkItem></li>)
                            }

                        </LinkList>
                        <LinkList>
                            {
                                impLinks.map((link, index) => <li key={`${index}`}><LinkItem href={link.linkURL}>{link.text}</LinkItem></li>)
                            }
                        </LinkList>
                        <LinkList>
                            <li><NewsLetterTitle data-testid='newsletter-title'>Subscribe To Our Newsletter</NewsLetterTitle></li>
                            <li>
                                <InputContainer>
                                    <InputSearch className="input" type="text" placeholder="Email Address"/>
                                    <InputSearchBtn className="input_btn">OK</InputSearchBtn>
                                </InputContainer>
                            </li>
                        </LinkList>
                    </BottomSectionWrapper>
                </Container>
            </BottomSection>
            <FooterBottomBar>
                <FooterBarContainer>
                    <SocialIconButton>
                        <Facebook/> <span data-testid='facebook'>Facebook</span>
                    </SocialIconButton>
                    <SocialIconButton>
                        <Instagram/> <span data-testid='instagram'>Instagram</span>
                    </SocialIconButton>
                    <SocialIconButton>
                        <Twitter/> <span data-testid='twitter'>Twitter</span>
                    </SocialIconButton>
                </FooterBarContainer>
            </FooterBottomBar>
        </FooterWrapper>
    )
}


Footer.defaultProps = {
    sitemapLinks: [
        {
            linkURL: 'about-us',
            text: 'About Us'
        },
        {
            linkURL: 'contact',
            text: 'Contact'
        },
        {
            linkURL: 'disclaimer',
            text: 'Disclaimer'
        },
    ],
    impLinks: [
        {
            linkURL: 'useful-information',
            text: 'Useful Information'
        },
        {
            linkURL: 'file-a-complaint',
            text: 'File a complaint'
        },
        {
            linkURL: 'working-hours',
            text: 'Working Hours'
        },
    ]
}

export default Footer;
