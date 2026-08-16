import { LegalPageBody } from "@/components/marketing/legal-page";
import { pageMetadata } from "@/components/page-scaffold";
import { TERMS } from "@/lib/content/legal";

export const metadata = pageMetadata("/legal/terms");

export default function Page() {
  return <LegalPageBody page={TERMS} />;
}
