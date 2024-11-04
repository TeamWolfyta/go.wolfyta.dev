import { StatusCodes, getReasonPhrase } from "http-status-codes";

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const ip = request.headers.get("x-real-ip") as string;
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      const status = StatusCodes.TOO_MANY_REQUESTS;
      return new Response(JSON.stringify({ error: getReasonPhrase(status) }), {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const url = new URL(request.url);
    const { hostname, pathname } = url;

    const domainRedirects: Record<string, string> = {
      "wolfyta.dev": "https://github.com/TeamWolfyta",
      "wolfyta.moe": "https://myanimelist.net/profile/TeamWolfyta",
    };

    const pathRedirects: Record<string, string> = {
      "/github": "https://github.com/TeamWolfyta",
      "/discord-profile": "https://discord.com/users/193657209660375040",
      "/discord-server": "https://discord.gg/9REcg4WdmQ",
      "/bungie":
        "https://www.bungie.net/7/en/User/Profile/1/4611686018451601257?bgn=TeamWolfyta",
      "/spotify":
        "https://open.spotify.com/user/kieran0203?si=366f5094f8eb4245",
      "/reddit": "https://www.reddit.com/user/TEAMGAM3R",
      "/twitch": "https://www.twitch.tv/teamwolfyta",
      "/twitter": "https://x.com/TeamWolfyta",
      "/youtube": "https://www.youtube.com/channel/UCwSrKBEtN_sktfZM1bIVfoA",
      "/steam": "https://steamcommunity.com/id/TeamWolfyta/",
      "/myanimelist": "https://myanimelist.net/profile/TeamWolfyta",
    };

    if (hostname in domainRedirects) {
      return Response.redirect(
        domainRedirects[hostname],
        StatusCodes.PERMANENT_REDIRECT,
      );
    }

    if (pathname.startsWith("/yukino/")) {
      return Response.redirect(
        `https://raw.githubusercontent.com/TeamWolfyta/Yukino-Public/main/scripts/${pathname.slice(
          8,
        )}`,
        308,
      );
    }

    if (pathname in pathRedirects) {
      return Response.redirect(
        pathRedirects[pathname],
        StatusCodes.PERMANENT_REDIRECT,
      );
    }

    const status = StatusCodes.NOT_FOUND;
    return new Response(JSON.stringify({ error: getReasonPhrase(status) }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
} satisfies ExportedHandler<Env>;
