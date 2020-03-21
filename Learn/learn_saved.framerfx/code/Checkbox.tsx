import * as React from 'react'
import { Frame, FrameProps, addPropertyControls, ControlType } from 'framer'
import { useInteractionState } from './Hooks'
import { colors } from './canvas'

type Props = Partial<FrameProps> & {
	value: boolean
	disabled: boolean
	validation: (value: boolean) => boolean
	onValueChange: (value: boolean, valid: boolean) => any
}

export function Checkbox(props: Partial<Props>) {
	const {
		value: initialValue,
		onValueChange,
		validation,
		style,
		...rest
	} = props

	const { disabled } = props

	/* ---------------------------------- State --------------------------------- */

	// Initialize state with props values
	const [state, setState] = React.useState({
		value: initialValue,
		valid: validation(initialValue),
	})

	// When the hook receives new props values, overwrite the state
	React.useEffect(() => {
		setState({
			...state,
			value: initialValue,
			valid: validation(state.value || initialValue),
		})
	}, [initialValue, validation])

	const [interactiveState, interactiveProps] = useInteractionState({
		disabled,
		style,
	})

	/* ----------------------------- Event Handlers ----------------------------- */

	// When the user taps on the switch, run onValueChange and flip the isOn state
	const handleTap = React.useCallback(() => {
		setState((state) => {
			const value = !state.value

			const valid = validation(value)

			onValueChange(value, valid)

			return {
				...state,
				value,
				valid,
			}
		})
	}, [validation])

	/* ------------------------------ Presentation ------------------------------ */

	const { value, valid } = state

	const variants = {
		initial: {
			border: `1px solid ${colors.Neutral}`,
		},
		hovered: {
			border: `1px solid ${colors.Border}`,
		},
		active: {
			border: `1px solid ${colors.Active}`,
		},
		warn: {
			border: `1px solid ${colors.Warn}`,
		},
	}

	return (
		<Frame
			{...rest}
			{...interactiveProps}
			background="none"
			height={50}
			width={50}
			onTap={!disabled && handleTap}
		>
			<Frame
				center
				height={28}
				width={28}
				borderRadius={8}
				background={colors.Light}
				{...variants[valid ? interactiveState : 'warn']}
			/>
			<Frame
				center
				borderRadius={6}
				height={20}
				width={20}
				variants={{
					on: {
						background: colors.Primary,
						border: `0px solid ${colors.Neutral}`,
					},
					off: {
						background: colors.Bg,
						border: `1px solid ${colors.Neutral}`,
					},
				}}
				transition={{
					duration: 0.15,
				}}
				initial={value ? 'on' : 'off'}
				animate={value ? 'on' : 'off'}
			/>
		</Frame>
	)
}

Checkbox.defaultProps = {
	value: false,
	disabled: false,
	height: 50,
	width: 50,
	validation: () => true,
	onValueChange: () => null,
}

addPropertyControls(Checkbox, {
	value: {
		type: ControlType.Boolean,
		title: 'Checked',
		defaultValue: false,
	},
	disabled: {
		type: ControlType.Boolean,
		title: 'Disabled',
		defaultValue: false,
	},
})
