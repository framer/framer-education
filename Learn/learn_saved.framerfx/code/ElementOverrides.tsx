import * as React from "react"
import { Override, Data, Frame } from "framer"

// Override Docs: https://framer.com/docs/overrides

const state = Data({
    values: [0, 0, 0],
    prices: [0.25, 0.5, 1.2],
})

export function StepperA(): Override {
    return {
        value: state.values[0],
        onValueChange: v => {
            const values = state.values
            values[0] = v
            state.values = values
        },
    }
}

export function StepperB(): Override {
    return {
        value: state.values[1],
        onValueChange: v => {
            const values = state.values
            values[1] = v
            state.values = values
        },
    }
}

export function StepperC(): Override {
    return {
        value: state.values[2],
        onValueChange: v => {
            const values = state.values
            values[2] = v
            state.values = values
        },
    }
}

export function Total(): Override {
    return {
        text:
            "$" +
            state.values
                .reduce((a, c, i) => a + c * state.prices[i])
                .toFixed(2),
    }
}

export function Segment(): Override {
    return {
        validation: v => v === "Red",
    }
}

export function CheckboxGroup(): Override {
    return {
        validation: v => v.includes("Red"),
    }
}

export function RadioGroup(): Override {
    return {
        validation: v => v === "Red",
    }
}

export function Slider(): Override {
    return {
        validation: v => v > 20,
    }
}

export function ChipList(): Override {
    return {
        chips: [
            {
                text: "Item A",
                type: "primary",
            },
            {
                text: "Item B",
                type: "secondary",
            },
            {
                text: "Item C",
                type: "accent",
                clearable: true,
            },
        ],
    }
}

export function ItemList(): Override {
    return {
        items: [
            {
                text: "Item A",
            },
            {
                text: "Item B",
                component: "stepper",
                value: 4,
                min: 2,
                max: 8,
                step: 2,
            },
            {
                text: "Item C",
                component: "switch",
                value: true,
            },
        ],
    }
}

export function CardList(): Override {
    return {
        cards: [
            {
                title: "Card A",
            },
            {
                title: "Card B",
                footer: "Footer...",
            },
            {
                title: "Card C",
                body: "Body...",
            },
        ],
    }
}

export function List(): Override {
    return {
        content: [<Frame />, <Frame />, <Frame />],
    }
}
