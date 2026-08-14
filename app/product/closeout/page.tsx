import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/closeout");

export default function Page() {
  return <PageScaffold path="/product/closeout" eyebrow="Product · Closeout" />;
}
