export default {
  headTags: {
    font: `<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600&display=swap" rel="stylesheet" />`
  },
  site: {
    logo: require("./img/logo-zeno.svg"),
    nav: [
      {
        path: "/",
        name: "Home"
      },
      {
        path: "/#solutions",
        name: "Solutions"
      },
      {
        path: "/#devops-as-a-service",
        name: "Devops-as-a-Service  "
      },
      {
        path: "/#infrastructure-as-code",
        name: "Infrastructure as Code"
      },
      {
        path: "/pricing",
        name: "Pricing"
      }
    ],
    cta: {
      title: "Get better results with Elastic Byte",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "bg-gray-100 text-indigo-600"
        },
      ]
    },
  },
  home: {
    meta: {
      title: "Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "Grow Your Business, Not Infrastructure.",
      title: "We build, optimize, secure, and support your cloud with no long-term contract.",
      content: "Experts that architect and manage clouds with dedicated and obsessive 24/7/365 support.",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        },
        {
          link: "/pricing",
          text: "Pricing",
          classes: "bg-gray-100 text-indigo-600"
        },
      ]
    },
    clients: {
      title: "Working with the following clouds:",
      list: [
        {
          link: "/",
          image: require("./img/aws.svg"),
          alt: "Amazon Web Services"
        },
        {
          link: "/",
          image: require("./img/google-cloud-platform.svg"),
          alt: "Google Cloud Platform"
        },
        {
          link: "/",
          image: require("./img/digital-ocean.svg"),
          alt: "Digital Ocean"
        }
      ]
    },
    solutions: {
      title: "Solutions",
      items: [
        {
          icon: require("./img/plan.svg"),
          title: "Plan",
          list: [
            {
              content: "Cloud infrastructure design that is secure, performant, elastic, affordable, and agnostic."
            },
            {
              content: "Migrate existing infrastructure from Heroku, on-premise, or other providers."
            },
            {
              content: "Re-architect your infrastructure or migrate to microservices, containers, and serverless."
            }
          ]
        },
        {
          icon: require("./img/build.svg"),
          title: "Build",
          list: [
            {
              content: "From simple LAMP/MEAN stacks to complex multi-region architectures using Packer, Terraform, containerization and beyond, we can build it."
            },
            {
              content: "CDN configuration and optimization including expert knowledge of CloudFlare."
            },
            {
              content: "Local development environments, continuous integration pipelines, deployments, and testing infrastructure."
            }
          ]
        },
        {
          icon: require("./img/manage.svg"),
          title: "Manage",
          list: [
            {
              content: "Manage your infrastructure spend and reduce costs."
            },
            {
              content: "Infrastructure monitoring and alerting using native cloud provider offerings or third parties such as Datadog, Pingdom, and PagerDuty."
            },
            {
              content: "Compliance and governance. Security patching and updating of infrastructure components."
            }
          ]
        }
      ]
    },
    devops: {
      id: "devops-as-a-service",
      pretitle: "Devops-as-a-Service",
      title: "Your first and last DevOps hire!",
      content: "<p>By leveraging our decades of DevOps and sysadmin experience, we'll help you focus on what's important… Growing your business.</p><p>Elastic Byte will handle uptime, security, cost optimization, disaster recovery, and performance. We’re always on-call, ready to assist. Focused on being responsive, transparent, and thorough.</p>",
      buttons: [
        {
          link: "/contact",
          text: "Contact Us",
          classes: "bg-green-300 text-indigo-600"
        }
      ],
      figure: () => import("./el/figure-devops.vue")
    },
    infrastructure: {
      pretitle: "Infrastructure as Code",
      title: "Packer + Terraform = ",
      titleIcon: require("./img/custom-heart.svg"),
      items: [
        {
          image: require("./img/logo-packer.svg"),
          alt: "HashiCorp Packer",
          content: "<p>Packer automates the creation of machine images across cloud providers.</p><p>It embraces modern configuration management by utilizing automated scripts to install and configure software within images.</p><p>Produces exact point-in-time images with multi-region replication support.</p>",
        },
        {
          image: require("./img/logo-terraform.svg"),
          alt: "HashiCorp Terraform",
          content: "<p>Terraform codifies infrastructure and resources, replacing manual point and click with a simple and intuitive declarative configuration.</p><p>Confidently apply reproducible infrastructure transformations. Humans make mistakes and forget details, machines and code don't.</p><p>Terraform configurations can be stored in version control, shared, and collaborated on by teams.</p>",
        }
      ],
      syntaxTitle: "terraform.tf",
      syntax: () => import("./el/figure-infrastructure.vue")
    },
    testimonials: {
      pretitle: "Success Stories",
      title: "Our customers love what we do!",
      items: [
        {
          content: "@elasticbyte architected and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!",
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        },
        {
          content: "@elasticbyte architected and fully managed our migration to #kubernetes and on-premises enterprise deployments. They've been absolutely fantastic!",
          image: require("./img/client.svg"),
          author: "Will Norton",
          info: "CEO, SimplyAgree"
        }
      ]
    },
  },
  about: {
    meta: {
      title: "About - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "About Us",
      title: "Elastic Byte is a DevOps as a service company which builds, optimizes, secures and supports your cloud.",
      image: require("./img/stars.svg"),
    },
    team: {
      title: "Leadership",
      members: [
        {
          photo: require("./img/justin.jpg"),
          social: [
            {
              link: "https://www.linkedin.com/in/jkell",
              icon: "linkedin"
            },
            {
              link: "https://github.com/nodesocket",
              icon: "github"
            },
            {
              link: "https://angel.co/justink",
              icon: "angellist"
            }
          ],
          title: "Founder",
          name: "Justin Keller",
          content: "Justin has been programming and managing infrastructure for over a decade and has founded three startups ranging from a hosting company to a Node.js platform as a service to a distributed SSH platform (Commando.io). He received his Bachelor of Science in Computer Science from San Diego State University. He's managed cloud infrastructure for Fortune 500 companies powered by Amazon Web Services and Google Cloud."
        }
      ]
    },
    location: {
      title: "Based in music city; Nashville, Tennessee.",
      figure: () => import("./el/figure-location.vue")
    }
  },
  pricing: {
    meta: {
      title: "Pricing - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "Pricing that scales with your business.",
      title: "Choose the right plan for your business.",
      content: "Three simple monthly plans with hours that can be used for any infrastructure or DevOps related tasks.",
      image: require("./img/stars.svg"),
    },
    packages: [
      {
        classes: "border border-gray-300",
        name: "Nano",
        description: "The full power of Elastic Byte",
        list: [
          {
            content: `<div>$2,000</div>per month`
          },
          {
            content: `<div>10</div>billable hours included monthly`
          },
          {
            content: `<span>$300</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "bg-green-300 text-indigo-600"
      },
      {
        classes: "border border-indigo-400",
        name: "Micro",
        description: "Great value for growing businesses",
        list: [
          {
            content: `<div>$3,500</div>per month`
          },
          {
            content: `<div>20</div>billable hours included monthly`
          },
          {
            content: `<span>$250</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via dedicated Slack, video conference, ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "bg-green-300 text-indigo-600"
      },
      {
        classes: "border border-gray-300",
        name: "Mega",
        description: "Infrastructure and DevOps at scale",
        list: [
          {
            content: `<div>$6,000</div>per month`
          },
          {
            content: `<div>40</div>billable hours included monthly`
          },
          {
            content: `<span>$200</span> per additional hour`
          },
          {
            content: `24/7/365 on-call and 99.9% SLA`
          },
          {
            content: `communication via dedicated Slack, video conference, ticketing system and e-mail.`
          }
        ],
        buttonLink: "/contact",
        buttonText: "Contact Us",
        buttonClasses: "bg-green-300 text-indigo-600"
      }
    ],
    packagesFooter: "* Tasks are billed in half-hour increments with a half-hour minimum.",
    faq: {
      title: "Billing FAQs",
      questions: [
        {
          title: "How are payments handled?",
          content: `<p>We process all payments via Stripe and offer two payment options.</p><ul><li>ACH debit bank transfer. (US only)</li><li> All major credit cards. Note, there is a 3% processing fee for credit card transactions.</li></ul>`
        },
        {
          title: "Who pays for infrastructure and 3rd party services?",
          content: `To prevent any vendor lock-in, you do. All infrastructure and cloud costs are still under your payment method of choice. If we recommend a 3rd party service, you'll signup, provide your own billing details, and then give us credentials/access to the service.`
        },
        {
          title: "Can I cancel at anytime?",
          content: `We require a three month commitment at the start, but after that all of our plans are month-to-month so you may cancel at any time. As a courtesy, we can provide a detailed "exit briefing" to the new party taking over.`
        },
        {
          title: "What happens if I go over my plans included hours?",
          content: `After you've utilized your plans included hours, you will be billed at your plans billable hourly rate above.`
        },
        {
          title: "Do you have smaller plans with less billable hours?",
          content: `Unfortunately no. The NANO plan is the smallest plan we can offer while maintaining a high level of quality service.`
        },
        {
          title: "Do you offer annual billing?",
          content: `Yes, and we offer a discount for up-front annual billing. Please contact us for details.`
        },
        {
          title: "Can I change plans at any time?",
          content: `Sure, you can upgrade and downgrade plans at any time we only ask for 30 days notice when downgrading.`
        },
        {
          title: "We require an invoice, do you send one?",
          content: `Yes, we send an invoice each month of service.`
        },
        {
          title: "How are tasks billed?",
          content: `Tasks are billed in half-hour increments with a half-hour minimum. For example, a task that takes us 15 minutes to complete would be billed as ½ hour.`
        },
        {
          title: "Do you accept clients outside of the United States?",
          content: `Absolutely.`
        },
        {
          title: "Do you accept credit cards outside of the United States?",
          content: `Yes. Stripe our payment processor accepts all major international credit cards.`
        },
        {
          title: "Are ACH debit bank transfers outside of the United States supported?",
          content: `Unfortunately not. ACH debit is only supported by US bank accounts.`
        }
      ]
    }
  },
  contact: {
    meta: {
      title: "Contact - Factor Zeno Theme",
      description:
        "A minimal, personal or portfolio theme. Ideal for entrepreneurs or individuals of multiple creative professions.",
      image: require("./img/logo-zeno.jpg")
    },
    intro: {
      pretitle: "Contact Us",
      title: "Give us a shout. Let us know how we can help.",
      content: "We'd love to hear about your business and find a time to discuss your needs. Fill out the form and we will be in touch shortly.",
      figure: require("./img/cloud.svg"),
      figure2: require("./img/stars.svg")
    }
  },
  contactForm: {
    submit: {
      btn: "primary",
      size: "",
      text: "Submit",
      icon: "arrow-right"
    },
    inputFormat: "vertical",
    confirm: {
      title: "Got it!",
      subTitle: "We’ll get back to you as soon as possible."
    },
    layout: [
      {
        label: "Plan Interest",
        _id: "plan",
        inputType: "select",
        required: true,
        options: [
          {
            name: "Unsure",
            label: "Unsure",
            value: "unsure"
          },
          {
            name: "Nano",
            value: "nano"
          },
          {
            name: "Micro",
            value: "micro"
          },
          {
            name: "Mega",
            value: "mega"
          }
        ]
      },
      {
        label: "Name",
        _id: "name",
        inputType: "text",
        placeholder: "Full Name",
        required: true
      },
      {
        label: "Work Email",
        _id: "email",
        inputType: "email",
        placeholder: "name@example.com",
        required: true
      },
      {
        label: "Message",
        _id: "message",
        inputType: "textarea",
        placeholder: "how can we help?"
      }
    ]
  },
  footer: {
    nav: [
      {
        path: "/",
        name: "Home"
      },
      {
        path: "/#solutions",
        name: "Solutions"
      },
      {
        path: "/#devops-as-a-service",
        name: "Devops-as-a-Service  "
      },
      {
        path: "/#infrastructure-as-code",
        name: "Infrastructure as Code"
      },
      {
        path: "/#pricing",
        name: "Pricing"
      },
      {
        path: "/about",
        name: "About"
      },
      {
        path: "/blog",
        name: "Blog"
      },
      {
        path: "https://twitter.com/",
        icon: "twitter"
      }
    ],
    left: `Built with <i class="fa fa-heart"></i> in Nashville`,
    right: "<p>&copy; 2020 <a href='https://nodesocket.com/' target='_blank'>NoseSocket, LLC.</a></p><p>All rights reserved.</p>",
  }
}
