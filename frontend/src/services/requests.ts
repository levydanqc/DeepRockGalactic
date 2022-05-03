export async function getPlanetes() {
  const response = await fetch("http://localhost:3000/planetes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.planetes.map((planet: any) => planet.nom);
}

export async function getContrats() {
  const response = await fetch("http://localhost:3000/contrats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  data.contrats.forEach(async (contrat: any) => {
    const request = await fetch(
      "http://localhost:3000/planetes/" + contrat.planeteId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const planete = await request.json();
    console.log(planete.image);
    contrat.planeteId = planete.image;
  });
  return data;
}
