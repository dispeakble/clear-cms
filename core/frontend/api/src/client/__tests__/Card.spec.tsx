import {render, screen} from '@testing-library/react'
import Card from '../components/agency/Card'
import '@testing-library/jest-dom'


test('display card Item', async () => {
    render(<Card />)
    const cardItem = screen.getByTestId(/card-item/)

    expect(cardItem).toBeInTheDocument()
})

test('card title exists on document', async () => {

    render(<Card />)
    const cardTitle = screen.getByTestId(/card-title/)

    expect(cardTitle).toBeInTheDocument()
})

test('card description exists on document', async () => {

    render(<Card />)
    const cardDescription = screen.getByTestId(/card-description/)

    expect(cardDescription).toBeInTheDocument()
})

