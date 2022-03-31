import Logo from "./Logo";
import LinkItem from './LinkItem'
import {HeaderContainer, HeaderWrapper, IconWrapper, InputSearch, InputWrapper, List} from './styled'
import * as React from "react";



const Header = (props: any) => {
    const links = props.links;

    return (
        <HeaderContainer>
            <HeaderWrapper data-testid='header-wrapper'>
                <Logo/>
                <List>
                    {
                        links.map((link: any, index: number) => <LinkItem key={`${index}`} {...link} />)
                    }
                </List>
                <InputWrapper>
                    <InputSearch data-testid='header-search-input' style={{height: '50px', width: '325px'}} type="search" placeholder={"Your Perfect Vacation ..."} />
                    <IconWrapper>
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8.5" cy="8.5" r="7" stroke="#F5803E" stroke-width="3"/>
                            <line x1="14.6415" y1="14.6615" x2="22.0758" y2="22.3026" stroke="#F5803E" stroke-width="2"/>
                        </svg>
                    </IconWrapper>
                </InputWrapper>
            </HeaderWrapper>
        </HeaderContainer>
    )
}


Header.defaultProps = {
    links: [
        {
            linkText: "Activities",
            linkSlug: "activities",
        },
        {
            linkText: "Hotel",
            linkSlug: "hotel",
        },
        {
            linkText: "Package",
            linkSlug: "package",
        },
    ]
}

export default Header;
