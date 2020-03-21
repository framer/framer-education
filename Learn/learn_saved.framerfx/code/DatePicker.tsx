import * as React from "react"
import {
    Frame,
    Stack,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { range, chunk, isEqual } from "./Utils"
import { colors } from "./canvas"

const dayAbbreviations = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

type Props = FrameProps & {
    id: string
    range: boolean
    date: string | Date
    start: string | Date
    end: string | Date
    onChangeDate: (date: Date) => void
    onChangeRange: (start: Date, end: Date) => void
}

export function DatePicker(props: Partial<Props>) {
    const {
        id,
        date,
        range: useRange,
        start,
        end,
        onChangeDate,
        onChangeRange,
        ...rest
    } = props

    /* ---------------------------------- State --------------------------------- */

    const d = typeof date === "string" ? new Date(Date.parse(date)) : date
    const e = typeof end === "string" ? new Date(Date.parse(end)) : end
    const s = typeof start === "string" ? new Date(Date.parse(start)) : start

    const [state, setState] = React.useState({
        setting: "start",
        display: {
            month: d.getMonth(),
            year: d.getFullYear(),
        },
        selected: {
            month: d.getMonth(),
            year: d.getFullYear(),
            date: d.getDate(),
        },
        start: {
            month: s.getMonth(),
            year: s.getFullYear(),
            date: s.getDate(),
        },
        end: {
            month: e.getMonth(),
            year: e.getFullYear(),
            date: e.getDate(),
        },
    })

    // Update state when date prop changes
    React.useEffect(() => {
        setState({
            ...state,
            display: {
                month: (useRange ? s : d).getMonth(),
                year: (useRange ? s : d).getFullYear(),
            },
            selected: {
                month: d.getMonth(),
                year: d.getFullYear(),
                date: d.getDate(),
            },
        })
    }, [date, useRange])

    React.useEffect(() => {
        setState({
            ...state,
            display: {
                month: s.getMonth(),
                year: s.getFullYear(),
            },
            start: {
                month: s.getMonth(),
                year: s.getFullYear(),
                date: s.getDate(),
            },
        })
    }, [start])

    React.useEffect(() => {
        setState({
            ...state,
            end: {
                month: e.getMonth(),
                year: e.getFullYear(),
                date: e.getDate(),
            },
        })
    }, [end])

    /* ----------------------------- Event Handlers ----------------------------- */

    // Update state with change in month
    const handleMonthChange = React.useCallback((delta: number) => {
        const next = new Date(
            state.display.year,
            state.display.month + delta,
            1
        )

        setState(state => {
            const next = new Date(
                state.display.year,
                state.display.month + delta,
                1
            )

            return {
                ...state,
                display: {
                    month: next.getMonth(),
                    year: next.getFullYear(),
                },
            }
        })
    }, [])

    // Change to the next earlier month
    const decrementMonth = () => handleMonthChange(-1)

    // Change to the next later month
    const incrementMonth = () => handleMonthChange(1)

    // Make a change to the start or end of the range
    const handleChangeRange = React.useCallback(
        (next, nextSetting, changes) => {
            setState(state => {
                return {
                    ...state,
                    setting: nextSetting,
                    ...changes,
                }
            })
        },
        []
    )

    // Make a change to the selected date
    const handleChangeSelected = React.useCallback((next, changes) => {
        setState(state => {
            return {
                ...state,
                ...changes,
            }
        })
    }, [])

    // Update state when the user selects a new date
    const handleChangeDate = React.useCallback(
        item => {
            const next = item.itemDate

            const date = next.getDate()
            const month = next.getMonth()
            const year = next.getFullYear()

            const changes = { date, month, year }

            if (useRange) {
                // Set start and end

                // Get whether the next setting should be end or start
                const time = next.getTime()

                const nextSetting =
                    endDate.getTime() - time < time - startDate.getTime()
                        ? "end"
                        : "start"

                if (next < startDate) {
                    // If below start, set start
                    onChangeRange(next, endDate)
                    handleChangeRange(next, state.setting, { start: changes })
                } else if (next > endDate) {
                    // If after end, set end
                    onChangeRange(startDate, next)
                    handleChangeRange(next, state.setting, { end: changes })
                } else {
                    // Set either start or end, depending on setting
                    if (state.setting === "start") {
                        onChangeRange(next, endDate)
                        handleChangeRange(next, "end", { start: changes })
                    } else {
                        onChangeRange(startDate, next)
                        handleChangeRange(next, "start", { end: changes })
                    }
                }
            } else {
                // Set selected
                onChangeDate(next)
                handleChangeSelected(next, { selected: changes })
            }
        },
        [useRange, state.setting]
    )

    /* ------------------------------ Presentation ------------------------------ */

    // Date when currently displayed month begins
    const current = new Date(state.display.year, state.display.month, 1)

    const startDate = new Date(
        state.start.year,
        state.start.month,
        state.start.date
    )
    const endDate = new Date(state.end.year, state.end.month, state.end.date)

    const selected = new Date(
        state.selected.year,
        state.selected.month,
        state.selected.date
    )

    // Number of days in month
    const daysInMonth = new Date(
        state.display.year,
        state.display.month + 1,
        0
    ).getDate()

    // First weekday in the month
    const firstDayOfMonth = current.getDay()

    // Weeks / Days 2D Array

    const getInRange = date => date >= startDate && date <= endDate

    const monthArray = range(6 * 7).map(index => {
        const day = index + 1 - firstDayOfMonth
        const hasDay = day > 0 && day <= daysInMonth

        const itemDate = new Date(state.display.year, state.display.month, day)

        const isInRange = hasDay && getInRange(itemDate)

        const isFirst = isInRange && isEqual(itemDate, startDate)
        const isLast = isInRange && isEqual(itemDate, endDate)

        const isRowFirst = index % 7 === 0
        const isRowLast = index % 7 === 6

        return {
            index,
            day,
            hasDay,
            isInRange,
            isFirst,
            isLast,
            isRowFirst,
            isRowLast,
            itemDate,
        }
    })

    const weeks = chunk(monthArray, 7)

    const isSelectedMonth =
        state.display.year === state.selected.year &&
        state.display.month === state.selected.month

    const daySize = 42
    const padding = 8

    return (
        <Frame {...rest}>
            <Stack
                center
                height={60 + 32 + daySize * 6 + padding}
                width={daySize * 7 + padding * 2}
                gap={0}
                direction="vertical"
                paddingTop={8}
            >
                <Stack
                    direction="horizontal"
                    width={"1fr"}
                    height={40}
                    paddingLeft={padding}
                    paddingRight={padding}
                >
                    <Icon
                        icon="chevron-left"
                        width={40}
                        height={40}
                        onTap={decrementMonth}
                    />
                    <Text
                        type="body"
                        width="1fr"
                        text={current.toLocaleDateString("en-us", {
                            month: "long",
                            year: "numeric",
                        })}
                    />
                    <Icon
                        icon="chevron-right"
                        width={40}
                        height={40}
                        onTap={incrementMonth}
                    />
                </Stack>
                <Stack
                    direction="horizontal"
                    width={"1fr"}
                    height={32}
                    paddingLeft={padding}
                    paddingRight={padding}
                    gap={0}
                >
                    {dayAbbreviations.map(abbr => {
                        return (
                            <Text
                                key={`${id}_abbr_${abbr}`}
                                type="caption"
                                size={daySize}
                                text={abbr}
                                color={colors.Active}
                            />
                        )
                    })}
                </Stack>
                {weeks.map((week, i) => {
                    let x: number
                    let width: number
                    let radii: any

                    let selectedIndex = -1

                    let firstIndex = 0
                    let lastIndex = 6
                    let hasInRange = false

                    if (useRange) {
                        hasInRange = week.find(item => item.isInRange)

                        // x / width

                        const monthStartItem = week.find(item => item.day === 1)
                        if (monthStartItem) {
                            firstIndex = week.indexOf(monthStartItem)
                        }

                        const monthEndItem = week.find(
                            item => item.day === daysInMonth
                        )
                        if (monthEndItem) {
                            lastIndex = week.indexOf(monthEndItem)
                        }

                        const firstItem = week.find(item => item.isFirst)
                        if (firstItem) {
                            firstIndex = week.indexOf(firstItem)
                        }

                        const lastItem = week.find(item => item.isLast)
                        if (lastItem) {
                            lastIndex = week.indexOf(lastItem)
                        }

                        x = padding + firstIndex * daySize

                        width = (lastIndex - firstIndex + 1) * daySize

                        // radii

                        const aboveLeft = monthArray[week[firstIndex].index - 7]
                        const aboveLeftInRange =
                            aboveLeft && aboveLeft.isInRange

                        const aboveRight = monthArray[week[lastIndex].index - 7]
                        const aboveRightInRange =
                            aboveRight && aboveRight.isInRange

                        const belowLeft = monthArray[week[firstIndex].index + 7]
                        const belowLeftInRange =
                            belowLeft && belowLeft.isInRange

                        const belowRight = monthArray[week[lastIndex].index + 7]
                        const belowRightInRange =
                            belowRight && belowRight.isInRange

                        radii = {
                            topLeft: aboveLeftInRange ? 0 : daySize / 2,
                            topRight: aboveRightInRange ? 0 : daySize / 2,
                            bottomLeft: belowLeftInRange ? 0 : daySize / 2,
                            bottomRight: belowRightInRange ? 0 : daySize / 2,
                        }
                    } else {
                        if (isSelectedMonth) {
                            const selected = week.find(
                                item => item.day === state.selected.date
                            )

                            selectedIndex = week.indexOf(selected)

                            x = padding + selectedIndex * daySize

                            width = daySize
                        }
                    }

                    return (
                        <Frame
                            width="1fr"
                            height={daySize}
                            background="none"
                            key={`${id}_week_${i}`}
                        >
                            {(selectedIndex >= 0 || hasInRange) && (
                                <Frame
                                    x={x}
                                    width={width}
                                    height="100%"
                                    borderRadius={
                                        useRange
                                            ? `${radii.topLeft}px ${
                                                  radii.topRight
                                              }px ${radii.bottomRight}px ${
                                                  radii.bottomLeft
                                              }px`
                                            : "100%"
                                    }
                                    background={colors.Secondary}
                                />
                            )}
                            <Stack
                                width="100%"
                                height="100%"
                                direction="horizontal"
                                paddingLeft={padding}
                                paddingRight={padding}
                                gap={0}
                            >
                                {week.map((item, j) => {
                                    const {
                                        index,
                                        day,
                                        hasDay,
                                        isFirst,
                                        isLast,
                                        isInRange,
                                    } = item

                                    const isSelected = selectedIndex === j

                                    return (
                                        <Frame
                                            key={`${id}_day_${index}`}
                                            size={daySize}
                                            borderRadius={"100%"}
                                            background={"none"}
                                            onTap={() => {
                                                if (
                                                    isFirst ||
                                                    isLast ||
                                                    isSelected
                                                ) {
                                                    return
                                                }
                                                handleChangeDate(item)
                                            }}
                                        >
                                            {hasDay && (
                                                <Text
                                                    center
                                                    width={daySize}
                                                    height={daySize}
                                                    paddingBottom={2}
                                                    type={
                                                        isSelected
                                                            ? "link"
                                                            : "body"
                                                    }
                                                    color={
                                                        (useRange
                                                          ? isInRange
                                                          : isSelected)
                                                            ? colors.Light
                                                            : colors.Dark
                                                    }
                                                    text={day.toString()}
                                                />
                                            )}
                                            {useRange &&
                                                (isFirst || isLast) && (
                                                    <Frame
                                                        size={daySize - 8}
                                                        center
                                                        borderRadius={"100%"}
                                                        background="none"
                                                        border={`2px solid ${
                                                            colors.Light
                                                        }`}
                                                    />
                                                )}
                                        </Frame>
                                    )
                                })}
                            </Stack>
                        </Frame>
                    )
                })}
            </Stack>
        </Frame>
    )
}

DatePicker.defaultProps = {
    height: 356,
    width: 320,
    date: "04/20/2019",
    start: "04/02/2019",
    end: "04/10/2019",
    range: false,
    background: colors.Light,
    onChangeDate: (date: Date) => null,
    onChangeRange: (start: Date, end: Date) => null,
}

addPropertyControls(DatePicker, {
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
        title: "Date",
        type: ControlType.String,
        defaultValue: "04/02/2019",
        hidden: ({ range }) => !range,
    },
    end: {
        title: "Date",
        type: ControlType.String,
        defaultValue: "04/20/2019",
        hidden: ({ range }) => !range,
    },
})
