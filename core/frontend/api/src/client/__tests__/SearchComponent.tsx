import {render, screen} from '@testing-library/react'
import SearchComponent from '../components/agency/SearchComponent'
import '@testing-library/jest-dom'

test("display search component form", async () => {
    render(<SearchComponent />)
    const cardsWrapper = screen.getByTestId(/search-form/)

    expect(cardsWrapper).toBeInTheDocument()
})