import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import HotelPage, {HotelPageProps} from "../HotelPage";


test('display card Item', async () => {

    const hotelProps: HotelPageProps = {
        websiteName: "fake website name",
        websiteUrl: "fakewebsite.com",
        websiteSlogan: "fake slogan",
    };

    render(<HotelPage {...hotelProps}/>)
    const hotelPage = screen.getByTestId(/hotel-page-wrapper/)

    expect(hotelPage).toBeInTheDocument()
})
