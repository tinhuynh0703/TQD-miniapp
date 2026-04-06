import appConfig from "../../app-config.json";

/**
 * Gets a value from the app configuration using a getter function
 * @param getter - Function that extracts a value from the app config
 * @returns The value extracted from the config by the getter function
 */
export function getConfig<T>(getter: (config: typeof appConfig) => T) {
  return getter(appConfig);
}

/**
 * Returns a promise that resolves after the specified time in milliseconds
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Starts a view transition if supported by the browser, otherwise executes the callback directly
 * @param callback - Function to execute during the view transition
 */
export const startViewTransition = (callback: () => void) => {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
};
