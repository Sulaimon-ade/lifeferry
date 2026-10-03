/*
  # Add service_type to booking_requests

  booking_requests.service_id is a FK to services, which holds three broad
  marketing services (therapy & emotional support, awareness & education,
  wellness programmes). The booking form needs a finer-grained choice —
  the kind of counseling someone is asking for, e.g. marriage and family
  life, addiction therapy, personal growth — which does not map onto those
  three and should not be forced into them.

  Store that as free text alongside service_id. service_id stays as
  provenance for people who arrive from a specific service page via
  /book?service=<slug>; service_type is what the visitor actually picked.
*/

ALTER TABLE booking_requests
  ADD COLUMN IF NOT EXISTS service_type text DEFAULT '';
