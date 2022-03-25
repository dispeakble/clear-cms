import React from 'react';
import {StarRatingContainer,StarRatingFilled ,StarRatingEmpty ,StarRatingHalf} from './styled'

const StarRating = ({rating}) => {
    const ratingStar = Math.floor(3.5);
    const arr = [1,2,3,4,5];
    const starArr: number[] = []
    for (let i = 1; i <= 5; i++){
        if(i <= ratingStar){
            starArr.push(i)
        }else if(rating > ratingStar && i === 4){
            starArr.push(0.5)
        }else {
            starArr.push(0)
        }

    }

    return (
        <StarRatingContainer>
            {
                arr.map((star, index) => star === starArr[index]  ? <StarRatingFilled /> : starArr[index] === 0 ? <StarRatingEmpty /> : <StarRatingHalf />)
            }
        </StarRatingContainer>
    )
}

export default StarRating;