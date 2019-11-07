import { toLabel } from "@factor/tools"

export const endpointId = "pluginData"

export function titleFromPackage({ pkg = {}, _id }) {
  if (pkg.factor && pkg.factor.title) {
    return pkg.factor.title
  } else {
    const name = _id
    const base = name.slice(name.lastIndexOf("/") + 1)

    return toLabel(base)
  }
}

export function formatDownloads(number) {
  let num = number
  return num.toLocaleString("en", { useGrouping: true })
}

export function extensionPermalink({ base = "plugin", name }) {
  return `/${base}/view?package=${name}`
}

export function extensionIcon(item) {
  return cdnUrl({
    ...item,
    fileName: "icon.svg",
    defaultFile: require("./img/icon-factor.svg")
  })
}

export function extensionScreenshot(item) {
  return cdnUrl({
    ...item,
    fileName: "screenshot.jpg",
    defaultFile: require("./img/icon-factor.svg")
  })
}

export function cdnUrl(item) {
  const { files, cdnBaseUrl, fileName = "icon.svg", defaultFile = "" } = item

  const found = files.find(f => f.name == fileName)

  return found ? `${cdnBaseUrl}/${fileName}` : defaultFile
}

export function screenshotsList(item) {
  const imagePattern = /screenshot\.(png|gif|jpg|svg)$/i

  const { files, cdnBaseUrl } = item

  let screenshots = []

  screenshots = files
    .filter(f => !!f.name.match(imagePattern))
    .map(f => `${cdnBaseUrl}/${f.name}`)

  return screenshots
}

export function getAuthors(item, { number = 2 } = {}) {
  const authors = item.maintainers.map(a => a.name)

  return authors.slice(0, number).join(", ")
}
