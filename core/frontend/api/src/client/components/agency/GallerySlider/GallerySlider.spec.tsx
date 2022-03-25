import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import GallerySlider from './index'

test('gallery slider renders correctly', async () => {
    const {getByTestId} = render(<GallerySlider />)
    const galleryEl = getByTestId('gallery-wrapper');
    expect(galleryEl).toBeInTheDocument()
})

test('slider slides change correctly on arrow button click', async () => {
    const {getByTestId} = render(<GallerySlider />);
    const arrowSlideLeft = getByTestId('arrow-slide-lef');
    expect(arrowSlideLeft).toBeInTheDocument()
})
test('slider slides change correctly on arrow button click', async () => {
    const {getByTestId} = render(<GallerySlider />);
    const arrowSlideRight = getByTestId('arrow-slide-right');
    expect(arrowSlideRight).toBeInTheDocument()
})