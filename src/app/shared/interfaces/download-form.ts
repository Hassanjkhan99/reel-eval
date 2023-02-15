export interface DownloadForm {
  name: string;
  direct_url: string;
}

export interface DownloadFormApi {
  count: number;
  next?: any;
  previous?: any;
  results: DownloadForm[];
}
