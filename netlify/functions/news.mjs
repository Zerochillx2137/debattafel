export default async () => {
  const rssUrl = "https://feeds.nos.nl/nosnieuwsalgemeen";

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
            ? cleanText(result[1])
            : "";
        };

        const title = get("title");
        const slug = createSlug(title);

        return {
          id: slug,
          slug,
          title,
          summary: get("description"),
          source: "NOS",
          publishedAt: get("pubDate"),
          url: get("link"),
          category: getCategory(title),
          tags: getTags(title),
          imageAlt: `Nieuwsafbeelding bij ${title}`,
          statement: createStatement(title)
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

function cleanText(text) {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createStatement(title) {
  const text = title.toLowerCase();

  if (
    text.includes("school") ||
    text.includes("onderwijs") ||
    text.includes("student")
  ) {
    return "Moet de overheid strengere maatregelen nemen rond dit onderwerp?";
  }

  if (
    text.includes("klimaat") ||
    text.includes("stikstof") ||
    text.includes("co2")
  ) {
    return "Moet Nederland strengere maatregelen nemen om dit probleem aan te pakken?";
  }

  if (
    text.includes("ai") ||
    text.includes("kunstmatige intelligentie") ||
    text.includes("technologie")
  ) {
    return "Moet de overheid strengere regels invoeren voor deze technologie?";
  }

  if (
    text.includes("belasting") ||
    text.includes("economie") ||
    text.includes("euro")
  ) {
    return "Moet de overheid meer ingrijpen in de economie?";
  }

  if (
    text.includes("verkiez") ||
    text.includes("kabinet") ||
    text.includes("minister") ||
    text.includes("politiek")
  ) {
    return "Moet de politiek naar aanleiding van dit nieuws andere keuzes maken?";
  }

  return "Moet de overheid naar aanleiding van dit nieuws maatregelen nemen?";
}

function getTags(title) {
  const text = title.toLowerCase();
  const tags = [];

  if (text.includes("kabinet")) tags.push("Kabinet");
  if (text.includes("minister")) tags.push("Politiek");
  if (text.includes("verkiez")) tags.push("Verkiezingen");
  if (text.includes("klimaat")) tags.push("Klimaat");
  if (text.includes("school")) tags.push("Onderwijs");
  if (text.includes("onderwijs")) tags.push("Onderwijs");
  if (text.includes("ai")) tags.push("AI");
  if (text.includes("europa")) tags.push("Europa");
  if (text.includes("economie")) tags.push("Economie");

  return tags.slice(0, 4);
}

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

  if (
    text.includes("oorlog") ||
    text.includes("oekraïne") ||
    text.includes("trump") ||
    text.includes("buitenland")
  ) {
    return "Internationale politiek";
  }

  return "Maatschappij";
}
