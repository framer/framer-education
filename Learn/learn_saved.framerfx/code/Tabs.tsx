import * as React from "react"
import {
    Stack,
    Scroll,
    Frame,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { Link } from "./Link"
import { colors } from "./canvas"

type Props = FrameProps & {
    currentTab: number | string
    onChangeTab: (index: number, tab: string) => void
    tabs: string[]
}

export function Tabs(props: Partial<Props>) {
    const { id, height, width, tabs, currentTab, onChangeTab } = props

    const containerRef = React.useRef<HTMLDivElement>()

    const initialSelectedIndex =
        typeof currentTab === "number"
            ? currentTab
            : tabs.indexOf(currentTab) || 0

    // Set an initial state
    const [state, setState] = React.useState({
        containerWidth: 320,
        selectedIndex: initialSelectedIndex,
        tabWidths: tabs.map(a => -1),
    })

    React.useLayoutEffect(() => {
        if (!containerRef.current) return
        const { offsetWidth } = containerRef.current
        setState({
            ...state,
            containerWidth: offsetWidth,
        })
    }, [width, state.tabWidths, tabs])

    // Update selected index when value changes
    React.useEffect(() => {
        setState({
            ...state,
            selectedIndex: initialSelectedIndex,
        })
    }, [currentTab])

    // When the links resize, update the tabwidths
    const handleResize = React.useCallback(
        (width, height, index) => {
            const { tabWidths } = state
            tabWidths[index] = width

            setState(state => ({
                ...state,
                tabWidths,
            }))
        },
        [state.tabWidths]
    )

    // When the user taps on a tab, update the state
    const setSelectedIndex = React.useCallback(
        selectedIndex => {
            if (selectedIndex === state.selectedIndex) return

            onChangeTab(selectedIndex, tabs[selectedIndex])

            setState(state => ({
                ...state,
                selectedIndex,
            }))
        },
        [onChangeTab, state.selectedIndex]
    )

    // Calculate the scroll Position
    const contentWidth = state.tabWidths.reduce((a, c) => a + 32 + c, 0)

    const midScreen = (width as number) / 2

    const buttonX =
        16 +
        state.tabWidths
            .slice(0, state.selectedIndex)
            .reduce((a, c) => a + 32 + c, 0)

    const buttonMid = state.tabWidths[state.selectedIndex] / 2

    const midX = midScreen - buttonMid
    const maxX = contentWidth - midScreen - buttonMid

    const scrollMin = 0
    const scrollMax = -(contentWidth - (width as number))
    const scrollMid = -(buttonX - midX)

    const offsetX =
        buttonX < midX // Is scroll too far left?
            ? scrollMin // Clamp to left
            : buttonX > maxX // Is scroll too far ight?
            ? scrollMax // Clamp to right
            : scrollMid // Center on button

    // Calculate the indicator position and width
    const indicatorX = buttonX
    const indicatorWidth = state.tabWidths[state.selectedIndex]

    const willDrag = contentWidth > state.containerWidth

    return (
        <Frame
            ref={containerRef}
            background="none"
            height={height}
            width={width}
        >
            <Scroll
                height={60}
                width={width}
                contentWidth={contentWidth}
                direction="horizontal"
                dragEnabled={willDrag}
                scrollAnimate={{
                    x: willDrag ? offsetX : 0,
                }}
            >
                <Frame background="none" width={contentWidth} height={height}>
                    <Stack
                        direction="horizontal"
                        alignment="center"
                        distribution="start"
                        gap={32}
                        paddingLeft={16}
                        height={60}
                        width={"100%"}
                    >
                        {tabs.map((tab, index) => (
                            <Link
                                key={`${id}_tab_${index}`}
                                text={tab}
                                height={60}
                                resize="width"
                                type={
                                    state.selectedIndex === index
                                        ? "primary"
                                        : "neutral"
                                }
                                onResize={(width, height) =>
                                    handleResize(width, height, index)
                                }
                                onTap={() => {
                                    setSelectedIndex(index)
                                }}
                            />
                        ))}
                    </Stack>
                    <Frame
                        height={4}
                        bottom={0}
                        background={colors.Primary}
                        initial={{
                            x: indicatorX,
                            width: indicatorWidth,
                        }}
                        animate={{
                            x: buttonX,
                            width: indicatorWidth,
                        }}
                    />
                </Frame>
            </Scroll>
        </Frame>
    )
}

Tabs.defaultProps = {
    id: "tabs",
    width: 320,
    height: 60,
    tabs: ["Paris", "New York", "London", "Hong Kong"],
    currentTab: "Paris",
    onChangeTab: (index, currentTab: string) => null,
}

addPropertyControls(Tabs, {
    currentTab: {
        type: ControlType.String,
        defaultValue: "Paris",
        title: "CurrentTab",
    },
    tabs: {
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.String,
        },
        defaultValue: ["Paris", "New York", "London", "Hong Kong"],
        title: "Tabs",
    },
})
