// Feed feature types for TikTok-like vertical feed

export interface Snip {
  id: string;
  titleId: string;
  titleName: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeName?: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  snips: Snip[];
}

export interface FeedPageData {
  items: FeedItem[];
  pageNumber: number;
  hasMore: boolean;
}

export interface FeedPageResponse {
  userUuid: string;
  country: string;
  data: FeedPageData;
}
