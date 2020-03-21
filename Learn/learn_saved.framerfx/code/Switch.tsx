import * as React from 'react'
import { Frame, addPropertyControls, ControlType, FrameProps } from 'framer'
import { useInteractionState } from './Hooks'
import { colors } from './canvas'

type Props = Partial<FrameProps> & {
	value: boolean
	disabled: boolean
	validation: (value: boolean) => boolean
	onValueChange: (value: boolean, valid: boolean) => any
}

/**
 * Switch
 * @param props
 */
export function Switch(props: Partial<Props>) {
	const {
		value: initialValue,
		onValueChange,
		validation,
		disabled,
		style,
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
			valid: validation(initialValue),
		})
	}, [initialValue, validation])

	const [interactionState, interactionProps] = useInteractionState({
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
	}, [state.value, validation, onValueChange])

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
			onTap={!disabled && handleTap}
			background="none"
		>
			<Frame
				center="y"
				height={40}
				width={64}
				borderRadius={25}
				variants={{
					on: {
						background: colors.Primary,
					},
					off: {
						background: colors.Neutral,
					},
				}}
				transition={{
					duration: 0.15,
				}}
				initial={value ? 'on' : 'off'}
				animate={value ? 'on' : 'off'}
			>
				<Frame
					center="y"
					height={36}
					width={36}
					background="none"
					variants={{
						on: {
							x: 26,
						},
						off: {
							x: 2,
						},
					}}
					transition={{
						duration: 0.15,
					}}
				>
					<Frame
						height="100%"
						width="100%"
						borderRadius="100%"
						background={colors.Light}
						shadow={`0px 2px 5px ${colors.Shadow}`}
						{...variants[valid ? interactionState : 'warn']}
					/>
				</Frame>
			</Frame>
		</Frame>
	)
}

Switch.defaultProps = {
	value: false,
	disabled: false,
	height: 50,
	width: 64,
	validation: () => true,
	onValueChange: () => null,
}

addPropertyControls(Switch, {
	value: {
		type: ControlType.Boolean,
		title: 'On',
	},
	disabled: {
		type: ControlType.Boolean,
		title: 'Disabled',
	},
})
