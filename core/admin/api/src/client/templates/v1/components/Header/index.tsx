import Logo from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  HeaderContent,
  HeaderWrapper,
  LanguagesWrapper,
  LogoWrapper,
  MenuWrapper,
} from './styled';
import Languages from './Languages';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Menu from './Menu';
import { useAuthentication } from '../../../../context/AuthContext';

const Header = (props: any) => {
  const { isAuthenticated } = useAuthentication();

  const links: any[] = [...props.links];

  const t = useTranslations();
  const router = useRouter();

  const [fixedHeader, setFixedHeader] = useState(false);
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  const doLogout = () => {
    router.push('/logout');
  };

  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
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
      setIsMounted(false);
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
          <Menu links={links} />
        </MenuWrapper>
        <LanguagesWrapper>
          <Languages />
        </LanguagesWrapper>
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
