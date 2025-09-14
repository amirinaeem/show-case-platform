// backend/utils/validator.js
import validator from 'validator';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return validator.isEmail(email || '');
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export const isStrongPassword = (password) => {
  return validator.isStrongPassword(password || '', {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  });
};

/**
 * Validate MongoDB ObjectId format
 */
export const validateObjectId = (id) => {
  return validator.isMongoId(id || '');
};


export const validateCommentText = (text) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 500;
};

/**
 * Check if string is not empty
 */
export const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

/**
 * Generic input sanitizer (remove dangerous characters)
 */
export const sanitizeInput = (input) => {
  return validator.escape(input || '');
};
