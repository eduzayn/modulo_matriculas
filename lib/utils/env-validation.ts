/**
 * Validates required environment variables and logs warnings for missing ones
 * @param variables Object containing environment variable names and their descriptions
 * @returns Object with validation results
 */
export function validateEnvironmentVariables(
  variables: Record<string, string>
): { isValid: boolean; missingVars: string[] } {
  const missingVars = Object.entries(variables)
    .filter(([name, _]) => !process.env[name])
    .map(([name, desc]) => `${name} (${desc})`);
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
  }
  
  return { isValid: missingVars.length === 0, missingVars };
}
