import * as React from "react"
import {
    Frame,
    ScrollProps,
    Stack,
    Scroll,
    addPropertyControls,
    ControlType,
} from "framer"
import { Text } from "./Text"

type Props = Partial<ScrollProps> &
    Partial<{
        pc_content: any[]
        gap: number
        scroll: boolean
        emptyText: string
        padding: number
        paddingTop: number
        paddingLeft: number
        paddingRight: number
        paddingBottom: number
        paddingPerSide: boolean
    }> & {
        content: any[]
    }

export function List(props: Props) {
    const {
        content,
        pc_content,
        gap,
        scroll,
        emptyText,
        paddingPerSide,
        padding,
        paddingTop,
        paddingLeft,
        paddingRight,
        paddingBottom,
        ...rest
    } = props

    // Calculate paddings
    const paddings = paddingPerSide
        ? {
              paddingRight,
              paddingBottom,
              paddingLeft,
              paddingTop,
          }
        : paddingPerSide === undefined
        ? {
              padding,
              paddingRight: paddingRight || padding,
              paddingBottom: paddingBottom || padding,
              paddingLeft: paddingLeft || padding,
              paddingTop: paddingTop || padding,
          }
        : {
              padding,
          }

    // Clone attached Frames
    const pcContent = React.useMemo(() => {
        return pc_content
            .filter(i => !!i)
            .map((item, index) =>
                React.cloneElement(item, { key: "pcContent_" + index })
            )
    }, [pc_content])

    // Clone provided content prop (just to be sure)
    const ccContent = React.useMemo(() => {
        return content
            .filter(i => !!i)
            .map((item, index) =>
                React.cloneElement(item, {
                    key: item.props.key || "ccContent_" + index,
                })
            )
    }, [content])

    const combinedContent = [...pcContent, ...ccContent]

    return (
        <Scroll {...rest} dragEnabled={scroll} background="none">
            <Stack
                width="100%"
                direction="vertical"
                height="auto"
                background="none"
                gap={gap}
                {...paddings}
            >
                {combinedContent.length > 0 ? (
                    combinedContent
                ) : (
                    <Text
                        height={128}
                        width="1fr"
                        type="body"
                        text={emptyText}
                    />
                )}
            </Stack>
        </Scroll>
    )
}

List.defaultProps = {
    width: 320,
    height: 520,
    content: [],
    pc_content: [],
    gap: 8,
    scroll: true,
    emptyText: "Nothing to see here.",
    padding: 0,
}

addPropertyControls(List, {
    emptyText: {
        title: "Empty Text",
        type: ControlType.String,
        defaultValue: "Nothing to see here.",
    },
    gap: {
        title: "Gap",
        type: ControlType.Number,
        displayStepper: true,
        defaultValue: 8,
    },
    padding: {
        title: "Padding",
        type: ControlType.FusedNumber,
        toggleKey: "paddingPerSide",
        toggleTitles: ["All Sides", "Per Side"],
        valueKeys: [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
        ],
        valueLabels: ["T", "R", "B", "L"],
        min: 0,
    },
    pc_content: {
        title: "Content",
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.ComponentInstance,
        },
        defaultValue: [],
    },
})
