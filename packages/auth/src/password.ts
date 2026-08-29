import bcryptjs from "bcryptjs";

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Validate password strength
 * Returns an error message if password is weak, or null if strong
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain special character";
  }

  return null;
}

/**
 * Generate a random password reset token
 */
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}
