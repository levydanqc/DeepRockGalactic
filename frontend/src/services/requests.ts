/* eslint-disable @typescript-eslint/no-non-null-assertion */

import ROUTES from "./routes";

export async function getContrats(
  minDate?: string,
  maxDate?: string,
  minPrime?: string,
  maxPrime?: string,
  dangers?: number[],
  planets?: string[]
) {
  const url = new URL(ROUTES.SEARCH);
  const params: { [key: string]: string } = {
    minDate: minDate || "",
    maxDate: maxDate || "",
    minPrime: minPrime?.toString() || "",
    maxPrime: maxPrime?.toString() || "",
    dangers: dangers?.join(",") || "",
    planets: planets?.join(",") || "",
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
  if (response.status === 404) {
    return [];
  }
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
  return data;
}

export async function getPlanete(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return { image: data.attributes.image, nom: data.attributes.nom };
}

export async function reserverContrat(url: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response;
}

export async function getReservations() {
  const url =
    ROUTES.RESERVATION +
    `?estTermine=true&user=${localStorage.getItem("token")}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.data;
}

export async function getContrat(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}
