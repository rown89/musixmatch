let api = {
  url: "http://api.musixmatch.com/ws/1.1/",
  popular: "chart.tracks.get?chart_name=top&page=1&page_size=80&f_has_lyrics=1",
  lyrics: "track.lyrics.get?track_id=",
  key: "&apikey=303d7e6bef5a506a8d742d7d009e4f1e"
};

export default api;
