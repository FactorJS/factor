import { addCallback } from "@factor/tools/filters"
import { decodeToken } from "@factor/user/jwt"
import * as endpointHandler from "@factor/post/server"

import { canUpdatePost } from "./util"
import {
  getModel,
  dbInitialize,
  dbDisconnect,
  dbSetupUtility,
  dbIsOffline
} from "./database"

export * from "./database"

addCallback("endpoints", { id: "posts", handler: endpointHandler })

if (process.env.DB_CONNECTION) {
  addCallback("initialize-server", () => dbInitialize())
  addCallback("close-server", () => dbDisconnect())
}

addCallback("initialize-server", () => dbSetupUtility())

export async function savePost({ data, postType = "post" }, { bearer = {} }) {
  if (dbIsOffline()) return null

  const { _id } = data

  let post
  let isNew
  let Model = getModel(postType)

  if (_id) post = await Model.findById(data._id)

  if (!_id || !post) {
    isNew = true
    post = new Model()
  }

  Object.assign(post, data)

  return canUpdatePost({ post, bearer, isNew, action: "save" }) ? await post.save() : null
}

export async function getSinglePost(params, meta = {}) {
  if (dbIsOffline()) return {}

  const { bearer } = meta

  let {
    _id,
    token,
    postType = "post",
    conditions,
    createOnEmpty = false,
    status = "all"
  } = params

  let _post

  let Model = getModel(postType)

  if (token) {
    const decoded = decodeToken(token)
    _id = decoded._id
  }

  // If ID is available, first look for it.
  if (_id) {
    _post = await Model.findById(_id)
  } else if (conditions) {
    _post = await Model.findOne(conditions)
  }

  if (_post) {
    // Check publication status. If author or mod, still return the post
    if (
      status == "published" &&
      _post.status != "published" &&
      (!bearer || (!_post.author.includes(bearer._id) && bearer.accessLevel < 100))
    ) {
      return null
    }
  }
  // If ID is unset or if it isn't found, create a new post model/doc
  // This is not saved at this point, leading to a post sometimes not existing although an ID exists
  else if (createOnEmpty) {
    const initial = {}
    if (bearer) initial.author = [bearer._id]
    _post = new Model(initial)
  }

  return _post
}

function authorCondition(bearer) {
  return bearer.accessLevel >= 300 ? {} : { author: bearer._id }
}

export async function updateManyById({ _ids, postType = "post", data }, { bearer }) {
  return await getModel(postType).update(
    { $and: [authorCondition(bearer), { _id: { $in: _ids } }] },
    { $set: data },
    { multi: true }
  )
}

export async function deleteManyById({ _ids, postType = "post" }, { bearer }) {
  return await getModel(postType).remove({
    $and: [authorCondition(bearer), { _id: { $in: _ids } }]
  })
}

export async function populatePosts({ _ids }) {
  if (dbIsOffline()) return []

  const _in = Array.isArray(_ids) ? _ids : [_ids]
  const result = await getModel("post").find({ _id: { $in: _in } })

  return Array.isArray(_ids) ? result : result[0]
}

export async function postList(params) {
  let { postType, conditions = {}, select = null, options } = params

  options = Object.assign(
    {},
    {
      sort: "-createdAt",
      limit: 20,
      skip: 0
    },
    options
  )

  return await getModel(postType).find(conditions, select, options)
}

export async function postIndex(params) {
  let { postType, conditions = {}, options } = params

  options = Object.assign(
    {},
    {
      sort: "-createdAt",
      limit: 20,
      skip: 0
    },
    options
  )

  const _p = [
    indexMeta({ postType, conditions, options }),
    getModel(postType).find(conditions, null, options)
  ]

  const [counts, posts] = await Promise.all(_p)

  return { meta: { ...counts, ...options, conditions }, posts }
}

export async function indexMeta({ postType, conditions, options }) {
  const { limit = 20, skip = 0 } = options || {}
  const ItemModel = getModel(postType)

  const aggregate = [
    {
      $facet: {
        tags: [{ $unwind: "$tag" }, { $sortByCount: "$tag" }],
        category: [{ $unwind: "$category" }, { $sortByCount: "$category" }],
        status: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ],
        role: [
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]

  const _p = [
    ItemModel.aggregate(aggregate),
    ItemModel.find(conditions).count(),
    ItemModel.count()
  ]

  const [aggregations, totalForQuery, total] = await Promise.all(_p)

  const pageCount = !totalForQuery ? 1 : Math.ceil(totalForQuery / limit)
  const pageCurrent = 1 + Math.floor(skip / limit)

  const _out = { ...aggregations[0], total, totalForQuery, pageCount, pageCurrent }

  return _out
}
