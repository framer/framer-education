import * as React from "react"
import {
    Frame,
    Stack,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { Icon } from "./Icon"
import { Switch } from "./Switch"
import { Checkbox } from "./Checkbox"
import { Radio } from "./Radio"
import { Text } from "./Text"
import { Stepper } from "./Stepper"
import { Favorite } from "./Favorite"
import { iconNames, iconTitles } from "./Shared"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    text: string
    message: string
    component:
        | string
        | "none"
        | "text"
        | "checkbox"
        | "favorite"
        | "radio"
        | "switch"
        | "icon"
        | "stepper"
    icon: string
    clamp: boolean
    min: number
    max: number
    step: number
    value: number | boolean | string
    required: boolean
    pc_number_value: number
    pc_boolean_value: boolean
    pc_string_value: string
    paddingLeft: number
    disabled: boolean
    color: string
    validation: (value: boolean | number) => boolean
    onValueChange: (value: boolean | number) => void
}

export function RowItem(props: Partial<Props>) {
    const {
        text,
        message,
        component,
        icon,
        clamp,
        min,
        max,
        step,
        value: overrideValue,
        required,
        pc_number_value = 0,
        pc_boolean_value = false,
        pc_string_value = "",
        paddingLeft,
        disabled,
        color,
        validation,
        onValueChange,
        ...rest
    } = props

    const rightComponent = React.useMemo(() => {
        const inputProps = {
            disabled,
            validation,
            onValueChange,
        }

        const stepperProps = {
            ...inputProps,
            clamp,
            min,
            max,
            step,
        }

        switch (component) {
            case "text":
                return (
                    <Text
                        textAlign="right"
                        type="body"
                        color={color}
                        text={(overrideValue as string) || pc_string_value}
                    />
                )
            case "icon":
                return <Icon color={color} icon={icon} />
            case "stepper":
                return (
                    <Stepper
                        {...stepperProps}
                        value={(overrideValue as number) || pc_number_value}
                    />
                )
            case "switch":
                return (
                    <Switch
                        {...inputProps}
                        value={(overrideValue as boolean) || pc_boolean_value}
                    />
                )
            case "favorite":
                return (
                    <Favorite
                        {...inputProps}
                        value={(overrideValue as boolean) || pc_boolean_value}
                    />
                )
            case "checkbox":
                return (
                    <Checkbox
                        {...inputProps}
                        value={(overrideValue as boolean) || pc_boolean_value}
                    />
                )
            case "radio":
                return (
                    <Radio
                        {...inputProps}
                        value={(overrideValue as boolean) || pc_boolean_value}
                    />
                )
            default:
                return null
        }
    }, [
        component,
        disabled,
        overrideValue,
        pc_boolean_value,
        pc_string_value,
        pc_number_value,
    ])

    return (
        <Frame
            background="none"
            {...rest}
            style={{ ...props.style, cursor: "pointer" }}
        >
            <Stack
                height="100%"
                width="100%"
                direction="horizontal"
                alignment="center"
                distribution="space-between"
                gap={0}
                padding={0}
            >
                <Stack
                    height="100%"
                    width="1fr"
                    direction="vertical"
                    alignment="start"
                    distribution="center"
                    gap={4}
                    padding={0}
                >
                    <Text
                        type="body"
                        textAlign="left"
                        text={text}
                        resize
                        paddingLeft={paddingLeft}
                    />
                    {message && (
                        <Text
                            type="caption"
                            textAlign="left"
                            text={message}
                            resize
                            paddingLeft={paddingLeft}
                        />
                    )}
                </Stack>
                {rightComponent}
            </Stack>
        </Frame>
    )
}

RowItem.defaultProps = {
    height: 50,
    width: 250,
    text: "Row Item",
    message: "",
    component: "none",
    required: false,
    validation: () => true,
    onValueChange: () => null,
    icon: "chevron-right",
    color: colors.Primary,
    onTap: () => null,
}

addPropertyControls(RowItem, {
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Row Item",
    },
    message: {
        title: "Message",
        type: ControlType.String,
        defaultValue: "",
    },
    component: {
        title: "Right",
        type: ControlType.Enum,
        options: [
            "none",
            "text",
            "favorite",
            "checkbox",
            "radio",
            "switch",
            "icon",
            "stepper",
        ],
        optionTitles: [
            "None",
            "Text",
            "Favorite",
            "Checkbox",
            "Radio",
            "Switch",
            "Icon",
            "Stepper",
        ],
        defaultValue: "none",
    },
    pc_number_value: {
        title: "Value",
        type: ControlType.Number,
        displayStepper: true,
        defaultValue: 0,
        min: -Infinity,
        max: Infinity,
        hidden: ({ component }) => component !== "stepper",
    },
    pc_boolean_value: {
        title: "Value",
        type: ControlType.Boolean,
        defaultValue: false,
        hidden: ({ component }) =>
            !(
                component === "switch" ||
                component === "checkbox" ||
                component === "favorite" ||
                component === "radio"
            ),
    },
    pc_string_value: {
        title: "Value",
        type: ControlType.String,
        hidden: ({ component }) => component !== "text",
    },
    icon: {
        title: "Icon",
        type: ControlType.Enum,
        options: iconNames,
        optionTitles: iconTitles,
        defaultValue: "chevron-right",
        hidden: ({ right, component }) => !(component === "icon"),
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: colors.Primary,
        hidden: ({ right, component }) =>
            !(component === "text" || component == "icon"),
    },
    clamp: {
        title: "Clamp Value",
        type: ControlType.Boolean,
        defaultValue: false,
        hidden: ({ component }) => component !== "stepper",
    },
    min: {
        title: "Min",
        type: ControlType.Number,
        displayStepper: true,
        min: 0,
        max: Infinity,
        defaultValue: 0,
        hidden: ({ clamp, component }) => component !== "stepper" || !clamp,
    },
    max: {
        title: "Max",
        type: ControlType.Number,
        displayStepper: true,
        min: 0,
        max: Infinity,
        defaultValue: 10,
        hidden: ({ clamp, component }) => component !== "stepper" || !clamp,
    },
    step: {
        title: "Step",
        type: ControlType.Number,
        displayStepper: true,
        min: 0,
        max: Infinity,
        defaultValue: 1,
        hidden: ({ component }) => component !== "stepper",
    },
})
