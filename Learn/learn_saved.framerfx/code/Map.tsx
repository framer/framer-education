import * as React from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    RenderTarget,
    FrameProps,
    useMotionValue,
    useTransform,
    MotionValue,
} from "framer"
import * as mapboxgl from "mapbox-gl"
import * as geoViewport from "@mapbox/geo-viewport"
import * as geojsonExtent from "geojson-extent"
import "mapbox-gl/dist/mapbox-gl.css"
import * as copy from "copy-to-clipboard"

type Marker = {
    id?: string
    center: [number, number]
    options?: mapboxgl.MarkerOptions
}

type MapEvent = (event?: React.MouseEvent<HTMLDivElement>) => void

type Viewport = {
    center: [number, number]
    zoom: number
    pitch?: number
    bearing?: number
}

type MarkerEventHandler = (
    marker: Marker,
    elm: mapboxgl.Marker,
    map: mapboxgl.Map
) => void

type Props = Partial<FrameProps> & {
    accessToken: string
} & Partial<{
        style: string
        styleUrl: string
        longitude: number
        latitude: number
        zoom: number
        pitch: number
        bearing: number
        markers: Marker[]
        fitBounds: boolean
        minZoom: number
        maxZoom: number
        padding: number
        debug: boolean
        onClick: MapEvent
        onMouseEnter: MapEvent
        onMouseLeave: MapEvent
        onStyleLoad: (map: mapboxgl.Map) => void
        prepareViewport: (previous: Viewport, next: Viewport) => Viewport
        onViewportChange: (
            viewport: Viewport,
            markers: mapboxgl.Marker[]
        ) => void
        onMarkerClick: MarkerEventHandler
        onMarkerMouseEnter: MarkerEventHandler
        onMarkerMouseLeave: MarkerEventHandler
        onMarkerMouseDown: MarkerEventHandler
        onMarkerMouseUp: MarkerEventHandler
        onMarkerDragStart: MarkerEventHandler
        onMarkerDrag?: MarkerEventHandler
        onMarkerDragEnd: MarkerEventHandler
    }>
// Open Preview (CMD + P)
// API Reference: https://www.framer.com/api

