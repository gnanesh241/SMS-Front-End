import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/DashboardLayout",
  },
  {
    navlabel: true,
    subheader: "Insert",
  },
  {
    id: uniqueId(),
    title: "Students",
    icon: IconUsersGroup,
    href: "/DashboardLayout/insertStudents",
  },
  {
    id: uniqueId(),
    title: "Teachers",
    icon: IconCopy,
    href: "/DashboardLayout/insertTeachers",
  },
  {
    navlabel: true,
    subheader: "Attendance",
  },
  {
    id: uniqueId(),
    title: "Attendance",
    icon: IconLogin,
    href: "/DashboardLayout/Attendance",
  },
  
];

export default Menuitems;
