import bcrypt from "bcryptjs";

// bcryptjs Node.js API'lerine dayanır, edge runtime'da (middleware) çalışmaz — bu yüzden bilerek
// auth.ts'ten (middleware'in de import ettiği, jose tabanlı edge-safe modül) ayrı bir dosyada.
// Sadece Node runtime'da çalışan route handler'lar (register/login) bunu import eder.
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