const MemoMap = React.memo((props: Partial<Props>) => {
    const {
        accessToken,
        style,
        styleUrl,
        longitude,
        latitude,
        zoom,
        pitch,
        bearing,
        markers,
        fitBounds,
        minZoom,
        maxZoom,
        padding,
        debug,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onStyleLoad,
        prepareViewport,
        onViewportChange,
        onMarkerClick,
        onMarkerMouseEnter,
        onMarkerMouseLeave,
        onMarkerMouseDown,
        onMarkerMouseUp,
        onMarkerDragStart,
        onMarkerDrag,
        onMarkerDragEnd,
        ...rest
    } = props

    const { height, width } = props

    const mvLongitude = useMotionValue(longitude)
    const mvLatitude = useMotionValue(longitude)
    const mvZoom = useMotionValue(zoom)
    const mvPitch = useMotionValue(pitch)
    const mvBearing = useMotionValue(bearing)

    const mapContainerRef = React.useRef<HTMLDivElement>()
    const mapRef = React.useRef<mapboxgl.Map>()
    const markersRef = React.useRef<mapboxgl.Marker[]>([])
    const viewportRef = React.useRef<Viewport>({
        center: [longitude, latitude],
        zoom,
        pitch,
        bearing,
    })

    // get next map
    React.useLayoutEffect(
        function createMap() {
            // Remove previous map
            if (mapRef.current) {
                mapRef.current.remove()
            }

            // If we don't have a token, bail
            if (!accessToken || accessToken === "") {
                return
            }

            // Set new access token
            ;(mapboxgl as any).accessToken = accessToken

            // Get style URL
            const url =
                style === "custom"
                    ? styleUrl
                    : `mapbox://styles/mapbox/${style}`

            // Create the map
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: url,
                minZoom,
                maxZoom,
                bearing,
                pitch,
                zoom,
                center: [longitude, latitude],
            })

            // When the style is loaded, continue
            map.on("move", ({ target }) => {
                if (debug) {
                    const { lng, lat } = target.getCenter()
                    mvLongitude.set(lng)
                    mvLatitude.set(lat)
                    mvZoom.set(map.getZoom())
                    mvBearing.set(map.getBearing())
                    mvPitch.set(map.getPitch())
                }
            })

            map.on("style.load", () => {
                onStyleLoad(map)
            })

            mapRef.current = map

            return () => {
                mapRef.current.remove()
            }
        },
        [accessToken]
    )

    // Resize map
    React.useLayoutEffect(
        function resizeMap() {
            if (!mapRef.current) {
                return
            }

            mapRef.current.resize()
        },
        [width, height]
    )

    // Update markers
    React.useLayoutEffect(
        function updateMarkers() {
            if (!mapRef.current) {
                return
            }

            // Remove previous markers
            markersRef.current.forEach(marker => marker.remove())

            // Add new markers
            markersRef.current = markers.map(marker => {
                // Add options if missing
                marker = {
                    options: {},
                    ...marker,
                }

                // Fix lowercase colors (e.g. #ffffff -> #FFFFFF)
                if (marker.options.color) {
                    marker.options.color = marker.options.color.toUpperCase()
                }

                // Create new marker
                const m = new mapboxgl.Marker(marker.options || {})

                // Set the marker's center and add it to map
                m.setLngLat(marker.center).addTo(mapRef.current)

                // Get the marker's HTML element
                const elm = m.getElement()

                // Set event listeners
                const mp = mapRef.current

                elm.onclick = () => onMarkerClick(marker, m, mp)
                elm.onmouseenter = () => onMarkerMouseEnter(marker, m, mp)
                elm.onmouseleave = () => onMarkerMouseLeave(marker, m, mp)
                elm.onmousedown = () => onMarkerMouseDown(marker, m, mp)
                elm.onmouseup = () => onMarkerMouseUp(marker, m, mp)
                elm.ondragstart = () => onMarkerDragStart(marker, m, mp)
                elm.ondrag = () => onMarkerDrag(marker, m, mp)
                elm.ondragend = () => onMarkerDragEnd(marker, m, mp)

                return m
            })
        },
        [markers]
    )

    // Re-style map
    React.useLayoutEffect(
        function restyleMap() {
            if (!mapRef.current) {
                return
            }

            const url =
                style === "custom"
                    ? styleUrl
                    : `mapbox://styles/mapbox/${style}`
            mapRef.current.setStyle(url)
        },
        [style]
    )

    // set viewport
    React.useLayoutEffect(
        function setViewport() {
            if (!fitBounds || !mapRef.current) {
                return
            }

            if (markers.length <= 0) {
                return
            }

            let viewport: any // next viewport

            let json = {
                type: "FeatureCollection",
                properties: {},
                features: [],
            }

            const markerFeatures = markers.map((marker, i) => ({
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: marker.center,
                },
            }))

            json.features = [...json.features, ...markerFeatures]

            const bounds = geojsonExtent(json)

            const { offsetWidth, offsetHeight } = mapContainerRef.current

            viewport = geoViewport.viewport(
                bounds,
                [offsetWidth / 2 - padding * 2, offsetHeight / 2 - padding * 2],
                minZoom,
                maxZoom,
                undefined,
                true
            )

            // Compare new viewport against existing viewport

            const cxHasChanged =
                viewportRef.current.center[0] != viewport.center[0] ||
                viewportRef.current.center[1] != viewport.center[1]

            // ... and if the viewport has changed, move the camera
            if (cxHasChanged || viewportRef.current.zoom != viewport.zoom) {
                // If we have a prepare viewport function, first calculate a starting viewport
                if (prepareViewport) {
                    const preparedViewport = prepareViewport(
                        viewportRef.current,
                        viewport
                    )
                    mapRef.current.jumpTo(preparedViewport)
                }

                // Fly the map to the new viewport
                mapRef.current.flyTo({
                    center: [viewport.center[0], viewport.center[1]],
                    zoom: viewport.zoom,
                    pitch,
                    bearing,
                })

                // Store the viewport for next time
                viewportRef.current = viewport

                // Alert new viewport
                onViewportChange(viewport, markersRef.current)
            }
        },
        [markers, fitBounds]
    )

    React.useLayoutEffect(() => {
        if (!mapRef.current || fitBounds) {
            return
        }

        viewportRef.current = {
            center: [longitude, latitude],
            zoom,
            pitch,
            bearing,
        }

        if (RenderTarget.current() === "CANVAS") {
            mapRef.current.jumpTo(viewportRef.current)
        } else {
            mapRef.current.flyTo(viewportRef.current)
        }
    }, [pitch, bearing, zoom, latitude, longitude, fitBounds])

    return (
        <Frame {...rest} onWheel={e => e.stopPropagation()}>
            {accessToken === "" ? (
                <DefaultContainer />
            ) : (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#c9d2d3",
                        zIndex: 1,
                    }}
                >
                    <div
                        ref={mapContainerRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#c9d2d3",
                        }}
                        onClick={onClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    {debug && (
                        <DebuggingOverlay
                            longitude={mvLongitude}
                            latitude={mvLatitude}
                            zoom={mvZoom}
                            bearing={mvBearing}
                            pitch={mvPitch}
                        />
                    )}
                </div>
            )}
        </Frame>
    )
})

