import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/product/rfis");

export default function Page() {
  return <PageScaffold path="/product/rfis" eyebrow="Product · RFIs & Resolution" />;
}
