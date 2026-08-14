import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/security");

export default function Page() {
  return <PageScaffold path="/security" eyebrow="Security" />;
}
