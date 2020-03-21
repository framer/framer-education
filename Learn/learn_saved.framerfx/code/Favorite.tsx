import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"
import { Link } from "./Link"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    value: boolean
    onValueChange: (value: boolean) => void
}

// A component for the favorite icon
export const Favorite = (props: Partial<Props>) => {
    const { value, onValueChange, ...rest } = props

    /* ---------------------------------- State --------------------------------- */

    // Set initial state
    const [state, setState] = React.useState({
        value,
    })

    // Update state from props
    React.useEffect(() => {
        setState({
            ...state,
            value,
        })
    }, [value])

    /* ----------------------------- Event Handlers ----------------------------- */

    // Toggle the favorite state
    const handleFavorite = event => {
        event.stopPropagation()
        setState({
            value: !state.value,
        })
        onValueChange(!state.value)
    }

    /* ------------------------------ Presentation ------------------------------ */

    return (
        <Link
            width={50}
            height={50}
            {...rest}
            icon={state.value ? "heart" : "heart-outline"}
            onTap={handleFavorite}
        />
    )
}

Favorite.defaultProps = {
    height: 50,
    width: 50,
    value: false,
    onValueChange: value => null,
}

addPropertyControls(Favorite, {
    value: {
        title: "Value",
        type: ControlType.Boolean,
        defaultValue: false,
    },
})
