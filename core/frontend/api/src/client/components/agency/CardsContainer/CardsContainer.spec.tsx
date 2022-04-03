import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import CardsContainer from './index'

test('cards wrapper renders correctly', async () => {
    const {getByTestId} = render(<CardsContainer />)
    const cardsWrapperEl = getByTestId('cards-wrapper')
    expect(cardsWrapperEl).toBeInTheDocument()
})





