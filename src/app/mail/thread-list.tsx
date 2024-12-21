"use client";
import React from "react";
import useThreads from "./use-threads";
import { format } from "date-fns";

const ThreadList = () => {
  const { threads } = useThreads();

  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.lastMessageDate ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );
  return (
    <div className="max-h-[calc(100vh-120px)] max-w-full overflow-y-scroll">
      <div className="flex flex-col gap-2 p-4 pt-0">
        
      </div>
    </div>
  );
};

export default ThreadList;
