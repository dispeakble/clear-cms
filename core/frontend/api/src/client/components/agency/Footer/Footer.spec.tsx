import {render, screen} from '@testing-library/react'
import Footer from './index'
import '@testing-library/jest-dom'

test("display footer wrapper", async () => {
    render(<Footer />)
    const footerWrapper = screen.getByTestId(/footer-wrapper/)
    expect(footerWrapper).toBeInTheDocument()
})

test('footer top section renders correctly', async () => {
    const {getByTestId} = render(<Footer />)
    const topSectionEl = getByTestId('footer-top-section')
    expect(topSectionEl).toBeInTheDocument()
})

test('footer terms heading has correct text content', async () => {
    const {getByTestId} = render(<Footer />)
    const termHeadingEl = getByTestId('footer-terms-heading');
    expect(termHeadingEl.textContent).toBe('Terms and conditions:')
})

test('footer terms description renders correctly', async () => {
    const {getByTestId} = render(<Footer />)
    const termsDescription = getByTestId('footer-terms-description')
    expect(termsDescription).toBeInTheDocument()
})

test('footer term description renders correctly', async () => {
    const {getByTestId} = render(<Footer />)
    const newsletterTitleEl = getByTestId('newsletter-title')
    expect(newsletterTitleEl).toBeInTheDocument()
})

test('footer newsletter section has correct text content', async () => {
    const {getByTestId} = render(<Footer />)
    const newsletterTitleEl = getByTestId('newsletter-title')
    expect(newsletterTitleEl.textContent).toBe('Subscribe To Our Newsletter')
})

test('facebook element has correct text content', async () => {
    const {getByTestId} = render(<Footer />)
    const facebookEl = getByTestId('facebook')
    expect(facebookEl.textContent).toBe('Facebook')
})
test('facebook element has correct text content', async () => {
    const {getByTestId} = render(<Footer />)
    const twitterEl = getByTestId('twitter')
    expect(twitterEl.textContent).toBe('Twitter')
})
test('facebook element has correct text content', async () => {
    const {getByTestId} = render(<Footer />)
    const instagramEl = getByTestId('instagram')
    expect(instagramEl.textContent).toBe('Instagram')
})








