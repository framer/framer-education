import * as React from "react"
import {
    Stack,
    Frame,
    addPropertyControls,
    ControlType,
    FrameProps,
} from "framer"
import { Text } from "./Text"
import { Favorite } from "./Favorite"
import { Image } from "./Image"
import { colors } from "./canvas"

type Props = Partial<FrameProps> & {
    overlay: boolean
    color: string
    title: string
    image: string
    body: string
    header: string
    footer: string
    autosize: boolean
    favorite: boolean
    isFavorite: boolean
    onTap: () => void
    onFavoriteChange: (favorite: boolean) => void
}

export function Card(props: Partial<Props>) {
    const {
        height,
        width,
        size,
        title,
        body,
        header,
        footer,
        image,
        overlay,
        color,
        autosize,
        favorite,
        isFavorite,
        onFavoriteChange,
        onTap,
    } = props

    /* ---------------------------------- State --------------------------------- */

    const [state, setState] = React.useState({
        titleHeight: 29,
        bodyHeight: 18,
    })

    /* ----------------------------- Event Handlers ----------------------------- */

    // When title text resizes, update state with the new height
    const handleTitleResize = React.useCallback(
        (width, height) =>
            setState(state => {
                return {
                    ...state,
                    titleHeight: height,
                }
            }),
        []
    )

    // When body text resizes, update state with the new height
    const handleBodyResize = React.useCallback(
        (width, height) =>
            setState(state => {
                return {
                    ...state,
                    bodyHeight: height,
                }
            }),
        []
    )

    /* ------------------------------ Presentation ------------------------------ */

    // Some facts about our props
    const hasContent = (title && title.length > 0) || (body && body.length > 0)

    // Where should we put the favorite icon?
    const favoriteWithImage = favorite && !header
    const favoriteWithTitle = favoriteWithImage && !image

    // Spacing
    const padding = 16
    const gap = 8

    // Height of the entire content
    const contentHeight =
        padding +
        (title ? state.titleHeight : 0) +
        (title && body ? gap : 0) +
        (body ? state.bodyHeight : 0) +
        padding +
        gap // extra on the bottom

    // Height of the image
    const imageHeight = hasContent ? "1.618fr" : "1fr"

    // Height of the body content (if autosize is off, we'll need to calculate this by hand)
    const calculatedBodyHeight = autosize
        ? state.bodyHeight
        : padding * 2 - gap - state.titleHeight

    return (
        <Stack
            height={size || height}
            width={size || width}
            onTap={onTap}
            overflow="hidden"
            direction="vertical"
            background={colors.Light}
            // border={`1px solid ${colors.Border}`}
            shadow={`0px 2px 16px ${colors.Shadow}`}
            borderRadius={8}
            gap={0}
        >
            {header && (
                <Stack
                    width="100%"
                    height={48}
                    direction="horizontal"
                    alignment="center"
                    distribution="space-between"
                    style={{
                        borderBottom: `${
                            image || hasContent || footer ? 1 : 0
                        }px solid ${colors.Neutral}`,
                    }}
                >
                    <Text
                        height={48}
                        verticalAlign="center"
                        textAlign="left"
                        paddingLeft={16}
                        paddingRight={16}
                        type="link"
                        text={header}
                    />
                    {favorite && (
                        <Favorite
                            x={-5}
                            y={2}
                            value={isFavorite}
                            onValueChange={onFavoriteChange}
                        />
                    )}
                </Stack>
            )}
            {image && (
                // If we have an image, add a Frame to the card's main Stack
                <Image
                    width={"100%"}
                    height={imageHeight}
                    image={image}
                    overlay={overlay}
                    color={color}
                    favorite={favoriteWithImage}
                    isFavorite={isFavorite}
                    onFavoriteChange={onFavoriteChange}
                />
            )}
            {hasContent && (
                // If we have a title or body, add a Stack to the card's main Stack
                <Stack
                    width="1fr"
                    height={
                        autosize && (image || !footer) ? contentHeight : "1fr"
                    }
                    direction="vertical"
                    background={colors.Light}
                    alignment="start"
                    distribution="start"
                    padding={padding}
                    gap={gap}
                    style={{
                        borderTop: `${image ? 1 : 0}px solid ${colors.Neutral}`,
                        borderBottom: `${footer ? 1 : 0}px solid ${
                            colors.Neutral
                        }`,
                    }}
                >
                    {title && (
                        // If we have a favorite but no title, stack the icon with the title
                        // and drop the right margin. If not, just show the title.
                        <Stack
                            width="100%"
                            height={state.titleHeight}
                            direction="horizontal"
                            alignment="end"
                            distribution="start"
                        >
                            <Text
                                width={`calc(100% - ${
                                    favoriteWithTitle ? 34 : 0
                                }px)`}
                                height={state.titleHeight}
                                type="h2"
                                text={title}
                                verticalAlign="top"
                                textAlign="left"
                                onResize={handleTitleResize}
                            />
                            {favoriteWithTitle && (
                                <Favorite
                                    x={-16}
                                    y={10}
                                    value={isFavorite}
                                    onValueChange={onFavoriteChange}
                                />
                            )}
                        </Stack>
                    )}
                    {body && (
                        <Text
                            width={"100%"}
                            height={calculatedBodyHeight}
                            type="body"
                            text={body}
                            verticalAlign="top"
                            textAlign="left"
                            onResize={handleBodyResize}
                        />
                    )}
                </Stack>
            )}
            {footer && (
                <Frame
                    width="100%"
                    height={48}
                    background="none"
                    style={{
                        borderTop: `${image && !hasContent ? 1 : 0}px solid ${
                            colors.Neutral
                        }`,
                    }}
                >
                    <Text
                        width="100%"
                        height={48}
                        verticalAlign="center"
                        textAlign="left"
                        paddingLeft={16}
                        paddingRight={16}
                        type="link"
                        text={footer}
                    />
                </Frame>
            )}
        </Stack>
    )
}

Card.defaultProps = {
    width: 320,
    height: 320,
    title: "",
    body: "",
    header: "",
    footer: "",
    image: "",
    overlay: true,
    color: colors.Primary,
    autosize: false,
    favorite: false,
    isFavorite: false,
    onFavoriteChange: (favorite: boolean) => null,
}

addPropertyControls(Card, {
    image: {
        title: "Image",
        type: ControlType.Image,
    },
    overlay: {
        title: "Overlay",
        type: ControlType.Boolean,
        defaultValue: true,
        hidden: ({ image }) => !image,
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: colors.Primary,
        hidden: ({ overlay, image }) => !image || !overlay,
    },
    header: {
        title: "Header",
        type: ControlType.String,
    },
    title: {
        title: "Title",
        type: ControlType.String,
    },
    body: {
        title: "Body",
        type: ControlType.String,
    },
    autosize: {
        title: "Autosize",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    footer: {
        title: "Footer",
        type: ControlType.String,
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
