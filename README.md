# DEBATTAFEL

Een Node 20-webapp met live RSS-nieuws, server-side AI-debatanalyse en een interactieve AI-debattrainer. API-sleutels blijven op de server.

## Lokale start

Stel variabelen in je shell of hostingomgeving in en start de server:

```powershell
$env:OPENAI_API_KEY = "jouw-sleutel"
$env:OPENAI_MODEL = "gpt-5"
$env:NEWS_RSS_URL = "https://feeds.nos.nl/nosnieuwsalgemeen"
node server.mjs
```

Open daarna `http://127.0.0.1:4173`. Zonder `OPENAI_API_KEY` werken nieuws, navigatie, favorieten en archief; Debatmodus en trainer tonen dan een eerlijke configuratiemelding.

## API

- `GET /api/news`: haalt maximaal vijf actuele RSS-artikelen op en cachet de laatste succesvolle set vijftien minuten.
- `GET /api/debates/:slug`: levert origineel artikel plus server-side AI-analyse.
- `POST /api/trainer`: ontvangt alleen stelling, argument en ronde; levert coachfeedback terug.

Controleer vóór publicatie de voorwaarden en gebruiksrechten van de ingestelde RSS-bron. De standaard-URL is een officiële NOS-feed; de NOS vermeldt eigen voorwaarden voor RSS-gebruik.

## Online publiceren zonder lokale Node-installatie

1. Zet deze map in een GitHub-repository.
2. Maak bij Render een nieuw **Blueprint**-project en verbind die repository. Render leest `render.yaml` en bouwt de Dockerfile in de cloud.
3. Vul in Render onder Environment de geheime waarde `OPENAI_API_KEY` in. Zet die nooit in GitHub of frontendcode.
4. Controleer `NEWS_RSS_URL` en pas die aan naar een bron waarvoor jouw gebruik is toegestaan.
5. Deploy. Render geeft je een openbare `https://…onrender.com`-URL om te delen. Je kunt daarna een eigen domein koppelen.

Voor productie zijn een database voor blijvende favorieten en analyses, een geplande refresh-taak en gebruikersauthenticatie logische vervolgstappen.
