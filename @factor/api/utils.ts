import deepMergeLib from "deepmerge"
import randToken from "rand-token"
import isNode from "detect-node"
import guid from "uniqid"
import stopwordsLib from "./resource/stopwords"

export * from "./utils-lodash"

export { isNode, guid }

export interface ListItem {
  value?: string;
  name?: string;
  label?: string;
  desc?: string;
}

export const randomToken = (): string => {
  return randToken.generate(16)
}

export const ensureTrailingSlash = (path: string): string => {
  path += path.endsWith("/") ? "" : "/"
  return path
}

export interface PriorityItem {
  priority?: number;
  [key: string]: any;
}

// Sort objects in an array by a priority value that defaults to 100
export const sortPriority = <TPri extends PriorityItem[]>(arr: TPri): TPri => {
  if (!arr || arr.length == 0) return arr

  return arr.sort((a, b) => {
    const ap = a.priority || 100
    const bp = b.priority || 100

    let result = 0

    if (ap < bp) {
      result = -1
    } else if (ap > bp) {
      result = 1
    }

    return result
  })
}

// Parse settings using dot notation
// TODO unit test this
// Cases: [port] [app.name] [roles.arpowers@gmail.com]
export const dotSetting = ({
  key,
  settings
}: {
  key: string;
  settings: Record<string, any>;
}): any => {
  const currentKey = key.slice(0, key.indexOf("."))
  const subKeys = key.slice(key.indexOf(".") + 1)

  if (typeof settings[key] !== "undefined") {
    return settings[key]
  } else if (typeof settings[currentKey] == "object") {
    return dotSetting({ key: subKeys, settings: settings[currentKey] })
  } else {
    return undefined
  }
}

// Deep merge an array of objects into a single object
// Replaces arrays instead of concat
export const deepMerge = <T>(items: Partial<T>[]): object => {
  const mergeItems = items.filter(_ => _)

  const merged = deepMergeLib.all(mergeItems, {
    arrayMerge: (destinationArray, sourceArray) => sourceArray
  })

  return merged
}

export const sortMerge = (arr: PriorityItem[]): object => {
  return deepMerge(sortPriority(arr))
}

// Make stop words lower case in a title
export const stopWordLowercase = (str: string, lib: string[] = []): string => {
  if (lib.length == 0) {
    lib = stopwordsLib
  }
  const words = str.split(" ")

  if (words.length <= 1) return str

  const regex = new RegExp("\\b(" + stopwordsLib.join("|") + ")\\b", "gi")
  return str.replace(regex, match => match.toLowerCase())
}

// Convert camel-case to kebab-case
export const camelToKebab = (string: string): string => {
  return !string ? string : string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

// Coverts a slug or variable into a title-like string
export const toLabel = (str: string): string => {
  if (!str || typeof str !== "string") return str

  const label = camelToKebab(str)
    .replace(new RegExp("-|_", "g"), " ")
    .replace(/\b\w/g, l => l.toUpperCase())

  return stopWordLowercase(label, ["and", "an", "a", "the", "or", "am"])
}

// Converts regular space delimited text into a hyphenated slug
export const slugify = (text: string): string => {
  if (!text) return text

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/^\d+/g, "") // Remove Numbers
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

// Parse to standard utility lists
// Ideal for passing around config data and lists (inputs, etc.. )
export const parseList = (
  list: ListItem[] = [],
  options: { prefix?: string; suffix?: string } = {}
): ListItem[] => {
  const { prefix = "" } = options
  let { suffix = "" } = options

  if (!Array.isArray(list)) return []

  suffix = suffix ? " " + suffix : ""

  const normalized = list.map(_ => {
    if (typeof _ == "string" || typeof _ == "number") {
      const label = `${prefix}${toLabel(_)}${suffix}`
      return {
        value: _,
        name: label,
        label,
        desc: ""
      }
    } else {
      const { name, label, value } = _
      if (!name && label) {
        _.name = label
      } else if (!label && name) {
        _.label = name
      }
      if (!_.label && value) {
        const label = `${prefix}${toLabel(value)}${suffix}`
        _.name = label
        _.label = label
      } else if (typeof value == "undefined" && _.label) {
        _.value = slugify(_.label)
      }
      return _
    }
  })
  return normalized
}

export const toPascalCase = (string: string): string => {
  return `${string}`
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\s\w]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), s => s.toUpperCase())
}
