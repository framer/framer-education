import * as React from "react"
import { Frame, ControlType, addPropertyControls, FrameProps } from "framer"
import ReactSelect from "react-select"
import { colors } from "./canvas"

type Option = {
    value: string
    label: string
}

type Props = Partial<FrameProps> & {
    value: Option
    defaultValue: any
    options: Option[]
    disabled: boolean
    searchable: boolean
    clearable: boolean
    multi: boolean
    styles: any
}

export const Select = (props: Props) => {
    const {
        width,
        height,
        size,
        options: rawOptions,
        value: rawValue,
        defaultValue: rawDefaultValue,
        ...rest
    } = props

    const options: Option[] = rawOptions.map(t => {
        if (typeof (t as any) === "string") {
            return {
                value: t as any,
                label: t as any,
            }
        } else {
            return t
        }
    })

    const defaultValue: Option =
        typeof rawDefaultValue === "string"
            ? {
                  value: rawDefaultValue,
                  label: rawDefaultValue,
              }
            : rawDefaultValue

    const value: Option =
        typeof rawValue === "string"
            ? {
                  value: rawValue,
                  label: rawValue,
              }
            : rawValue

    return (
        <Frame width={width} height={height} size={size} background="none">
            <ReactSelect
                theme={(theme: any) => {
                    return {
                        ...theme,
                        borderRadius: 8,
                        spacing: {
                            baseUnit: 4,
                            menuGutter: 8,
                            controlHeight: 50,
                        },
                        colors: {
                            ...theme.colors,
                            primary: colors.Primary,
                        },
                    }
                }}
                {...rest}
                value={value}
                defaultValue={defaultValue}
                options={options}
            />
        </Frame>
    )
}

Select.defaultProps = {
    height: 50,
    width: 320,
    options: ["London", "Paris", "Hong Kong", "New York"],
    defaultValue: "London",
    multi: false,
    clearable: true,
    styles: undefined,
}

addPropertyControls(Select as any, {
    options: {
        title: "Options",
        type: ControlType.Array,
        propertyControl: {
            type: ControlType.String,
        },
        defaultValue: ["London", "Paris", "Hong Kong", "New York"],
    },
    defaultValue: {
        title: "Default",
        type: ControlType.String,
        defaultValue: "London",
    },
    isMulti: {
        title: "Multi",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    isClearable: {
        title: "Clearable",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    isDisabled: {
        title: "Disabled",
        type: ControlType.Boolean,
        defaultValue: false,
    },
    isSearchable: {
        title: "Searchable",
        type: ControlType.Boolean,
        defaultValue: false,
    },
})
