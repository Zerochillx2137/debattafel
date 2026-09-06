export default async (request) => {
  const slug = request.url.split("/").pop();

  const rssUrl = "https://feeds.nos.nl/nosnieuwsalgemeen";

  try {
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error("NOS-nieuws kon niet worden opgehaald.");
    }

    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
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
        const articleSlug = createSlug(title);

        return {
          title,
          slug: articleSlug,
          summary: get("description"),
          source: "NOS",
          publishedAt: get("pubDate"),
          url: get("link"),
          category: getCategory(title)
        };
      })
      .find((article) => article.slug === slug);

    if (!items) {
      return new Response(
        JSON.stringify({ error: "Artikel niet gevonden." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const statement = createStatement(items.title);

    return new Response(
      JSON.stringify({
        article: items,
        analysis: {
          statement,
          context: items.summary,
          facts: [
            `Bron: ${items.source}`,
            `Categorie: ${items.category}`,
            `Gepubliceerd: ${items.publishedAt}`
          ],
          pro: [
            "Voorstanders kunnen vinden dat ingrijpen nodig is.",
            "De maatregel kan het probleem directer aanpakken.",
            "De overheid kan hiermee verantwoordelijkheid nemen."
          ],
          con: [
            "Tegenstanders kunnen wijzen op mogelijke nadelen.",
            "De maatregel kan extra kosten of beperkingen opleveren.",
            "Er kunnen andere oplossingen zijn die minder ingrijpend zijn."
          ],
          counterArguments: [
            "Welke gevolgen heeft deze keuze op de lange termijn?",
            "Zijn er alternatieven die hetzelfde doel bereiken?",
            "Wie betaalt uiteindelijk de kosten?"
          ],
          weakPoints: [
            "Controleer of de gebruikte bronnen betrouwbaar en actueel zijn.",
            "Let erop dat oorzaak en gevolg niet automatisch hetzelfde zijn.",
            "Maak onderscheid tussen feiten en meningen."
          ],
          questions: [
            "Wat vind jij van deze stelling?",
            "Welke argumenten zijn volgens jou het sterkst?",
            "Welke gevolgen zou deze keuze hebben?"
          ]
        }
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
      JSON.stringify({ error: error.message }),
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

  if (text.includes("klimaat") || text.includes("stikstof")) {
    return "Moet Nederland strengere maatregelen nemen om dit probleem aan te pakken?";
  }

  if (text.includes("school") || text.includes("onderwijs")) {
    return "Moet de overheid strengere maatregelen nemen rond dit onderwerp?";
  }

  if (text.includes("ai") || text.includes("technologie")) {
    return "Moet de overheid strengere regels invoeren voor deze technologie?";
  }

  if (text.includes("verkiez") || text.includes("kabinet") || text.includes("minister")) {
    return "Moet de politiek naar aanleiding van dit nieuws andere keuzes maken?";
  }

  if (text.includes("economie") || text.includes("belasting")) {
    return "Moet de overheid meer ingrijpen in de economie?";
  }

  return "Moet de overheid naar aanleiding van dit nieuws maatregelen nemen?";
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

  if (text.includes("europa") || text.includes("europese")) {
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
