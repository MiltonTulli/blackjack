export function uuid() {
  const timestamp = new Date().getTime();
  const randomPart = Math.random().toString(36).substr(2, 10); //
  const uniqueIdentifier = "BLACKJACK-SIMPLE-UUID";

  return `${timestamp}-${randomPart}-${uniqueIdentifier}`;
}
