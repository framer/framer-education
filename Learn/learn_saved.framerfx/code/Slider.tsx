import * as React from "react"
import {
    Frame,
    motionValue,
    useMotionValue,
    MotionValue,
    useTransform,
    FrameProps,
    addPropertyControls,
    ControlType,
} from "framer"
import { useInteractionState } from "./Hooks"
import { Text } from "./Text"
import { colors } from "./canvas"

// This component will update much more often than other components,
// so we've gone a little heavy on memoization!

type Props = FrameProps & {
    value: number | MotionValue<number>
    disabled: boolean
    validation: (value: number, progress: number) => boolean
    onValueChange: (value: number, progress: number, valid: boolean) => void
    knobSize: number
    railHeight: number
    min: number
    max: number
    step: number
    titles: boolean
    places: number
    color: string
    onDrag: any
    onDragStart: any
    onDragEnd: any
}

export function Slider(props: Partial<Props>) {
    const {
        step,
        min,
        max,
        value: initialValue,
        validation,
        knobSize,
        railHeight,
        disabled,
        onValueChange,
        titles,
        places,
        color,
        onDrag,
        onDragStart,
        onDragEnd,
        style,
        ...rest
    } = props

    // Whether the incoming value is a MotionValue or a number
    const hasMotionValue = React.useMemo(
        () => (initialValue as any).onChange !== undefined,
        []
    )

    // The number we can use as our initial value
    const localInitialValue = React.useMemo(
        () =>
            hasMotionValue
                ? (initialValue as MotionValue<number>).get()
                : (initialValue as number),
        []
    )

    // The number we can use as our initial value
    const localWidth = React.useMemo(
        () =>
            (props.width as any).onChange !== undefined
                ? (props.width as MotionValue<number>).get()
                : (props.width as number),
        []
    )

    // The width of our slider's rail, based on our width and knobSize
    const railWidth = React.useMemo(() => localWidth - knobSize, [
        props.width,
        knobSize,
    ])

    // Turn a number into its closest multiple of our step prop.
    const toStep = React.useCallback(
        (value: number) => Math.round(value / step) * step,
        [step]
    )

    // Turn a number into a normal value, using our min and max.
    const toProgress = React.useCallback(
        (value: number) => (value - min) / (max - min),
        [min, max]
    )

    /* ---------------------------------- State --------------------------------- */

    // If the slider's value prop is a motion value, then
    // set up a listener to update the slider's value
    // when that MotionValue changes its value.
    React.useEffect(() => {
        if (hasMotionValue) {
            const cancel = (initialValue as MotionValue<number>).onChange(
                handleChange
            )
            return cancel // unsubscribe on unmount
        }
    }, [])

    // If the slider's value prop is a regular number, then
    // update the slider's value when that prop changes.
    React.useEffect(() => {
        if (!hasMotionValue) {
            handleChange(initialValue)
        }
    }, [initialValue])

    // Create a ref to hold our currentValue.
    const currentValue = React.useRef(toStep(localInitialValue))

    // Create our state, holding: value, progress and valid
    const [state, setState] = React.useState({
        value: toStep(localInitialValue),
        progress: toProgress(toStep(localInitialValue)),
        valid: validation(
            toStep(localInitialValue),
            toProgress(toStep(localInitialValue))
        ),
    })

    // Get interaction state and props (event handlers)
    const [interactionState, interactionProps] = useInteractionState({
        disabled,
        style,
    })

    /* ----------------------------- Event Handlers ----------------------------- */

    // When we get a new value, check whether it is the same
    // as the value that we already have. This prevents
    // render loops and updating between steps.
    const handleChange = React.useCallback(value => {
        if (value !== currentValue.current) {
            handleValueChange(value)
        }
    }, [])

    // When we receive a new incoming value (either from a
    // new value prop or from a MotionValue change event),
    // turn it into a stepped value and check against our
    // current value. If it's different, update state, run
    // our onValueChange callback, and update our motion
    // value (if we have one).
    const handleValueChange = React.useCallback(value => {
        const steppedValue = toStep(value)
        const steppedProgress = toProgress(steppedValue)
        const steppedValid = validation(steppedValue, steppedProgress)

        if (currentValue.current !== steppedValue) {
            currentValue.current = steppedValue

            if (hasMotionValue) {
                ;(initialValue as MotionValue<number>).set(steppedValue)
            }

            onValueChange(steppedValue, steppedProgress, steppedValid)

            setState(state => ({
                value: steppedValue,
                progress: steppedProgress,
                valid: steppedValid,
            }))
        }
    }, [])

    // As the user drags the knob, attempt to update state.
    const handleDrag = React.useCallback((event, info) => {
        onDrag && onDrag(event, info)
        const progress = info.point.x / railWidth
        const value = progress * (max - min)

        handleChange(value)
    }, [])

    /* ------------------------------ Presentation ------------------------------ */

    const variants = {
        initial: {
            border: `1px solid ${colors.Neutral}`,
        },
        hovered: {
            border: `1px solid ${colors.Border}`,
        },
        active: {
            border: `1px solid ${colors.Active}`,
        },
        warn: {
            border: `1px solid ${colors.Warn}`,
        },
    }

    return (
        <Frame
            // Constants
            {...rest}
            {...interactionProps}
            height={40}
            background="none"
        >
            <Frame
                height={railHeight}
                borderRadius={railHeight / 2}
                center="y"
                width={railWidth}
                left={knobSize / 2}
                background={colors.Neutral}
                border={`${state.valid ? 0 : 1}px solid ${colors.Warn}`}
            />
            <Frame
                height={railHeight}
                borderRadius={4}
                background={color}
                center="y"
                width={state.progress * railWidth}
                left={knobSize / 2}
            />
            {titles && (
                <>
                    <Text
                        text={min.toString()}
                        width={knobSize}
                        y={16}
                        height="100%"
                        type={"caption"}
                        textAlign="center"
                        verticalAlign="bottom"
                    />
                    <Text
                        text={max.toString()}
                        width={knobSize}
                        y={16}
                        x={railWidth}
                        height="100%"
                        type={"caption"}
                        textAlign="center"
                        verticalAlign="bottom"
                    />
                </>
            )}
            <Frame
                size={knobSize}
                x={state.progress * railWidth}
                center="y"
                background="none"
            >
                <Frame
                    background={colors.Light}
                    height={knobSize - 4}
                    width={knobSize - 4}
                    borderRadius="100%"
                    shadow={`0px 2px 5px ${colors.Shadow}`}
                    center
                    {...variants[state.valid ? interactionState : "warn"]}
                />
                {titles && (
                    <Text
                        text={state.value.toFixed(places)}
                        y={-16}
                        center="x"
                        type={"caption"}
                        height={12}
                        textAlign="center"
                        verticalAlign="bottom"
                    />
                )}
            </Frame>
            <Frame
                size={knobSize}
                center="y"
                background="none"
                x={state.progress * railWidth}
                drag={disabled ? false : "x"}
                dragMomentum={false}
                dragElastic={false}
                dragConstraints={{
                    left: 0,
                    right: localWidth - knobSize,
                }}
                onDrag={handleDrag}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            />
        </Frame>
    )
}

Slider.defaultProps = {
    center: true,
    height: 40,
    width: 320,
    step: 0.01,
    value: 62,
    min: 0,
    max: 100,
    titles: false,
    places: 2,
    railHeight: 8,
    knobSize: 40,
    color: colors.Primary,
    validation: v => true,
    onValueChange: () => null,
}

addPropertyControls(Slider, {
    value: {
        type: ControlType.Number,
        min: 0,
        max: 100,
        defaultValue: 62,
        title: "Value",
    },
    min: {
        type: ControlType.Number,
        min: 0,
        max: 100,
        defaultValue: 0,
        title: "Min",
    },
    max: {
        type: ControlType.Number,
        min: 0,
        max: 100,
        defaultValue: 100,
        title: "Max",
    },
    step: {
        type: ControlType.Number,
        min: 0.001,
        max: 100,
        step: 0.001,
        defaultValue: 0.01,
        displayStepper: true,
        title: "Step",
    },
    titles: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Titles",
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: colors.Primary,
    },
    disabled: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Disabled",
    },
})
