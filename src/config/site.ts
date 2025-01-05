export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "VinhUNI Campus - Cổng thông tin",
  description:
    "Cổng tra cứu thông tin sinh viên trường Đại học Vinh",
  navItems: [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Lịch thi",
      href: "/contest-schedule",
    },
    {
      label: "Thời khóa biểu",
      href: "/schedule",
    },
  ],
  navMenuItems: [
    {
      label: "Tra cứu lịch thi",
      href: "/contest-schedule",
    },
    {
      label: "Tra cứu hời khóa biểu",
      href: "/schedule",
    },
  ],
  links: {
    github: "https://github.com/tuan2002",
    sponsor: "https://github.com/tuan2002",
  },
};
