import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from './index'

test('hero wrapper renders correctly', async () => {
    const {getByTestId} = render(<Hero/>)
    const heroWrapper = getByTestId('hero-wrapper')
    expect(heroWrapper).toBeInTheDocument()
})

test('header input renders correctly', async () => {
    const {getByTestId} = render(<Hero/>)
    const headerInput = getByTestId('header-search-input')
    expect(headerInput).toBeInTheDocument()

})

test('header input renders correctly', async () => {
    const {getByTestId} = render(<Hero/>)
    const headerInput = getByTestId('header-search-input')
    expect(headerInput).toHaveAttribute('type', 'search')
})
test('header input renders correctly', async () => {
    const {getByTestId} = render(<Hero/>)
    const headerInput = getByTestId('header-search-input')
    expect(headerInput).toHaveAttribute('placeholder', 'Search For a Hotel or a Destination...')
})


test('hero title renders and has correct text content', async () => {
    const {getByTestId} = render(<Hero/>)
    const heroTitle = getByTestId('hero-title')
    expect(heroTitle).toBeInTheDocument()

})
test('hero title renders and has correct text content', async () => {
    const {getByTestId} = render(<Hero/>)
    const heroTitle = getByTestId('hero-title')
    expect(heroTitle.textContent).toBe('The Most Famous Travel Agency')
})
