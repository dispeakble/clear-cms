import Image from "next/image";
import styled from "styled-components";

const Logo = () => {
  return <LogoWrapper>
    <Image
      loader={() => `/files/images/logoSmall.png`}
      src="https://www.google.com/logos/doodles/2022/montserrat-caballes-89th-birthday-6753651837109386-l.webp"
      width={300}
      height={48}
    />
  </LogoWrapper>;

};

const LogoWrapper = styled.div`
  width: 100%;
`;

export default Logo;