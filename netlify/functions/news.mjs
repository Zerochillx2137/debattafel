export default async () => {
  const rssUrl =
    "https://feeds.nos.nl/nosnieuwsalgemeen";

  try {
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error("NOS-nieuws kon niet worden opgehaald.");
    }

    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 5)
      .map((match) => {
        const item = match[1];

        const get = (tag) => {
          const result = item.match(
            new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
          );

          return result
            ? result[1]
                .replace(/<!\[CDATA\[|\]\]>/g, "")
                .trim()
            : "";
        };

        const title = get("title");

        return {
          title,
          summary: get("description"),
          source: "NOS",
          publishedAt: get("pubDate"),
          url: get("link"),
          category: getCategory(title),
          tags: []
        };
      });

    return new Response(
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        articles: items
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

function getCategory(title) {
  const text = title.toLowerCase();

  if (
    text.includes("kabinet") ||
    text.includes("minister") ||
    text.includes("politiek") ||
    text.includes("verkiez")
  ) {
    return "Nederlandse politiek";
  }

  if (
    text.includes("klimaat") ||
    text.includes("stikstof") ||
    text.includes("co2")
  ) {
    return "Klimaat";
  }

  if (
    text.includes("school") ||
    text.includes("onderwijs") ||
    text.includes("student")
  ) {
    return "Onderwijs";
  }

  if (
    text.includes("technologie") ||
    text.includes("techniek") ||
    text.includes("ai")
  ) {
    return "Technologie";
  }

  if (
    text.includes("europa") ||
    text.includes("europese")
  ) {
    return "Europa";
  }

  if (
    text.includes("economie") ||
    text.includes("belasting") ||
    text.includes("euro")
  ) {
    return "Economie";
  }

  return "Maatschappij";
}
