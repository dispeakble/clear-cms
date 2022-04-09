import Image from 'next/image'
import styled from 'styled-components'

const Logo = () => {
    return <LogoWrapper>
            <Image
              loader={() => `/files/images/logoMarioViajesSmall.png`}
              src="logo.png"
              alt="Mario Viajes Home Page"
              width={300}
              height={48}
            />
        </LogoWrapper>

}

const LogoWrapper = styled.div`
  width: 100%;
`

export default Logo;