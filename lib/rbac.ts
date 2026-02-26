import type { Role } from "@prisma/client";

export function canGenerateAi(role: Role) {
  return role === "ADMIN" || role === "MANAGER";
}

export function canSeeAllLeads(role: Role) {
  return role === "ADMIN" || role === "MANAGER";
}
