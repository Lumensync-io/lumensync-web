import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
} from "@/components/primitives";

export default function NotFound() {
  return (
    <Section aria-labelledby="page-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>404</Eyebrow>
          <span id="page-heading">
            <DisplayHeading>That page isn&apos;t on the drawing.</DisplayHeading>
          </span>
          <BodyCopy className="mt-6">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </BodyCopy>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/" variant="primary">
              Back to Home
            </LinkButton>
            <LinkButton href="/product" variant="secondary">
              Product Overview
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
