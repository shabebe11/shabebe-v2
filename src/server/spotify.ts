import { unstable_cache } from "next/cache";

export type Track = {
  name: string;
  artists: string;
  url: string;
  image: string | null;
};

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
  external_urls: { spotify: string };
};

async function fetchTopTracks(limit: number): Promise<Track[] | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
    });
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`);
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const topRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${limit}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
    if (!topRes.ok) throw new Error(`top tracks ${topRes.status}`);
    const { items } = (await topRes.json()) as { items: SpotifyTrack[] };

    return items.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(", "),
      url: track.external_urls.spotify,
      image:
        [...track.album.images].sort((a, b) => a.width - b.width).find((img) => img.width >= 96)?.url ??
        track.album.images[0]?.url ??
        null,
    }));
  } catch (error) {
    console.error("Spotify top tracks failed:", error);
    return null;
  }
}

export const getTopTracks = unstable_cache(fetchTopTracks, ["spotify-top-tracks"], {
  revalidate: 3600,
  tags: ["spotify"],
});
