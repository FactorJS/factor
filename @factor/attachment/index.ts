import { endpointRequest, authorizedRequest, EndpointParameters } from "@factor/endpoint"
import { storeItem } from "@factor/api"
import { uploadEndpointPath } from "./util"
import { PreUploadProperties } from "./types"
import "./universal"

export interface PostAttachment {
  url: string
}

export interface ImageUploadItems {
  file: File | Blob
  onPrep?: (p: PreUploadProperties) => void
  onFinished?: (p: any) => void
  onError?: (p: any) => void
  onChange?: (p: any) => void
}

export const sendStorageRequest = async ({
  method,
  params,
}: {
  method: string
  params: EndpointParameters
}): Promise<Record<string, any>> => {
  return (await endpointRequest({ id: "storage", method, params })) as Record<string, any>
}

/**
 * Sends a request to endpoint to delete an image
 */
export const requestDeleteImage = async (
  params: EndpointParameters
): Promise<Record<string, any>> => {
  return await sendStorageRequest({ method: "deleteImage", params })
}

/**
 * Resize a raw file upload and return as blog
 * Makes for better storage and uploading
 * @param fileOrBlobOrUrl - Image file or blob
 * @param {maxHeight, maxWidth} - Max dimensions of returned image
 */
export const resizeImage = async (
  fileOrBlobOrUrl: File | Blob,
  { maxWidth = 1200, maxHeight = 1200 }
): Promise<Blob> => {
  if (!document) {
    throw new Error("Can't resize image using this method on server.")
  }
  // Contains an unwrapped call to document, errors in server
  const { default: loadImage } = await import("blueimp-load-image")

  return await new Promise((resolve) => {
    loadImage(
      fileOrBlobOrUrl,
      (canvas: HTMLCanvasElement) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, fileOrBlobOrUrl.type)
      },
      { maxWidth, maxHeight, canvas: true, orientation: true }
    )
  })
}

/**
 * Optimize the image for upload
 * @param file - the image to upload
 * @param options  - image resizing options
 */
export const preUploadImage = async (
  { file, onPrep }: { file: File | Blob; onPrep?: (p: PreUploadProperties) => void },
  options = {}
): Promise<File | Blob> => {
  if (onPrep) {
    onPrep({ mode: "started", percent: 5 } as PreUploadProperties)
  }

  if (file.type.includes("image")) {
    file = await resizeImage(file, options)

    if (onPrep) {
      onPrep({
        mode: "resized",
        percent: 25,
        preview: URL.createObjectURL(file),
      } as PreUploadProperties)
    }
  }

  if (onPrep) {
    onPrep({ mode: "finished", percent: 100 } as PreUploadProperties)
  }

  return file
}

/**
 * Upload an image
 * @param file - the image
 * @param onPrep - callback during prep process
 * @param onFinished - callback when finished uploading
 * @param onError - callback if an error occurs
 * @param onChange - callback with upload progress info
 */
export const uploadImage = async ({
  file,
  onPrep,
  onFinished,
  onError,
  onChange,
}: ImageUploadItems): Promise<void> => {
  file = await preUploadImage({ file, onPrep })

  const formData = new FormData()

  formData.append("imageUpload", file)

  const {
    data: { result, error },
  } = await authorizedRequest(uploadEndpointPath(), formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: function (progressEvent) {
      if (onChange) {
        onChange(progressEvent)
      }
    },
  })

  if (error && onError) {
    onError(error)
  } else {
    storeItem(result._id, result)
    if (onFinished) {
      onFinished(result)
    }
  }
}
