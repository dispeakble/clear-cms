import Logo from "./Logo";
import Link from "next/link";
import {useRouter} from "next/router";

import {
  AuthWrapper,
  HeaderContent,
  HeaderWrapper,
  IconContainer, InfosItem, InfosItemLabel,
  InputSearch,
  LanguagesWrapper,
  LoginButton, LogoutButton,
  LogoWrapper,
  MenuWrapper,
  ProfileButton,
  ProfileContainer,
  ProfileFirstName,
  ProfileInfosContainer, ProfileInfosItem, ProfileMainInfos,
  ProfilePicture, ProfilePictureBig,
  ProfilePictureInfosContainer,
  RegisterButton,
  SearchWrapper, UserEmail, UserFullName
} from "./styled";
import Languages from "./Languages";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import {useAuthentication} from "../../../../context/AuthContext";
import Image from "next/image";
import DefaultImage from "../../assets/img/accounts/profile-default.png"
import ExpandIcon from "../../assets/img/accounts/expand-icon.svg"
import ProfileIcon from "../../assets/img/accounts/profile-icon.svg"
import ChangePasswordIcon from "../../assets/img/accounts/bag-icon.svg"
import InvoiceIcon from "../../assets/img/accounts/invoice-icon.svg"
import StarIcon from "../../assets/img/accounts/star-icon.svg"




const Header = (props: any) => {
  const links: any[] = props.links;
  const {isAuthenticated, user, setIsLoading} = useAuthentication()

  const t = useTranslations();
  const router = useRouter()

  const [fixedHeader, setFixedHeader] = useState(false);
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  const doLogout = () => {
    router.push('/logout')
  }

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

  const redirect = (path: string) => {
    setIsLoading(true)
    return router.push(path).then(() => setIsLoading(false))
  }

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
        {
          !isAuthenticated &&
            (<AuthWrapper>
              <LoginButton onClick={() => redirect('/login')}>
                {t('global.accounts.login')}
              </LoginButton>
            </AuthWrapper>)
        }
        {
          (isAuthenticated && user) &&
            (
                <ProfileContainer>
                  <ProfileButton onClick={() => setProfileIsOpen(!profileIsOpen)}>
                    <ProfilePicture>
                      <Image src={user.img || DefaultImage} alt="profile-picture" width={32} height={32} />
                    </ProfilePicture>
                    <ProfileFirstName>
                      {user && user.firstName}
                    </ProfileFirstName>
                    <IconContainer>
                      <Image src={ExpandIcon} alt="expand-icon" width={15} />
                    </IconContainer>
                  </ProfileButton>

                  <ProfileInfosContainer isOpen={profileIsOpen}>
                    <ProfilePictureInfosContainer>
                      <ProfilePictureBig>
                        <Image src={user.img || DefaultImage} alt="profile-picture" width={64} height={64} />
                      </ProfilePictureBig>
                      <ProfileMainInfos>
                        <UserFullName>
                          {`${user.firstName} ${user.lastName}`}
                        </UserFullName>
                        <UserEmail>
                          {user && user.email}
                        </UserEmail>
                      </ProfileMainInfos>
                    </ProfilePictureInfosContainer>

                    <ProfileInfosItem onClick={() => redirect('/client-area')}>
                      <InfosItem>
                        <Image src={ProfileIcon} alt="icon-item" className="iconItem" />
                        <InfosItemLabel>
                          {t('global.accounts.myProfile')}
                        </InfosItemLabel>
                      </InfosItem>
                    </ProfileInfosItem>

                    <ProfileInfosItem onClick={() => redirect('/client-area/edit/password')}>
                      <InfosItem>
                        <Image src={ChangePasswordIcon} alt="icon-item" className="iconItem" />
                        <InfosItemLabel>
                          {t('global.accounts.changePassword')}
                        </InfosItemLabel>
                      </InfosItem>
                    </ProfileInfosItem>

                    <ProfileInfosItem onClick={() => redirect('/client-area/invoice')}>
                      <InfosItem>
                        <Image src={InvoiceIcon} alt="icon-item" className="iconItem" />
                        <InfosItemLabel>
                          {t('global.accounts.invoices')}
                        </InfosItemLabel>
                      </InfosItem>
                    </ProfileInfosItem>

                    <ProfileInfosItem>
                      <InfosItem>
                        <Image src={StarIcon} alt="icon-item" className="iconItem" />
                        <InfosItemLabel>
                          {t('global.accounts.contracts')}
                        </InfosItemLabel>
                      </InfosItem>
                    </ProfileInfosItem>

                    <LogoutButton onClick={doLogout}>
                      {t('global.accounts.logout')}
                    </LogoutButton>
                  </ProfileInfosContainer>
                </ProfileContainer>
            )
        }
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