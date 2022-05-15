/* eslint-disable @typescript-eslint/no-non-null-assertion */

import ROUTES from "./routes";

export async function getPlanetes() {
  const response = await fetch("http://localhost:3000/planetes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.planetes;
}

export async function getContrats(
  minDate?: string,
  maxDate?: string,
  minPrime?: string,
  maxPrime?: string,
  dangers?: number[],
  planetIds?: string[]
) {
  const url = new URL(ROUTES.SEARCH);
  const params: { [key: string]: string } = {
    minDate: minDate || "",
    maxDate: maxDate || "",
    minPrime: minPrime?.toString() || "",
    maxPrime: maxPrime?.toString() || "",
    dangers: dangers?.join(",") || "",
    planetIds: planetIds?.join(",") || "",
  };
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  const data = res.data;
  for (let i = 0; i < data.length; i++) {
    const contrat = data[i];
    const planete = await getPlanete(
      contrat.relationships.planete.links.related
    );
    contrat.planeteImage = planete.image;
    contrat.planeteNom = planete.nom;
  }
  console.log(data);
  return data;
}

async function getPlanete(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return { image: data.attributes.image, nom: data.attributes.nom };
}

async function getPlanetesById(id: number) {
  const response = await fetch(`http://localhost:3000/planetes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return { image: data.planete.image, nom: data.planete.nom };
}

export async function reserverContrat(id: string) {
  const response = await fetch(`http://localhost:3000/reservation/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data;
}
