import * as React from 'react'
import { Frame, addPropertyControls, FrameProps, ControlType } from 'framer'

// Define a type for our props
type Props = Partial<FrameProps> & {
	disabled: boolean
	pressed: boolean
	active: boolean
	hover: boolean
	interactive: boolean
	type: string
}

/**
 * Button
 * @param props
 */
export function Interactive(props: Partial<Props>) {
	const {
		children,
		disabled,
		pressed,
		active: doActive,
		hover: doHover,
		interactive,
		...rest
	} = props

	/* ---------------------------------- State --------------------------------- */

	// Initialize state with props values
	const [state, setState] = React.useState({
		hovered: false,
		active: false,
	})

	/* ----------------------------- Event Handlers ----------------------------- */

	// Set the hovered state when the user mouses in or out
	const setHover = (hovered: boolean) =>
		doHover && setState({ ...state, hovered })

	// Set the active state when the user mouses down or up
	const setActive = (active: boolean) =>
		doActive && setState({ ...state, active })

	const clearActiveHovered = () =>
		setState({ ...state, active: false, hovered: false })

	/* ------------------------------ Presentation ------------------------------ */

	const { hovered, active } = state

	const variants = {
		initial: {
			opacity: 1,
		},
		hovered: {
			opacity: 1,
		},
		active: {
			opacity: 1,
		},
		pressed: {
			opacity: 1,
		},
		disabled: {
			opacity: 0.3,
		},
	}

	// Determine which variant to show
	const current = disabled
		? pressed
			? 'pressed'
			: 'disabled'
		: pressed
		? 'pressed'
		: active
		? 'active'
		: hovered
		? 'hovered'
		: 'initial'

	return (
		<Frame
			{...rest}
			variants={variants}
			initial={current}
			animate={current}
			transition={{
				type: 'tween',
				ease: 'easeInOut',
				duration: 0.12,
			}}
			style={{
				...props.style,
				cursor:
					interactive && !disabled && (doHover || doActive || props.onTap)
						? 'pointer'
						: undefined,
			}}
			onMouseEnter={() => interactive && setHover(true)}
			onMouseLeave={() => interactive && setHover(false)}
			onMouseDown={() => interactive && setActive(true)}
			onMouseUp={() => interactive && setActive(false)}
			onTapCancel={() => interactive && clearActiveHovered()}
			// Pass in container props when using this component in code
		>
			{children && typeof children === 'function'
				? children(current)
				: children}
		</Frame>
	)
}

Interactive.defaultProps = {
	height: 60,
	width: 200,
	disabled: false,
	active: true,
	hover: true,
	interactive: true,
	background: null,
	onTap: () => null,
}

addPropertyControls(Interactive, {
	disabled: {
		type: ControlType.Boolean,
		title: 'Disabled',
		defaultValue: false,
	},
})
