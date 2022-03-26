import React, {useState} from 'react';
import {TabButton, TabButtonActive, TabContainer} from "../../CardsContainer/styled";

const CardsTabs = ({categories ,handleActiveHotel}) => {
    const [activeCategory, setActiveCategory] = useState(() => categories[0])
    return (

        <TabContainer>
            {
                categories.map((category:any , Index:number) => category === activeCategory ? (
                    <TabButtonActive onClick={() => {
                        console.log(Index)
                        setActiveCategory(category)

                    }}>{category}</TabButtonActive>

                ) : (<TabButton onClick={() => {
                    handleActiveHotel(Index)
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