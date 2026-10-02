import { enableAutoUnmount } from "@vue/test-utils";
import { afterEach } from "vitest";

const memoryStorage = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return memoryStorage.size;
  },
  clear: () => memoryStorage.clear(),
  getItem: (key) => memoryStorage.get(key) ?? null,
  key: (index) => [...memoryStorage.keys()][index] ?? null,
  removeItem: (key) => {
    memoryStorage.delete(key);
  },
  setItem: (key, value) => {
    memoryStorage.set(key, value);
  },
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: localStorageMock,
});

enableAutoUnmount(afterEach);

afterEach(() => {
  localStorage.clear();
});
