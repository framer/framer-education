import * as React from "react"
import {
    Override,
    motionValue,
    useMotionValue,
    useTransform,
    Data,
    Frame,
} from "framer"
import { MotionGamepad } from "./MotionGamepad"
import * as fitCurve from "fit-curve"

type point = [number, number]

// The current drawing line
let line: Path2D = null

// The points that make up the current line
let points: [number, number][] = []

// All lines
let lines: [Path2D, string, number][] = []

// Redos
let redos: [Path2D, string, number][] = []

// Colors
const colors = [
    "#0099FF",
    "#BB88FF",
    "#FFCC66",
    "#FF8866",
    "#04B5F6",
    "#22CCDD",
    "#9CDCFD",
]

let currentColor = motionValue(0)

let lineWidth = motionValue(4)

const height = 520,
    width = 280

const gamepad = new MotionGamepad(0, {
    sticks: {
        left: {
            speed: 10,
            bounds: {
                top: -height / 2 + 10,
                left: -width / 2 + 10,
                right: width / 2 - 10,
                bottom: height / 2 - 10,
            },
        },
    },
    onConnect: () => console.log("Connected"),
    onButtonDown: button => {
        // When press x, start drawing a line
        if (button === "x") {
            points = []
            redos = []
            line = new Path2D()
        }
    },
    onButtonUp: button => {
        // When release x, stop drawing the line
        if (button === "x") {
            const bezierCurves = fitCurve(points, 50)
            const smoothedLine = new Path2D()

            const [[x, y]] = bezierCurves[0]

            smoothedLine.moveTo(x, y)

            for (let curve of bezierCurves) {
                const [_, [cp1x, cp1y], [cp2x, cp2y], [x, y]] = curve
                smoothedLine.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
            }
            lines.push([
                smoothedLine,
                colors[currentColor.get()],
                lineWidth.get(),
            ])
            line = null
        }

        // When release triangle, clear all lines
        if (button === "triangle") {
            line = null
            lines = []
        }

        // When release square, undo
        if (button === "square") {
            redos.push(lines.pop())
        }

        // When release circle, redo
        if (button === "circle") {
            const redo = redos.pop()
            if (redo) {
                lines.push(redo)
            }
        }

        // ADJUST COLOR
        if (button === "rightTrigger1") {
            let color = currentColor.get() + 1

            if (color === colors.length) {
                color = 0
            }

            currentColor.set(color)
        }

        if (button === "leftTrigger1") {
            let color = currentColor.get() - 1

            if (color === colors.length) {
                color = colors.length - 1
            }

            currentColor.set(color)
        }

        // ADJUST SIZE
        if (button === "rightTrigger2") {
            lineWidth.set(Math.min(lineWidth.get() + 2, 16))
        }

        if (button === "leftTrigger2") {
            lineWidth.set(Math.max(lineWidth.get() - 2, 4))
        }
    },
})

export function Cursor(): Override {
    const background = useTransform(currentColor, v => colors[v])
    return {
        ...gamepad.inputs.sticks.left.point,
        background,
        height: lineWidth,
        width: lineWidth,
        size: lineWidth,
        border: "2px solid #000",
    }
}

// [10]
export function Canvas(): Override {
    const rCanvas = React.useRef<HTMLCanvasElement>()

    return {
        canvas: rCanvas,
        onStart: (ctx, width, height) => {
            ctx.lineCap = "round"
        },
        onFrame: (ctx, width, height) => {
            ctx.clearRect(0, 0, width, height)

            for (let line of lines) {
                const [path, color, lineWidth] = line
                ctx.lineWidth = lineWidth
                ctx.strokeStyle = color
                ctx.stroke(path)
            }

            // If we have a current line, add a point to that line
            if (line) {
                ctx.strokeStyle = colors[currentColor.get()]
                ctx.lineWidth = lineWidth.get()
                const { x, y } = gamepad.sticks.left.point
                points.push([x + width / 2, y + height / 2])
                line.lineTo(x + width / 2, y + height / 2)
                ctx.stroke(line)
            }
        },
    }
}
