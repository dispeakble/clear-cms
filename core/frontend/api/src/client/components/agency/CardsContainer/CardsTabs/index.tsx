import React, {useState} from 'react';
import {TabButton, TabButtonActive, TabContainer} from "../../CardsContainer/styled";

const CardsTabs = ({categories}) => {
    const [activeCategory, setActiveCategory] = useState(() => categories[0])
    return (

        <TabContainer>
            {
                categories.map(category => category === activeCategory ? (
                    <TabButtonActive onClick={() => setActiveCategory(category)}>{category}</TabButtonActive>

                ) : (<TabButton onClick={() => setActiveCategory(category)}>{category}</TabButton>))
            }
        </TabContainer>

    )
}

CardsTabs.defaultProps = {
    categories: [
        'Latest Special Offers',
        'Last Minute',
        'Flights'
    ]
}

export default CardsTabs;