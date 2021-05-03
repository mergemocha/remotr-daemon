import Conf from 'conf'

const config = new Conf({
  // This is not a leak; this is just here to prevent casual users from
  // fiddling with the config if they find it somewhere
  encryptionKey: 'supersecret',
  clearInvalidConfig: true,
  fileExtension: 'db',
  // This is a bit of a hack but it's the only way we'll get configs into the package EXE
  cwd: process.cwd()
})

/**
 * Returns a credential from the credential store.
 *
 * @param key - Key to search by.
 * @returns Value of specified key, or undefined if not defined.
 */
export function getCredential (key: string): unknown | null {
  return config.get(key, undefined)
}

/**
 * Checks if a credential is defined in the credential store.
 *
 * @param key - Key to search by.
 * @returns Whether store contains a definition for this key.
 */
export function hasCredential (key: string): boolean {
  return config.has(key)
}

/**
 * Sets a credential in the credential store.
 *
 * @param key - Key to define.
 * @param value - Value to define for the key.
 */
export function setCredential (key: string, value: string): void {
  return config.set(key, value)
}

/**
 * Removes a credential from the credential store.
 *
 * @param key - Key to remove.
 */
export function deleteCredential (key: string): void {
  config.delete(key)
}
