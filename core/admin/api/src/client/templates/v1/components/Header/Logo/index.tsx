import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

const Logo = () => {
  const [logoSRC, setLogoSRC] = useState(`/files/images/logoSmall.png`);
  const defaultLogoSRC = '/files/images/logoSmallDefault.png';
  return <LogoWrapper>
    <Image
      alt='Logo'
      loader={() => logoSRC}
      src={logoSRC}
      layout='fill'
      objectFit='contain'
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          setLogoSRC(defaultLogoSRC);
        }
      }}
      onErrorCapture={() => {
        setLogoSRC(defaultLogoSRC);
      }}
    />
  </LogoWrapper>;

};

const LogoWrapper = styled.span`
  display: flex;
  flex: 1;
  height: 52px;
  position: relative;
`;

export default Logo;