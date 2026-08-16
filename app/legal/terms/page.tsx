import { LegalPageBody } from "@/components/marketing/legal-page";
import { pageMetadata } from "@/components/page-scaffold";
import { TERMS } from "@/lib/content/legal";
import { assertLegalContentMatchesFlag } from "@/lib/indexing";

export const metadata = pageMetadata("/legal/terms");

export default function Page() {
  // Fails the build rather than publishing pre-approval text on a deployment
  // that claims its legal content is approved.
  assertLegalContentMatchesFlag();
  return <LegalPageBody page={TERMS} />;
}
