import { FiltersWrapper } from "./styled";
import { useTranslations } from "next-intl";
import ResultFilter from "../ResultFilter";


const FilteringFlightResult = () => {
  const t = useTranslations();
  const sortCheckboxes = [
    t("flightList.filters.sortCheckboxes.all"),
    t("flightList.filters.sortCheckboxes.theBest"),
    t("flightList.filters.sortCheckboxes.theCheapest"),
    t("flightList.filters.sortCheckboxes.theFastest"),
    t("flightList.filters.sortCheckboxes.airline")
  ];

  const airlinesCheckboxes = [
    "All",
    "bbb",
    "ccc",
    "ddd",
    "fff",
    "ggg"
  ];

  const numberOfStopovers = [
    "All",
    "Direct",
    "1",
    "2",
    "3"
  ];

  return (
    <FiltersWrapper>
      <ResultFilter title={t("flightList.sort")} checkboxes={sortCheckboxes} />
      <ResultFilter title={t("flightList.airlines")} checkboxes={airlinesCheckboxes} />
      <ResultFilter title={t("flightList.stopOvers")} checkboxes={numberOfStopovers} />
    </FiltersWrapper>
  );
};

export default FilteringFlightResult;