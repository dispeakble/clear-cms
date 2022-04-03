import React, {useState} from 'react';
import {TabButton, TabButtonActive, TabContainer} from "../../CardsContainer/styled";

const CardsTabs = ({categories ,handleActiveHotel}) => {
    const [activeCategory, setActiveCategory] = useState(() => categories[0])
    return (
        <TabContainer>
            {
                categories.map((category:any , index:number) => category === activeCategory ? (
                    <TabButtonActive key={`${index}`} onClick={() => {
                        setActiveCategory(category)
                    }}>{category}</TabButtonActive>
                ) : (<TabButton key={`${index}`} onClick={() => {
                    handleActiveHotel(index)
                    setActiveCategory(category)
                }}>{category}</TabButton>))
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