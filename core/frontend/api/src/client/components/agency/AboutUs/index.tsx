import React from 'react';

import PersonOnBeach from '../../../pages/agency/assets/img.png';
import {AboutUsMainWrapper ,ContactUsButton,AboutUsContainer ,PrimaryButton  ,AboutUsWrapper ,AboutImage ,AbsoluteItemOne ,AbsoluteItemTwo ,AbsoluteItemThree ,AboutUsImageWrapper ,AboutUsContentWrapper ,AboutUsTitle ,AboutUsDescription} from './styled'

const AboutUs = () => {
    return (
        <AboutUsMainWrapper>
            <AboutUsContainer>
                <AboutUsWrapper>
                    <AboutUsImageWrapper>
                        <AboutImage src={PersonOnBeach.src} alt=""/>
                        <AbsoluteItemOne>
                            <h4>300+</h4>
                            <h5>Destinations</h5>
                        </AbsoluteItemOne>
                        <AbsoluteItemTwo>
                            <h4>5000+</h4>
                            <h5>Tourists</h5>
                        </AbsoluteItemTwo>
                        <AbsoluteItemThree>
                            <h4>150+</h4>
                            <h5>hotels</h5>
                        </AbsoluteItemThree>
                    </AboutUsImageWrapper>
                    <AboutUsContentWrapper>

                            <AboutUsTitle>
                                Travel Any Corner of <br/>
                                The World With Us
                            </AboutUsTitle>
                            <AboutUsDescription>
                                Would you explore nature paradise in the world, let's find the
                                best destination in world with us, Would you explore nature
                                paradise in the world, let's find the best destination in world
                                with us. Would you explore nature paradise in the world, let's
                                find the best destination in world with us.
                            </AboutUsDescription>
                            <AboutUsDescription>
                                Would you explore nature paradise in the world, let's find the
                                best destination in world with us.
                            </AboutUsDescription>

                                <PrimaryButton href={'contact-us'} className="btn"> contact us</PrimaryButton>
                    </AboutUsContentWrapper>
                </AboutUsWrapper>
            </AboutUsContainer>
        </AboutUsMainWrapper>
    )
}


export default AboutUs;
