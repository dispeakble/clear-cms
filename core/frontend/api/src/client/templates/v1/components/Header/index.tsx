import Logo from "./Logo";
import Link from "next/link";

import {
  HeaderContent,
  HeaderWrapper,
  InputSearch,
  LanguagesWrapper,
  LogoWrapper,
  MenuWrapper,
  SearchWrapper
} from "./styled";
import Languages from "./Languages";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Menu from "./Menu";

const Header = (props: any) => {
  const links: any[] = props.links;

  const t = useTranslations();

  const [fixedHeader, setFixedHeader] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.addEventListener("scroll", () => {
      if(isMounted) {
        if (window.scrollY > 50) {
          setFixedHeader(true);
        } else {
          setFixedHeader(false);
        }
      }
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isMounted = false
    };
  }, []);

  return (
    <HeaderWrapper data-testid="header-wrapper" className={fixedHeader ? "fixedHeader" : ""}>
      <HeaderContent>
        <LogoWrapper>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <Logo />
            </a>
          </Link>

        </LogoWrapper>
        <MenuWrapper>
          <Menu links={links} />
        </MenuWrapper>
        <LanguagesWrapper>
          <Languages />
        </LanguagesWrapper>
        <SearchWrapper>
          <InputSearch data-testid="header-search-input" type="search" placeholder={t("global.search")} />
        </SearchWrapper>
      </HeaderContent>

    </HeaderWrapper>
  );
};

Header.defaultProps = {
  links: [
    {
      linkText: "activities",
      linkSlug: "activities"
    },
    {
      linkText: "hotels",
      linkSlug: "hotels"
    },
    {
      linkText: "flights",
      linkSlug: "flights"
    },
    {
      linkText: "packages",
      linkSlug: "packages"
    }
  ]
};

export default Header;