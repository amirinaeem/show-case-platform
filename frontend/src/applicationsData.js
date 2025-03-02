const applicationsData = [
  {
    _id: "1",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "E-commerce Website",
    image: "/images/cybers/cyber1.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Web", // Platform: Web, Mobile, Desktop
    programmingLanguage: "JavaScript",
    framework: "React, Node.js",
    database: "MongoDB",
    licenseType: "Single License", // License type: Single, Multi, Open Source
    price: 500, // Price of the application
    demoLink: "https://demo-ecommerce.com", // Link to live demo
    documentationLink: "https://docs-ecommerce.com", // Link to documentation
    githubRepo: "https://github.com/johndoe/ecommerce-project", // GitHub repository
    supportDetails: {
      type: "Email support",
      duration: "6 months", // Support duration
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
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great design and functionality, but the documentation could be improved.",
        createdAt: "2023-10-02T14:30:00Z",
      },
      {
        _id: "review2",
        user: {
          _id: "user3",
          name: "Alice Johnson",
          avatar: "/images/avatars/alice.jpg",
        },
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
        _id: "collab1",
        user: {
          _id: "user4",
          name: "Bob Brown",
          avatar: "/images/avatars/bob.jpg",
        },
        role: "UI Designer",
        status: "approved",
        message: "I designed the homepage and product pages.",
        createdAt: "2023-10-03T18:20:00Z",
      },
    ],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: [
          "Initial release of the e-commerce website.",
          "Added product search and filtering.",
        ],
      },
      {
        _id: "version2",
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
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    _id: "2",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "Fitness Tracker App",
    image: "/images/education/educa1.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Mobile",
    programmingLanguage: "Dart",
    framework: "Flutter",
    database: "Firebase",
    licenseType: "Multi-License",
    price: 300,
    demoLink: "https://demo-fitness-app.com",
    documentationLink: "https://docs-fitness-app.com",
    githubRepo: "https://github.com/johndoe/fitness-app",
    supportDetails: {
      type: "Email and Chat support",
      duration: "12 months",
    },
    features: [
      "Activity tracking",
      "Calorie counter",
      "Workout plans",
      "User progress charts",
      "Social sharing",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video2.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4.2,
    numReviews: 8,
    reviews: [
      {
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great app, but the UI could be more intuitive.",
        createdAt: "2023-10-02T14:30:00Z",
      },
    ],
    tags: ["fitness", "flutter", "firebase", "mobile"],
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
    collaborators: [],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: ["Initial release of the fitness tracker app."],
      },
    ],
    metrics: {
      views: 800,
      likes: 100,
      shares: 30,
      downloads: 200,
      purchases: 15,
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    _id: "3",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "Fitness Tracker App",
    image: "/images/education/educa3.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Mobile",
    programmingLanguage: "Dart",
    framework: "Flutter",
    database: "Firebase",
    licenseType: "Multi-License",
    price: 300,
    demoLink: "https://demo-fitness-app.com",
    documentationLink: "https://docs-fitness-app.com",
    githubRepo: "https://github.com/johndoe/fitness-app",
    supportDetails: {
      type: "Email and Chat support",
      duration: "12 months",
    },
    features: [
      "Activity tracking",
      "Calorie counter",
      "Workout plans",
      "User progress charts",
      "Social sharing",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video3.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4,
    numReviews: 7,
    reviews: [
      {
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great app, but the UI could be more intuitive.",
        createdAt: "2023-10-02T14:30:00Z",
      },
    ],
    tags: ["fitness", "flutter", "firebase", "mobile"],
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
    collaborators: [],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: ["Initial release of the fitness tracker app."],
      },
    ],
    metrics: {
      views: 800,
      likes: 100,
      shares: 30,
      downloads: 200,
      purchases: 15,
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    _id: "4",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "Fitness Tracker App",
    image: "/images/education/educa2.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Mobile",
    programmingLanguage: "Dart",
    framework: "Flutter",
    database: "Firebase",
    licenseType: "Multi-License",
    price: 300,
    demoLink: "https://demo-fitness-app.com",
    documentationLink: "https://docs-fitness-app.com",
    githubRepo: "https://github.com/johndoe/fitness-app",
    supportDetails: {
      type: "Email and Chat support",
      duration: "12 months",
    },
    features: [
      "Activity tracking",
      "Calorie counter",
      "Workout plans",
      "User progress charts",
      "Social sharing",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video4.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4.2,
    numReviews: 8,
    reviews: [
      {
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great app, but the UI could be more intuitive.",
        createdAt: "2023-10-02T14:30:00Z",
      },
    ],
    tags: ["fitness", "flutter", "firebase", "mobile"],
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
    collaborators: [],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: ["Initial release of the fitness tracker app."],
      },
    ],
    metrics: {
      views: 800,
      likes: 100,
      shares: 30,
      downloads: 200,
      purchases: 15,
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    _id: "5",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "Fitness Tracker App",
    image: "/images/ecome/ecom2.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Mobile",
    programmingLanguage: "Dart",
    framework: "Flutter",
    database: "Firebase",
    licenseType: "Multi-License",
    price: 300,
    demoLink: "https://demo-fitness-app.com",
    documentationLink: "https://docs-fitness-app.com",
    githubRepo: "https://github.com/johndoe/fitness-app",
    supportDetails: {
      type: "Email and Chat support",
      duration: "12 months",
    },
    features: [
      "Activity tracking",
      "Calorie counter",
      "Workout plans",
      "User progress charts",
      "Social sharing",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video5.mov",
        caption: "Full Demo",
      },
    ],
    rating: 5,
    numReviews: 10,
    reviews: [
      {
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great app, but the UI could be more intuitive.",
        createdAt: "2023-10-02T14:30:00Z",
      },
    ],
    tags: ["fitness", "flutter", "firebase", "mobile"],
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
    collaborators: [],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: ["Initial release of the fitness tracker app."],
      },
    ],
    metrics: {
      views: 800,
      likes: 100,
      shares: 30,
      downloads: 200,
      purchases: 15,
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
  {
    _id: "6",
    user: {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatars/john.jpg",
    },
    name: "Fitness Tracker App",
    image: "/images/social/social1.jpg",
    description: `
    Limitless app kit is fully based on LESS pre-processor, includes 100+ commented LESS files. Each file corresponds to a single component, layout, page, plugin or extension – so you can easily find necessary piece of code and edit it for your needs. The package includes both normal and minified CSS files, compiled from LESS.
    Also it is translation ready – you can change application language on-the-fly and use other features such as fallback languages, language detection, direct access etc etc. To see examples, follow the main navigation.

    Navigation is a powerful thing here. It supports both collapsible and accordion vertical navigation; multi level horizontal navigation with state saving feature. Horizontal navigation is used in navbars and mega menu. Navbar component has been extended and added plugins and components support (form components, buttons, links, menus, progress bars etc.). Mega menu is another song – it can be any color, any width and include any content.

    Page and panel headers support a lot of customization options and can include different components, basically all of them are optional (means you can easily remove them from stylesheets by removing a single line in LESS file).

    Overall design is harmonious, clean and user friendly. Even though the template has a lot of content, it doesn’t looks messy and all files and code are well structured, commented and divided. Check out the full list of features and go through all the pages. It will take some time though, but you won’t miss anything. Enjoy!

    Please, if you found any bugs or have any suggestions and requests – don’t hesitate to let me know, i will do my best to fix those issues as soon as possible. Support is available: Mon – Fri, 9:00 – 20:00 CET
    `,
    platform: "Mobile",
    programmingLanguage: "Dart",
    framework: "Flutter",
    database: "Firebase",
    licenseType: "Multi-License",
    price: 300,
    demoLink: "https://demo-fitness-app.com",
    documentationLink: "https://docs-fitness-app.com",
    githubRepo: "https://github.com/johndoe/fitness-app",
    supportDetails: {
      type: "Email and Chat support",
      duration: "12 months",
    },
    features: [
      "Activity tracking",
      "Calorie counter",
      "Workout plans",
      "User progress charts",
      "Social sharing",
    ],
    previews: [
      {
        type: "video",
        url: "/videos/video6.mov",
        caption: "Full Demo",
      },
    ],
    rating: 4.8,
    numReviews: 81,
    reviews: [
      {
        _id: "review1",
        user: {
          _id: "user2",
          name: "Jane Smith",
          avatar: "/images/avatars/jane.jpg",
        },
        rating: 4,
        comment: "Great app, but the UI could be more intuitive.",
        createdAt: "2023-10-02T14:30:00Z",
      },
    ],
    tags: ["fitness", "flutter", "firebase", "mobile"],
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
    collaborators: [],
    versions: [
      {
        _id: "version1",
        versionNumber: "1.0.0",
        releaseDate: "2023-10-01T12:00:00Z",
        changelog: ["Initial release of the fitness tracker app."],
      },
    ],
    metrics: {
      views: 800,
      likes: 100,
      shares: 30,
      downloads: 200,
      purchases: 15,
    },
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-05T12:00:00Z",
  },
];

export default applicationsData;