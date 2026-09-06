export default async () => {
  const tips = [
    "Maak je argument concreet met een voorbeeld.",
    "Leg uit waarom jouw argument belangrijk is.",
    "Denk alvast na over het sterkste tegenargument.",
    "Maak duidelijk wie verantwoordelijk is voor de oplossing.",
    "Gebruik een feit of bron om je argument sterker te maken."
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];

  return new Response(
    JSON.stringify({
      feedback: tip,
      counterArgument: "Een tegenstander kan vragen of er ook een andere oplossing mogelijk is.",
      score: 7,
      nextQuestion: "Kun je jouw argument verder onderbouwen?"
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
};
