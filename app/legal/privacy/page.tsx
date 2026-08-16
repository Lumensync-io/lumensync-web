import { LegalPageBody } from "@/components/marketing/legal-page";
import { pageMetadata } from "@/components/page-scaffold";
import { PRIVACY } from "@/lib/content/legal";

export const metadata = pageMetadata("/legal/privacy");

export default function Page() {
  return <LegalPageBody page={PRIVACY} />;
}
