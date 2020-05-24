import { applyFilters } from "@factor/api/hooks"
import { Schema, Document } from "mongoose"
import { setting } from "@factor/api/settings"
import { addPostType } from "@factor/api/post-types"
import { objectIdType } from "./object-id"
import { FactorPost, PostStatus } from "./types"

addPostType({
  postType: "post",
  schemaOptions: {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
  schemaPopulated: ["author", "images", "avatar"],
  permissions: {
    create: { accessLevel: 100 },
    retrieve: {
      accessLevel: 100,
      accessPublished: 0,
      accessAuthor: true,
    },
    update: { accessLevel: 100, accessAuthor: true },
    delete: { accessLevel: 200, accessAuthor: true },
    embedded: {
      create: { accessLevel: 1 },
      retrieve: { accessLevel: 0 },
      update: { accessLevel: 100, accessAuthor: true },
      delete: { accessLevel: 100, accessAuthor: true },
    },
  },
  schemaMiddleware: (postSchema: Schema): void => {
    /**
     * Add index to allow full-text search
     */
    postSchema.index({
      title: "text",
      content: "text",
      username: "text",
      "embedded.$.title": "text",
      "embedded.$.content": "text",
    })

    postSchema.pre("save", function (this: FactorPost & Document, next) {
      // apparently mongoose can't detect change to object keys
      this.markModified("settings")

      if (!this.date) {
        const now = new Date()
        this.date = now.toISOString()
        this.contributedAt = now.toISOString()
      }

      this.postType = this.get("__t") || "post"
      next()
    })
  },
  schemaDefinition: () =>
    applyFilters("post-schema", {
      postType: { type: String, index: true, sparse: true },
      date: Date,
      contributedAt: Date,
      title: { type: String, trim: true },
      synopsis: { type: String, trim: true },
      content: { type: String, trim: true },
      author: [{ type: objectIdType(), ref: "user" }],
      follower: [{ type: objectIdType(), ref: "user" }],
      images: [{ type: objectIdType(), ref: "attachment" }],
      avatar: { type: objectIdType(), ref: "attachment" },
      tag: { type: [String], index: true },
      category: { type: [String], index: true, default: [] },
      /**
       * Source Key
       * - Used to distinguish which app created a post in multi-app databases
       */
      source: {
        type: String,
        trim: true,
        default: setting("package.name"),
        index: true,
      },
      /**
       * Settings is a vanilla key/value container
       */
      settings: {},
      /**
       * List is a vanilla list container
       */
      list: { type: [Object] },
      /**
       * Embedded documents (comments, posts, etc.)
       */
      embedded: { type: [Object], select: false },
      embeddedCount: { type: Number, default: 0, index: true },
      status: {
        type: String,
        enum: Object.values(PostStatus),
        index: true,
        default: PostStatus.Draft,
      },
      /**
       * Provides a shorter unique identifier, also
       * Allow plugins to set a custom UniqueId that can be
       * referenced without first querying the DB
       */
      uniqueId: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
      },
      permalink: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        minlength: 2,
        validator: function (v: string): boolean {
          return /^[\d-az-]+$/.test(v)
        },
        message: (props: { value: string }): string =>
          `permalink ${props.value} is not URL compatible.`,
      },
    }),
})
