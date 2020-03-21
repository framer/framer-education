import * as React from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    FrameProps,
    Stack,
} from "framer"
import { Icon } from "./Icon"
import { Text } from "./Text"
import { iconNames, iconTitles } from "./Shared"
import { useInteractionState } from "./Hooks"
import { colors } from "./canvas"

type Props = Partial<FrameProps> &
    Partial<{
        text: string
        icon: string
        contentType: string
        alignIcon: string
        type: string
        toggle: boolean
        toggled: boolean
        disabled: boolean
        onTap?: (toggled: boolean | null) => void
    }>

export function Button(props: Props) {
    const {
        type,
        text,
        contentType,
        icon,
        alignIcon,
        onTap,
        disabled,
        toggle,
        toggled: initialToggled,
        style,
        ...rest
    } = props

    /* ---------------------------------- State --------------------------------- */

    // Initialize state with props values
    const [state, setState] = React.useState({
        toggled: toggle ? initialToggled || false : null,
    })

    // When the hook receives new props, overwrite the state
    React.useEffect(() => {
        setState({
            ...state,
            toggled: toggle ? initialToggled || false : null,
        })
    }, [initialToggled])

    const [interactiveState, interactiveProps] = useInteractionState({
        disabled,
        toggled: state.toggled,
        style,
    })

    /* ----------------------------- Event Handlers ----------------------------- */

    // When the user taps on the button, run onTap and update toggled
    const handleTap = (event, info) => {
        if (toggle) {
            const toggled = !state.toggled
            onTap(toggled)
            setState({
                ...state,
                toggled,
            })
        } else {
            onTap(null)
        }
    }

    /* ------------------------------ Presentation ------------------------------ */

    const theme = {
        primary: {
            foreground: colors.Light,
            background: colors.Primary,
        },
        secondary: {
            foreground: colors.Light,
            background: colors.Secondary,
        },
        accent: {
            foreground: colors.Light,
            background: colors.Accent,
        },
        neutral: {
            foreground: colors.Dark,
            background: colors.Neutral,
        },
        warn: {
            foreground: colors.Light,
            background: colors.Warn,
        },
        ghost: {
            foreground: colors.Primary,
            background: "none",
        },
    }

    const variants = {
        initial: {
            style: {
                filter: `brightness(1)`,
            },
        },
        hovered: {
            style: {
                filter: `brightness(1.055)`,
            },
        },
        toggled: {
            style: {
                filter: `brightness(.8)`,
            },
        },
        active: {
            style: {
                filter: `brightness(.95)`,
            },
        },
    }

    const variant =
        type === "ghost"
            ? { border: `1px solid ${colors.Primary}` }
            : variants[interactiveState]

    const iconComponent = <Icon icon={icon} color={theme[type].foreground} />

    return (
        <Frame
            {...rest}
            {...interactiveProps}
            onTap={!disabled && handleTap}
            borderRadius={8}
            background={theme[type].background}
            {...variant}
            style={{ ...variant.style, ...interactiveProps.style, ...style }}
        >
            <Stack
                width="100%"
                height="100%"
                alignment="center"
                distribution="center"
                direction="horizontal"
                gap={-4}
            >
                {contentType === "both" &&
                    alignIcon === "left" &&
                    iconComponent}
                {contentType === "icon" ? (
                    iconComponent
                ) : (
                    <Text
                        resize
                        // Constant props
                        type="link"
                        color={theme[type].foreground}
                        text={text}
                    />
                )}
                {contentType === "both" &&
                    alignIcon === "right" &&
                    iconComponent}
            </Stack>
        </Frame>
    )
}

Button.defaultProps = {
    height: 60,
    width: 320,
    borderRadius: 8,
    disabled: false,
    text: "Get Started!",
    icon: "check",
    type: "primary",
    primary: true,
    toggle: false,
    onTap: () => null,
}

addPropertyControls(Button, {
    text: {
        type: ControlType.String,
        title: "Text",
        defaultValue: "Get Started!",
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
    contentType: {
        title: "Show",
        type: ControlType.SegmentedEnum,
        options: ["text", "icon", "both"],
        optionTitles: ["Text", "Icon", "Both"],
        defaultValue: "text",
    },
    alignIcon: {
        title: "Align icon",
        type: ControlType.SegmentedEnum,
        options: ["left", "right"],
        optionTitles: ["<", ">"],
        defaultValue: "left",
        hidden: ({ contentType }) => contentType === "text",
    },
    icon: {
        title: "Icon",
        type: ControlType.Enum,
        options: iconNames,
        optionTitles: iconTitles,
        defaultValue: "check",
        hidden: ({ contentType }) => contentType === "text",
    },
    toggle: {
        type: ControlType.Boolean,
        title: "Toggle",
        defaultValue: false,
    },
    toggled: {
        type: ControlType.Boolean,
        title: "Toggled",
        defaultValue: false,
        hidden: ({ toggle }) => !toggle,
    },
    disabled: {
        type: ControlType.Boolean,
        title: "Disabled",
        defaultValue: false,
    },
})
