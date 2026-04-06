"use client";

import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Only create client if Convex URL is configured
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // Convex not configured yet — render children without provider
    return <>{children}</>;
  }

  return (
    <BaseConvexProvider client={convex}>
      {children}
    </BaseConvexProvider>
  );
}
