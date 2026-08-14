import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/field");

export default function Page() {
  return <PageScaffold path="/product/field" eyebrow="Product · Field Hub" />;
}
