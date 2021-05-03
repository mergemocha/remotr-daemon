import Conf from 'conf'

const config = new Conf({
  // This is not a leak; this is just here to prevent casual users from
  // fiddling with the config if they find it somewhere
  encryptionKey: 'supersecret',
  clearInvalidConfig: true,
  fileExtension: 'db'
})

export function getCredential (key: string): unknown | null {
  return config.get(key, null)
}

export function hasCredential (key: string): boolean {
  return config.has(key)
}

export function setCredential (key: string, value: string): void {
  return config.set(key, value)
}

export function deleteCredential (key: string): void {
  config.delete(key)
}
