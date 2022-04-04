import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import UpcomingOffers from './index'

test('upcoming offer wrapper renders correctly', async () => {
    const {getByTestId} = render(<UpcomingOffers />)
    const upcomingWrapper = getByTestId('upcoming-offer-wrapper')
    expect(upcomingWrapper).toBeInTheDocument()
})

test('upcoming offer tagline renders correctly', async () => {
    const {getByTestId} = render(<UpcomingOffers />)
    const upcomingOfferTagline = getByTestId('upcoming-offer-tagline')
    expect(upcomingOfferTagline).toBeInTheDocument()
})

test('upcoming offer tagline heading renders and has correct text content', async () => {
    const {getByTestId} = render(<UpcomingOffers />)
    const upcomingOfferTaglineHeading = getByTestId('upcoming-offer-tagline-heading')
    expect(upcomingOfferTaglineHeading).toBeInTheDocument()
    expect(upcomingOfferTaglineHeading.textContent).toBe(`Special Upcoming Offers`)
})



