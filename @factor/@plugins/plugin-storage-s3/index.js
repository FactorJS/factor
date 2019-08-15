module.exports.default = Factor => {
  return new (class {
    constructor() {
      const AWS = require("aws-sdk")

      this.AWS_ACCESS_KEY = Factor.$config.setting("AWS_ACCESS_KEY")
      this.AWS_ACCESS_KEY_SECRET = Factor.$config.setting("AWS_ACCESS_KEY_SECRET")
      this.AWS_S3_BUCKET = Factor.$config.setting("AWS_S3_BUCKET")

      if (!this.AWS_ACCESS_KEY || !this.AWS_ACCESS_KEY_SECRET || !this.AWS_S3_BUCKET) {
        Factor.$filters.add("setup-needed", _ => {
          const item = {
            title: "Plugin: S3 Storage Credentials",
            value: "The S3 storage plugin requires AWS S3 information to run correctly.",
            location: ".env/AWS_ACCESS_KEY, AWS_ACCESS_KEY_SECRET, AWS_S3_BUCKET"
          }

          return [..._, item]
        })

        return
      }

      AWS.config.update({
        accessKeyId: this.AWS_ACCESS_KEY,
        secretAccessKey: this.AWS_ACCESS_KEY_SECRET
      })

      this.bucket = this.AWS_S3_BUCKET
      this.S3 = new AWS.S3()

      Factor.$filters.add("storage-attachment-url", ({ buffer, key }) => {
        return new Promise((resolve, reject) => {
          var params = { Bucket: this.bucket, Key: key, Body: buffer, ACL: "public-read" }
          this.S3.upload(params, (err, data) => {
            if (err) reject(err)

            const { Location } = data || {}

            resolve(Location)
          })
        })
      })

      Factor.$filters.callback("delete-attachment", async doc => {
        const key = doc.url.split("amazonaws.com/")[1]

        if (key) {
          var params = { Bucket: this.bucket, Key: key }
          return await this.S3.deleteObject(params).promise()
        }
      })
    }
  })()
}
