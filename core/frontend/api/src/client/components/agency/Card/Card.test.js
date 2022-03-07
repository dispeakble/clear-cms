import {render} from '@testing-library/react'
import Card from './index'
import '@testing-library/jest-dom'

test('load and display Card', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const component = render(
        <Card />
    )

    expect(component.container).toBeCalled()
})

