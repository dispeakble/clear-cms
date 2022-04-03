import Logo from "./Logo";
import Link from "next/link"

import {HeaderWrapper, LogoWrapper, MenuWrapper, InputSearch, SearchWrapper, LanguagesWrapper} from './styled';
import Languages from "./Languages";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import Menu from "./Menu";

const Header = (props: any) => {
    const links: any[] = props.links;
    const t = useTranslations();

    const [fixedHeader, setFixedHeader] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", (evt) => {
            if(window.pageYOffset > 50) {
                setFixedHeader(true);
            } else {
                setFixedHeader(false);
            }
        })
    }, []);

    return (
        <HeaderWrapper data-testid='header-wrapper' className={fixedHeader ? 'fixedHeader' : ''}>
            <LogoWrapper>
                <Link href="/">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
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