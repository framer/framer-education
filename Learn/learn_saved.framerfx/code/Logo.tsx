import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"
import { colors } from "./canvas"

type Props = FrameProps & {
    flat: boolean
    fill: string
}

export function Logo(props: Partial<Props>) {
    const { flat, fill, ...rest } = props

    return (
        <Frame background="none" borderRadius={"100%"} {...rest}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 50 50`}
                width="100%"
                height="100%"
            >
                <defs>
                    <linearGradient
                        id="idsKMxYfO70g124009"
                        gradientTransform="rotate(45, 0.5, 0.5)"
                    >
                        <stop
                            offset="0"
                            stopColor={flat ? fill : colors.Primary}
                            stopOpacity="1"
                        />
                        <stop
                            offset="1"
                            stopColor={flat ? fill : colors.Secondary}
                            stopOpacity="1"
                        />
                    </linearGradient>
                </defs>
                <circle
                    cx={25}
                    cy={25}
                    r={23.5}
                    fill={flat ? "none" : colors.Light}
                    strokeWidth="3"
                    stroke="url(#idsKMxYfO70g124009)"
                />
                <g transform="translate(9.834 10.212)">
                    <path
                        d="M 3.734 14.088 C 3.653 13.098 2.204 13.098 2.122 14.088 L 1.38 23.121 C 1.339 23.618 1.485 24.113 1.79 24.508 L 2.122 24.937 C 2.53 25.465 3.327 25.465 3.734 24.937 L 4.066 24.508 C 4.371 24.113 4.518 23.618 4.477 23.121 Z"
                        transform="translate(0 .8)"
                        fill={flat ? fill : colors.Accent}
                    />
                    <path
                        d="M 16.127 0.145 C 15.809 -0.048 15.41 -0.048 15.092 0.145 L 0.482 8.99 C -0.161 9.379 -0.161 10.312 0.482 10.701 L 15.092 19.547 C 15.41 19.739 15.809 19.739 16.127 19.547 L 30.737 10.701 C 31.38 10.312 31.38 9.379 30.737 8.99 Z"
                        fill={flat ? fill : colors.Primary}
                    />
                    <path
                        d="M 24.431 22.663 C 24.431 23.344 24.085 23.977 23.513 24.345 L 16.691 28.734 C 16.032 29.158 15.186 29.158 14.527 28.734 L 7.706 24.345 C 7.134 23.977 6.788 23.344 6.788 22.663 L 6.788 16.077 L 15.092 21.104 C 15.41 21.297 15.809 21.297 16.127 21.104 L 24.431 16.077 Z"
                        fill={flat ? fill : colors.Primary}
                    />
                </g>
            </svg>
        </Frame>
    )
}

Logo.defaultProps = {
    width: 200,
    height: 200,
    flat: false,
    fill: colors.Darker,
}

addPropertyControls(Logo, {
    flat: {
        type: ControlType.Boolean,
        defaultValue: false,
    },
    fill: {
        type: ControlType.Color,
        defaultValue: colors.Darker,
        hidden: ({ flat }) => !flat,
    },
})
