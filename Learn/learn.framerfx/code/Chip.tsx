import * as React from "react"
import {
    Frame,
    Color,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { useInteractionState } from "./Hooks"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { toColor } from "./Utils"
import { colors } from "./canvas"

export function Chip(
    props: Partial<
        FrameProps & {
            text: string
            type: string
            clearable: boolean
            onResize: (width: number, height: number) => void
            onClear: () => void
        }
    >
) {
    const {
        clearable,
        text,
        type,
        style,
        onClear,
        onResize,
        onTap,
        ...rest
    } = props

    const { width, height } = props

    /* ---------------------------------- State --------------------------------- */

    const [interactionState, interactionProps] = useInteractionState({
        disabled: false,
        style: props.style,
    })

    // Set initial sizes
    const [state, setState] = React.useState({
        width: width as number,
        height: height as number,
    })

    // Reset sizes (to trigger Text's auto-size)
    React.useLayoutEffect(() => {
        setState({
            width: width as number,
            height: height as number,
        })
    }, [width, height])

    /* ----------------------------- Event Handlers ----------------------------- */

    // When Text resizes, resize this component, too
    const handleResize = React.useCallback(
        (offsetWidth, offsetHeight) => {
            onResize(offsetWidth, offsetHeight)
            setState(state => ({
                ...state,
                width: offsetWidth,
                height: offsetHeight,
            }))
        },
        [onResize]
    )

    /* ------------------------------ Presentation ------------------------------ */

    const fade = 0.16

    const theme = {
        primary: {
            foreground: colors.Primary,
            background: colors.Primary,
        },
        secondary: {
            foreground: colors.Secondary,
            background: colors.Secondary,
        },
        accent: {
            foreground: colors.Accent,
            background: colors.Accent,
        },
        neutral: {
            foreground: Color.alpha(Color(toColor(colors.Dark)), 0.7).toValue(),
            background: colors.Neutral,
        },
        ghost: {
            foreground: colors.Light,
            background: colors.Light,
        },
        warn: {
            foreground: colors.Warn,
            background: colors.Warn,
        },
    }

    return (
        <Frame
            {...rest}
            {...interactionProps}
            {...state} // Resized height and width
            background={Color.alpha(
                Color(toColor(theme[type].background)),
                fade
            )}
            borderRadius={8}
        >
            <Text
                resize
                text={text}
                type="caption"
                color={theme[type].foreground}
                paddingTop={8}
                paddingRight={clearable ? 32 : 12}
                paddingBottom={8}
                paddingLeft={12}
                onTap={onTap}
                onResize={handleResize}
            />
            {clearable && (
                <Frame
                    height="100%"
                    x={state.width - 28}
                    width={24}
                    background="none"
                    onTap={onClear}
                >
                    <Icon
                        icon={"close"}
                        center
                        height={13}
                        width={13}
                        size={13}
                        color={theme[type].foreground}
                    />
                </Frame>
            )}
        </Frame>
    )
}

Chip.defaultProps = {
    height: 60,
    width: 200,
    text: "Item",
    type: "primary",
    clearable: false,
    onTap: () => null,
    onClear: () => null,
    onResize: (width, height) => null,
}

addPropertyControls(Chip, {
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Item",
    },
    type: {
        title: "Type",
        type: ControlType.Enum,
        options: ["primary", "secondary", "accent", "warn", "neutral", "ghost"],
        optionTitles: [
            "Primary",
            "Secondary",
            "Accent",
            "Warn",
            "Neutral",
            "Ghost",
        ],
        defaultValue: "primary",
    },
    clearable: {
        title: "Clearable",
        type: ControlType.Boolean,
        defaultValue: false,
    },
})
