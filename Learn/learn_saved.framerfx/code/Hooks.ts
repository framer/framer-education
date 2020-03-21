import * as React from "react";
import { motionValue, MotionValue, useMotionValue } from "framer";

export type InteractiveOptions = {
	hover: boolean;
	active: boolean;
	enabled: boolean;
	disabled: boolean;
	toggled: boolean;
	style: any;
};

export const useInteractionState: (
	options: Partial<InteractiveOptions>
) => [
	string,
	{
		onHoverStart: () => void;
		onHoverEnd: () => void;
		onMouseDown: () => void;
		onMouseUp: () => void;
		onTapCancel: () => void;
		style: any;
	}
] = (options = {}) => {
	const {
		hover = true,
		active = true,
		enabled = true,
		disabled = false,
		toggled = false,
		style = {}
	} = options;

	const [state, setState] = React.useState({
		isHovered: false,
		isActive: false
	});

	// Set the hovered state when the user mouses in or out
	const setHover = React.useCallback(
		(isHovered: boolean) =>
			enabled &&
			!disabled &&
			hover &&
			setState(state => ({ ...state, isHovered: isHovered })),
		[enabled, disabled, hover]
	);

	// Set the active state when the user mouses down or up
	const setActive = React.useCallback(
		(isActive: boolean) =>
			enabled &&
			!disabled &&
			active &&
			setState(state => ({ ...state, isActive: isActive })),
		[enabled, disabled, hover, active]
	);

	const clearActiveHovered = React.useCallback(
		() =>
			enabled &&
			!disabled &&
			setState(state => ({
				...state,
				isActive: false,
				isHovered: false
			})),
		[enabled, disabled]
	);

	const hoverStart = React.useCallback(() => setHover(true), []);
	const hoverEnd = React.useCallback(() => setHover(false), []);
	const activeStart = React.useCallback(() => setActive(true), []);
	const activeEnd = React.useCallback(() => setActive(false), []);

	// Determine which interaction state to return
	const current = toggled
		? "toggled"
		: state.isActive
		? "active"
		: state.isHovered
		? "hovered"
		: "initial";

	return [
		current,
		{
			opacity: disabled ? 0.3 : 1,
			onHoverStart: hoverStart,
			onHoverEnd: hoverEnd,
			onMouseDown: activeStart,
			onMouseUp: activeEnd,
			onTapCancel: clearActiveHovered,
			style: {
				...style,
				cursor: enabled && !disabled ? "pointer" : undefined
			}
		}
	];
};

export const useResize = props => {
	const { mvWidth, mvHeight, width, height, size, onResize, ...rest } = props;

	const contentRef = React.useRef<HTMLDivElement>();

	mvWidth.set(size || width);
	mvHeight.set(size || height);

	const [resizing, setResizing] = React.useState(false);

	React.useLayoutEffect(() => {
		mvWidth.set(size || width);
		mvHeight.set(size || height);
		setResizing(true);
	}, [size, height, width]);

	React.useLayoutEffect(() => {
		const { offsetWidth, offsetHeight } = contentRef.current;

		mvWidth.set(offsetWidth + 1);
		mvHeight.set(offsetHeight);

		onResize(offsetWidth + 1, offsetHeight);

		setResizing(false);
	}, [resizing]);

	return contentRef;
};
