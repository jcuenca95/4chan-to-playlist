import { HttpService, Injectable } from '@nestjs/common';

export interface ThreadResponse {
  posts: Post[];
}

export interface Post {
  no: number;
  now: string;
  name: Name;
  sub?: string;
  com?: string;
  filename?: string;
  ext?: EXT;
  w?: number;
  h?: number;
  tn_w?: number;
  tn_h?: number;
  tim?: number;
  time: number;
  md5?: string;
  fsize?: number;
  resto: number;
  bumplimit?: number;
  imagelimit?: number;
  semantic_url?: string;
  replies?: number;
  images?: number;
  unique_ips?: number;
  tail_size?: number;
}

export enum EXT {
  GIF = '.gif',
  Jpg = '.jpg',
  PNG = '.png',
  Webm = '.webm',
}

export enum Name {
  Anonymous = 'Anonymous',
}

export interface ViewInfo {
  title: string;
  videos: { embedded: string; url: string }[];
}

@Injectable()
export class AppService {
  constructor(private httpClient: HttpService) {}

  public async getThreadVideos(
    board: string,
    threadId: string,
  ): Promise<ViewInfo> {
    const url = 'https://a.4cdn.org/' + board + '/thread/' + threadId + '.json';

    const response = await this.httpClient.get<ThreadResponse>(url).toPromise();

    const videos = new Array<{ embedded: string; url: string }>();
    for (const post of response.data.posts) {
      if (post.com) {
        const videosOnComment = this.analyzeComment(post.com);
        videos.push(...videosOnComment);
      }
    }

    return {
      title: response.data.posts[0].com.slice(0, 100) + '...',
      videos: videos,
    };
  }

  private analyzeComment(
    comment: string,
  ): Array<{ embedded: string; url: string }> {
    var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    const results = comment.match(youtubeRegex);
    return results
      ? results.map((result) => this.getYoutubeEmbedded(result))
      : [];
  }

  private getYoutubeEmbedded(url: string): { embedded: string; url: string } {
    let id = url.slice(url.lastIndexOf('/') + 1);
    return {
      embedded: 'https://www.youtube.com/embed/' + id,
      url: 'https://' + url,
    };
  }
}
