module.exports.default = Factor => {
  return {
    contactForm: {
      email: "andrew@fiction.com",
      confirm: {
        title: "Got your message.",
        subTitle: "We'll take a look and be in touch as soon as possible."
      }
    },
    blog: {
      indexRoute: "/blog",
      postRoute: "/entry",
      limit: 6,
      returnLinkText: "Back",
      components: {
        blogWrap: () => import("./blog/blog-wrap.vue"),
        blogIndex: () => import("./blog/blog-index.vue"),
        blogSingle: () => import("./blog/blog-single.vue"),
        blogFeaturedImage: () => import("./blog/el-featured-image.vue"),
        blogHeaders: () => import("./blog/el-headers.vue"),
        blogReturnLink: () => import("./blog/el-return-link.vue"),
        blogExcerpt: () => import("./blog/el-excerpt.vue"),
        blogMeta: () => import("./blog/el-meta.vue")
      },
      layout: {
        index: ["blogFeaturedImage", "blogHeaders", "blogExcerpt", "blogMeta"],
        single: [
          "blogHeaders",
          "blogFeaturedImage",
          "blogMeta",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate", "tags"]
      }
    },
    jobs: {
      indexRoute: "/careers",
      postRoute: "/careers",
      limit: 5,
      metatags: {
        index: {
          title: "Fiction Careers - Building Apps, Code, Remote Work",
          description: "Fiction Careers."
        }
      },
      components: {
        jobsContent: () => import("./jobs/content.vue"),
        jobsIndex: () => import("./jobs/index.vue"),
        jobsSingle: () => import("./jobs/single.vue")
      }
    }
  }
}
