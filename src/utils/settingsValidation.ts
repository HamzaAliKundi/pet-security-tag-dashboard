/**
 * Utility function to check if user settings/profile is complete
 * Complete means all required fields are filled:
 * - firstName, lastName, email (always present if user exists)
 * - phone, street, city, state, zipCode, country (must be filled)
 */
export const isUserSettingsComplete = (user: any): boolean => {
  if (!user) {
    return false;
  }

  // Check required fields
  const requiredFields = [
    user.firstName,
    user.lastName,
    user.email,
    user.phone,
    user.street,
    user.city,
    user.state,
    user.zipCode,
    user.country
  ];

  // All fields must be truthy and non-empty strings
  return requiredFields.every(field => {
    return field && typeof field === 'string' && field.trim().length > 0;
  });
};

