import Factor from "@factor/core"
import mongoose from "mongoose"
import { logError } from "@factor/logger/util"

// POSTS

export async function savePost(_parameters, meta = {}) {
  return await Factor.$postServer.save(_parameters, meta)
}

export async function getSinglePost(_parameters, meta = {}) {
  return await Factor.$postServer.single(_parameters, meta)
}

// DB

export function getModel(postType) {
  return Factor.$postServer.db.model(postType)
}

export async function dbDisconnect() {
  if (["connected", "connecting"].includes(dbReadyState())) {
    await mongoose.connection.close()
  }
}

export async function dbConnect() {
  if (!["connected", "connecting"].includes(dbReadyState())) {
    try {
      const connectionString = process.env.DB_CONNECTION_TEST || process.env.DB_CONNECTION

      return await mongoose.connect(connectionString, { useNewUrlParser: true })
    } catch (error) {
      logError(error)
    }
  }
}

export function dbReadyState() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]

  return states[mongoose.connection.readyState]
}
