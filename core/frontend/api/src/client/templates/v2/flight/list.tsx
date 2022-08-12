import * as React from "react";

import {
  ContentWrapper, PaperWrapper
} from "../styled";
import ResultsMainContent from "../components/ResultsMainContent";
import FilteringFlightResult from "../components/FilteringFlightResult";
import Layout from "../components/Layout";
import { FlightsLayout } from "./styled";

const List = ({ websiteName, websiteSlogan, colorScheme }: any) => {
  const breadcrumbs = {
    //TODO translate this
    "flights/list": "Flights"
  };

  return (
    <Layout selectedTab="flights" websiteName={websiteName} colorScheme={colorScheme} breadcrumbs={breadcrumbs}
            showSearch websiteSlogan={websiteSlogan}>
      <PaperWrapper>
        <ContentWrapper>
          <FlightsLayout>
            <FilteringFlightResult />
            <ResultsMainContent />
          </FlightsLayout>
        </ContentWrapper>
      </PaperWrapper>
    </Layout>
  );
};

export default List;