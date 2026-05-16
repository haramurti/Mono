import { format, parseISO } from "date-fns";

export function formatProfileDate(value: string | undefined) {
  if (!value) {
    return "—";
  }

  try {
    return format(parseISO(value), "MMMM d, yyyy");
  } catch {
    return "—";
  }
}

export function getLastLoginLabel(lastLoginAt: string | undefined) {
  return `Last login · ${formatProfileDate(lastLoginAt)}`;
}

export function getMemberSinceLabel(createdAt: string | undefined) {
  return `Member since · ${formatProfileDate(createdAt)}`;
}
