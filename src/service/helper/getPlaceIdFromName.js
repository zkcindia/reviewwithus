const getPlaceIdFromName = (placeName) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject("Google Maps SDK not loaded");
    }

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const request = {
      query: placeName,
      fields: ["place_id", "name"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        resolve(results[0].place_id);
      } else {
        reject("Place ID not found");
      }
    });
  });
};
