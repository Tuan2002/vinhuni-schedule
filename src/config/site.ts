export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "VinhUNI Campus - Cổng thông tin sinh viên",
  description:
    "Cổng tra cứu thông tin sinh viên trường Đại học Vinh",
  keywords: "VinhUNI, Vinh University, VinhUNI Campus, VinhUNI Portal",
  url: process.env.NEXT_PUBLIC_BASE_URL,
  publicLogoUrl: "https://res.cloudinary.com/dxuxalbb0/image/upload/v1742903877/logo-vinhuni_vjscns.jpg",
  navItems: [
    {
      label: "Lịch thi",
      href: "/contest-schedule",
      isRoot: true,
    },
    {
      label: "Giảng viên",
      href: "/lecturers",
      isRoot: false,
    },
    {
      label: "Thời khóa biểu",
      href: "/schedule",
      isRoot: false,
    },
  ],
  navMenuItems: [
    {
      label: "Lịch thi",
      href: "/contest-schedule",
    },
    {
      label: "Giảng viên",
      href: "/lecturers",
    },
    {
      label: "Thời khóa biểu",
      href: "/schedule",
    },
  ],
  links: {
    github: "https://github.com/tuan2002",
    sponsor: "https://github.com/tuan2002",
  },
};