export const Map = (props: Partial<Props>) => {
    return <MemoMap {...props} />
}

Map.defaultProps = {
    accessToken: "",
    style: "light-v9",
    styleUrl: "",
    longitude: 83.0769,
    latitude: 13.8462,
    zoom: 2,
    pitch: 0,
    bearing: 0,
    markers: [],
    fitBounds: true,
    minZoom: 12,
    maxZoom: 15,
    padding: 32,
    width: 200,
    height: 200,
    debug: false,
    prepareViewport: undefined,
    onViewportChange: () => null,
    onStyleLoad: () => null,
    onMarkerClick: () => null,
    onMarkerMouseEnter: () => null,
    onMarkerMouseLeave: () => null,
    onMarkerMouseDown: () => null,
    onMarkerMouseUp: () => null,
    onMarkerDragStart: () => null,
    onMarkerDrag: () => null,
    onMarkerDragEnd: () => null,
} as Partial<Props>

addPropertyControls(Map, {
    accessToken: {
        title: "Access Token",
        type: ControlType.String,
    },
    style: {
        title: "Style",
        type: ControlType.Enum,
        options: [
            "light-v9",
            "dark-v10",
            "streets-v11",
            "outdoors-v11",
            "satellite-v9",
            "satellite-streets-v11",
            "custom",
        ],
        optionTitles: [
            "Light",
            "Dark",
            "Streets",
            "Outdoors",
            "Satellite",
            "Satellite Streets",
            "Custom",
        ],
        defaultValue: "light-v9",
    },
    styleUrl: {
        title: "Style URL",
        type: ControlType.String,
        defaultValue: "",
        hidden: ({ style }) => style !== "custom",
    },
    longitude: {
        title: "Longitude",
        type: ControlType.Number,
        min: -180,
        max: 180,
        defaultValue: 83.0769,
        step: 0.001,
    },
    latitude: {
        title: "Latitude",
        type: ControlType.Number,
        min: -90,
        max: 90,
        defaultValue: 13.8462,
        step: 0.001,
    },
    zoom: {
        title: "Zoom",
        type: ControlType.Number,
        min: 0,
        max: 22,
        defaultValue: 2,
        step: 0.01,
    },
    pitch: {
        title: "Pitch",
        type: ControlType.Number,
        min: 0,
        max: 60,
        defaultValue: 0,
        step: 1,
    },
    bearing: {
        title: "Bearing",
        type: ControlType.Number,
        min: -180,
        max: 180,
        defaultValue: 0,
        step: 1,
    },
    fitBounds: {
        title: "Fit Bounds",
        type: ControlType.Boolean,
        defaultValue: true,
    },
    minZoom: {
        title: "Min Zoom",
        type: ControlType.Number,
        min: 0,
        max: 20,
        defaultValue: 0,
        step: 0.5,
        hidden: ({ fitBounds }) => !fitBounds,
    },
    maxZoom: {
        title: "Max Zoom",
        type: ControlType.Number,
        min: 0,
        max: 20,
        defaultValue: 16,
        step: 0.5,
        hidden: ({ fitBounds }) => !fitBounds,
    },
    padding: {
        title: "Padding",
        type: ControlType.Number,
        min: 0,
        max: 128,
        defaultValue: 32,
        step: 1,
        hidden: ({ fitBounds }) => !fitBounds,
    },
})

