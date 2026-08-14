import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/checks");

export default function Page() {
  return <PageScaffold path="/product/checks" eyebrow="Product · Checks" />;
}
