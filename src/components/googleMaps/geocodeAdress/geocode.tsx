import loader from "../louders/louderFotGeoco";

export const geocodeAddress = async (
  address: string
): Promise<google.maps.GeocoderResult[]> => {
  await loader.load();
  const geocoder = new google.maps.Geocoder();
  return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results !== null) {
        // Asegurarse de que results no sea null
        resolve(results);
        console.log(
          "imprimeiendo desde geocoding",
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        );
      } else {
        reject(
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  });
};



