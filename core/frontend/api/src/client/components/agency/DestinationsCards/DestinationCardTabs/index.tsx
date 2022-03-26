import React, {useState} from 'react';
import {TabButton, TabButtonActive, TabContainer} from "../../CardsContainer/styled";

const DestinationCardTabs = ({categories}) => {
    const [activeCategory, setActiveCategory] = useState(() => categories[0])
    return (

        <TabContainer>
            {
                categories.map(category => category === activeCategory ? (<TabButtonActive onClick={() => setActiveCategory(category)}>{category}</TabButtonActive>

                ) : (<TabButton onClick={() => setActiveCategory(category)}>{category}</TabButton>))
            }
        </TabContainer>

    )
}

DestinationCardTabs.defaultProps = {
    categories: [
        'Popular',
        'Adventure',
        'Bath'
    ]
}

export default DestinationCardTabs;