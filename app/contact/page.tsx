import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/contact");

export default function Page() {
  return <PageScaffold path="/contact" eyebrow="Contact" />;
}