const DebugLine = props => (
    <>
        <div style={{ gridColumn: 1 }}>{props.name}:</div>{" "}
        <div style={{ gridColumn: 2 }}>{props.value}</div>
    </>
)

const DebuggingOverlay = props => {
    const { zoom, pitch, bearing, longitude, latitude } = props

    const [state, setState] = React.useState({
        lat: 0,
        lng: 0,
        zmm: 0,
        brn: 0,
        ptc: 0,
    })

    React.useEffect(() => {
        const cancelLat = latitude.onChange(v =>
            setState(state => ({
                ...state,
                lat: v,
            }))
        )

        const cancelLng = longitude.onChange(v =>
            setState(state => ({
                ...state,
                lng: v,
            }))
        )

        const cancelZoom = zoom.onChange(v =>
            setState(state => ({
                ...state,
                zmm: v,
            }))
        )

        const cancelBearing = bearing.onChange(v =>
            setState(state => ({
                ...state,
                brn: v,
            }))
        )

        const cancelPitch = pitch.onChange(v =>
            setState(state => ({
                ...state,
                ptc: v,
            }))
        )

        return () => {
            cancelLat()
            cancelLng()
            cancelZoom()
            cancelBearing()
            cancelPitch()
        }
    }, [])

    const handleCopyClick = () => {
        copy(`
center: [${state.lng}, ${state.lat}],
zoom: ${state.zmm},
pitch: ${state.ptc},
bearing: ${state.brn}
`)
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "min-content auto",
                gridAutoRows: "min-content",
                gridAutoFlow: "row",
                gridColumnGap: 16,
                gridRowGap: 8,
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(255, 255, 255, .8)",
                fontSize: 10,
                padding: 16,
                fontFamily: "'Menlo', 'Monaco', monospace",
                zIndex: 99,
            }}
        >
            <DebugLine name="Longitude" value={state.lng} />
            <DebugLine name="Latitude" value={state.lat} />
            <DebugLine name="Zoom" value={state.zmm} />
            <DebugLine name="Pitch" value={state.ptc} />
            <DebugLine name="Bearing" value={state.brn} />
            <button
                style={{
                    width: "100%",
                    gridColumn: "1 / span 2",
                    padding: "8px 16px",
                    marginTop: 16,
                    zIndex: 1000,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "'Menlo', 'Monaco', monospace",
                }}
                onClick={handleCopyClick}
            >
                Copy to Clipboard
            </button>
        </div>
    )
}

const DefaultContainer = () => {
    return (
        <ComponentInstructions>
            <h1>Mapbox Map</h1>
            <p>
                Add your{" "}
                <a
                    style={{ color: "#bb88ff" }}
                    href="https://account.mapbox.com/"
                >
                    Mapbox access token
                </a>
                .
            </p>
        </ComponentInstructions>
    )
}

// Re-usable container for default instructions
const ComponentInstructions = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                fontSize: 16,
                fontWeight: 500,
                textAlign: "left",
                color: "#bb88ff",
                backgroundColor: "#2f2546",
                border: "1px solid #8855ff",
                padding: 32,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    minHeight: 300,
                    minWidth: 220,
                }}
            >
                {children}
            </div>
        </div>
    )
}

// Helpers
