// Feed feature types for TikTok-like vertical feed

export interface Snip {
  id: string;
  captions_en: string;
  link: string;
  name_en: string;
  poster_url: string;
  rank: number;
  video_playback_url: string;
}

export interface FeedPageData {
  feedTitles: Snip[];
  currentPage: number;
  nextPage: number;
  total: number;
  totalPages: number;
}
