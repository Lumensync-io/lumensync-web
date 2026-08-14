import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinkButton, SectionHeading } from "@/components/primitives";
import { Logo } from "@/components/logo";

describe("LinkButton", () => {
  it("renders internal links with Next Link semantics", () => {
    render(<LinkButton href="/request-demo">Request a Demo</LinkButton>);
    const link = screen.getByRole("link", { name: "Request a Demo" });
    expect(link).toHaveAttribute("href", "/request-demo");
  });

  it("renders external links as plain anchors", () => {
    render(<LinkButton href="https://app.lumensync.io">Sign In</LinkButton>);
    const link = screen.getByRole("link", { name: "Sign In" });
    expect(link).toHaveAttribute("href", "https://app.lumensync.io");
  });

  it("meets the 44px minimum touch-target height", () => {
    render(<LinkButton href="/x">Tap me</LinkButton>);
    const link = screen.getByRole("link", { name: "Tap me" });
    expect(link.className).toContain("min-h-11");
  });
});

describe("typography", () => {
  it("SectionHeading renders an h2", () => {
    render(<SectionHeading>Section title</SectionHeading>);
    expect(
      screen.getByRole("heading", { level: 2, name: "Section title" }),
    ).toBeInTheDocument();
  });
});

describe("Logo", () => {
  it("links home with an accessible name", () => {
    render(<Logo />);
    expect(
      screen.getByRole("link", { name: "LumenSync home" }),
    ).toHaveAttribute("href", "/");
  });
});
