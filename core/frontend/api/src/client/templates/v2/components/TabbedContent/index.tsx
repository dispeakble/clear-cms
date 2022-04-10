import {StyledContent, StyledTab, StyledTabs, StyledTitle, Wrapper} from "./styled";
import {useTranslations} from "next-intl";
import VerticalPhotoSlider from "../VerticalPhotoSlider";
import * as React from "react";

const TabbedContent = () => {
    const t = useTranslations()

    return (<Wrapper>
        <StyledTabs>
            <StyledTab>{t('home.tabbed.tabs.packages')}</StyledTab>
            <StyledTab>{t('home.tabbed.tabs.relax')}</StyledTab>
            <StyledTab>{t('home.tabbed.tabs.water-parks')}</StyledTab>
        </StyledTabs>
        <StyledContent>
            <StyledTitle>Best Water Parks</StyledTitle>
            <div>
                <VerticalPhotoSlider maxWidth="600px" maxHeight="250px"/>
            </div>

        </StyledContent>
    </Wrapper>);
}

export default TabbedContent;