import * as React from 'react'
import {
	Frame,
	addPropertyControls,
	ControlType,
	FrameProps,
	useMotionValue,
} from 'framer'
// @ts-ignore
import Markdown from 'markdown-to-jsx'
import { colors } from './canvas'

// See bottom of file for theme styles

type Props = Partial<FrameProps> & {
	text: string | number
	type: string
	color: string
	textAlign: string
	verticalAlign: string
	padding: number
	paddingTop: number
	paddingLeft: number
	paddingRight: number
	paddingBottom: number
	paddingPerSide: boolean
	interactive: boolean
	style: { [key: string]: any }
	resize: 'width' | 'height' | boolean
	pc_resizeDirection: 'xaxis' | 'yaxis' | 'bothaxii'
	onResize: (width?: number, height?: number) => void
}

export function Text(props: Partial<Props>) {
	const {
		text,
		color,
		verticalAlign,
		textAlign,
		type,
		paddingPerSide,
		padding,
		paddingTop,
		paddingLeft,
		paddingRight,
		paddingBottom,
		resize,
		pc_resizeDirection,
		onResize,
		interactive,
		...rest
	} = props

	const { size, height, width } = props

	/* ---------------------------------- State --------------------------------- */

	// Ref for text container
	const resizeRef = React.useRef<HTMLDivElement>()
	const containerRef = React.useRef<HTMLDivElement>()

	const [state, setState] = React.useState({
		resized: false,
		width: size || width,
		height: size || height,
		resizeWidth: null,
		resizeHeight: null,
	})

	// Motion values track computed width and height
	const mvWidth = useMotionValue(size || width)
	const mvHeight = useMotionValue(size || height)

	React.useLayoutEffect(() => {
		mvWidth.set(size || width)
		mvHeight.set(size || height)
	}, [text, type, resize, size, height, width, pc_resizeDirection])

	React.useEffect(() => {
		if (!resizeRef.current) return

		// Get offset size from text container
		const { offsetWidth, offsetHeight } = resizeRef.current
		const { offsetWidth: owC, offsetHeight: ohC } = containerRef.current

		// Share these through props.onResize
		onResize(offsetWidth, offsetHeight)

		// Set motion value for width if needed
		if (
			(pc_resizeDirection === undefined &&
				(resize === true || resize === 'width')) ||
			(resize === true &&
				(pc_resizeDirection === 'xaxis' || pc_resizeDirection === 'bothaxii'))
		) {
			mvWidth.set(offsetWidth + 1)
		} else {
			mvWidth.set(owC + 1)
		}

		// Set motion value for height if needed
		if (
			(pc_resizeDirection === undefined &&
				(resize === true || resize === 'height')) ||
			(resize === true &&
				(pc_resizeDirection === 'yaxis' || pc_resizeDirection === 'bothaxii'))
		) {
			mvHeight.set(offsetHeight)
		} else {
			mvHeight.set(ohC)
		}
	}, [text, type, resize, size, height, width, pc_resizeDirection])

	/* ------------------------------ Presentation ------------------------------ */

	// Calculate paddings
	const paddings = paddingPerSide
		? {
				paddingRight,
				paddingBottom,
				paddingLeft,
				paddingTop,
		  }
		: paddingPerSide === undefined
		? {
				padding,
				paddingRight: paddingRight || padding,
				paddingBottom: paddingBottom || padding,
				paddingLeft: paddingLeft || padding,
				paddingTop: paddingTop || padding,
		  }
		: {
				padding,
		  }

	return (
		<Frame {...rest} width={mvWidth as any} height={mvHeight as any}>
			<div
				ref={containerRef}
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: verticalFlexAligns[verticalAlign], // see end of file
					justifyContent: horizontalFlexAligns[textAlign], // see end of file
				}}
			>
				<div
					ref={resizeRef}
					style={{
						...sharedStyles, // see end of file
						...typeStyles[type], // see end of file
						color,
						width: 'fit-content',
						textAlign: textAligns[textAlign],
						overflow: 'hidden',
						...paddings,
					}}
				>
					{text !== undefined && text.toString ? (
						<Markdown options={{ forceBlock: false }}>
							{text.toString()}
						</Markdown>
					) : (
						text
					)}
				</div>
			</div>
		</Frame>
	)
}

