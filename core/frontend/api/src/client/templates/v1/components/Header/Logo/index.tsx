import Image from "next/image";
import styled from "styled-components";

const Logo = () => {
  return <LogoWrapper>
    <Image
      loader={() => `/files/images/logoSmall.png`}
      src="logo.png"
      width={300}
      height={48}
    />
  </LogoWrapper>;

};

const LogoWrapper = styled.div`
  width: 100%;
`;

export default Logo;