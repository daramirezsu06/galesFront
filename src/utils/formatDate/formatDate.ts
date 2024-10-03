export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Formateador para día/mes/año hora:minutos
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit", // Correcto
    month: "2-digit", // Correcto
    year: "numeric", // Correcto
    hour: "2-digit", // Correcto
    minute: "2-digit", // Correcto
    hour12: false, // Correcto, formato 24 horas
  };

  // Utilizando el formateador
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

const dateString = "2024-09-26T17:18:18.390Z";
console.log(formatDate(dateString)); // Ejemplo: 26/09/2024 17:18
