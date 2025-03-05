import mongoose from "mongoose";

const applicationsData = [
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/cybers/cyber1.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video1.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4.5,
    numReviews: 12,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: true,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/cybers/cyber2.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video2.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4.5,
    numReviews: 12,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: true,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/cybers/cyber3.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video3.mov",
        caption: "Full Demo",
      },
    ],
    rating: 5,
    numReviews: 120,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: false,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/cybers/cyber4.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video4.mov",
        caption: "Full Demo",
      },
    ],
    rating: 3.5,
    numReviews: 12,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: true,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/cybers/cyber5.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video5.mov",
        caption: "Full Demo",
      },
    ],
    rating: 2.5,
    numReviews: 11,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: true,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    user: new mongoose.Types.ObjectId(), 
    name: "E-commerce Website",
    image: "/images/social/social3.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files.
    Each file corresponds to a single component, layout, page, plugin or extension – so you can
    easily find necessary piece of code and edit it for your needs. The package includes both 
    normal and minified CSS files, compiled from LESS. Also it is translation ready – you can
    change application language on-the-fly and use other features such as fallback languages,
    language detection, direct access etc etc. To see examples, follow the main navigation.
    Navigation is a powerful thing here. It supports both collapsible and accordion vertical
    navigation; multi level horizontal navigation with state saving feature. Horizontal navigation
    is used in navbars and mega menu. Navbar component has been extended and added plugins and
    components support (form components, buttons, links, menus, progress bars etc.). Mega menu
    is another song – it can be any color, any width and include any content. Page and panel headers
    support a lot of customization options and can include different components, basically all of
    them are optional (means you can easily remove them from stylesheets by removing a single
    line in LESS file). Overall design is harmonious, clean and user friendly. Even though the
    template has a lot of content, it doesn’t looks messy and all files and code are well structured,
    commented and divided. Check out the full list of features and go through all the pages.
    It will take some time though, but you won’t miss anything. Enjoy! Please, if you found any
    bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my
    best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web",
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License",
    price: 500,
    demoLink: "https://demo-ecommerce.com",
    documentationLink: "https://docs-ecommerce.com",
    githubRepo: "https://github.com/johndoe/ecommerce-project",
    supportDetails: {
      type: "Email support",
      duration: "6 months",
    },
    features: [
      "Responsive design",
      "Product search and filtering",
      "Shopping cart and checkout",
      "User authentication",
      "Admin dashboard",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video6.mov",
        caption: "Full Demo",
      },
    ],
    rating: 2,
    numReviews: 12,
    reviews: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        rating: 5,
        comment: "Excellent e-commerce solution! Easy to customize and deploy.",
        createdAt: "2023-10-03T10:15:00Z",
      },
    ],
    tags: ["ecommerce", "react", "nodejs", "mongodb"],
    authorDetails: {
      name: "Kopyov",
      portfolioLink: "https://example.com/portfolio",
      lastUpdate: "3 September 2023",
      published: "1 October 2015",
      highResolution: true,
      compatibleBrowsers: ["IE11", "Firefox", "Safari", "Opera", "Chrome", "Edge"],
      compatibleWith: "Bootstrap 5.x",
      documentation: "Well Documented",
      layout: "Responsive",
    },
    collaborators: [
      {
        _id: new mongoose.Types.ObjectId(), 
        user: new mongoose.Types.ObjectId(), 
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: new mongoose.Types.ObjectId(), 
        versionNumber: "1.1.0",
        releaseDate: "2023-10-05T12:00:00Z",
        changelog: [
          "Improved checkout process.",
          "Fixed bugs in the admin dashboard.",
        ],
      },
    ],
    metrics: {
      views: 1200,
      likes: 150,
      shares: 50,
      downloads: 300,
      purchases: 25,
    },
    isAvailable: false,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
 
];

export default applicationsData;