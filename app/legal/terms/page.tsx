import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/legal/terms");

export default function Page() {
  return <PageScaffold path="/legal/terms" eyebrow="Legal" />;
}
