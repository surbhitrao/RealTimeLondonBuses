// ./utils/api.js
import axios from 'axios';

export const fetchBusLines = async () => {
  return await axios.get('https://api.tfl.gov.uk/Line/Mode/bus');
};

export const fetchArrivalsByLine = async lineId => {
  return await axios.get(`https://api.tfl.gov.uk/Line/${lineId}/Arrivals`);
};

export const forwardGeocode = async locationName => {
  try {
    const formattedLocationName = locationName.replace(/ /g, '+');
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedLocationName}&key=AIzaSyAYv66f0VStGVrMlJsEQAvAG55r47y8YfA`,
    );

    if (response.data.results[0]) {
      return {
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng,
      };
    }
  } catch (error) {
    return null;
  }
};
