import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Formatea un ISBN agregando guiones
 * Soporta ISBN-10 (10 dígitos) e ISBN-13 (13 dígitos)
 * También maneja números parciales mientras el usuario escribe
 */
export function formatISBN(isbn: string): string {
  // Remover todos los guiones y espacios
  const cleanISBN = isbn.replace(/[-\s]/g, "");
  
  // Si tiene 13 dígitos (ISBN-13)
  if (cleanISBN.length === 13) {
    // Formato: 978-84-376-0498-5
    return `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 5)}-${cleanISBN.slice(5, 8)}-${cleanISBN.slice(8, 12)}-${cleanISBN.slice(12)}`;
  }
  
  // Si tiene 10 dígitos (ISBN-10)
  if (cleanISBN.length === 10) {
    // Formato: 84-376-0498-5
    return `${cleanISBN.slice(0, 2)}-${cleanISBN.slice(2, 5)}-${cleanISBN.slice(5, 9)}-${cleanISBN.slice(9)}`;
  }
  
  // Formato parcial mientras escribe (para mejor UX)
  if (cleanISBN.length > 0 && cleanISBN.length < 10) {
    // Si empieza con 978 o 979, probablemente será ISBN-13
    if (cleanISBN.startsWith('978') || cleanISBN.startsWith('979')) {
      let formatted = cleanISBN.slice(0, 3);
      if (cleanISBN.length > 3) formatted += '-' + cleanISBN.slice(3, 5);
      if (cleanISBN.length > 5) formatted += '-' + cleanISBN.slice(5, 8);
      if (cleanISBN.length > 8) formatted += '-' + cleanISBN.slice(8);
      return formatted;
    }
    // Si no, asumir ISBN-10
    let formatted = cleanISBN.slice(0, 2);
    if (cleanISBN.length > 2) formatted += '-' + cleanISBN.slice(2, 5);
    if (cleanISBN.length > 5) formatted += '-' + cleanISBN.slice(5, 9);
    if (cleanISBN.length > 9) formatted += '-' + cleanISBN.slice(9);
    return formatted;
  }
  
  // Formato parcial para ISBN-13 incompleto (10-12 dígitos)
  if (cleanISBN.length > 10 && cleanISBN.length < 13) {
    const formatted = cleanISBN.slice(0, 3) + '-' + cleanISBN.slice(3, 5) + '-' + cleanISBN.slice(5, 8) + '-' + cleanISBN.slice(8);
    return formatted;
  }
  
  // Si no tiene el formato esperado, devolver sin formatear
  return cleanISBN;
}

/**
 * Limpia un ISBN removiendo guiones y espacios
 */
export function cleanISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, "");
}

export type Book = {
  id: string;
  title: string;
  author?: string | null;
  authorMiddleName?: string | null;
  authorLastName?: string | null;
  editorial?: string | null;
  year?: number | null;
  gender?: string | null;
  description?: string | null;
  isbn?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  status?: string | null;
};
