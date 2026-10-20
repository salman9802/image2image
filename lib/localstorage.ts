
export function getItem(key: string) {
  if (window !== undefined)
    return localStorage.getItem(key);
  return null;
}

export function setItem(key: string, value: string) {
  if (window !== undefined)
    localStorage.setItem(key, value);
}
