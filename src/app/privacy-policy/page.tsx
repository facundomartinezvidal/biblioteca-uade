/**
 * Página /privacidad que reutiliza el componente creado en
 * src/app/politica-de-privacidad/page.tsx
 */
import PrivacyContent, {
  metadata as privacyMetadata,
} from "~/app/_components/privacy/privacy-content";

export const metadata = privacyMetadata;

export default function Page() {
  return <PrivacyContent />;
}
