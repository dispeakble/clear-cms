import React from 'react'
import chroma from 'chroma-js'
import posed from 'react-pose'
import ColorCube from '../Components/ColorCube'
import ColorPickers from '../Components/ColorPickers'
import GradientSelection from '../Components/GradientSelection'
import {observer} from 'mobx-react'
import evaluate from '../Utility/evaluate';
import PropTypes from "prop-types";
import {MdIndeterminateCheckBox, MdLibraryAdd} from "react-icons/md";

export const AnimatedGroup = posed.div({
    visible: {delayChildren: 100, staggerChildren: 150}
})

export const AnimatedDiv = posed.div({
    visible: {opacity: 1, y: 0, margin: '15px 15px 0'},
    hidden: {opacity: 0, y: 32}
})

class Main extends React.Component {
    componentDidMount = () => {
        this.props.store.showUI()
        this.props.store.unlockUIHidden()
        this.props.selectColor(evaluate(this.props.store, chroma));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.selectColor(evaluate(this.props.store, chroma));
    }

    render() {
        const store = this.props.store
        const selected = store.selectedGradient
        const linearGradient = chroma
            .scale(selected.colors)
            .mode(selected.mode)
            .colors(selected.grades)

        const visibility =
            store.uiHidden || store.uiHiddenLocked ? 'hidden' : 'visible'

        return (
            <div id="contentBlock">
                <AnimatedGroup pose={visibility}>
                    <AnimatedDiv>
                        <GradientSelection store={store} selected={selected}/>
                    </AnimatedDiv>
                    <AnimatedDiv style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button onPointerUp={selected.removeGrade}>
                            <MdIndeterminateCheckBox/>
                        </button>
                        <div
                            pose={visibility}
                            className="colorBlocks"
                        >
                            {linearGradient.map((c, idx) => <ColorCube color={c} key={idx}/>)}
                        </div>
                        <button onPointerUp={selected.addGrade}>
                            <MdLibraryAdd/>
                        </button>
                    </AnimatedDiv>

                    <AnimatedDiv pose={visibility}>
                        <ColorPickers store={store} gradient={selected}/>
                    </AnimatedDiv>

                </AnimatedGroup>
            </div>
        )
    }
}

export default observer(Main)

Main.propTypes = {
    store: PropTypes.object,
    selectColor: PropTypes.func,
};
