import { useEffect, useState } from "react";
import { favoriteStore, watchedStore } from "../../localForage/localForage";
import cl from "./header.module.scss";

interface HeaderProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setLocalLibrary: React.Dispatch<React.SetStateAction<string>>;
  setCards: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
}

const Header: React.FC<HeaderProps> = ({
  setSort,
  setSearch,
  setCards,
  setLocalLibrary,
}) => {
  const [input, setInput] = useState("");
  const [active, setActive] = useState("Popular");
  const sortList = [
    { text: "Popular", sort: "POPULARITY_DESC" },
    { text: "Score", sort: "SCORE_DESC" },
    { text: "New", sort: "START_DATE_DESC" },
    { text: "Trends", sort: "TRENDING_DESC" },
  ];

  const wathchedList = async () => {
    let keys:
      | string[]
      | {
          id: number;
        }[] = await watchedStore.keys();
    keys = keys.map((id) => ({ id: +id }));
    setLocalLibrary("watchedList");
    setCards(keys);
    setActive("watchedList");
  };
  const favoriteList = async () => {
    setSort("POPULARITY_DESC");
    let keys:
      | string[]
      | {
          id: number;
        }[] = await favoriteStore.keys();
    keys = keys.map((id) => ({ id: +id }));
    setLocalLibrary("favoriteList");
    setCards(keys);
    setActive("favoriteList");
  };

  useEffect(() => {
    const timeoutid = setTimeout(() => {
      setSearch(input);
    }, 500);
    return () => clearTimeout(timeoutid);
  }, [input]);
  const buttons = sortList.map((button) => (
    <button
      key={button.text}
      className={`${cl.button} ${active === button.text && cl.button__active}`}
      onClick={() => {
        setLocalLibrary("");
        setCards([]);
        setActive(button.text);
        setSort(button.sort);
      }}
    >
      {button.text}
    </button>
  ));
  return (
    <div className={cl.wrapper} id="logo">
      <p className={cl.logo}>ANIME LIST</p>
      <input
        className={cl.search}
        placeholder="Search"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <div className={cl.buttons} style={{ width: 800 }}></div>
      <div className={cl.buttons}>
        {buttons}

        <button
          className={`${cl.button} ${
            active === "favoriteList" && cl.button__active
          }`}
          onClick={favoriteList}
        >
          Favorite
        </button>
        <button
          className={`${cl.button} ${
            active === "watchedList" && cl.button__active
          }`}
          onClick={wathchedList}
        >
          Watched
        </button>
      </div>
    </div>
  );
};

export default Header;
