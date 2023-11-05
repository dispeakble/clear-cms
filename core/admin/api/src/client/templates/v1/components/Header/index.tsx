import Logo from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  HeaderContent,
  HeaderWrapper,
  IconContainer,
  InfosItem,
  InfosItemLabel,
  LanguagesWrapper,
  LogoutButton,
  LogoWrapper,
  MenuWrapper,
  ProfileButton,
  ProfileContainer,
  ProfileFirstName,
  ProfileInfosContainer,
  ProfileInfosItem,
  ProfileMainInfos,
  ProfilePicture,
  ProfilePictureBig,
  ProfilePictureInfosContainer,
  UserEmail,
  UserFullName,
} from './styled';
import Languages from './Languages';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Menu from './Menu';
import { useAuthentication } from '../../../../context/AuthContext';
import Image from 'next/image';
import DefaultImage from '../../assets/img/accounts/profile-default.png';
import ExpandIcon from '../../assets/img/accounts/expand-icon.svg';
import ProfileIcon from '../../assets/img/accounts/profile-icon.svg';
import ChangePasswordIcon from '../../assets/img/accounts/bag-icon.svg';
import InvoiceIcon from '../../assets/img/accounts/invoice-icon.svg';
import StarIcon from '../../assets/img/accounts/star-icon.svg';

const Header = (props: any) => {
  const { isAuthenticated, user, setIsLoading } = useAuthentication();

  const links: any[] = [...props.links];

  const t = useTranslations();
  const router = useRouter();

  const [fixedHeader, setFixedHeader] = useState(false);
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  const doLogout = () => {
    router.push('/logout');
  };

  useEffect(() => {
    let isMounted = true;
    window.addEventListener('scroll', () => {
      if (isMounted) {
        if (window.scrollY > 50) {
          setFixedHeader(true);
        } else {
          setFixedHeader(false);
        }
      }
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isMounted = false;
    };
  }, []);

  return (
    <HeaderWrapper
      data-testid="header-wrapper"
      className={fixedHeader ? 'fixedHeader' : ''}
    >
      <HeaderContent>
        <LogoWrapper>
          <Link href="/">
            <div style={{ display: 'flex', cursor: 'pointer' }}>
              <Logo />
            </div>
          </Link>
        </LogoWrapper>
        <MenuWrapper>
          {isAuthenticated}
          <Menu links={links} />
        </MenuWrapper>
        <LanguagesWrapper>
          <Languages />
        </LanguagesWrapper>
        {isAuthenticated && user && (
          <ProfileContainer>
            <ProfileButton onClick={() => setProfileIsOpen(!profileIsOpen)}>
              <ProfilePicture>
                <Image
                  src={user.img || DefaultImage}
                  alt="profile-picture"
                  width={32}
                  height={32}
                />
              </ProfilePicture>
              <ProfileFirstName>{user && user.firstName}</ProfileFirstName>
              <IconContainer>
                <Image src={ExpandIcon} alt="expand-icon" width={15} />
              </IconContainer>
            </ProfileButton>

            <ProfileInfosContainer isOpen={profileIsOpen}>
              <LogoutButton onClick={doLogout}>
                {t('global.accounts.logout')}
              </LogoutButton>
            </ProfileInfosContainer>
          </ProfileContainer>
        )}
      </HeaderContent>
    </HeaderWrapper>
  );
};

Header.defaultProps = {
  links: [
    {
      linkText: 'categories',
      linkSlug: 'categories',
      linkHref: 'categories/list',
    },
    {
      linkText: 'logout',
      linkSlug: 'logout',
      linkHref: 'logout',
    },
  ],
};

export default Header;
