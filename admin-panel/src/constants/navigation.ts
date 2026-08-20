import { ModuleName } from "@/constants/permissionEnums";

import { BoxCubeIcon, CalenderIcon, PageIcon, PlugInIcon } from "@/icons";
import {
  GridIcon,
  ListIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "lucide-react";
import { BsClipboardDataFill } from "react-icons/bs";
import {
  FaBlog,
  FaBorderAll,
  FaDatabase,
  FaListCheck,
  FaListUl,
  FaUniversalAccess,
} from "react-icons/fa6";
import { GrArticle, GrOverview, GrSync } from "react-icons/gr";
import { ImUsers } from "react-icons/im";
import { IoIosImages } from "react-icons/io";
import {
  MdAdminPanelSettings,
  MdOutlineFeaturedPlayList,
  MdOutlineManageHistory,
  MdUpcoming,
  MdWorkHistory,
} from "react-icons/md";
import { RiLoginCircleLine, RiUserSettingsFill } from "react-icons/ri";
import { SiShutterstock } from "react-icons/si";
import { TbBinaryTreeFilled, TbCategory2 } from "react-icons/tb";

export type NavItem = {
  name: string;
  icon: any;
  path?: string;
  moduleName?: ModuleName;
  subItems?: {
    moduleName: ModuleName;
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: any;
  }[];
};

export type MenuCategory = {
  id: string;
  label: string;
  items: NavItem[];
};

const modulesItem = [
  {
    icon: GridIcon,
    name: "Dashboard",
    path: "/",
    moduleName: ModuleName.DASHBOARD,
  },
  {
    name: "Blog Management",
    icon: FaBlog,
    subItems: [
      {
        name: "Blog Category",
        path: "/blog-category-management",
        icon: TbCategory2,
        moduleName: ModuleName.BLOG_POST,
      },
      {
        name: "Blog Post",
        path: "/blog-post-management",
        icon: GrArticle,
        moduleName: ModuleName.BLOG_POST,
      },
    ],
  },
  {
    name: "Booking Management",
    icon: FaBorderAll,
    path: "/booking-management",
    moduleName: ModuleName.BOOKING_MANAGEMENT,
  },
  {
    name: "ComingSoon Subscriber",
    icon: MdUpcoming,
    path: "/comingSoon-management",
    moduleName: ModuleName.COMMING_SOON_MANAGEMENT,
  },
  {
    name: "Plan Management",
    icon: FaListCheck,
    subItems: [
      {
        name: "Plans Overview",
        path: "/plans-overview",
        icon: GrOverview,
        moduleName: ModuleName.PLANS,
      },
      {
        name: "Plan Features",
        path: "/plan-features",
        icon: MdOutlineFeaturedPlayList,
        moduleName: ModuleName.PLANFEATURE,
      },
      {
        name: "FAQ for Plans",
        path: "/faq-plans",
        icon: FaListUl,
        moduleName: ModuleName.PLANFAQ,
      },
    ],
  },
  {
    icon: UserCircleIcon,
    name: "User Profile",
    path: "/profile",
    moduleName: ModuleName.DASHBOARD,
  },
];

const systemItems = [
  {
    icon: MdAdminPanelSettings,
    name: "Admin Management",
    path: "/admin-management",
    moduleName: ModuleName.ADMINMANAGEMENT,
  },
  {
    icon: FaUniversalAccess,
    name: "Access Management",
    path: "/access-management",
    moduleName: ModuleName.ACCESSMANAGEMENT,
  },
  {
    icon: RiUserSettingsFill,
    name: "Role Management",
    path: "/role-management",
    moduleName: ModuleName.ROLEMANAGEMENT,
  },
  {
    name: "Admin History",
    icon: MdWorkHistory,
    subItems: [
      {
        name: "Activity History",
        path: "/activity-history",
        icon: MdOutlineManageHistory,
        moduleName: ModuleName.ADMIN_ACTIVITY_HISTORY,
      },
      {
        name: "Login History",
        path: "/login-history",
        icon: RiLoginCircleLine,
        moduleName: ModuleName.ADMIN_LOGIN_HISTORY,
      },
    ],
  },
  {
    name: "Member Management",
    icon: ImUsers,
    path: "/member-management",
    moduleName: ModuleName.MEMBER_MANAGEMENT,
  },
  {
    name: "Member History",
    icon: MdWorkHistory,
    subItems: [
      {
        name: "Activity History",
        path: "/member-activity",
        icon: MdOutlineManageHistory,
        moduleName: ModuleName.MEMBER_MANAGEMENT,
      },
      {
        name: "Login History",
        path: "/member-history",
        icon: RiLoginCircleLine,
        moduleName: ModuleName.MEMBER_MANAGEMENT,
      },
    ],
  },
];

const marketDataSystemItems = [
  {
    name: "Indices Management",
    icon: BsClipboardDataFill,
    path: "/indices-management",
    moduleName: ModuleName.INDEX_MANAGEMENT,
  },
  {
    name: "Stocks List Management",
    icon: SiShutterstock,
    path: "/stocks-management",
    moduleName: ModuleName.STOCKS_MANAGEMENT,
  },
  {
    name: "Sync Management",
    icon: GrSync,
    path: "/sync-management",
    moduleName: ModuleName.SYNC_MANAGEMENT,
  },
  {
    name: "ETF List Management",
    icon: TbBinaryTreeFilled,
    path: "/etf-management",
    moduleName: ModuleName.ETF_MANAGEMENT,
  },
  {
    name: "Historical Data Management",
    icon: FaDatabase,
    path: "/historical-data-management",
    moduleName: ModuleName.HISTORICAL_DATA_MANAGEMENT,
  },
  {
    name: "Logos Management",
    icon: IoIosImages,
    path: "/logo-management",
    moduleName: ModuleName.LOGO_MANAGEMENT,
  },

  {
    name: "IPO Management",
    icon: FaDatabase,
    path: "/IPO-management",
    moduleName: ModuleName.BLOG_POST,
  },
];

export const menuCategories: MenuCategory[] = [
  {
    id: "modules",
    label: "Core Modules",
    items: modulesItem,
  },
  {
    id: "system",
    label: "Admin Management",
    items: systemItems,
  },
  {
    id: "marketData",
    label: "Market Data Center",
    items: marketDataSystemItems,
  },
  {
    id: "others",
    label: "Others",
    items: [
      {
        icon: CalenderIcon,
        name: "Calendar",
        path: "/calendar",
        moduleName: ModuleName.DASHBOARD,
      },
      {
        icon: UserCircleIcon,
        name: "User Profile",
        path: "/profile",
        moduleName: ModuleName.DASHBOARD,
      },

      {
        name: "Forms",
        icon: ListIcon,
        subItems: [
          {
            name: "Form Elements",
            path: "/form-elements",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
        moduleName: ModuleName.DASHBOARD,
      },

      {
        name: "Tables",
        icon: TableIcon,
        subItems: [
          {
            name: "Basic Tables",
            path: "/basic-tables",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
        moduleName: ModuleName.DASHBOARD,
      },
      {
        name: "Pages",
        icon: PageIcon,
        moduleName: ModuleName.DASHBOARD,
        subItems: [
          {
            name: "Blank Page",
            path: "/blank",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "404 Error",
            path: "/error-404",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
      },

      {
        icon: PieChartIcon,
        name: "Charts",
        moduleName: ModuleName.DASHBOARD,
        subItems: [
          {
            name: "Line Chart",
            path: "/line-chart",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Bar Chart",
            path: "/bar-chart",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
      },
      {
        icon: BoxCubeIcon,
        name: "UI Elements",
        moduleName: ModuleName.DASHBOARD,
        subItems: [
          {
            name: "Alerts",
            path: "/alerts",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Avatar",
            path: "/avatars",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Badge",
            path: "/badge",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Buttons",
            path: "/buttons",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Images",
            path: "/images",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Videos",
            path: "/videos",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
      },
      {
        icon: PlugInIcon,
        moduleName: ModuleName.DASHBOARD,
        name: "Authentication",
        subItems: [
          {
            name: "Sign In",
            path: "/signin",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
          {
            name: "Sign Up",
            path: "/signup",
            pro: false,
            moduleName: ModuleName.DASHBOARD,
          },
        ],
      },
    ],
  },
];
