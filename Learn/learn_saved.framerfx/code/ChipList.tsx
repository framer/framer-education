import * as React from 'react'
import { Stack, addPropertyControls, ControlType, FrameProps } from 'framer'
import { pull } from './Utils'
import { Chip } from './Chip'

type ChipItem = Partial<{
	text: string
	type: string
	clearable: boolean
	onResize: (width: number, height: number) => void
	onClear: () => void
}>

export function ChipList(
	props: Partial<
		FrameProps & {
			chips: Array<string | ChipItem>
			type: string
			clearable: boolean
			onTapChip: (item: ChipItem, index: number) => void
			onClearChip: (item: ChipItem, index: number, items: ChipItem[]) => void
		}
	>
) {
	const {
		id,
		chips: chipItems,
		type,
		clearable,
		onTapChip,
		onClearChip,
		...rest
	} = props

	const { width, height } = props

	const chips: ChipItem[] = React.useMemo(
		() =>
			chipItems.map((v, i) =>
				typeof v === 'string'
					? {
							text: v as string,
							type,
							clearable,
							onTap: () => handleTapChip(i),
							onClear: () => null,
					  }
					: {
							text: v.text,
							type,
							clearable,
							onTap: () => handleTapChip(i),
							...v,
					  }
			),
		[chipItems]
	)

	/* ---------------------------------- State --------------------------------- */

	// Set initial sizes
	const [state, setState] = React.useState({
		chips,
	})

	// Reset sizes (to trigger Text's auto-size)
	React.useEffect(() => {
		setState({
			chips,
		})
	}, [chips])

	/* ----------------------------- Event Handlers ----------------------------- */

	const handleTapChip = (index) => {
		onTapChip(state.chips[index], index)
	}

	const handleClearChip = (index, chip) => {
		chip.onClear()

		const next = pull(state.chips, chip)

		onClearChip(chip, index, next)

		setState({
			chips: next,
		})
	}

	/* ------------------------------ Presentation ------------------------------ */

	return (
		<Stack
			direction="horizontal"
			alignment="center"
			distribution="start"
			background="none"
			width={width}
			height={height}
			{...rest} //
		>
			{state.chips.map((chip, index) => (
				<Chip
					key={`${id}_chip_${index}`}
					{...chip}
					onClear={() => handleClearChip(chip, index)}
				/>
			))}
		</Stack>
	)
}

ChipList.defaultProps = {
	height: 40,
	width: 200,
	chips: ['Paris', 'London', 'New York', 'Hong Kong'],
	type: 'primary',
	overflow: 'hidden' as any,
	clearable: true,
	onTapChip: (item: ChipItem, index: number) => null,
	onClearChip: (item: ChipItem, index: number, items: ChipItem[]) => null,
}

addPropertyControls(ChipList, {
	chips: {
		title: 'Chips',
		type: ControlType.Array,
		propertyControl: {
			type: ControlType.String,
		},
		defaultValue: ['Paris', 'London', 'New York', 'Hong Kong'],
	},
	type: {
		title: 'Type',
		type: ControlType.Enum,
		options: ['primary', 'secondary', 'accent', 'warn', 'neutral', 'ghost'],
		optionTitles: [
			'Primary',
			'Secondary',
			'Accent',
			'Warn',
			'Neutral',
			'Ghost',
		],
		defaultValue: 'primary',
	},
	clearable: {
		title: 'Clearable',
		type: ControlType.Boolean,
		defaultValue: false,
	},
})
