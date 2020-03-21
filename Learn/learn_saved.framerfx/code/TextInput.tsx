import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"
import { Interactive } from "./Interactive"
import { Icon } from "./Icon"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    value: string
    disabled: boolean
    required: boolean
    onValueChange: (value: string, valid: boolean) => any
    validation: (value: string) => boolean
} & {
    placeholder: string
    readOnly: boolean
    password: boolean
    message: string | ((value: string, valid: boolean) => string)
    delay: number // in seconds
    clearable: boolean
    onBlur: (value: string, valid: boolean) => void
    onFocus: (value: string, valid: boolean) => void
    onInputStart: () => any
}

export function TextInput(props: Partial<Props>) {
    const {
        value: initialValue,
        placeholder,
        readOnly,
        password,
        validation,
        onInputStart,
        onValueChange,
        message,
        delay,
        clearable,
        required,
        tabIndex,
        ...rest
    } = props

    /* ---------------------------------- State --------------------------------- */

    // Store the input's last value in a ref
    const input = React.useRef<HTMLInputElement>()
    const inputValue = React.useRef(initialValue)

    // Initialize state with props values
    const [state, setState] = React.useState({
        value: initialValue,
        valid: validation(initialValue),
        typing: false,
        focused: false,
    })

    // When the hook receives new props values, overwrite the state
    React.useEffect(() => {
        // Sync inputValue ref with initialValue
        inputValue.current = initialValue

        setState({
            ...state,
            value: initialValue,
            valid: validate(state.value),
        })
    }, [initialValue])

    // Re-validate when required or validation changes
    React.useEffect(() => {
        setState({
            ...state,
            valid: validate(state.value),
        })
    }, [validation, required])

    /* ----------------------------- Event Handlers ----------------------------- */

    // Get a valid state for the current value
    const validate = value =>
        value && value.length > 0
            ? validation(value || initialValue)
            : !required

    // Set the focus state when the user clicks in or out of the input
    const setFocus = (focused: boolean) => {
        if (focused) {
            props.onFocus(state.value, state.valid)
        } else {
            props.onBlur(state.value, state.valid)
        }

        setState({ ...state, focused })
    }

    // When the content of the input changes, run onValueChange and update state
    const handleInput = event => {
        const { value } = event.target

        // Store the value in the inputValue ref
        inputValue.current = value

        // If we're not already typing, run props.onInputStart()
        if (!state.typing) {
            onInputStart()
        }

        // Set value and typing states
        setState({ ...state, value, typing: true })

        // Check whether inputValue is still the same
        delay > 0
            ? // If we have a delay, use the delay
              setTimeout(() => updateState(value), delay * 1000)
            : // Otherwise, check immediately
              updateState(value)
    }

    // A shared callback to update state
    const updateState = value => {
        // Compare the current value against the inputValue ref,
        // and bail if there's a disagreement (it means that the user)
        // has entered new text while the timeout was running
        if (value === inputValue.current) {
            const valid = value ? validate(value) : !required
            onValueChange(value, valid)
            setState({ ...state, typing: false, value, valid })
        }
    }

    // Clear input
    const handleClear = event => {
        inputValue.current = ""
        updateState("")
    }

    /* ------------------------------ Presentation ------------------------------ */

    const { value, valid, focused } = state

    const variants = {
        initial: {
            border: `1px solid ${colors.Neutral}`,
        },
        hovered: {
            border: `1px solid ${colors.Border}`,
        },
        active: {
            border: `1px solid ${colors.Dark}`,
        },
        focused: {
            border: `1px solid ${colors.Dark}`,
        },
        warn: {
            border: `1px solid ${colors.Warn}`,
        },
    }

    return (
        <Interactive {...rest} active={false} overflow={"hidden"}>
            {current => (
                <>
                    <Frame
                        width="100%"
                        height={props.height}
                        background={colors.Light}
                        borderRadius={8}
                        {...variants[
                            valid ? (focused ? "focused" : current) : "warn"
                        ]}
                    />
                    <input
                        ref={input}
                        type={password ? "password" : "text"}
                        value={value || ""}
                        placeholder={placeholder || ""}
                        disabled={props.disabled}
                        readOnly={readOnly}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            padding: clearable
                                ? "0px 40px 0px 12px"
                                : "0px 12px",
                            fontSize: 14,
                            fontWeight: 600,
                            width: "100%",
                            height: "100%",
                            background: "none",
                            borderRadius: 4,
                            outline: "none",
                            border: "none",
                            color: valid ? colors.Dark : colors.Warn,
                        }}
                        tabIndex={tabIndex}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onChange={handleInput}
                    />
                    {clearable && value && !readOnly && !props.disabled && (
                        <Frame
                            background="none"
                            height={props.height}
                            width={40}
                            right={0}
                            top={0}
                            onTap={handleClear}
                        >
                            <Frame
                                center
                                height={16}
                                width={16}
                                background={colors.Neutral}
                                borderRadius="100%"
                            >
                                <Icon
                                    icon={"close"}
                                    center
                                    y={1}
                                    height={13}
                                    width={13}
                                    size={13}
                                    color={colors.Light}
                                />
                            </Frame>
                        </Frame>
                    )}
                    {!!message && (
                        <div
                            style={{
                                width: "100%",
                                position: "absolute",
                                top: 50,
                                left: 0,
                                padding: 8,
                                fontFamily: "Helvetica Neue",
                                color: valid ? colors.Dark : colors.Warn,
                                fontSize: 12,
                            }}
                        >
                            {message
                                ? typeof message === "function"
                                    ? message(state.value, state.valid)
                                    : message
                                : ""}
                        </div>
                    )}
                </>
            )}
        </Interactive>
    )
}

TextInput.defaultProps = {
    value: undefined,
    placeholder: undefined,
    disabled: false,
    required: false,
    readOnly: false,
    tabIndex: -1,
    message: null,
    clearable: true,
    onFocus: () => null,
    onBlur: () => null,
    validation: v => true,
    onInputStart: () => null,
    onValueChange: () => null,
    delay: 0.25,
    height: 50,
    width: 320,
}

addPropertyControls(TextInput, {
    value: {
        type: ControlType.String,
        defaultValue: "",
        title: "Value",
    },
    placeholder: {
        type: ControlType.String,
        defaultValue: "",
        title: "Placeholder",
    },
    message: {
        type: ControlType.String,
        defaultValue: "",
        title: "Message",
    },
    password: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Password",
    },
    readOnly: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Read Only",
    },
    clearable: {
        type: ControlType.Boolean,
        defaultValue: true,
        title: "Clearable",
    },
    required: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Required",
    },
    disabled: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Disabled",
    },
})
