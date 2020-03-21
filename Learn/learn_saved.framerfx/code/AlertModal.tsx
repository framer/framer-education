import * as React from 'react'
import { Stack, addPropertyControls, ControlType, FrameProps } from 'framer'
import { Link } from './Link'
import { Text } from './Text'
import { Button } from './Button'
import { Modal } from './Modal'
import { colors } from './canvas'

type Props = Partial<FrameProps> &
	Partial<{
		title: string
		body: string
		warn: boolean
		open: boolean
		cancel: string
		confirm: string
		onCancel: () => void
		onConfirm: () => void
	}>

export function AlertModal(props: Props) {
	const {
		open,
		title,
		body,
		warn,
		cancel,
		confirm,
		onConfirm,
		onCancel,
		...rest
	} = props

	/* ---------------------------------- State --------------------------------- */

	const [state, setState] = React.useState({
		title: 0,
		body: 0,
		open,
	})

	// Update state when props.open changes
	React.useEffect(() => {
		setState((state) => ({
			...state,
			open,
		}))
	}, [open])

	/* ----------------------------- Event Handlers ----------------------------- */

	const handleResize = (width, height, layer) => {
		setState((state) => ({
			...state,
			[layer]: height,
		}))
	}

	const handleConfirm = () => {
		onConfirm()
		setState((state) => ({
			...state,
			open: false,
		}))
	}

	const handleCancel = () => {
		onCancel()
		setState((state) => ({
			...state,
			open: false,
		}))
	}

	/* ------------------------------ Presentation ------------------------------ */

	return (
		<Modal {...rest} open={state.open}>
			<Stack
				width={320}
				height={state.title + state.body + 64}
				borderRadius={8}
				// border={`1px solid ${colors.Border}`}
				overflow="hidden"
				gap={0}
				direction="vertical"
				background={colors.Light}
				shadow={`0px 2px 16px ${colors.Shadow}`}
				variants={{
					closed: {
						opacity: 0,
						scale: 0.95,
						y: 16,
						transition: {
							type: 'tween',
							ease: 'easeIn',
							duration: 0.16,
							delay: 0.15,
						},
					},
					open: {
						opacity: 1,
						scale: 1,
						y: 0,
						transition: {
							type: 'tween',
							ease: 'easeOut',
							duration: 0.26,
						},
					},
				}}
			>
				{title && (
					<Text
						type="link"
						width="82%"
						resize="height"
						text={title}
						paddingTop={16}
						onResize={(w, h) => handleResize(w, h, 'title')}
					/>
				)}
				{body && (
					<Text
						type="body"
						width="100%"
						resize="height"
						text={body}
						padding={16}
						paddingTop={0}
						paddingBottom={24}
						onResize={(w, h) => handleResize(w, h, 'body')}
					/>
				)}
				<Stack direction="horizontal" width="1fr" height={64} gap={1}>
					{cancel && (
						<Link
							type={'ghost'}
							background={colors.Primary}
							width="1fr"
							text={cancel}
							onTap={handleCancel}
						/>
					)}
					{confirm && (
						<Link
							type={'ghost'}
							background={warn ? colors.Warn : colors.Primary}
							width="1fr"
							text={confirm}
							onTap={handleConfirm}
						/>
					)}
				</Stack>
			</Stack>
		</Modal>
	)
}

AlertModal.defaultProps = {
	height: 714,
	width: 375,
	open: false,
	confirm: 'Confirm',
	warn: false,
	onConfirm: () => null,
	onCancel: () => null,
}

addPropertyControls(AlertModal, {
	open: {
		title: 'Open',
		type: ControlType.Boolean,
		defaultValue: false,
	},
	title: {
		title: 'Title',
		type: ControlType.String,
		defaultValue: 'Title',
	},
	body: {
		title: 'Body',
		type: ControlType.String,
		defaultValue: 'Add your alert message here.',
	},
	confirm: {
		title: 'Confirm',
		type: ControlType.String,
		defaultValue: 'Confirm',
	},
	cancel: {
		title: 'Cancel',
		type: ControlType.String,
		defaultValue: 'Cancel',
	},
})
