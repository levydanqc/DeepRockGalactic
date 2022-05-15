/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  dangers?: string[],
  planetIds?: string[]
) {
  const url = new URL("http://localhost:3000/search");
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
  const data = await response.json();

  for (let i = 0; i < data.length; i++) {
    const contrat = data[i];
    const planete = await getPlanetesById(contrat.planeteId);
    contrat.planeteImage = planete.image;
    contrat.planeteNom = planete.nom;
  }

  return data;
}

export async function getPlanetesById(id: number) {
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

export async function getReservations() {
  const response = await fetch(`http://localhost:3000/reservations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.reservations;
}

export async function getContratByID(id: string) {
  const response = await fetch(`http://localhost:3000/contrats/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}
