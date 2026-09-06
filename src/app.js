export default async (request) => {
  try {
    const body = await request.json();
    const statement = body.statement || "";
    const argument = body.argument || "";

    if (!statement.trim() || !argument.trim()) {
      return new Response(
        JSON.stringify({ error: "Vul zowel een stelling als een argument in." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        feedback: {
          feedback: "Je hebt een duidelijk standpunt ingenomen. Probeer je argument nog sterker te maken met een concreet voorbeeld of feit.",
          argumentType: "Gevolgenargument",
          weakPoint: "Je argument kan nog sterker worden onderbouwd.",
          counterArgument: "Een tegenstander kan zeggen dat er ook andere oplossingen mogelijk zijn.",
          followUpQuestion: "Welk concreet voorbeeld ondersteunt jouw argument?",
          nextExercise: "Geef nu een tweede argument dat jouw standpunt vanuit een andere invalshoek ondersteunt."
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
      JSON.stringify({ error: "De trainer kon je antwoord niet verwerken." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
