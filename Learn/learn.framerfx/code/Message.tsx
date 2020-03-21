import * as React from "react"
import {
    Frame,
    Stack,
    FrameProps,
    addPropertyControls,
    ControlType,
    useMotionValue,
} from "framer"
import { clamp } from "./Utils"
import { Text } from "./Text"
import { RowItem } from "./RowItem"
import { colors } from "./canvas"

// Open Preview (CMD + P)
// API Reference: https://www.framer.com/api

type Props = Partial<FrameProps> &
    Partial<{
        userName: string
        avatar: string
        date: Date | string
        text: string
        align: "left" | "right" | string
    }>

export function Message(props: Props) {
    const { userName, avatar, date, align, text, height, ...rest } = props

    // When the text resizes, resize the component
    const mvHeight = useMotionValue(height as number)

    const handleResize = React.useCallback((width, height) => {
        mvHeight.set(height + 32)
    }, [])

    // Turn our date into a string
    const dateString = React.useMemo(() => {
        const dateSource = typeof date === "string" ? new Date(date) : date

        return dateSource.toLocaleTimeString("en-us", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
        })
    }, [date])

    const isLeft = align === "left"

    return (
        <Stack
            {...rest}
            height={mvHeight}
            direction="horizontal"
            distribution="start"
            alignment="start"
            gap={16}
        >
            {isLeft && (
                <Frame
                    size={40}
                    borderRadius="100%"
                    image={avatar}
                    background={colors.Secondary}
                />
            )}
            <Stack
                direction="vertical"
                width="1fr"
                alignment={isLeft ? "start" : "end"}
                distribution="start"
                gap={8}
            >
                <Text
                    text={text}
                    textAlign="left"
                    width="100%"
                    type="body"
                    background={colors.Light}
                    borderRadius={
                        align === "left" ? "0px 8px 8px 8px" : "8px 0px 8px 8px"
                    }
                    padding={16}
                    resize
                    onResize={handleResize}
                />
                <Text
                    text={`**${userName}** - ${dateString}`}
                    textAlign="left"
                    width="100%"
                    type="caption"
                    paddingLeft={16}
                    resize
                />
            </Stack>
            {!isLeft && (
                <Frame
                    size={40}
                    borderRadius="100%"
                    image={avatar}
                    background={colors.Accent}
                />
            )}
        </Stack>
    )
}

Message.defaultProps = {
    userName: "xSk8ter720x",
    avatar: "",
    date: new Date(),
    text: "Hey, how's it going?",
    align: "left",
}

addPropertyControls(Message, {
    userName: {
        title: "UserName",
        type: ControlType.String,
        defaultValue: "xSk8ter720x",
    },
    avatar: {
        title: "Avatar",
        type: ControlType.Image,
    },
    date: {
        title: "Date",
        type: ControlType.String,
        defaultValue: "09/16/2020",
    },
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Hey, how's it going?",
    },
    align: {
        title: "Align",
        type: ControlType.SegmentedEnum,
        options: ["left", "right"],
        optionTitles: ["Left", "Right"],
        defaultValue: "left",
    },
})
