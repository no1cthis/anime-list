export type Media = {
  media: {
    averageScore: number;
    genres: string[];
    status: string;
    description: string;
    duration: number;
    title: {
      english: string;
      native: string;
    };
    coverImage: {
      extraLarge: string;
      color: string;
    };
  };
};

export type AnimeList = {
  Page: {
    media: {
      id: number;
    }[];
  };
};
