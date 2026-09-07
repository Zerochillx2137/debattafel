export default async function handler(request) {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Gebruik POST." }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const body = await request.json();
    const statement = body.statement || "";
    const argument = body.argument || "";

    if (!statement.trim() || !argument.trim()) {
      return new Response(
        JSON.stringify({
          error: "Vul zowel een stelling als een argument in."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        feedback: {
          feedback:
            "Je argument is duidelijk. Maak het sterker door een concreet voorbeeld of feit toe te voegen.",
          argumentType:
            "Gevolgenargument",
          weakPoint:
            "Je argument is nog niet volledig onderbouwd.",
          counterArgument:
            "Een tegenstander kan zeggen dat er ook andere oplossingen mogelijk zijn.",
          followUpQuestion:
            "Welk concreet voorbeeld ondersteunt jouw argument?",
          nextExercise:
            "Geef een tweede argument vanuit een andere invalshoek."
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "De trainer kon je antwoord niet verwerken."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
