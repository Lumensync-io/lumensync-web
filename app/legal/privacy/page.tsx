import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/legal/privacy");

export default function Page() {
  return <PageScaffold path="/legal/privacy" eyebrow="Legal" />;
}
