import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName: string, lastName: string) {
  if (!firstName && !lastName) return "U";
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""
    }`.toUpperCase();
}

export function getRoleName(roles: { id: string; name: string }[] | undefined): string {
  if (!roles || roles.length === 0) {
    return "N/A";
  }
  return roles?.find((role) => role.id === localStorage.getItem("selectedRole"))?.name || "N/A"
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};