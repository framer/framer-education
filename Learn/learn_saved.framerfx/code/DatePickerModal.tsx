import * as React from "react"
import {
    Frame,
    Stack,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { Text } from "./Text"
import { Button } from "./Button"
import { range } from "./Utils"
import { colors } from "./canvas"
import { Modal } from "./Modal"
import { DatePicker } from "./DatePicker"

type Props = FrameProps & {
    id: string
    open: boolean
    range: boolean
    date: string
    start: string
    end: string
    onChangeDate: (date: Date) => void
    onChangeRange: (start: Date, end: Date) => void
    onSelectDate: (date: Date, end?: Date) => void
}

export function DatePickerModal(props: Partial<Props>) {
    const {
        id,
        open,
        date,
        start,
        end,
        range: useRange,
        onChangeRange,
        onChangeDate,
        onSelectDate,
        ...rest
    } = props

    const d = new Date(Date.parse(date))
    const e = new Date(Date.parse(end))
    const s = new Date(Date.parse(start))

    /* ---------------------------------- State --------------------------------- */

    const [state, setState] = React.useState({
        open,
        selected: d,
        start: s,
        end: e,
    })

    // Update state when props.open changes
    React.useEffect(() => {
        setState({
            ...state,
            open,
        })
    }, [open])

    // Update state when props.date changes
    React.useEffect(() => {
        setState({
            ...state,
            selected: d,
        })
    }, [date])

    React.useEffect(() => {
        setState({
            ...state,
            end: e,
            start: s,
        })
    }, [range])

    React.useEffect(() => {
        setState({
            ...state,
            end: e,
        })
    }, [end])

    React.useEffect(() => {
        setState({
            ...state,
            start: s,
        })
    }, [start])

    /* ----------------------------- Event Handlers ----------------------------- */

    // Update state when the user taps select date
    const handleChangeDate = () => {
        useRange
            ? onChangeRange(state.start, state.end)
            : onChangeDate(state.selected)
        setState({
            ...state,
            open: false,
        })
    }

    const handleSelectRange = (start, end) => {
        setState({
            ...state,
            start,
            end,
        })
    }

    // Update state when the user selects a new date
    const handleSelectDate = selected => {
        setState({
            ...state,
            selected,
        })
    }

    /* ------------------------------ Presentation ------------------------------ */

    return (
        <Modal {...rest} open={state.open}>
            <Stack
                width={320}
                height={356 + 96 + 80}
                borderRadius={8}
                border={`1px solid ${colors.Border}`}
                overflow="hidden"
                gap={0}
                direction="vertical"
                background={colors.Light}
                shadow={`0px 2px 16px ${colors.Shadow}`}
                variants={{
                    closed: {
                        opacity: 0,
                        scale: 0.95,
                        y: 16,
                        transition: {
                            type: "tween",
                            ease: "easeIn",
                            duration: 0.16,
                            delay: 0.15,
                        },
                    },
                    open: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.26,
                        },
                    },
                }}
            >
                <Stack
                    direction="vertical"
                    alignment="start"
                    width={"1fr"}
                    height={96}
                    gap={0}
                    padding={16}
                    background={colors.Primary}
                >
                    {useRange ? (
                        <RangeSelectionTitle
                            start={state.start}
                            end={state.end}
                        />
                    ) : (
                        <SingleSelectionTitle selected={state.selected} />
                    )}
                </Stack>
                <DatePicker
                    date={state.selected}
                    range={useRange}
                    start={s.toISOString()}
                    end={e.toISOString()}
                    onChangeRange={handleSelectRange}
                    onChangeDate={handleSelectDate}
                />
                <Stack
                    direction="horizontal"
                    width="1fr"
                    height={64}
                    paddingLeft={16}
                    paddingRight={16}
                >
                    <Button
                        text="Select Date"
                        width="1fr"
                        onTap={handleChangeDate}
                        disabled={
                            useRange
                                ? !(state.start && state.end)
                                : !state.selected
                        }
                    />
                </Stack>
            </Stack>
        </Modal>
    )
}

DatePickerModal.defaultProps = {
    height: 714,
    width: 375,
    open: false,
    range: false,
    date: "04/20/2019",
    start: "04/02/2019",
    end: "04/07/2019",
    onChangeDate: (date: Date) => null,
    onChangeRange: (start: Date, end: Date) => null,
}

addPropertyControls(DatePickerModal, {
    open: {
        title: "Open",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    range: {
        title: "Range",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    date: {
        title: "Date",
        type: ControlType.String,
        defaultValue: "04/20/2019",
        hidden: ({ range }) => range,
    },
    start: {
        title: "Start",
        type: ControlType.String,
        defaultValue: "04/02/2019",
        hidden: ({ range }) => !range,
    },
    end: {
        title: "End",
        type: ControlType.String,
        defaultValue: "04/19/2019",
        hidden: ({ range }) => !range,
    },
})

const SingleSelectionTitle = props => {
    const { selected } = props
    return (
        <>
            <Text
                textAlign="left"
                type="body"
                color={colors.Light}
                height={32}
                width={"1fr"}
                text={selected.getFullYear()}
            />
            <Text
                textAlign="left"
                type={"h2"}
                width={"1fr"}
                color={colors.Light}
                height={"1fr"}
                text={selected.toLocaleDateString("en-us", {
                    weekday: "long",
                    month: "short",
                    day: "2-digit",
                })}
            />
        </>
    )
}

const RangeSelectionTitle = props => {
    const { start, end } = props

    return (
        <>
            <Stack
                distribution="space-between"
                direction="horizontal"
                height={32}
                width={"100%"}
            >
                <Text
                    height={"1fr"}
                    width={"1fr"}
                    textAlign="left"
                    type="body"
                    color={colors.Light}
                    text={start.getFullYear()}
                />
                <Text
                    height={"1fr"}
                    width={"1fr"}
                    textAlign="right"
                    type="body"
                    color={colors.Light}
                    text={end.getFullYear()}
                />
            </Stack>
            <Stack
                width={"100%"}
                height={"2fr"}
                distribution="space-between"
                direction="horizontal"
            >
                <Text
                    type={"lead"}
                    width={"1fr"}
                    height={"100%"}
                    color={colors.Light}
                    textAlign="left"
                    text={start.toLocaleDateString("en-us", {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                    })}
                />
                <Text
                    width={30}
                    text={"–"}
                    height={"100%"}
                    textAlign="center"
                    color={colors.Light}
                />
                <Text
                    type={"lead"}
                    width={"1fr"}
                    height={"100%"}
                    color={colors.Light}
                    textAlign="right"
                    text={end.toLocaleDateString("en-us", {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                    })}
                />
            </Stack>
        </>
    )
}
