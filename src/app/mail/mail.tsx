'use client'
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSwitcher } from "./account-switcher";
//Remarks and Notes on the Code:
//- We're Using Resizalble to be able to SPlit the screen into a lots of part a part for NavBar , main context ,and others
//- Use items-stretch to stretch items to fill the container’s cross axis
//on the line using '&&' it works as evaluatingthe left-hand-side then return the right-hand-side if the left-hand-side is true
//Separator is used to separate btw components s for or case it's used to separate btw sidebar emails and main content.

interface Props {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

const Mail = ({ defaultLayout = [20, 32, 40], navCollapsedSize }: Props) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false); // Accessed via React object
  // writing as a withhold for the futur to prevent the code to be lost :
  return (
    <TooltipProvider>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          console.log(sizes);
        }}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={40}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onResize={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className="flex-clo flex h-full flex-1">
            <div
              className={cn(
                "flex h-[52px] items-center justify-between px-4",
                isCollapsed ? "h-[52px]" : "px-2",
              )}
            >
              <AccountSwitcher isCollapsed={isCollapsed}></AccountSwitcher>
            </div>
            <Separator />
            Sidebar
            <div className="flex-1"></div>
            Ask AI
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="inbox">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>

              <TabsList className="ml-auto">
                <TabsTrigger
                  value="inbox"
                  className="text-zinc-600 dark:text-zinc-200"
                >Inbox</TabsTrigger>
              <TabsTrigger
                  value="done"
                  className="text-zinc-600 dark:text-zinc-200"
                >Done</TabsTrigger>
              </TabsList>
            </div>
            {/* Search Content */}
            Search Bar 
            <TabsContent value='inbox'>
              inbox
            </TabsContent>
            <TabsContent value='done'>
              done
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={(defaultLayout[2])} minSize={30}>
          thread display
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Mail;
