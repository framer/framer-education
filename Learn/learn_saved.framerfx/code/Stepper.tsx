import * as React from "react";
import { Stack, FrameProps, addPropertyControls, ControlType } from "framer";
import { Link } from "./Link";
import { Text } from "./Text";
import { colors } from "./canvas";
import { clamp } from "./Utils";

type Props = Partial<FrameProps> & {
	value: number;
	disabled: boolean;
	min: number;
	max: number;
	step: number;
	pc_clamp: boolean; // used only for property controls
	validation: (value: number) => boolean;
	onValueChange: (value: number, valid: boolean) => any;
};

export function Stepper(props: Partial<Props>) {
	const {
		value,
		onValueChange,
		validation,
		min,
		max,
		step,
		disabled,
		...rest
	} = props;

	// Set an initial state
	const [state, setState] = React.useState({
		value: clamp(value, min, max),
		valid: validation(value)
	});

	// Update state when props change
	React.useEffect(() => {
		setState({
			value,
			valid: validation(state.value || value)
		});
	}, [value, validation]);

	// Update state when the user taps the + or - buttons
	const handleValueChange = (change: number) => {
		const next = clamp(state.value + change * step, min, max);
		if (next === state.value) {
			return;
		}

		onValueChange(next, validation(next));

		setState(state => ({
			...state,
			value: next,
			valid: validation(next)
		}));
	};

	const decrement = () => handleValueChange(-1);
	const increment = () => handleValueChange(1);

	const { valid } = state;

	return (
		<Stack
			border={`1px solid ${
				valid ? (disabled ? colors.Border : colors.Primary) : colors.Warn
			}`}
			background={
				valid ? (disabled ? colors.Border : colors.Primary) : colors.Warn
			}
			{...rest}
			direction="horizontal"
			alignment="center"
			gap={1}
			borderRadius={`8px 8px 8px 8px`}
			overflow="hidden"
		>
			<Link
				type={"ghost"}
				background={colors.Primary}
				icon="minus"
				height={"100%"}
				width={48}
				disabled={disabled || state.value <= min}
				borderRadius={`8px 0px 0px 8px`}
				onTap={decrement}
				text=""
			/>
			<Text
				type="link"
				width="1fr"
				height={"100%"}
				text={state.value.toString()}
				color={colors.Dark}
				background={colors.Light}
			/>
			<Link
				type={"ghost"}
				background={colors.Primary}
				icon="plus"
				height={"100%"}
				width={48}
				disabled={disabled || state.value >= max}
				borderRadius={`0px 8px 8px 0px`}
				onTap={increment}
				text=""
			/>
		</Stack>
	);
}

Stepper.defaultProps = {
	height: 40,
	width: 160,
	min: 0,
	max: 999,
	step: 1,
	value: 0,
	validation: (value: number) => true,
	disabled: false,
	onValueChange: (value: number, valid: boolean) => null
};

addPropertyControls(Stepper, {
	value: {
		title: "Value",
		type: ControlType.Number,
		displayStepper: true,
		defaultValue: 0,
		min: -Infinity,
		max: Infinity
	},
	pc_clamp: {
		title: "Clamp Value",
		type: ControlType.Boolean,
		defaultValue: false
	},
	min: {
		title: "Min",
		type: ControlType.Number,
		displayStepper: true,
		min: 0,
		max: Infinity,
		defaultValue: 0,
		hidden: ({ pc_clamp }) => !pc_clamp
	},
	max: {
		title: "Max",
		type: ControlType.Number,
		displayStepper: true,
		min: 0,
		max: Infinity,
		defaultValue: 10,
		hidden: ({ pc_clamp }) => !pc_clamp
	},
	step: {
		title: "Step",
		type: ControlType.Number,
		displayStepper: true,
		min: 0,
		max: Infinity,
		defaultValue: 1
	},
	disabled: {
		type: ControlType.Boolean,
		title: "Disabled",
		defaultValue: false
	}
});
