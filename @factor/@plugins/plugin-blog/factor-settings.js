module.exports.default = Factor => {
  return {
    blog: {
      indexRoute: "/blog",
      postRoute: "/entry",
      limit: 10,
      returnLinkText: "All Posts",
      metatags: {
        index: {
          title: "Fiction Essays - Building Apps, Code, Remote Work",
          description: "Fiction blog posts."
        }
      },
      notFound: {
        title: "No Posts",
        subTitle: "Couldn't find any blog posts."
      },
      layout: {
        index: ["featuredImage", "headers", "excerpt", "meta"],
        single: [
          "returnLink",
          "featuredImage",
          "headers",
          "meta",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate", "tags"]
      },
      components: {
        blogWrap: () => import("./blog-wrap.vue"),
        blogIndex: () => import("./blog-index.vue"),
        blogSingle: () => import("./blog-single.vue"),
        pagination: () => import("./widget-pagination.vue"),
        returnLink: () => import("./widget-return-link.vue"),
        authorDate: () => import("./widget-author-date.vue"),
        authorBio: () => import("./widget-author-bio.vue"),
        entry: () => import("./widget-entry.vue"),
        excerpt: () => import("./widget-excerpt.vue"),
        featuredImage: () => import("./widget-featured-image.vue"),
        headers: () => import("./widget-headers.vue"),
        meta: () => import("./widget-meta.vue"),
        social: () => import("./widget-social.vue"),
        tags: () => import("./widget-tags.vue")
      }
    }
  }
}
