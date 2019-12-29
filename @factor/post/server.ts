import { addCallback } from "@factor/api/hooks"
import { decodeTokenIntoUser } from "@factor/user/jwt"
import * as endpointHandler from "@factor/post/server"
import { EndpointMeta } from "@factor/endpoint/types"
import { addEndpoint } from "@factor/api/endpoints"

import {
  PostActions,
  FactorPost,
  PostIndexAggregations,
  PostIndexCounts,
  PostIndexRequestParameters,
  PostIndex,
  UpdateManyPosts,
  PostRequestParameters
} from "./types"
import { canUpdatePostsCondition, postPermission } from "./util"
import {
  getModel,
  dbInitialize,
  dbDisconnect,
  dbSetupUtility,
  dbIsOffline
} from "./database"

export const savePost = async (
  { data, postType = "post" }: { data: FactorPost; postType: string },
  { bearer }: EndpointMeta
): Promise<FactorPost | {}> => {
  if (dbIsOffline()) return {}

  const { _id } = data

  let post
  let action = PostActions.Update

  const Model = getModel(postType)

  if (_id) post = await Model.findById(data._id)

  if (!_id || !post) {
    action = PostActions.Create
    post = new Model()
  }

  Object.assign(post, data)

  // Add bearer for middleware validation
  post.$locals.bearer = bearer

  return postPermission({ post, bearer, action }) ? await post.save() : {}
}

export const getSinglePost = async (
  params: PostRequestParameters,
  meta: EndpointMeta = {}
): Promise<FactorPost | void> => {
  const { bearer } = meta

  let { _id } = params

  const { token, postType = "post", conditions, createOnEmpty = false } = params

  let _post

  const Model = getModel(postType)

  if (!Model || dbIsOffline()) return

  // If token is sent, then return Post associated with it
  if (token) {
    const user = decodeTokenIntoUser(token)
    _id = user._id
  }

  // If ID is available, first look for it.
  if (_id) {
    _post = await Model.findById(_id)
  } else if (conditions) {
    _post = await Model.findOne(conditions)
  }

  if (_post && !postPermission({ post: _post, bearer, action: PostActions.Retrieve })) {
    return
  }
  // If ID is unset or if it isn't found, create a new post model/doc
  // This is not saved at this point, leading to a post sometimes not existing although an ID exists
  else if (createOnEmpty) {
    const initial = { author: bearer && bearer._id ? [bearer._id] : null }

    _post = new Model(initial)
  } else if (!_post) {
    return
  }

  return _post
}

export const updateManyById = async (
  { _ids, postType = "post", data }: UpdateManyPosts,
  { bearer }: EndpointMeta
): Promise<FactorPost[]> => {
  const permissionCondition = canUpdatePostsCondition({
    bearer,
    action: PostActions.Update,
    postType
  })

  const r = await getModel(postType).update(
    { $and: [permissionCondition, { _id: { $in: _ids } }] },
    { $set: data },
    { multi: true, bearer }
  )

  return r
}

export const deleteManyById = async (
  { _ids, postType = "post" }: UpdateManyPosts,
  { bearer }: EndpointMeta
): Promise<void> => {
  const permissionCondition = canUpdatePostsCondition({
    bearer,
    action: PostActions.Delete,
    postType
  })

  await getModel(postType).remove({
    $and: [permissionCondition, { _id: { $in: _ids } }]
  })

  return
}

export const populatePosts = async ({ _ids }: UpdateManyPosts): Promise<FactorPost[]> => {
  if (dbIsOffline()) return []

  const _in = Array.isArray(_ids) ? _ids : [_ids]
  const result = await getModel("post").find({ _id: { $in: _in } })

  return result
}

export const postList = async (
  params: PostIndexRequestParameters
): Promise<FactorPost[]> => {
  if (dbIsOffline()) return []

  const { postType, conditions = {}, select = null } = params
  let { options } = params

  options = Object.assign(
    {},
    {
      sort: { createdAt: "descending" },
      limit: 20,
      skip: 0
    },
    options
  )

  return await getModel(postType).find(conditions, select, options)
}

export const indexMeta = async ({
  postType,
  conditions,
  options
}: PostIndexRequestParameters): Promise<PostIndexAggregations & PostIndexCounts> => {
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

  const [aggregations, totalForQuery, total] = await Promise.all([
    ItemModel.aggregate(aggregate).exec(),
    ItemModel.find(conditions).count(),
    ItemModel.count({})
  ])

  const pageCount = !totalForQuery ? 1 : Math.ceil(totalForQuery / limit)
  const pageCurrent = 1 + Math.floor(skip / limit)

  const _out = { ...aggregations[0], total, totalForQuery, pageCount, pageCurrent }

  return _out
}

export const postIndex = async (
  params: PostIndexRequestParameters
): Promise<PostIndex> => {
  if (dbIsOffline()) return { meta: {}, posts: [] }

  const { postType, conditions = {} } = params
  let { options } = params

  options = Object.assign(
    {},
    {
      sort: { date: "descending", createdAt: "descending" },
      limit: 20,
      skip: 0
    },
    options
  )

  const [counts, posts] = await Promise.all([
    indexMeta({ postType, conditions, options }),
    getModel(postType)
      .find(conditions, null, options)
      .exec()
  ])

  return { meta: { ...counts, ...options, conditions }, posts }
}

export const setup = (): void => {
  addEndpoint({ id: "posts", handler: endpointHandler })

  if (process.env.DB_CONNECTION) {
    addCallback({ key: "db", hook: "initialize-server", callback: () => dbInitialize() })
    addCallback({ key: "db", hook: "close-server", callback: () => dbDisconnect() })
  }

  addCallback({
    key: "dbSetup",
    hook: "initialize-server",
    callback: () => dbSetupUtility()
  })
}

setup()
