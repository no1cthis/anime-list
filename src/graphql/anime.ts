import { gql } from "@apollo/client";

// export const ALL_ANIME_ID_BY_DATE = gql`
//   query getAllAnime($page: Int!) {
//     Page(page: $page, perPage: 12) {
//       media(type: ANIME, sort: START_DATE_DESC) {
//         id
//       }
//     }
//   }
// `;
export const ALL_ANIME_ID = gql`
 query getAllAnime($page: Int!, $sort: [MediaSort]!, $search: String) {
    Page(page: $page, perPage: 12) {
      media(type: ANIME, sort: $sort, search: $search) {
        id
      title {
        english
        native
      }
      }
    }
  }
`;
// export const ALL_ANIME_ID_BY_POPULAR = gql`
//   query getAllAnime($page: Int!) {
//     Page(page: $page, perPage: 12) {
//       media(type: ANIME, sort: POPULARITY_DESC) {
//         id
//       }
//     }
//   }
// `;
// export const ALL_ANIME_ID_BY_TRENDS = gql`
//   query getAllAnime($page: Int!) {
//     Page(page: $page, perPage: 12) {
//       media(type: ANIME, sort: TRENDING_DESC) {
//         id
//       }
//     }
//   }
// `;

export const GET_BY_ID = gql`
  query getAnimeByID($id: Int!) {
    media: Media(id: $id) {
      averageScore
      genres
      status
      description
      duration
      title {
        english
        native
      }
      coverImage {
        extraLarge
        color
      }
    }
  }
`;

export const GET_ANIME_ID_BY_SEARCH = gql`
  query getAnime($search: String!, $page: Int!) {
    Page(page: $page, perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC, search: $search) {
        id
      }
    }
  }
`;
