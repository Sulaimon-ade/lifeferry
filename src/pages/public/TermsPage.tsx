import LegalPage from '../../components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      pageKey="terms"
      kicker="Legal"
      errorText="Failed to load terms of use. Please try again later."
    />
  );
}
