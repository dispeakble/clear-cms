import Logo from "./Logo";
import LinkItem from './LinkItem'

import {HeaderContainer, HeaderWrapper, IconWrapper, InputSearch, InputWrapper, List} from './styled'
import Languages from "./Languages";
import Image from "next/image";

import searchIcon from "../"

const Header = (props: any) => {
    const links = props.links;

    return (
        <HeaderContainer>
            <HeaderWrapper data-testid='header-wrapper'>
                <Logo/>
                <List>
                    {
                        links.map((link: any, i: number) => <LinkItem {...link} key={`link-${i}`}/>)
                    }
                </List>
                <InputWrapper>
                    <InputSearch data-testid='header-search-input' style={{height: '50px', width: '325px'}} type="search" placeholder={"Your Perfect Vacation ..."} />
                    <IconWrapper>
                        <Image src={searchIcon} />
                    </IconWrapper>
                </InputWrapper>
                <Languages/>
            </HeaderWrapper>
        </HeaderContainer>
    )
}

Header.defaultProps = {
    links: [
        {
            linkText: "home",
            linkSlug: "activities",
        },
        {
            linkText: "hotels",
            linkSlug: "hotels",
        },
        {
            linkText: "packages",
            linkSlug: "packages",
        },
    ],
};

export default Header;