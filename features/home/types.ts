// Home feature types based on API response structure

export interface Title {
  id: string;
  nameEn: string;
  tags: string[];
  posterUrl: string;
  thumbnailUrl?: string;
  duration: number;
  releaseDate: string;
  genres: string[];
  snipsCount: number;
  badges: string[];
  playbackUrl?: string;
  heroCoverUrl?: string;
  videoPlaybackUrl?: string;
}

export interface Component {
  id: string;
  componentType: string;
  sectionTitle: string;
  titles: Title[];
}

export interface HomePageData {
  components: Component[];
}

export interface HomePageResponse {
  userUuid: string;
  country: string;
  data: HomePageData;
}
