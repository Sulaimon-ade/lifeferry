import LegalPage from '../../components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      pageKey="privacy"
      kicker="Legal"
      errorText="Failed to load privacy policy. Please try again later."
    />
  );
}
