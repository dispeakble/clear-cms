import { useTranslations } from "next-intl";
import {
  StyledHomeSearch,
  StyledSearchTab,
  StyledSearchTabs,
} from "./styled";
import { useState } from "react";
import { Packages } from "./SearchForms/Packages";
import { Hotels } from "./SearchForms/Hotels";
import { Flights } from "./SearchForms/Flights";

const HomeSearch = () => {
  const t = useTranslations();
  const [formType, setFormType] = useState('hotels');

  const changeForm = (type: string) => {
    setFormType(type);
  }

  return <StyledHomeSearch>
    <StyledSearchTabs>
      <StyledSearchTab
        onClick={() => changeForm('hotels')}
        data-testid='test-hotels-search-tab'
        className={formType === 'hotels' ? 'selected' : ''}>{t("search.hotels")}</StyledSearchTab>
      <StyledSearchTab
        data-testid='test-packages-search-tab'
        onClick={() => changeForm('packages')}
        className={formType === 'packages' ? 'selected' : ''}>{t("search.packages")}</StyledSearchTab>
      <StyledSearchTab
        onClick={() => changeForm('flights')}
        data-testid='test-flights-search-tab'
        className={formType === 'flights' ? 'selected' : ''}>{t("search.flights")}</StyledSearchTab>
    </StyledSearchTabs>
    { formType === 'packages' && <Packages/> }
    { formType === 'hotels' && <Hotels/> }
    { formType === 'flights' && <Flights/> }
  </StyledHomeSearch>;
};

export default HomeSearch;