import { Callout } from "@/components/marketing/callout";
import { PageScaffold, pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/legal/terms");

export default function Page() {
  return (
    <PageScaffold path="/legal/terms" eyebrow="Legal">
      <Callout label="Not final yet" className="mt-10 max-w-3xl">
        This page is a placeholder. The final terms of service will be published
        here before the site goes live on its production domain — we would
        rather show an empty page than publish terms that have not been
        reviewed.
      </Callout>
    </PageScaffold>
  );
}