Text.defaultProps = {
	width: 200,
	height: 50,
	text: 'Text',
	type: 'link',
	textAlign: 'center',
	verticalAlign: 'center',
	style: {},
	color: colors.Dark,
	background: 'none',
	interactive: false,
	resize: false,
	onResize: (width, height) => null,
}

addPropertyControls(Text, {
	text: {
		title: 'Text',
		type: ControlType.String,
		defaultValue: 'Hello world',
	},
	type: {
		title: 'Type',
		type: ControlType.Enum,
		options: [
			'display',
			'h1',
			'h2',
			'h3',
			'lead',
			'link',
			'body',
			'label',
			'caption',
		],
		optionTitles: [
			'Display',
			'Heading 1',
			'Heading 2',
			'Heading 3',
			'Lead',
			'Link',
			'Body',
			'Label',
			'Caption',
		],
		defaultValue: 'link',
	},
	color: {
		title: 'Color',
		type: ControlType.Color,
		defaultValue: colors.Dark,
	},
	background: {
		title: 'Background',
		type: ControlType.Color,
		defaultValue: 'none',
	},
	textAlign: {
		title: 'Horizontal',
		type: ControlType.SegmentedEnum,
		options: ['left', 'center', 'right'],
		optionTitles: ['Left', 'Center', 'Right'],
		defaultValue: 'left',
	},
	verticalAlign: {
		title: 'Vertical',
		type: ControlType.SegmentedEnum,
		options: ['top', 'center', 'bottom'],
		optionTitles: ['Top', 'Center', 'Bottom'],
		defaultValue: 'top',
	},
	padding: {
		title: 'Padding',
		type: ControlType.FusedNumber,
		toggleKey: 'paddingPerSide',
		toggleTitles: ['All Sides', 'Per Side'],
		valueKeys: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
		valueLabels: ['T', 'R', 'B', 'L'],
		min: 0,
	},
	resize: {
		title: 'Resize',
		type: ControlType.Boolean,
		defaultValue: false,
	},
	pc_resizeDirection: {
		title: 'Axis',
		type: ControlType.SegmentedEnum,
		options: ['yaxis', 'xaxis', 'bothaxii'],
		optionTitles: ['vertical', 'horizontal', 'both'],
		defaultValue: 'xaxis',
		hidden: ({ resize }) => !resize,
	},
})

const sharedStyles = {
	fontFamily: 'Helvetica Neue',
	fontWeight: 500,
	lineSpacing: 1.2,
}

const typeStyles = {
	display: {
		fontSize: 64,
		letterSpacing: -1,
		fontWeight: 600,
	},
	h1: {
		fontSize: 40,
		letterSpacing: -1,
		fontWeight: 600,
	},
	h2: {
		fontSize: 24,
		fontWeight: 600,
	},
	h3: {
		fontSize: 16,
		fontWeight: 600,
	},
	lead: {
		fontSize: 20,
	},
	body: {
		fontSize: 16,
		lineHeight: 1.3,
	},
	link: {
		fontSize: 16,
		fontWeight: 600,
	},
	label: {
		fontSize: 13,
		letterSpacing: 0.5,
		lineHeight: 1.2,
		fontWeight: 600,
		textTransform: 'uppercase',
	},
	caption: {
		fontSize: 12,
		fontWeight: 500,
	},
}

const textAligns = {
	start: 'left',
	left: 'left',
	middle: 'center',
	center: 'center',
	right: 'right',
	end: 'right',
	justify: 'justify',
}

const horizontalFlexAligns = {
	start: 'flex-start',
	left: 'flex-start',
	middle: 'center',
	center: 'center',
	right: 'flex-end',
	end: 'flex-end',
	justify: 'center',
}

const verticalFlexAligns = {
	start: 'flex-start',
	top: 'flex-start',
	middle: 'center',
	center: 'center',
	bottom: 'flex-end',
	end: 'flex-end',
}
