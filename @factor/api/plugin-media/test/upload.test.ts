/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import path from "path"
import nodeFetch from "node-fetch"
import { FormData } from "formdata-node"
// eslint-disable-next-line import/no-unresolved
import { fileFromPathSync } from "formdata-node/file-from-path"
import {
  it,
  describe,
  beforeAll,
  expect,
  createTestUtils,
  TestUtils,
} from "../../testUtils"
import { safeDirname } from "../../utils"
import { FactorMedia } from ".."
import { FactorAws } from "../../plugin-aws"
let testUtils: (TestUtils & { factorMedia?: FactorMedia }) | undefined =
  undefined

let url: string | undefined = undefined
const thisDir = safeDirname(import.meta.url)
// const randomImageFile = async () => {
//   const response = await axios.default.get<Blob>(
//     "https://source.unsplash.com/random",
//     {
//       responseType: "blob",
//     },
//   )

//   const file = new File([response.data], "random.jpg", { type: "image/jpeg" })

//   return file
// }

describe("user tests", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    const factorAws = new FactorAws({
      awsAccessKey: testUtils.factorEnv.var("AWS_ACCESS_KEY"),
      awsAccessKeySecret: testUtils.factorEnv.var("AWS_ACCESS_KEY_SECRET"),
    })
    testUtils.factorMedia = new FactorMedia({
      factorDb: testUtils.factorDb,
      factorUser: testUtils.factorUser,
      factorServer: testUtils.factorServer,
      factorAws,
      bucket: "factor-testing",
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    })
    testUtils.initialized = await testUtils.init()
  })

  it("uploads a file", async () => {
    // const file = await randomImageFile()

    // expect(file).toBeTruthy()

    const file = fileFromPathSync(path.join(thisDir, "./test.png"), {
      type: "image/png",
    })

    const formData = new FormData()

    formData.set("imageFile", file)

    const r = await testUtils?.factorMedia?.uploadFile({
      formData,
    })

    console.log("RESPONSE", r)

    expect(r?.data?.mediaId).toBeDefined()

    url = r?.data?.url

    if (!url) throw new Error("no url")
    expect(url).toContain("factor-testing")
    expect(url).toContain("test.png")

    expect(r).toMatchInlineSnapshot(`
      {
        "data": {
          "alt": null,
          "bucket": "factor-testing",
          "contentEncoding": null,
          "createdAt": "2022-06-13T23:38:57.942Z",
          "etag": null,
          "filePath": "us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
          "height": null,
          "mediaId": "62a7ca916126f913ef2ca564",
          "mime": "image/png",
          "size": 6914,
          "updatedAt": "2022-06-13T23:38:57.942Z",
          "url": "https://factor-testing.s3.amazonaws.com/us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
          "userId": "us62a7ca90f841d8033b3ba9a6",
          "width": null,
        },
        "message": "uploaded successfully",
        "status": "success",
      }
    `)

    const img = await nodeFetch(url)
    expect(img.status).toBe(200)
  })

  it("gets index of files uploaded", async () => {
    const r = await testUtils?.factorMedia?.requests.MediaIndex.request({
      _action: "list",
    })

    expect(r?.data?.length).toBeGreaterThan(0)
    expect(r?.message).toBeFalsy()
    expect(r).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "alt": null,
            "bucket": "factor-testing",
            "contentEncoding": null,
            "createdAt": "2022-06-13T23:38:57.942Z",
            "etag": null,
            "filePath": "us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
            "height": null,
            "mediaId": "62a7ca916126f913ef2ca564",
            "mime": "image/png",
            "size": 6914,
            "updatedAt": "2022-06-13T23:38:57.942Z",
            "url": "https://factor-testing.s3.amazonaws.com/us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
            "userId": "us62a7ca90f841d8033b3ba9a6",
            "width": null,
          },
        ],
        "message": "",
        "status": "success",
      }
    `)
  })

  it("deletes a file", async () => {
    if (!url) throw new Error("no url")

    const r = await testUtils?.factorMedia?.requests.MediaAction.request({
      _action: "delete",
      url,
      deleteStorage: true,
    })

    const pathname = new URL(url).pathname.replace(/^\/+/g, "")

    expect(pathname).toMatchInlineSnapshot(
      '"us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png"',
    )

    expect(r?.data).toMatchInlineSnapshot(`
      [
        {
          "alt": null,
          "bucket": "factor-testing",
          "contentEncoding": null,
          "createdAt": "2022-06-13T23:38:57.942Z",
          "etag": null,
          "filePath": "us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
          "height": null,
          "mediaId": "62a7ca916126f913ef2ca564",
          "mime": "image/png",
          "size": 6914,
          "updatedAt": "2022-06-13T23:38:57.942Z",
          "url": "https://factor-testing.s3.amazonaws.com/us62a7ca90f841d8033b3ba9a6/62a7ca916126f913ef2ca564-test.png",
          "userId": "us62a7ca90f841d8033b3ba9a6",
          "width": null,
        },
      ]
    `)

    const img = await nodeFetch(url)
    expect(img.status).toBe(403)
  })

  it("gets unsplash photos", async () => {
    const r = await testUtils?.factorMedia?.requests.Unsplash.request({
      _action: "random",
    })

    expect(r?.status).toBe("success")
    const urls = r?.data?.map((d) => d.urls).filter(Boolean)
    expect(urls?.length).toBe(30)

    const r2 = await testUtils?.factorMedia?.requests.Unsplash.request({
      _action: "search",
      query: "dog",
    })

    expect(r2?.status).toBe("success")
    const urls2 = r?.data?.map((d) => d.urls).filter(Boolean)
    expect(urls2?.length).toBe(30)
  })
})