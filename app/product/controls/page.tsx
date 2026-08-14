import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/controls");

export default function Page() {
  return <PageScaffold path="/product/controls" eyebrow="Product · Controls" />;
}
