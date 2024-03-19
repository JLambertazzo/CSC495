/**
 * Navigate up relatively in the given path by {levels} levels
 * Works like ".." on unix cd
 * @param path The current path to navigate on
 * @param levels The number of levels up to navigate
 * @returns The modified path
 */
const navigateUp = (path: string, levels: number) => path.split('/').slice(0, -levels).join('/')

export { navigateUp }
