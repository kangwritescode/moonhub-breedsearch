import { Tooltip } from '@mantine/core'
import classNames from 'classnames'
import { useUIStore } from '../../store/UIStore';
import doggySVG from '../../assets/doggy.svg';
import './DogWidget.css'

function DogWidget() {
    const showResults = useUIStore(state => state.showResults)
    const isAnimating = useUIStore(state => state.isAnimating)
    return (
        <Tooltip
            label="bork bork bork 🎵"
            color="cyan"
            withArrow>
            <img
                className={classNames('doggySVG', {
                    'animate__animated animate__bounceOutLeft': isAnimating,
                    'animation--creep-in': !showResults && !isAnimating
                })}
                src={doggySVG} />
        </Tooltip>
    )
}

export default DogWidget