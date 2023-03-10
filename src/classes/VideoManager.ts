import { getVideoID, validateURL } from "../utils";
import PlayerFactory from "youtube-player";
import { YouTubePlayer } from "youtube-player/dist/types";

export default class VideoManager {
  public static player: YouTubePlayer;
  public static initialized = false;

  private static isPlaying = false;

  public static videoDuration: number | null = null;

  public static init(url: string, domId: string) {
    this.load(url, domId);
    this.initialized = true;
  }

  public static async load(url: string, domId: string) {
    if (!validateURL(url)) return;
    const id = getVideoID(url);

    if (this.player != null) {
      this.player.destroy();
    }
    this.player = PlayerFactory(domId, {
      videoId: id,
      playerVars: {
        autoplay: 0,
        disablekb: 1,
        controls: 0,
      },
    });

    this.videoDuration = await this.player.getDuration();
  }

  public static play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    document.querySelector("body")?.classList.add("playing");

    this.player.playVideo();
  }

  public static async validatePlaytime(expectedTime: number) {
    if (!this.isPlaying || expectedTime > this.videoDuration!) return;

    if (Math.abs((await this.player.getCurrentTime()) - expectedTime) > 0.5) {
      this.player.seekTo(expectedTime, true);
      this.player.playVideo();
    }
  }
}
