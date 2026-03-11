"use client"

import { useAppSelector } from "@/store/hooks"

export function usePermission(permission: string) {
  const permissions = useAppSelector((state) => state.permissions.permissions)
  return permissions.includes(permission)
}