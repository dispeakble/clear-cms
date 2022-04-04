import {render, screen} from '@testing-library/react'
import Footer from './index'
import '@testing-library/jest-dom'

import Header from './index'

test('header wrapper renders correctly', async () => {
    const {getByTestId} = render(<Footer />)
    const headerWrapper = getByTestId('header-wrapper')
    expect(headerWrapper).toBeInTheDocument()
})

test('header input renders correctly, has type of search and correct placeholder text', async () => {
    const {getByTestId} = render(<Footer />)
    const headerInput = getByTestId('header-search-input')
    expect(headerInput).toBeInTheDocument()
    expect(headerInput).toHaveAttribute('type','search')
    expect(headerInput).toHaveAttribute('placeholder', 'Your Perfect Vacation ...')
})

