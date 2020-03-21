import * as React from "react"
import { Frame, addPropertyControls, ControlType, FrameProps } from "framer"
import { Favorite } from "./Favorite"
import { colors } from "./canvas"

type Props = FrameProps & {
    image: string
    overlay: boolean
    color: string
    favorite: boolean
    isFavorite: boolean
    onFavoriteChange: (isFavorite: boolean) => void
}

export function Image(props: Partial<Props>) {
    const {
        color,
        image,
        overlay,
        favorite,
        isFavorite,
        onFavoriteChange,
        ...rest
    } = props

    /* ------------------------------ Presentation ------------------------------ */

    // Hello R/GA

    return (
        <Frame {...rest} background="#FFFFFF">
            <Frame
                width="100%"
                height="100%"
                image={image || ""}
                style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    WebkitFilter: overlay
                        ? "contrast(77%) grayscale(100%)"
                        : "contrast(100%) grayscale(0%)",
                }}
                opacity={overlay ? 0.6 : 1}
            />
            {overlay && (
                <Frame
                    width="100%"
                    height="100%"
                    background={color}
                    style={{
                        mixBlendMode: "overlay",
                    }}
                />
            )}
            {favorite && (
                <Favorite
                    top={0}
                    right={0}
                    value={isFavorite}
                    onValueChange={onFavoriteChange}
                />
            )}
        </Frame>
    )
}

Image.defaultProps = {
    height: 200,
    width: 320,
    image: null,
    overlay: true,
    color: colors.Primary,
    favorite: false,
    isFavorite: false,
    onFavoriteChange: isFavorite => null,
}

addPropertyControls(Image, {
    image: {
        title: "Image",
        type: ControlType.Image,
    },
    overlay: {
        title: "Overlay",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        hidden: ({ overlay }) => !overlay,
    },
    favorite: {
        title: "Favorite",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    isFavorite: {
        title: "Is Favorite",
        type: ControlType.Boolean,
        defaultValue: false,
        hidden: ({ favorite }) => !favorite,
    },
})
