"use client";

import React from "react";
import { Provider } from "@/store/Provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
