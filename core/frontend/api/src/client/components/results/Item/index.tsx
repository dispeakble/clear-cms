import React from "react"
import {ItemContainer} from './styled'

const Item = React.forwardRef((props, ref) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {itemTitle, itemDescription} = props

    return (
        <ItemContainer ref={ref as React.MutableRefObject<HTMLInputElement>} data-testid="item-container" >
            <h1>{ itemTitle}</h1>
            <h2>{ itemDescription}</h2>
        </ItemContainer>
    )
})

export default Item