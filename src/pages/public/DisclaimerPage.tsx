import LegalPage from '../../components/LegalPage';

export default function DisclaimerPage() {
  return (
    <LegalPage
      pageKey="disclaimer"
      kicker="Please Read"
      errorText="Failed to load mental health disclaimer. Please try again later."
      withNotice
    />
  );
}
