/**
 * Converts a string to a kebab-cased slug by removing special characters and replacing spaces with hyphens.
 * @param input The input string to be converted to a slug.
 * @returns The kebab-cased slug.
 */
export function getPolicyAreaSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim(); // Trim leading and trailing spaces or hyphens
}
