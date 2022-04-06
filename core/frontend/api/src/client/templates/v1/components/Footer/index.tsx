import {FooterContainer, StyledFooterList, StyledSocialLink, StyledFooterListItem, CustomInputStyled, StyledFooterSearchContainer} from "./styled";
import Link from "next/link"
import Image from "next/image"
import {useState} from "react";
import  Facebook from "../../assets/img/fb-icon.svg"
import  Twitter from "../../assets/img/twitter-icon.svg"
import  Instagram from "../../assets/img/ig-icon.svg"

const Footer = (props: any) => {

    const {links, _links, socialMedia} = props
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const handleNewsletterEmail = (e: any) => {
        e.preventDefault()
        setNewsletterEmail(e.target.value)
    }

    return(
        <FooterContainer>
            <div>
                <div>
                    <StyledFooterList>
                        {
                            links.map((link: any, index: number) => (
                                <StyledFooterListItem key={index}>
                                    <Link href={link.path}>
                                        <a>{link.label}</a>
                                    </Link>
                                </StyledFooterListItem>
                            ))
                        }
                    </StyledFooterList>

                    <StyledFooterList>
                        {
                            _links.map((link: any, index: number) =>(
                                <StyledFooterListItem key={index}>
                                    <Link href={link.path}>
                                        <a>{link.label}</a>
                                    </Link>
                                </StyledFooterListItem>
                            ))
                        }
                    </StyledFooterList>

                    <StyledFooterSearchContainer>
                        <h3>
                            Subscribe to our newsletter
                        </h3>
                        <CustomInputStyled>
                            <input type="email" placeholder="Email Address" value={newsletterEmail} onChange={handleNewsletterEmail} />
                            <button>OK</button>
                        </CustomInputStyled>
                    </StyledFooterSearchContainer>
                </div>
                <div>
                    {
                        socialMedia.map((sm: any, index: number)=>(
                            <StyledSocialLink key={index} href={sm.path}>
                                <a>
                                    <Image src={sm.icon} /> {sm.label}
                                </a>
                            </StyledSocialLink>
                        ))
                    }
                </div>
            </div>
        </FooterContainer>
    )
}

Footer.defaultProps = {
    links:[
        {
            label: 'About Us',
            path: 'about-us'
        },
        {
            label: 'Contact',
            path: 'contact'
        },
        {
            label: 'Disclaimer',
            path: 'disclaimer'
        },

    ],
    _links:[
        {
            label: 'Useful Information',
            path: 'useful-information'
        },
        {
            label: 'File a complaint',
            path: 'file-a-complaint'
        },
        {
            label: 'Working Hours',
            path: 'working-hours'
        },
    ],
    socialMedia: [
        {
            label: 'Facebook',
            icon: Facebook,
            path: 'https://www.facebook.com'
        },
        {
            label: 'Twitter',
            icon: Twitter,
            path: 'https://www.twitter.com'
        },
        {
            label: 'Instagram',
            icon: Instagram,
            path: 'https://www.Instagram.com'
        }
    ]
}



export default Footer