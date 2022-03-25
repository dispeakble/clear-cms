import * as React from 'react'
import styled from 'styled-components'

import {Widths,Colors} from '../../../assets/design-set'
import {SearchOutlined} from "@material-ui/icons";
import StayingFromImg from '../../../pages/agency/assets/door-from.png'
import StayingToImg from '../../../pages/agency/assets/door-to.png'
import PassengerAdult from '../../../pages/agency/assets/adult.png'
import PassengerChildren from '../../../pages/agency/assets/adult.png'
import PassengerInfant from '../../../pages/agency/assets/infant.png'
import PassengerStar from '../../../pages/agency/assets/star.png'
import {HeroWrapper ,ParaNumber  ,PassengerChildIcon,HeroTitle,PassengerImage,PassengerWrapper,RightContainer,SearchImage,StayingInfoWrapper,LeftContainer,SearchSettingsContainer,HeroContainer,HeroContentWrapper,HeroSearchBar,SearchBarContainer,SearchInputContainer ,InputSearch ,IconWrapper} from './styled'

const Hero = () => {
    return (

        <HeroWrapper data-testid='hero-wrapper'>
            <HeroContainer>
                <HeroContentWrapper>
                    <HeroSearchBar>
                        <SearchBarContainer>
                           <SearchInputContainer>
                                   <InputSearch type="search" placeholder={'Search For a Hotel or a Destination...'} />
                                   <IconWrapper>
                                       <SearchOutlined style={{color: Colors.primaryColor, fontSize: '40px'}}  />
                                   </IconWrapper>
                           </SearchInputContainer>
                            <SearchSettingsContainer>
                                <LeftContainer>
                                    <StayingInfoWrapper>
                                        <div>
                                            <SearchImage src={StayingFromImg.src} />
                                        </div>
                                        <div>
                                            <p>Staying From</p>
                                            <p><strong>23 Jan, Sat</strong></p>
                                        </div>
                                    </StayingInfoWrapper>
                                    <StayingInfoWrapper>
                                        <div>
                                            <SearchImage src={StayingToImg.src} />
                                        </div>
                                        <div>
                                            <p>Staying Until</p>
                                            <p><strong>23 Jan, Sat</strong></p>
                                        </div>
                                    </StayingInfoWrapper>
                                </LeftContainer>
                                <RightContainer>
                                    <PassengerWrapper>
                                        <div><PassengerImage  src={PassengerAdult.src} /> <span>Adults</span></div>
                                        <ParaNumber>2</ParaNumber>

                                    </PassengerWrapper>
                                    <PassengerWrapper>
                                        <div><PassengerChildIcon  src={PassengerChildren.src}  /> <span>Children</span></div>
                                        <ParaNumber>2</ParaNumber>
                                    </PassengerWrapper>
                                    <PassengerWrapper>
                                        <div><PassengerImage  src={PassengerInfant.src} /> <span>Infants</span></div>
                                        <ParaNumber>2</ParaNumber>
                                    </PassengerWrapper>
                                    <PassengerWrapper>
                                        <div><PassengerImage src={PassengerStar.src} /> <span>Stars</span></div>
                                        <ParaNumber>2</ParaNumber>
                                    </PassengerWrapper>
                                </RightContainer>
                            </SearchSettingsContainer>
                        </SearchBarContainer>
                    </HeroSearchBar>
                    <HeroTitle data-testid='hero-title'>The Most Famous Travel Agency</HeroTitle>
                </HeroContentWrapper>
            </HeroContainer>
        </HeroWrapper>
    )
}



export default Hero;