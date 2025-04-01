export function generateReferralCode() {
  const randomCharPart = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const datePart = new Date().getTime().toString().slice(0, 4);

  return `${randomCharPart}-${datePart}`;
}
