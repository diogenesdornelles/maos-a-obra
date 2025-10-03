import * as SecureStore from 'expo-secure-store';

export async function saveToken(value?: string) {
  await SecureStore.setItemAsync('token', value ?? '');
}

export async function getToken() {
  return await SecureStore.getItemAsync('token');
}

export async function deleteToken() {
  return await SecureStore.deleteItemAsync('token');
}
