import { Callout } from "@/components/marketing/callout";
import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/legal/privacy");

export default function Page() {
  return (
    <PageScaffold path="/legal/privacy" eyebrow="Legal">
      <Callout label="Not final yet" className="mt-10 max-w-3xl">
        This page is a placeholder. The final privacy policy will be published
        here before the site goes live on its production domain — we would
        rather show an empty page than publish policy text that has not been
        reviewed.
      </Callout>
    </PageScaffold>
  );
}
