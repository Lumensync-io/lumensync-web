import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/drawings");

export default function Page() {
  return <PageScaffold path="/product/drawings" eyebrow="Product · Drawings" />;
}
