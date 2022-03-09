import Logo from "./Logo";
import LinkItem from './LinkItem'

import {HeaderContainer, HeaderWrapper, List} from './styled'

const Header = (props: any)  => {
    const links = props.links;

    return(
       <HeaderContainer>
           <HeaderWrapper>
               <Logo />
               <List>
                   {
                       links.map((link:any) => <LinkItem {...link} />)
                   }
               </List>
           </HeaderWrapper>
       </HeaderContainer>
    )
}


Header.defaultProps = {
    links: [
        {
            linkText: "Home",
            linkSlug: "home",
        },
        {
            linkText: "About Us",
            linkSlug: "about-us",
        },
        {
            linkText: "Services",
            linkSlug: "services",
        },
        {
            linkText: "Contact Us",
            linkSlug: "contact-us",
        },
    ]
}

export default Header;

