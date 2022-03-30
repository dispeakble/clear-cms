import Logo from "./Logo";
import Link from "next/link"

import {HeaderWrapper, LogoWrapper, MenuWrapper, InputSearch, SearchWrapper, LanguagesWrapper} from './styled';
import Languages from "./Languages";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import Menu from "./Menu";

const Header = (props: any) => {
    const links: any[] = props.links;
    const t = useTranslations();

    useEffect(() => {
        window.addEventListener("mousewheel", (evt) => {
            console.log(evt);
        })
    }, []);

    return (
        <HeaderWrapper data-testid='header-wrapper'>
            <LogoWrapper>
                <Link href="/">
                    <a href="/">
                        <Logo/>
                    </a>
                </Link>

            </LogoWrapper>
            <MenuWrapper>
                <Menu links={links}/>
            </MenuWrapper>
            <LanguagesWrapper>
                <Languages/>
            </LanguagesWrapper>
            <SearchWrapper>
                <InputSearch data-testid='header-search-input' type="search" placeholder={t('global.search')} />
            </SearchWrapper>
        </HeaderWrapper>
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