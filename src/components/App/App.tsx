import { ApolloError, ApolloProvider, useQuery } from "@apollo/client";
import Card from "../Card/Card";
import { ALL_ANIME_ID } from "../../graphql/anime";

import cl from "./app.module.scss";

import Header from "../Header/Header";
import { AnimeList } from "../../types/types";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Modal from "../Modal/Modal";
// import { apolloClient } from "../../graphql/apolloClient";
import { GetServerSideProps } from "next";

// interface AppProps {
//   data: AnimeList | undefined;
//   loading: boolean;
//   error: ApolloError;
// }

const App: React.FC = () => {
  const [cards, setCards] = useState<
    {
      id: number;
    }[]
  >([]);
  const [localLibrary, setLocalLibrary] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("POPULARITY_DESC");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<number | boolean>(false);

  const { ref: bottom, inView } = useInView();
  const { data, loading, error } = useQuery<
    AnimeList,
    { page: number; sort: string; search?: string | null }
  >(ALL_ANIME_ID, {
    variables: {
      page: page,
      sort: sort,
      search: search || null,
    },
  });

  useEffect(() => {
    if (!localLibrary) setCards([]);
    setPage(1);
  }, [sort, search, localLibrary]);

  const filter = () => {
    console.log("filter");
    const list = cards.filter((card) => {
      let temp = false;
      data?.Page.media.forEach((item) => {
        if (item.id === card.id) temp = true;
      });
      return temp;
    });
    setCards(list);
  };

  useEffect(() => {
    if (data && !loading) {
      if (
        (localLibrary === "watchedList" || localLibrary === "favoriteList") &&
        search
      ) {
        filter();
        return;
      } else if (localLibrary) {
        setCards(cards);
        return;
      }

      setCards([...cards, ...data?.Page.media]);
    }
  }, [loading, sort, search, localLibrary]);
  useEffect(() => {
    if (!loading && inView && !localLibrary) setPage(page + 1);
  }, [inView]);

  if (process.browser) document.body.style.overflow = modal ? "hidden" : "";

  const cardsElements = cards.map((anime: any) => (
    <Card id={anime.id} key={anime.id} setModal={setModal} />
  ));
  return (
    <>
      <Header
        setSort={setSort}
        setSearch={setSearch}
        setCards={setCards}
        setLocalLibrary={setLocalLibrary}
      />

      <div className={cl.container}>
        <div className={cl.card__wrapper}>{cardsElements}</div>
        {error && (
          <h1
            className={cl.loading}
          >{`${error.networkError} \n API allow only 90 requests/min`}</h1>
        )}
        {loading && <h1 className={cl.loading}>{`Loading...`}</h1>}
        <div ref={bottom} style={{ height: 10 }}></div>
      </div>

      {modal && (
        <Modal
          id={typeof modal !== "boolean" ? modal : 1}
          setModal={setModal}
        />
      )}

      <a className={cl.arrow_up} href="#logo">
        <i className="fa-solid fa-circle-up"></i>
      </a>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { data, loading, error } = useQuery<
//     AnimeList,
//     { page: number; sort: string; search?: string | null }
//   >(ALL_ANIME_ID, {
//     variables: {
//       page: 1,
//       sort: "POPULARITY_DESC",
//       search: "" || null,
//     },
//   });

//   return {
//     props: {
//       data,
//       loading,
//       error,
//     },
//   };
// };

export default App;
