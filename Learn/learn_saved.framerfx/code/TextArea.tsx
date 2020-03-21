import * as React from "react";
import {
	Stack,
	Frame,
	addPropertyControls,
	ControlType,
	StackProperties
} from "framer";
import { Interactive } from "./Interactive";
import { colors } from "./canvas";
import { Text } from "./Text";

type Props = Partial<StackProperties> & {
	value: string;
	disabled: boolean;
	required: boolean;
	validation: (value: string) => boolean;
	message: string | ((value: string, valid: boolean) => string);
	delay: number; // in seconds
	onValueChange: (value: string, valid: boolean) => any;
	onBlur: (value: string, valid: boolean) => void;
	onFocus: (value: string, valid: boolean) => void;
	onInputStart: () => any;
	// component-specific
	autocapitalize: "none" | "sentences" | "words" | "characters" | string;
	autocomplete: boolean;
	autofocus: boolean;
	cols: number;
	form: string;
	maxLength: number;
	minLength: number;
	placeholder: number;
	readOnly: boolean;
	spellcheck: boolean;
	wrap: "hard" | "soft" | "off";
	tabIndex: number;
};

export function TextArea(props: Partial<Props>) {
	const {
		value: initialValue,
		disabled,
		required,
		validation,
		message,
		delay,
		onValueChange,
		onBlur,
		onFocus,
		onInputStart,
		autocapitalize,
		autocomplete,
		autofocus,
		cols,
		form,
		maxLength,
		minLength,
		placeholder,
		readOnly,
		spellcheck,
		tabIndex,
		wrap,
		...rest
	} = props;

	/* ---------------------------------- State --------------------------------- */

	// Store the input's last value in a ref
	const input = React.useRef<HTMLTextAreaElement>();
	const inputValue = React.useRef(initialValue);

	// Initialize state with props values
	const [state, setState] = React.useState({
		value: initialValue,
		valid: validation(initialValue),
		typing: false,
		focused: false,
		textHeight: 50,
		messageHeight: 0
	});

	// When the hook receives new props values, overwrite the state
	React.useEffect(() => {
		// Sync inputValue ref with initialValue
		inputValue.current = initialValue;

		setState(state => ({
			...state,
			value: initialValue,
			valid: validate(state.value)
		}));
	}, [initialValue]);

	// Re-validate when required or validation changes
	React.useEffect(() => {
		setState(state => ({
			...state,
			valid: validate(state.value)
		}));
	}, [validation, required]);

	/* ----------------------------- Event Handlers ----------------------------- */

	// Get a valid state for the current value
	const validate = value =>
		value && value.length > 0 ? validation(value || initialValue) : !required;

	// Set the focus state when the user clicks in or out of the input
	const setFocus = (focused: boolean) => {
		if (focused) {
			props.onFocus(state.value, state.valid);
		} else {
			props.onBlur(state.value, state.valid);
		}

		setState({ ...state, focused });
	};

	// When the content of the input changes, run onValueChange and update state
	const handleInput = event => {
		const { value } = event.target;

		// Store the value in the inputValue ref
		inputValue.current = value;

		// If we're not already typing, run props.onInputStart()
		if (!state.typing) {
			onInputStart();
		}

		// Set value and typing states
		setState(state => ({ ...state, value, typing: true }));

		// Check whether inputValue is still the same
		delay > 0
			? // If we have a delay, use the delay
			  setTimeout(() => updateState(value), delay * 1000)
			: // Otherwise, check immediately
			  updateState(value);
	};

	// A shared callback to update state
	const updateState = value => {
		// Compare the current value against the inputValue ref,
		// and bail if there's a disagreement (it means that the user)
		// has entered new text while the timeout was running
		if (value === inputValue.current) {
			const valid = value ? validate(value) : !required;
			onValueChange(value, valid);
			setState(state => ({ ...state, typing: false, value, valid }));
		}
	};

	// Clear input
	const setMessageHeight = (width, height) => {
		setState(state => ({
			...state,
			messageHeight: height + 8
		}));
	};

	/* ------------------------------ Presentation ------------------------------ */

	const { value, valid, focused } = state;

	const variants = {
		initial: {
			border: `1px solid ${colors.Neutral}`
		},
		hovered: {
			border: `1px solid ${colors.Border}`
		},
		active: {
			border: `1px solid ${colors.Dark}`
		},
		focused: {
			border: `1px solid ${colors.Dark}`
		},
		warn: {
			border: `1px solid ${colors.Warn}`
		}
	};

	return (
		<Interactive {...rest} active={false} overflow={"hidden"}>
			{current => (
				<Stack
					width="100%"
					height="100%"
					direction="vertical"
					background={colors.Light}
					borderRadius={8}
				>
					<Frame
						width="100%"
						height={
							!!message ? `calc(100% - ${state.messageHeight}px)` : "100%"
						}
						background={colors.Light}
						borderRadius={8}
						{...variants[valid ? (focused ? "focused" : current) : "warn"]}
					/>
					<textarea
						ref={input}
						value={value || ""}
						placeholder={placeholder || ""}
						disabled={props.disabled}
						readOnly={readOnly}
						{...{
							autocapitalize,
							autocomplete,
							autofocus,
							cols,
							form,
							maxLength,
							minLength,
							readOnly,
							spellcheck,
							tabIndex,
							wrap
						}}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							padding: "12px",
							fontSize: 14,
							fontWeight: 600,
							width: "100%",
							height: !!message
								? `calc(100% - ${state.messageHeight}px)`
								: "100%",
							background: "none",
							borderRadius: 4,
							outline: "none",
							border: "none",
							resize: "none",
							color: valid ? colors.Dark : colors.Warn
						}}
						onFocus={() => setFocus(true)}
						onBlur={() => setFocus(false)}
						onChange={handleInput}
					/>
					{!!message && (
						<Text
							type="caption"
							resize="height"
							textAlign="left"
							verticalAlign="top"
							width="100%"
							onResize={setMessageHeight}
							text={
								message
									? typeof message === "function"
										? message(state.value, state.valid)
										: message
									: ""
							}
						/>
					)}
				</Stack>
			)}
		</Interactive>
	);
}

TextArea.defaultProps = {
	value: undefined,
	autocapitalize: "none",
	autocomplete: false,
	autofocus: false,
	cols: undefined,
	disabled: false,
	form: undefined,
	maxLength: undefined,
	minLength: undefined,
	placeholder: undefined,
	required: false,
	readOnly: false,
	spellcheck: false,
	wrap: undefined,
	tabIndex: 0,
	message: null,
	onFocus: () => null,
	onBlur: () => null,
	validation: v => true,
	onInputStart: () => null,
	onValueChange: () => null,
	delay: 0.25,
	height: 200,
	width: 320
};

addPropertyControls(TextArea, {
	value: {
		type: ControlType.String,
		defaultValue: "",
		title: "Value"
	},
	placeholder: {
		type: ControlType.String,
		defaultValue: "",
		title: "Placeholder"
	},
	message: {
		type: ControlType.String,
		defaultValue: "",
		title: "Message"
	},
	readOnly: {
		type: ControlType.Boolean,
		defaultValue: false,
		title: "Read Only"
	},
	required: {
		type: ControlType.Boolean,
		defaultValue: false,
		title: "Required"
	},
	disabled: {
		type: ControlType.Boolean,
		defaultValue: false,
		title: "Disabled"
	}
});
