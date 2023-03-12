import localforage from "localforage";

export const watchedStore = localforage.createInstance({
  name: "watched",
});
export const favoriteStore = localforage.createInstance({
  name: "favorite",
});
