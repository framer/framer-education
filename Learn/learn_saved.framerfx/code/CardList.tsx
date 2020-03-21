import * as React from "react"
import {
    FrameProps,
    ScrollProps,
    Stack,
    Scroll,
    addPropertyControls,
    ControlType,
} from "framer"
import { Card } from "./Card"
import { List } from "./List"

type CardItem = Partial<FrameProps> &
    Partial<{
        overlay: boolean
        color: string
        title: string
        image: string
        body: string
        header: string
        footer: string
        autosize: boolean
        favorite: boolean
        isFavorite: boolean
        onTap: () => void
        onFavoriteChange: (favorite: boolean) => void
    }>

type Props = Partial<ScrollProps> & {
    cards: CardItem[]
    gap: number
    emptyText?: string
    padding: number
    paddingTop: number
    paddingLeft: number
    paddingRight: number
    paddingBottom: number
    paddingPerSide: boolean
}

export function CardList(props: Props) {
    const { cards, ...rest } = props

    const content = React.useMemo(
        () =>
            cards.map((card, index) => {
                return <Card key={`card_${index}`} width="1fr" {...card} />
            }),
        [cards]
    )

    return <List {...rest} content={content} />
}

CardList.defaultProps = {
    width: 320,
    height: 520,
    cards: [],
    emptyText: "Nothing to see here.",
}

addPropertyControls(CardList, {
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
