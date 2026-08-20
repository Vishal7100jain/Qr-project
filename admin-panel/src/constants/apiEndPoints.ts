export const API_END_POINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
  },
  admin: {
    getProfile: "/profile",
  },
  adminManagement: {
    get: "/manage",
    getAdmin: "/manage",
    post: "/manage",
    delete: "/manage",
    getRoleList: "/roles/list",
    put: "/manage",
  },
  accessManagement: {
    get: "/access",
    post: "/access",
    put: "/access",
    delete: "/access",
    getAccess: "/access",
    getAccessPermissions: "/access/list",
  },
  role: {
    get: "/roles",
    post: "/roles",
    put: "/roles",
    delete: "/roles",
  },
  blogCategory: {
    get: "/blog-category",
    post: "/blog-category",
    put: "/blog-category",
    delete: "/blog-category",
    getList: "/blog-category/list",
  },
  blogPost: {
    get: "/blog",
    post: "/blog",
    put: "/blog",
    delete: "/blog",
  },
  history: {
    adminActivity: "/history/activity",
    adminLogin: "/history/login",
  },
  memberManagement: {
    get: "/member",
    post: "/member",
    delete: "/member",
    put: "/member",
  },
  memberHistory: {
    memberActivity: "/member-history/activity",
    memberLogin: "/member-history/login",
  },
  bookings: {
    bookingManagement: "/booking-management",
  },
  comingSoon: {
    comingSoonSubscriber: "/comming-soon",
  },
  planOverview: {
    get: "/plans",
    post: "/plans",
    put: "/plans",
    delete: "/plans",
    getList: "/plans",
  },
};
