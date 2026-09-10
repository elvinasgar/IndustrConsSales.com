/* =========================================================
   SECURITY — frontend-only fraud language detector.
   This is a simulation. A real implementation should call:
     POST /api/security/scan-text { text }
   and return a risk score from a proper backend/AI service.
   Flags text, never determines guilt — routes to moderation.
   ========================================================= */

const IC_FRAUD_KEYWORDS = [
  { pattern: /avans( ödəniş)?|qabaqcadan pul/i, label: "Advance-payment request" },
  { pattern: /otp|sms kod/i, label: "OTP / SMS code request" },
  { pattern: /cvv/i, label: "CVV request" },
  { pattern: /parol/i, label: "Password request" },
  { pattern: /şəxsi kart(a)?a? köçür/i, label: "Personal card transfer request" },
  { pattern: /https?:\/\/(?!industrcons)/i, label: "External link" },
  { pattern: /kripto|qarantili mənfəət|guaranteed profit/i, label: "Crypto / guaranteed-profit scheme" },
  { pattern: /kuryer.*ödəniş|fake courier/i, label: "Fake courier payment" },
  { pattern: /admin.*yazın|inzibatçı/i, label: "Admin impersonation" },
];

function scanTextForFraud(text){
  // TODO backend: POST /api/security/scan-text
  const hits = IC_FRAUD_KEYWORDS.filter(k => k.pattern.test(text));
  const score = Math.min(100, hits.length * 28 + (text.length > 400 ? 5 : 0));
  return { flagged: hits.length > 0, score, reasons: hits.map(h => h.label) };
}

function computeTrustScore(user){
  // TODO backend: GET /api/users/:id/trust-score
  let score = 40;
  if(user.phoneVerified) score += 15;
  if(user.emailVerified) score += 15;
  if(user.identitySubmitted) score += 15;
  if(user.businessVerified) score += 10;
  score += 5; // active history
  return Math.min(100, score);
}

function reportListing(listingId, reason){
  // TODO backend: POST /api/reports { listingId, reason }
  const ref = `RPT-${20000 + icRand(1,9999)}`;
  return { ok: true, reference: ref };
}

