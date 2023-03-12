import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { GET_BY_ID } from "../../graphql/anime";
import { favoriteStore, watchedStore } from "../../localForage/localForage";
import { Media } from "../../types/types";
import cl from "./modal.module.scss";

interface ModalProps {
  id: number;
  setModal: React.Dispatch<React.SetStateAction<boolean | number>>;
}

const Modal: React.FC<ModalProps> = ({ id, setModal }) => {
  const text = useRef<HTMLParagraphElement>(null);
  const [wrapDescr, setWrapDesct] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState(true);
  const { data, loading, error } = useQuery<Media>(GET_BY_ID, {
    variables: { id },
  });

  const toggleWatch = async () => {
    if (await watchedStore.getItem(id.toString()))
      watchedStore.removeItem(id.toString());
    else watchedStore.setItem(id.toString(), true);
    setIsWatched(!isWatched);
  };
  const toggleFavorite = async () => {
    if (await favoriteStore.getItem(id.toString()))
      favoriteStore.removeItem(id.toString());
    else favoriteStore.setItem(id.toString(), true);
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const prefer = async () => {
      setIsWatched(
        (await watchedStore.getItem<boolean>(id.toString())) ? true : false
      );
      setIsFavorite(
        (await favoriteStore.getItem<boolean>(id.toString())) ? true : false
      );
      setLoadingButtons(false);
    };
    prefer();
  }, []);

  let mainName;
  if (data)
    mainName = data.media.title.english
      ? data.media.title.english
      : data.media.title.native;

  useEffect(() => {
    if (data?.media.description && text.current && !loading)
      text.current.innerHTML = data?.media.description;
  }, [loading]);

  return (
    <div className={cl.modal} onClick={() => setModal(false)}>
      <div className={cl.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={cl.left_column}>
          <div className={cl.poster__wrapper}>
            <img
              className={cl.poster}
              src={data?.media.coverImage.extraLarge}
              alt={`poster ${mainName}`}
            />
          </div>
        </div>
        <div className={cl.right_column}>
          <p className={cl.title}>{mainName}</p>
          <ul className={cl.details}>
            <li>
              <p>Original title:</p>{" "}
              <p className={cl.details__data}>{data?.media.title.native}</p>
            </li>
            <li>
              <p>Score:</p>{" "}
              <p className={cl.details__data}>{data?.media.averageScore}/100</p>
            </li>
            <li>
              <p>Genres:</p>
              <p className={cl.details__data}>
                {data?.media.genres.join(", ").toLowerCase()}
              </p>
            </li>
            <li>
              <p>Status:</p>{" "}
              <p className={cl.details__data}>
                {data?.media.status.toLowerCase()}
              </p>
            </li>
            <li>
              <p>Duration:</p>{" "}
              <p className={cl.details__data}>{data?.media.duration} mins</p>
            </li>
          </ul>

          <div
            className={cl.description}
            onClick={() => {
              setWrapDesct(!wrapDescr);
            }}
          >
            <p className={cl.description__title}>Description:</p>
            <p
              ref={text}
              className={wrapDescr ? cl.description__wrapText : undefined}
            />
          </div>
          {!loadingButtons && (
            <div className={cl.buttons}>
              <button className={cl.button} onClick={toggleWatch}>
                {isWatched ? "Delete from watched" : "Add to watched"}
              </button>
              <button className={cl.button} onClick={toggleFavorite}>
                {isFavorite ? "Delete from favorites" : "Add to favorites"}
              </button>
            </div>
          )}
        </div>
        <div className={cl.close} onClick={() => setModal(false)}>
          ✖
        </div>
      </div>
    </div>
  );
};

export default Modal;
