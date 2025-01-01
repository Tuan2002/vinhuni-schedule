export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vinh University - Cổng thông tin SV",
  description:
    "Tra cứu lịch thi và thời khóa biểu của sinh viên trường Đại học Vinh",
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
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
