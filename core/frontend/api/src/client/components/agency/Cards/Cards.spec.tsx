import {render, screen} from '@testing-library/react'
import Cards from './index'
import '@testing-library/jest-dom'

test("display card wrapper", async () => {
    render(<Cards />)
    const cardsWrapper = screen.getByTestId(/cards-wrapper/)

    expect(cardsWrapper).toBeInTheDocument()
})

test("display cards in card wrapper", async () => {
    const cards = [
        {
            title: "Test title 1",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            title: "Test title 2",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]

    render(<Cards cards={cards} />)
    const cardsWrapper = screen.getByTestId(/cards-wrapper/)

    expect(cardsWrapper).toBeInTheDocument()
    expect(cardsWrapper).toHaveTextContent(/Test title/)
})