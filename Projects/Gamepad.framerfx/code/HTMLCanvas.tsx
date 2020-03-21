import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"

type Props = Partial<FrameProps> & {
    canvas: React.Ref<HTMLCanvasElement>
    width: number
    height: number
    onStart: (
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => void
    onFrame: (
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => void
}

export const HTMLCanvas = props => {
    const { canvas, height, width, onStart, onFrame, ...rest } = props
    let rLooping = React.useRef(true)

    React.useEffect(() => {
        start()
        return () => (rLooping.current = false)
    }, [canvas])

    const start = () => {
        if (!canvas) return
        const cvs = canvas.current

        if (!cvs) return
        const ctx = cvs.getContext("2d")

        onStart(ctx, cvs.width, cvs.height)

        rLooping.current = true
        requestAnimationFrame(loop)
    }

    const loop = () => {
        if (!canvas) return
        const cvs = canvas.current

        if (!cvs) return
        const ctx = cvs.getContext("2d")

        onFrame(ctx, cvs.width, cvs.height)

        if (rLooping.current) {
            requestAnimationFrame(loop)
        }
    }

    return (
        <Frame height={height} width={width} background="none" {...rest}>
            <canvas
                ref={canvas}
                height={height}
                width={width}
                style={{
                    width,
                    height,
                }}
            />
        </Frame>
    )
}

HTMLCanvas.defaultProps = {
    height: 128,
    width: 240,
    onFrame: () => {},
}

// Learn more: https://framer.com/api/property-controls/
addPropertyControls(HTMLCanvas, {})
