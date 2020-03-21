// ---------------------- Helper Utilities -----------------------

export function isEqual(valueA: any, valueB: any) {
    return JSON.stringify(valueA) === JSON.stringify(valueB)
}

// Array

/**
 * Get an array of numbers, starting and ending at given numbers.
 * 
 * - `start` - The first number in the array.
 * - `end` - The last number in the array.
 * - `step` - The difference between each number. Default is `1`.
 * 
 * ```
 const valueA = rangeFrom(0, 3) // [0, 1, 2, 3]
 const valueB = rangeFrom(0, 6, 3) // [0, 3, 6]
 const valueC = rangeFrom(0, 1, .5) // [0, .5, 1]
 ```
*/
export const rangeFrom = (start: number, end: number, step = 1) => {
    return Array.from({
        length: Math.ceil((end - start + step) / step),
    }).map((v, i, arr) => i * step - start)
}

/**
 * Get an array of numbers of a given length, starting from zero.
 * 
 * - `length` - The length of the array.
 * 
 * ```
 const valueA = range(1) // [0]
 const valueB = range(3) // [0, 1, 2]
 const valueC = range(5) // [0, 1, 2, 3, 4]
 ```
*/
export function range(length: number) {
    return rangeFrom(0, length - 1, 1)
}

/**
 * Get sub-arrays of a given length from an array.
 * 
 * - `array` - The array to chunk.
 * - `length` - The length of each chunk.
 * 
 * ```
 const valueA = chunk([0, 1, 2, 3], 2) // [[0, 1], [2, 3]]
 const valueB = chunk([0, 1, 2, 3], 3) // [[0, 1, 2], [3]]
 const valueC = chunk([0, 1, 2, 3], 4) // [[0, 1, 2, 3]]
 ```
*/
export function chunk(array: any[], length: number) {
    return Array.from({ length: Math.ceil(array.length / length) }, (v, i) =>
        array.slice(i * length, i * length + length)
    )
}

// Numbers

/**
 * Clamp a number between a minimum and a maxiumum.
 * 
 * - `value` - The number to clamp.
 * - `min` - The lowest possible result.
 * - `max` - The highest possible result.
 * 
 * ```
 const valueA = clamp(6, 0, 10) // 6
 const valueB = clamp(-2, 0, 10) // 0
 const valueC = clamp(12, 0, 10) // 10
 ```
*/
export function clamp(value: number, min: number, max: number) {
    return Math.max(Math.min(value, Math.max(min, max)), Math.min(min, max))
}

const clampAlias = clamp // to avoid naming conflicts

/** 
 * Get a number that represents the distance of a value between a minimum and maximum.
 * 
 * - `value` - The number to normalize.
 * - `min` - The lowest possible result.
 * - `max` - The highest possible result.
 * - `clamp` - Whether to clamp the result between 0 and 1.
 * 
 * ```
 const valueA = normalize(3, 0, 5) // .6
 const valueB = normalize(5, 0, 5) // 1
 const valueC = normalize(-1, 0, 5) // 0
 const valueD = normalize(-1, 0, 5, false) // -0.2
 ```
*/
export function normalize(
    value: number,
    min: number,
    max: number,
    clamp = true
) {
    const result = (value - min) / (max - min)
    return clamp ? clampAlias(result, 0, 1) : result
}

/** 
 * Remove the given values from an array.
 * 
 * - `array` - The array to change.
 * - `values` - One or more values to remove.
 * 
 * ```
  const valueA = pull(['a', 'b', 'c'], 'a') // ["b", "c"]
  const valueB = pull(['a', 'b', 'c'], 'a', 'b') // ["c"]
  const valueC = pull(['a', 'b', 'c'], 'a', 'b', 'c') // []
 ```
*/
export function pull(array: any[], ...values) {
    let argState = Array.isArray(values[0]) ? values[0] : values
    let pulled = array.filter((v, i) => !argState.includes(v))
    array.length = 0
    pulled.forEach(v => array.push(v))
    return pulled
}

/** 
 * Remove the given values from an array.
 * 
 * - `array` - The array to change.
 * - `indexes` - One or more indexes to remove.
 * 
 * ```
 const valueA = pullAtIndex(["a", "b", "c"], 0) // ["b", "c"]
 const valueB = pullAtIndex(["a", "b", "c"], 0, 1) // ["c"]
 const valueC = pullAtIndex(["a", "b", "c"], 0, 1, 3) // []
 ```
*/
export function pullAtIndex(array: any[], ...indexes) {
    // If we've been given an array instead of an argument list, use the array
    let argState = Array.isArray(indexes[0]) ? indexes[0] : indexes
    let removed = []
    let pulled = array
        .map((v, i) => (argState.includes(i) ? removed.push(v) : v))
        .filter((v, i) => !argState.includes(i))
    array.length = 0
    pulled.forEach(v => array.push(v))
    return removed
}

/**
 * Sleep for a duration. This utility only works in an async function.
 *
 * - `duration` - How many seconds to wait.
 * 
 * ```
 async function Example() {
     console.log("First message")
     await sleep(1.5)
     console.log("Second message")
     await sleep(2)
     console.log("Third message")
 }
 ```
*/
export function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration * 1000)
    })
}

/**
 * Get whether or not a given text string is a valid e-mail.
 * 
 * ```
 isEmail(steve@aol.com) // true
 isEmail(steveaol.com) // false
 isEmail(steve@aol) // false
 ```
 */
export function isEmail(text: string) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        text
    )
}

export function toColor(color: string) {
    return color.match(/rgba?\(([^)]+)\)/g)[0]
}
