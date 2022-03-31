import React, {useEffect, useState} from 'react';
import DestinationCardTabs from "../DestinationCardTabs";
import CardView from '../Card'

import {
    CardsWrapper,
    CardsContainer,
    Cards,
    TaglineHeading,
} from '../styled'


const DestinationsCards = ({data}) => {
    const [cardDetails, setCard] = useState([])
    const [type, setType] = useState('Popular')
    useEffect(() => {
        const ArrayData = data?.filter((value: any) => {
            return value.Type == type
        })
        const items = ArrayData.slice(0, 3)
        setCard(items)

    }, [])

    const onSetLocation = (dataValue: string) => {
        console.log(dataValue)
        const ArrayData = data?.filter((value: any) => {
            return value.Type == dataValue
        })
        const items = ArrayData.slice(0, 3)
        console.log(items)
        setCard(items)


    }
    return (
        <CardsWrapper>
            <CardsContainer>

                <DestinationCardTabs onChange={onSetLocation}/>
                <Cards>
                    {
                        cardDetails.map((value: any, index: number) => {

                            return (
                                <CardView key={`${index}`} value={value}/>
                            )
                        })
                    }
                </Cards>
            </CardsContainer>
        </CardsWrapper>
    )
}


DestinationsCards.defaultProps = {
    data: [

        {
            Name: "Aroma",
            Image: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/2011092615421078-342ac0e2ec9011e8ac9a0242ac110002.jpg?&output-quality=75&downsize=910:612&crop=910:612;0,9&output-format=jpg',
            Rating: '4',
            Address: 'Himalaya Marg, 22C, Sector 22, Chandigarh, 160022',
            Description: '9 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Popular'
        },
        {
            Name: "Altius Boutique Hotel",
            Image: 'https://images.lastminutes.deals/hotels/IN/589818921.webp',
            Rating: '4',
            Address: '25/9, Chandigarh Rd, Industrial Area Phase II, Chandigarh, 160002\n',
            Type: 'Popular',
            Description: '8 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
        },
        {
            Name: "Hotel Pride",
            Image: 'https://blessingsonthenet.com/img/uploads/hotels/aim_bn_1306555570.jpg',
            Rating: '4',
            Address: '2, 3, Hallo Majra Main Market Rd, Baba Samada Wala, Hallo Majra, Chandigarh, 160002',
            Description: '7 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Popular'
        },
        {
            Name: "HOTEL KULLU VALLEY",
            Image: 'https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_258,q_auto,w_258/itemimages/51/14/5114280.jpeg',
            Rating: '4',
            Address: 'Bazar, Akhara, Kullu, Himachal Pradesh 175101',
            Description: '6 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Adventure'
        },
        {
            Name: "Royal Mansion Bhuntar",
            Image: 'https://lh5.googleusercontent.com/p/AF1QipPkb_IKTVrlNY6TcVMmijDgodH-8OBTfN378H8t=w253-h168-k-no',
            Rating: '4',
            Address: 'Manikaran Rd, Parla Bhuntar, Bhuntar, Himachal Pradesh 175125',
            Description: '5 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Adventure'
        },
        {
            Name: "Echor Palm Bliss ",
            Image: 'https://lh5.googleusercontent.com/proxy/aQ4zVxbZkP1jgYtW3Ue_X6FRiJXzsp4PJ-TLL8fPqywCSXPBpHlJbkNFS-bAxPx1orinTpgZfef-fo26OCu1Qk2kBu2w4OsxJEqblQ_Yx_lK4PYg95ssKgsPeVOr9GnXnD0KO4w8Px4dgwmejU2M1dEXtz9qIA=w253-h168-k-no',
            Rating: '4',
            Address: ' Kasol Road Kasol, Himachal Pradesh, Kasol, Himachal Pradesh 175105',
            Description: '4 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Adventure'
        },
        {
            Name: "Royal Mansion Bhuntar",
            Image: 'https://lh5.googleusercontent.com/p/AF1QipPkb_IKTVrlNY6TcVMmijDgodH-8OBTfN378H8t=w253-h168-k-no',
            Rating: '4',
            Address: 'Manikaran Rd, Parla Bhuntar, Bhuntar, Himachal Pradesh 175125',
            Description: '3 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Bath'
        },
        {
            Name: "Echor Palm Bliss ",
            Image: 'https://lh5.googleusercontent.com/proxy/aQ4zVxbZkP1jgYtW3Ue_X6FRiJXzsp4PJ-TLL8fPqywCSXPBpHlJbkNFS-bAxPx1orinTpgZfef-fo26OCu1Qk2kBu2w4OsxJEqblQ_Yx_lK4PYg95ssKgsPeVOr9GnXnD0KO4w8Px4dgwmejU2M1dEXtz9qIA=w253-h168-k-no',
            Rating: '4',
            Address: ' Kasol Road Kasol, Himachal Pradesh, Kasol, Himachal Pradesh 175105',
            Description: '2 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Bath'
        },
        {
            Name: "Teji's Riverside Resort",
            Image: 'https://lh3.googleusercontent.com/p/AF1QipOV2tfJj4tCv1sZCyhUi27EFVuYCqhcKbr4quB8=w296-h202-n-k-rw-no-v1',
            Rating: '4',
            Address: 'near primary school, Kasol, Himachal Pradesh 175105',
            Description: '1 The Jianguo Hotel Qianmen is located near Tiantan Park, just a 10-minute walk from the National Center for the Performing Arts and Tian\'anmen Square',
            Type: 'Bath'
        }

    ]

}

export default DestinationsCards;