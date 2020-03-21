import * as React from "react"
import { Stack, addPropertyControls, ControlType, FrameProps } from "framer"
import { iconNames, iconTitles } from "./Shared"
import { url } from "framer/resource"
//@ts-ignore
import * as Icons from "./icons.json"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    icon: string
    size?: number
    color?: string
}

export function Icon(props: Props) {
    const { icon, color, size, ...rest } = props

    /* ------------------------------ Presentation ------------------------------ */

    const path = React.useMemo(() => Icons[icon], [icon])

    return (
        <Stack
            {...rest}
            background="none"
            alignment="center"
            distribution="center"
        >
            <svg
                viewBox={`0 0 24 24`}
                style={{
                    height: size,
                    width: size,
                    alignSelf: "center",
                    justifySelf: "center",
                }}
                height={size}
                width={size}
            >
                <path d={path} fill={color} />
            </svg>
        </Stack>
    )
}

Icon.defaultProps = {
    icon: "camera",
    color: colors.Primary,
    height: 40,
    width: 40,
    size: 24,
    interactive: false,
    disabled: false,
}

addPropertyControls(Icon, {
    icon: {
        title: "Icon",
        type: ControlType.Enum,
        options: iconNames,
        optionTitles: iconTitles,
        defaultValue: "camera",
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: colors.Primary,
    },
    size: {
        title: "Size",
        type: ControlType.Number,
        min: 0,
        max: 96,
        defaultValue: 24,
    },
})
