import * as React from 'react'
import {
	Frame,
	Stack,
	FrameProps,
	addPropertyControls,
	ControlType,
} from 'framer'
import { Icon } from './Icon'
import { Text } from './Text'
import { Interactive } from './Interactive'
import { colors } from './canvas'

type TabObject = {
	icon: string
	title: string
}

type Tab = string | TabObject

type Props = Partial<FrameProps> & {
	currentTab: number | string
	onChangeTab: (index: number, tab: string) => void
	tabs: Tab[]
	showTitles: boolean
}

export function TabBar(props: Partial<Props>) {
	const { id, width, height, tabs, currentTab, onChangeTab, showTitles } = props

	// Create our tab objects (if we've received strings)
	const tabObjects: TabObject[] = tabs.map((t) => {
		if (typeof t === 'string') {
			return {
				icon: (t as any).toLowerCase(),
				title: t,
			}
		} else {
			return t
		}
	})

	// Get the tab labels
	const tabLabels = React.useMemo(() => tabObjects.map((t) => t.title), [
		tabObjects,
	])

	// Calculate initial selected index
	const initialSelectedIndex = React.useMemo(
		() =>
			typeof currentTab === 'number'
				? currentTab
				: tabObjects.indexOf(tabObjects.find((t) => t.title === currentTab)) ||
				  0,
		[currentTab, tabObjects]
	)

	// Set the initial selected index
	const [state, setState] = React.useState({
		selectedIndex: initialSelectedIndex,
	})

	// Update state when we get a new selected index
	React.useEffect(() => {
		setState({
			selectedIndex: initialSelectedIndex,
		})
	}, [initialSelectedIndex])

	// Update state when the user taps a new tab
	const handleTap = React.useCallback(
		(selectedIndex: number) => {
			if (selectedIndex === state.selectedIndex) return

			onChangeTab(selectedIndex, tabLabels[selectedIndex])

			setState({
				...state,
				selectedIndex,
			})
		},
		[onChangeTab, state.selectedIndex, tabLabels]
	)

	return (
		<Stack
			direction="horizontal"
			height={height}
			width={width}
			distribution="space-around"
			alignment="start"
			style={{
				borderTop: `1px solid ${colors.Border}`,
			}}
			background={colors.Bg}
		>
			{tabObjects.map((tabObject, index) => {
				const isSelected = state.selectedIndex === index

				const color =
					state.selectedIndex >= 0
						? isSelected
							? colors.Primary
							: colors.Dark
						: colors.Primary
				return (
					<Interactive
						key={`${id}_tab_${tabObject.title}_${index}`}
						width={48}
						height={49}
						onTap={() => handleTap(index)}
					>
						{(current) => (
							<Stack
								width="100%"
								height="100%"
								distribution="center"
								alignment="center"
								gap={-2}
								paddingTop={2}
							>
								<Icon icon={tabObject.icon} color={color} size={28} />
								{showTitles && (
									<Text
										type="caption"
										color={color}
										height={12}
										width={56}
										verticalAlign="center"
										textAlign="center"
										resize="width"
										text={tabObject.title}
									/>
								)}
							</Stack>
						)}
					</Interactive>
				)
			})}
		</Stack>
	)
}

TabBar.defaultProps = {
	id: 'tabs',
	height: 84,
	width: 320,
	currentTab: 'Home',
	onChangeTab: (index, currentTab) => null,
	showLabels: false,
	tabs: [
		{
			icon: 'home',
			title: 'Home',
		},
		{
			icon: 'person',
			title: 'Profile',
		},
		{
			icon: 'settings',
			title: 'Settings',
		},
	],
}

addPropertyControls(TabBar, {
	currentTab: {
		title: 'CurrentTab',
		type: ControlType.String,
		defaultValue: 'Home',
	},
	tabs: {
		title: 'Tabs',
		type: ControlType.Array,
		propertyControl: {
			type: ControlType.String,
		},
		defaultValue: ['Home', 'Camera', 'Settings'],
	},
	showTitles: {
		title: 'Show Titles',
		type: ControlType.Boolean,
		defaultValue: false,
	},
})
