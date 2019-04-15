import * as React from "react"
import { Frame, Color, addPropertyControls, ControlType } from "framer"

type Props = {
    height: number
    width: number
    value: boolean
    disabled: boolean
    tint: string
    accent: string
    validation: (value: boolean) => boolean
    onValueChange: (value: boolean, valid: boolean) => any
}

/**
 * Switch
 * @param props
 */
export function Radio(props: Partial<Props>) {
    // Grab the properties we want to use from props (note that we're
    // renaming value to avoid conflicting with the state's value
    // property
    const {
        value: initialValue,
        disabled,
        onValueChange,
        validation,
        height,
        width,
        tint,
        accent,
    } = props

    /* ---------------------------------- State --------------------------------- */

    // Initialize state with props values
    const [state, setState] = React.useState({
        value: initialValue,
        valid: validation(initialValue),
        active: false,
        hovered: false,
    })

    // When the hook receives new props values, overwrite the state
    React.useEffect(() => {
        setState({
            ...state,
            value: initialValue,
            valid: validation(initialValue),
        })
    }, [initialValue])

    /* ----------------------------- Event Handlers ----------------------------- */

    // Set the hovered state when the user mouses in or out
    const setHover = (hovered: boolean) =>
        setState({ ...state, hovered, active: hovered ? state.active : false })

    // Set the active state when the user mouses down or up
    const setActive = (active: boolean) => setState({ ...state, active })

    // When the user taps on the switch, run onValueChange and flip the isOn state
    const handleTap = () => {
        if (disabled) return

        setState(state => {
            const value = !state.value

            const valid = validation(value)

            onValueChange(value, valid)

            return {
                ...state,
                value,
                valid,
            }
        })
    }

    /* ------------------------------ Presentation ------------------------------ */

    // Grab the properties we want to use from state
    const { value, valid, hovered, active } = state

    const tintColor = Color(tint)
    const accentColor = Color(accent)

    // Define a set of variants for our options
    const variants = {
        initial: {
            background: Color.alpha(tintColor, 0),
            color: tintColor,
        },
        hovered: {
            background: Color.alpha(tintColor, 0),
            color: accent,
        },
        active: {
            background: Color.alpha(tintColor, 0.5),
            color: accent,
        },
        selected: {
            background: tintColor,
            color: accent,
        },
    }

    // Decide which variant to use
    const currentVariant = disabled
        ? value
            ? "selected"
            : "initial"
        : value
        ? "selected"
        : active
        ? "active"
        : hovered
        ? "hovered"
        : "initial"

    return (
        <Frame
            // Pass in container props when using this component in code
            {...props as any}
            // Constants
            size="100%"
            borderRadius="100%"
            color={accent}
            opacity={disabled ? 0.3 : 1}
            border={`2px solid ${tint}`}
            shadow={valid ? "none" : "0 2px 0px 0px #8855ff"}
            transition={{
                type: "tween",
                duration: 0.16,
            }}
            style={{
                fontSize: 14,
                fontWeight: 600,
            }}
            // Variants
            variants={variants}
            initial={currentVariant}
            animate={currentVariant}
            // Events
            onClick={handleTap}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
        >
            <Frame
                size={height - 10}
                borderRadius="100%"
                background={accent}
                opacity={value ? 1 : 0}
                scale={value ? 1 : 0.8}
                center
                transition={{
                    type: "tween",
                    duration: 0.15,
                }}
            />
        </Frame>
    )
}

// Set the component's default properties
Radio.defaultProps = {
    value: false,
    disabled: false,
    height: 32,
    width: 32,
    tint: "#027aff",
    accent: "#FFFFFF",
    validation: () => true,
    onValueChange: () => null,
}

// Set the component's property controls
addPropertyControls(Radio, {
    value: {
        type: ControlType.Boolean,
        title: "On",
    },
    disabled: {
        type: ControlType.Boolean,
        title: "Disabled",
    },
    tint: {
        type: ControlType.Color,
        defaultValue: "#027aff",
        title: "Tint",
    },
    accent: {
        type: ControlType.Color,
        defaultValue: "#FFFFFF",
        title: "Accent",
    },
})
