import {
  StyledContent,
  StyledContentSubtitle,
  StyledContentTitle,
  StyledContentWrapper,
  StyledTab,
  StyledTabs,
  StyledTitle,
  Wrapper
} from "./styled";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useState } from "react";
import VerticalTabbedSlider from "./VerticalTabbedSlider";

const TabbedContent = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const t = useTranslations();

  const slides = ["first", "second", "third"];

  return (<Wrapper>
    <StyledTabs>
      {slides.map((slide, index) => (
        <StyledTab key={slide} data-testid={`test-${slide}-tab-button`} onClick={() => setSelectedTab(index)}
                   className={selectedTab === index ? "selected" : ""}>{t(`home.tabbed.tabs.${slide}`)}</StyledTab>
      ))}
    </StyledTabs>
    <StyledContent>
      {slides.map((slide, index) => (
        selectedTab === index && <div key={index}>
          <StyledTitle>{t(`home.tabbed.${slide}.title`)}</StyledTitle>
          <VerticalTabbedSlider maxWidth="732px" maxHeight="250px" />
          <StyledContentWrapper>
            <StyledContentTitle>{t(`home.tabbed.${slide}.first.subtitle`)}</StyledContentTitle>
            <StyledContentSubtitle>{t(`home.tabbed.${slide}.first.content`)}</StyledContentSubtitle>
          </StyledContentWrapper>
          <StyledContentWrapper>
            <StyledContentTitle>{t(`home.tabbed.${slide}.second.subtitle`)}</StyledContentTitle>
            <StyledContentSubtitle>{t(`home.tabbed.${slide}.second.content`)}</StyledContentSubtitle>
          </StyledContentWrapper>
          <StyledContentWrapper>
            <StyledContentTitle>{t(`home.tabbed.${slide}.third.subtitle`)}</StyledContentTitle>
            <StyledContentSubtitle>{t(`home.tabbed.${slide}.third.content`)}</StyledContentSubtitle>
          </StyledContentWrapper>
        </div>
      ))}
    </StyledContent>
  </Wrapper>);
};

export default TabbedContent;