import { useState } from "react";
import { watchedStore } from "../localForage/localForage";

export const useWatched = (id: number) => {
  const [watched, setWatched] = useState<boolean>(false);
  const toggleWatched = async () => {
    setWatched(
      (await watchedStore.getItem<boolean>(id.toString())) ? true : false
    );
  };

  return { watched, toggleWatched };
};
