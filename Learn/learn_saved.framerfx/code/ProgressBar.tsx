import * as React from "react"
import { Frame, FrameProps, addPropertyControls, ControlType } from "framer"
import { colors } from "./canvas"

type Props = FrameProps & {
    value: number
    duration: number
    animate: boolean
    countdown: boolean
    onAnimationComplete: () => void
}

export function ProgressBar(props: Partial<Props>) {
    const {
        value,
        duration,
        animate,
        countdown,
        onAnimationComplete,
        ...rest
    } = props

    /* ---------------------------------- State --------------------------------- */

    const [state, setState] = React.useState({
        value,
    })

    React.useEffect(() => {
        setState({ value })
    }, [value])

    /* ----------------------------- Event Handlers ----------------------------- */

    const handleAnimationEnd = React.useCallback(() => {
        onAnimationComplete()
    }, [onAnimationComplete])

    /* ------------------------------ Presentation ------------------------------ */

    return (
        <Frame {...rest} background="none">
            <Frame
                height={8}
                borderRadius={4}
                center="y"
                width="100%"
                background={colors.Neutral}
            />
            <Frame
                height={8}
                borderRadius={4}
                background={colors.Primary}
                center="y"
                // todo - fix for non-animated
                initial={{
                    width: `${state.value * 100}%`,
                }}
                animate={
                    animate && {
                        width: countdown ? "0%" : "100%",
                        transition: {
                            type: "tween",
                            curve: "linear",
                            duration,
                        },
                    }
                }
                onAnimationComplete={handleAnimationEnd}
            />
        </Frame>
    )
}

ProgressBar.defaultProps = {
    height: 40,
    width: 320,
    value: 0.62,
    duration: 1.5,
    animate: false,
    countdown: false,
    onAnimationComplete: () => null,
}

addPropertyControls(ProgressBar, {
    value: {
        type: ControlType.Number,
        min: 0,
        max: 1,
        step: 0.01,
        title: "Value",
        defaultValue: 0.62,
    },
    animate: {
        type: ControlType.Boolean,
        title: "Animate",
        defaultValue: false,
    },
    countdown: {
        type: ControlType.Boolean,
        title: "Animate",
        defaultValue: false,
        hidden: ({ animate }) => !animate,
    },
    duration: {
        type: ControlType.Number,
        min: 0,
        max: 10,
        step: 0.1,
        title: "Duration",
        defaultValue: 1.5,
    },
})
