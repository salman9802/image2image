import { BASE_PATH } from "@/config";


/** Helper function to prefix with configured Base Path  */
export function asset(path: string) {
  return `/${BASE_PATH}/${path.replace(/^\//, "")}`;
}

