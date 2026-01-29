export default async function handler(req, res) {
  // 🔓 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const jornada = req.query.jornada || 22;

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/PD/matches?matchday=${jornada}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
      }
    );

    const data = await response.json();

    const matches = data.matches.map(match => ({
      matchId: match.id,
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      homeTeamName: match.homeTeam.name,
      awayTeamName: match.awayTeam.name,
      status: match.status,
      score: {
        home: match.score.fullTime.home,
        away: match.score.fullTime.away,
      },
    }));

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener partidos" });
  }
}
