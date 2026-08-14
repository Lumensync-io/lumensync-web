import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/fixtures");

export default function Page() {
  return <PageScaffold path="/product/fixtures" eyebrow="Product · Fixture Intelligence" />;
}
