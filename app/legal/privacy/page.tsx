import { LegalPageBody } from "@/components/marketing/legal-page";
import { pageMetadata } from "@/components/page-scaffold";
import { DEMO_FORM_OFF_NOTE, DEMO_FORM_SECTION, PRIVACY } from "@/lib/content/legal";
import { isDemoRequestEnabled } from "@/lib/demo-request/config";
import { assertLegalContentMatchesFlag } from "@/lib/indexing";

export const metadata = pageMetadata("/legal/privacy");

export default function Page() {
  // Fails the build rather than publishing pre-approval text on a deployment
  // that claims its legal content is approved.
  assertLegalContentMatchesFlag();

  // The page must describe this deployment, not an intended one: while the form
  // has no destination, it says so instead of implying data is being collected.
  const sectionNotes: Record<string, string> = isDemoRequestEnabled()
    ? {}
    : { [DEMO_FORM_SECTION]: DEMO_FORM_OFF_NOTE };

  return <LegalPageBody page={PRIVACY} sectionNotes={sectionNotes} />;
}
