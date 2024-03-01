import { FactorDbCol, FactorDbTable } from "../plugin-db"

export const mediaTable = new FactorDbTable({
  tableKey: "factor_media",
  timestamps: true,
  columns: [
    new FactorDbCol({
      key: "mediaId",
      create: ({ schema, column, db }) => {
        schema
          .string(column.pgKey)
          .primary()
          .defaultTo(db.raw(`generate_object_id()`))
      },
    }),
    new FactorDbCol({
      key: "userId",
      create: ({ schema, column }) => {
        schema
          .string(column.pgKey, 32)
          .references(`factor_user.user_id`)
          .onUpdate("CASCADE")
      },
    }),
    new FactorDbCol({
      key: "url",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "originUrl",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "urlSmall",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "originUrlSmall",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),

    new FactorDbCol({
      key: "blurhash",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "preview",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "filePath",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "mime",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "width",
      create: ({ schema, column }) => schema.integer(column.pgKey),
    }),
    new FactorDbCol({
      key: "height",
      create: ({ schema, column }) => schema.integer(column.pgKey),
    }),

    new FactorDbCol({
      key: "alt",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),

    new FactorDbCol({
      key: "contentEncoding",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "etag",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "bucket",
      create: ({ schema, column }) => schema.string(column.pgKey),
    }),
    new FactorDbCol({
      key: "size",
      create: ({ schema, column }) => schema.integer(column.pgKey),
    }),
  ],
})
