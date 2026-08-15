import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

// Vitest does not auto-cleanup Testing Library renders without `globals`.
afterEach(() => cleanup());

// next/image needs the Next runtime; render a plain <img> in unit tests.
// Static image imports resolve to a URL string under Vite, so accept both.
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, priority: _priority, sizes: _sizes, ...rest } = props;
    void _priority;
    void _sizes;
    const resolved =
      typeof src === "string" ? src : (src as { src?: string })?.src ?? "";
    return React.createElement("img", { src: resolved, alt, ...rest });
  },
}));
