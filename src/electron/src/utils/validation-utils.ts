import { logger } from "./logger.js";

export class ValidationUtils {
  public static isValidPhoneNumber(phone: string): boolean {
    if (!phone || typeof phone !== 'string') {
      return false;
    }
    
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Check if it's a valid Thai phone number (10-11 digits)
    return /^0[689]\d{8}$/.test(cleanPhone) || /^0[689]\d{9}$/.test(cleanPhone);
  }

  public static isValidAccessToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // Check if token has the expected format (contains colon)
    return token.includes(':') && token.length > 20;
  }

  public static isValidLdPlayerName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    // Check if name contains only valid characters
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0 && name.length <= 50;
  }

  public static isValidFileName(fileName: string): boolean {
    if (!fileName || typeof fileName !== 'string') {
      return false;
    }
    
    // Check for invalid characters in filename
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(fileName) && fileName.length > 0 && fileName.length <= 255;
  }

  public static isValidFilePath(filePath: string): boolean {
    if (!filePath || typeof filePath !== 'string') {
      return false;
    }
    
    try {
      // Check if path is absolute or relative
      return filePath.length > 0 && filePath.length <= 4096;
    } catch {
      return false;
    }
  }

  public static validateRequiredFields(obj: any, requiredFields: string[]): string[] {
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
        missingFields.push(field);
      }
    }
    
    return missingFields;
  }

  public static validateNumberRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
  }

  public static validateStringLength(value: string, minLength: number, maxLength: number): boolean {
    return typeof value === 'string' && value.length >= minLength && value.length <= maxLength;
  }

  public static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();
  }

  public static validateAndLog<T>(
    value: T,
    validator: (value: T) => boolean,
    fieldName: string,
    context?: string
  ): boolean {
    const isValid = validator(value);
    
    if (!isValid) {
      logger.warn(`Validation failed for ${fieldName}`, {
        value: String(value),
        context,
        fieldName
      });
    }
    
    return isValid;
  }
} 