import { getPassword, setPassword, deletePassword } from 'keytar'
import { CREDSTORE_SERVICE_NAME } from './constants'

export async function getCredential (key: string): Promise<string | null> {
  return await getPassword(CREDSTORE_SERVICE_NAME, key)
}

export async function setCredential (key: string, value: string): Promise<void> {
  return await setPassword(CREDSTORE_SERVICE_NAME, key, value)
}

export async function deleteCredential (key: string): Promise<boolean> {
  return await deletePassword(CREDSTORE_SERVICE_NAME, key)
}
