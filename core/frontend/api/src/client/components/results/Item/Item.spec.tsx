import {render} from '@testing-library/react'
import Item from './index'
import '@testing-library/jest-dom'

test('Result Item exists on document', async () => {

    const {getByTestId } = render(<Item />)

    expect(getByTestId("item-container")).toBeInTheDocument()
})

