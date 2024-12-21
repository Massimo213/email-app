"use client";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";

type SideBarProps = {
  isCollapsed: boolean;
};
const Sidebar = ({ isCollapsed }: SideBarProps) => {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("elystra-tab", "inbox");

  return (
    <Nav
      isCollapsed={isCollapsed}
    links={[
        {
          title: "Inbox",
          label: "1",
          icon: Inbox,
          variant: "default",
        },
        {
          title: "Draft",
          label: "4",
          icon: File,
          variant: "ghost",
        },
        {
          title: "Sent",
          label: "6",
          icon: Send,
          variant: "ghost",
        },
      ]}
    />
  );
};

export default Sidebar;
