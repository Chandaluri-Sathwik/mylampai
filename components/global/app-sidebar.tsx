"use client";
import * as React from "react";
import {
  Bookmark,
  BookmarkMinus,
} from "lucide-react";
import { NavMain } from "@/components/global/nav-main";
import { NavUser } from "@/components/global/nav-user";
import {
  Sidebar,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icons: [Bookmark, BookmarkMinus],
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "CV Reviewer",
      url: "#",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Interview",
      url: "#",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Communnity",
      url: "#",
      icons: [Bookmark, BookmarkMinus],
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <div className="flex flex-col justify-between p-2">
      <NavMain items={data.navMain} />
      <NavUser />
    </div>
  );
}
