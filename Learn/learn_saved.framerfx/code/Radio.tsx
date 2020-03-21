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

export function Radio(props: Partial<Props>) {
	const {
		value: initialValue,
		onValueChange,
		validation,
		style,
		disabled,
		...rest
	} = props

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

	const [interactionState, interactionProps] = useInteractionState({
		disabled,
		style,
	})

	/* ----------------------------- Event Handlers ----------------------------- */

	// When the user taps on the switch, run onValueChange and flip the isOn state
	const handleTap = React.useCallback(() => {
		if (state.value) return

		setState((state) => {
			const value = true

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
			{...interactionProps}
			height={50}
			width={50}
			background="none"
			onTap={!disabled && handleTap}
		>
			<Frame
				center
				height={28}
				width={28}
				borderRadius={'100%'}
				background={colors.Light}
				{...variants[valid ? interactionState : 'warn']}
			/>
			<Frame
				center
				borderRadius={'100%'}
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

Radio.defaultProps = {
	value: false,
	disabled: false,
	height: 50,
	width: 50,
	validation: () => true,
	onValueChange: () => null,
}

addPropertyControls(Radio, {
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
