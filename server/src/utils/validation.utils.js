// Email Regex Validation
export const isValidEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password Regex Validation
export const isStrongPassword = password => {
  // Explanation:
  // (?=.*[a-z])        -> must contain at least one lowercase letter
  // (?=.*[A-Z])        -> must contain at least one uppercase letter
  // (?=.*\d)           -> must contain at least one digit
  // (?=.*[^A-Za-z0-9]) -> must contain at least one special character
  // .{6,}              -> must be at least 6 characters long
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  return passwordRegex.test(password);
};

// Mobile Number Regex Validation
export const isValidMobile = mobile => {
  // Matches Indian mobile numbers (10 digits, starts with 6-9)
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};
