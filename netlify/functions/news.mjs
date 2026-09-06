export default async (req) => {
  const rssUrl =
    process.env.NEWS_RSS_URL ||
    "https://feeds.nos.nl/nosnieuwsalgemeen";

  try {
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`RSS error: ${response.status}`);
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
          return result ? result[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
        };

        return {
          title: get("title"),
          description: get("description"),
          link: get("link"),
          publishedAt: get("pubDate"),
        };
      });

    const debates = items.map((article) => ({
      ...article,
      statement: makeStatement(article.title),
    }));

    return new Response(JSON.stringify(debates), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

function makeStatement(title) {
  const t = title.toLowerCase();

  if (t.includes("klimaat") || t.includes("stikstof") || t.includes("co2")) {
    return `De overheid moet strengere maatregelen nemen tegen klimaatverandering.`;
  }

  if (t.includes("onderwijs") || t.includes("school") || t.includes("student")) {
    return `De overheid moet meer geld investeren in het onderwijs.`;
  }

  if (
    t.includes("asiel") ||
    t.includes("migratie") ||
    t.includes("vluchteling")
  ) {
    return `Nederland moet een strenger migratiebeleid voeren.`;
  }

  if (
    t.includes("technologie") ||
    t.includes("ai") ||
    t.includes("kunstmatige intelligentie")
  ) {
    return `De overheid moet strengere regels invoeren voor nieuwe technologie en AI.`;
  }

  if (
    t.includes("economie") ||
    t.includes("belasting") ||
    t.includes("geld")
  ) {
    return `De overheid moet meer maatregelen nemen om economische ongelijkheid te verminderen.`;
  }

  return `De overheid moet meer actie ondernemen naar aanleiding van dit nieuws: "${title}".`;
}
