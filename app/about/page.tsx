import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/about");

export default function Page() {
  return <PageScaffold path="/about" eyebrow="Company" />;
}
