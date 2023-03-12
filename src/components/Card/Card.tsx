import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_BY_ID } from "../../graphql/anime";
import { watchedStore } from "../../localForage/localForage";
import { Media } from "../../types/types";
import cl from "./card.module.scss";

interface CardProps {
  id: number;
  setModal: React.Dispatch<React.SetStateAction<boolean | number>>;
}

const Card: React.FC<CardProps> = ({ id, setModal }) => {
  const [watched, setWatched] = useState(false);
  const { data, loading, error } = useQuery<Media>(GET_BY_ID, {
    variables: { id },
  });

  useEffect(() => {
    const prefer = async () => {
      setWatched(
        (await watchedStore.getItem<boolean>(id.toString())) ? true : false
      );
    };
    prefer();
  }, []);

  let mainName;
  if (loading)
    return (
      <div className={cl.wrapper}>
        <div className={cl.poster__wrapper}>
          <h1 className={cl.poster}>Loading...</h1>
        </div>
        ;
      </div>
    );
  if (error) {
    console.log(error.networkError);
    return (
      <div className={cl.wrapper}>
        <div className={cl.poster__wrapper}>
          <h1 className={cl.poster}>
            {`${error.networkError} \n API allow only 90 requests/min`}
          </h1>
        </div>
      </div>
    );
  }

  if (data)
    mainName = data.media.title.english
      ? data.media.title.english
      : data.media.title.native;
  return (
    <div className={cl.wrapper} onClick={() => setModal(id)}>
      <div className={cl.poster__wrapper}>
        <img
          className={cl.poster}
          src={data?.media.coverImage.extraLarge}
          alt={`poster ${mainName}`}
        />
      </div>
      <p className={cl.title}>{mainName}</p>
      <p className={cl.score}>
        Average Score: {data?.media.averageScore || "none"}
      </p>
      <p className={cl.watched}>
        {watched && <i className="fa-solid fa-eye" />}
      </p>
    </div>
  );
};

export default Card;
