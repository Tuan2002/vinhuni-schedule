"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@heroui/navbar";
import NextLink from "next/link";

import {
  GithubIcon,
  HeartFilledIcon,
  Logo,
  SearchIcon,
} from "@/components/Icons";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";

export const Navbar = () => {

  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const POPOVER_INTERVAL = 10000; // 20 seconds
  const POPOVER_DURATION = 5000; // 5 seconds
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Tìm kiếm..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="fixed">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-4" href="/">
            <Logo />
            <p className="font-bold text-inherit">VinhUNI Campus</p>
          </NextLink>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          {siteConfig.navItems.map((item, index) => (
            <NavbarItem key={`${item.label}-${index}`} isActive={isActive(item.href)}>
              <Link
                color={isActive(item.href) ? "secondary" : "foreground"}
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Ủng hộ
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Button
          as={Link}
          isIconOnly
          className="text-sm font-normal text-default-600 bg-default-100"
          href={siteConfig.links.sponsor}
          startContent={<HeartFilledIcon className="text-danger" />}
          variant="flat"
        >
        </Button>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                as={NextLink}
                color={isActive(item.href) ? "secondary" : "foreground"}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
