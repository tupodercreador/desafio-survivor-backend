export default async function handler(req, res) {
  const { jornada } = req.query;

  if (!jornada) {
    return res.status(400).json({ error: "Falta el parámetro jornada" });
  }

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/PD/matches?matchday=${jornada}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener partidos de Football-Data");
    }

    const data = await response.json();

    const partidos = data.matches.map(match => ({
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

    return res.status(200).json(partidos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudieron obtener los partidos" });
  }
}
