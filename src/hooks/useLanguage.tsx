"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import ko from "@/i18n/ko";

type ContentType = typeof ko;

type LanguageContextType = {
  lang: string;
  t: ContentType;
  updateField: (path: string, value: unknown) => void;
  addListItem: (path: string, template: unknown) => void;
  removeListItem: (path: string, index: number) => void;
  saveContent: () => void;
  revertContent: () => void;
  resetContent: () => void;
};

const STORAGE_KEY = "portfolio-content";

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => {
    const m = key.match(/^(.+)\[(\d+)\]$/);
    if (m) return acc?.[m[1]]?.[parseInt(m[2])];
    return acc?.[key];
  }, obj);
}

function setByPath(obj: any, path: string, value: any): any {
  const clone = deepClone(obj);
  const keys = path.split(".");
  let cur = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const m = keys[i].match(/^(.+)\[(\d+)\]$/);
    if (m) cur = cur[m[1]][parseInt(m[2])];
    else cur = cur[keys[i]];
  }

  const last = keys[keys.length - 1];
  const m = last.match(/^(.+)\[(\d+)\]$/);
  if (m) cur[m[1]][parseInt(m[2])] = value;
  else cur[last] = value;

  return clone;
}

function deepMerge(target: any, source: any): any {
  if (typeof target !== "object" || typeof source !== "object") return source;
  if (Array.isArray(source)) return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      key in target &&
      typeof target[key] === "object" &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const LanguageContext = createContext<LanguageContextType>({
  lang: "ko",
  t: ko,
  updateField: () => {},
  addListItem: () => {},
  removeListItem: () => {},
  saveContent: () => {},
  revertContent: () => {},
  resetContent: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang] = useState("ko");
  const [content, setContent] = useState<ContentType>(deepClone(ko));
  const [savedContent, setSavedContent] = useState<ContentType>(deepClone(ko));
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = deepMerge(deepClone(ko), parsed) as ContentType;
        setContent(merged);
        setSavedContent(deepClone(merged));
      }
    } catch {
      /* ignore parse errors */
    }
    setLoaded(true);
  }, []);

  const updateField = useCallback((path: string, value: unknown) => {
    setContent((prev) => setByPath(prev, path, value) as ContentType);
  }, []);

  const addListItem = useCallback((path: string, template: unknown) => {
    setContent((prev) => {
      const arr = getByPath(prev, path);
      if (!Array.isArray(arr)) return prev;
      const newArr = [...arr, deepClone(template)];
      return setByPath(prev, path, newArr) as ContentType;
    });
  }, []);

  const removeListItem = useCallback((path: string, index: number) => {
    setContent((prev) => {
      const arr = getByPath(prev, path);
      if (!Array.isArray(arr) || arr.length <= 1) return prev;
      const newArr = arr.filter((_: unknown, i: number) => i !== index);
      return setByPath(prev, path, newArr) as ContentType;
    });
  }, []);

  const saveContent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSavedContent(deepClone(content));
  }, [content]);

  const revertContent = useCallback(() => {
    setContent(deepClone(savedContent));
  }, [savedContent]);

  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(deepClone(ko));
    setSavedContent(deepClone(ko));
  }, []);

  // Don't render until localStorage is loaded to prevent hydration mismatch
  if (!loaded) return null;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: content,
        updateField,
        addListItem,
        removeListItem,
        saveContent,
        revertContent,
        resetContent,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { getByPath };
