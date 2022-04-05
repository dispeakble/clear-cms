import React, { useState } from "react";
import { TabButton, TabButtonActive, TabContainer } from "../../CardsContainer/styled";
import styled from "styled-components";
import { Colors } from "../../../../assets/design-set";

const DestinationCardTabs = ({ categories, onChange }: any) => {
  const [activeCategory, setActiveCategory] = useState(() => categories[0]);
  return (

    <DestinationTabContainer>
      {
        categories.map((category: any, index: number) => category === activeCategory ? (
          <DestinationTabButtonActive key={`${index}`}
                                      onClick={() => setActiveCategory(category)}>{category}</DestinationTabButtonActive>

        ) : (<DestinationTabButton key={`${index}`} onClick={() => {
          setActiveCategory(category);
          onChange(category);
        }}>{category}</DestinationTabButton>))
      }
    </DestinationTabContainer>

  );
};

const DestinationTabContainer = styled(TabContainer)`
  background-color: transparent;
  box-shadow: none;
`;
const DestinationTabButtonActive = styled(TabButtonActive)`
  background-color: ${Colors.white};
  color:${Colors.primaryColor};
`;

const DestinationTabButton = styled(TabButton)`
  color:${Colors.gray};
`;

DestinationCardTabs.defaultProps = {
  categories: [
    "Popular",
    "Adventure",
    "Bath"
  ]
};

export default DestinationCardTabs;