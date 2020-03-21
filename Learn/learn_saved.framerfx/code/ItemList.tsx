import * as React from "react"
import {
    Frame,
    ScrollProps,
    Stack,
    Scroll,
    addPropertyControls,
    ControlType,
} from "framer"
import { List } from "./List"
import { RowItem } from "./RowItem"

type ListItem = {
    text: string
    onTap: (item) => void
    component: string
    icon: string
    value: number | boolean
    onValueChange: (value) => void
}

type Props = Partial<ScrollProps> & {
    items: ListItem[]
    gap: number
    emptyText?: string
    padding: number
    paddingTop: number
    paddingLeft: number
    paddingRight: number
    paddingBottom: number
    paddingPerSide: boolean
}

export function ItemList(props: Props) {
    const { items, ...rest } = props

    const content = React.useMemo(
        () =>
            items.map((item, index) => {
                return <RowItem key={`card_${index}`} width="1fr" {...item} />
            }),
        [items]
    )

    return <List {...rest} content={content} />
}

ItemList.defaultProps = {
    width: 320,
    height: 520,
    items: [],
    emptyText: "Nothing to see here.",
}

addPropertyControls(ItemList, {
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
})
