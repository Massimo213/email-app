'use client'; // Marks this file as a Client Component

import React from "react";
import dynamic from "next/dynamic";

const Mail = dynamic(
  () => {
    return import("./mail");
  },
  {
    ssr: false, // This is now allowed since this is a Client Component
  },
);

const MailDashboard = () => {
  return (
    <Mail
      defaultLayout={[20, 32, 40]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
};

export default MailDashboard;

