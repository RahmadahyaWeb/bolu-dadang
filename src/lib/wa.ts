export function waLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("8")
      ? `62${digits}`
      : digits;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
