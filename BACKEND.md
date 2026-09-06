# Productieaansluiting

De frontend kent geen geheimen en kent geen rollen toe. Laat alle gevoelige operaties op een server plaatsvinden.

## Modellen

Gebruik minimaal `User`, `NewsArticle`, `Debate`, `Category`, `Favorite` en `AuditLog`. `NewsArticle` bewaart onder meer `id`, `title`, `summary`, `category`, `source`, `sourceUrl`, `imageUrl`, `publishedAt`, `importance`, `debateWorthiness`, `hidden`, `createdAt` en `updatedAt`. `Debate` is gekoppeld aan een artikel en bevat de slug, stelling, context, feiten, pro/con-argumenten, tegenargumenten, zwakke punten, vragen en primaire bronlinks.

## Nieuwsadapter

Voeg aan de server een provider-adapter toe die betrouwbare RSS/API-bronnen ophaalt. Valideer de response, normaliseer URLs, dedupliceer op canonieke URL, categoriseer, beoordeel belang/debatwaarde en selecteer maximaal vijf. Cache alleen een succesvol gevalideerde set in de database; bij fouten retourneert de API de vorige succesvolle set met de laatst opgeslagen UTC-tijd.

De geplande taak draait server-side maximaal één keer per dag. Bewaar haar status en foutmelding in `AuditLog`/`UpdateLog`; geef uitsluitend die status door aan de adminroute na server-side rolcontrole.

## Beveiliging

Gebruik server-side wachtwoordhashing (Argon2id of bcrypt), HttpOnly/Secure/SameSite cookies, CSRF-bescherming waar nodig, invoervalidatie, parametrische queries, rate-limiting en output-escaping. Check bij iedere adminhandeling de sessie én adminrol op de server. Secrets en API-sleutels blijven uitsluitend in omgevingsvariabelen op de server.
