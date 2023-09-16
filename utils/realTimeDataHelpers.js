import {fetchArrivalsByLine, forwardGeocode} from './api';
import {calculateCoordinate} from './turfHelper';

export const fetchAndCalculateMarkers = async (
  selectedLines,
  fixedPoint,
  setMarkers,
) => {
  const newMarkersMap = {};

  for (let lineId of selectedLines) {
    try {
      const result = await fetchArrivalsByLine(lineId);
      const uniqueDestinationNames = new Set();

      const newMarkers = await Promise.all(
        result.data.map(async arrival => {
          let coordinate;
          let distance;

          if (arrival.currentLocation) {
            coordinate = await forwardGeocode(arrival.currentLocation);
          } else {
            const destinationName = arrival.destinationName;

            if (!uniqueDestinationNames.has(destinationName)) {
              uniqueDestinationNames.add(destinationName);

              const speed = 8.9408;
              distance = arrival.timeToStation * speed;
              const destinationCoordinate = await forwardGeocode(
                destinationName,
              );

              if (destinationCoordinate) {
                coordinate = calculateCoordinate(
                  distance,
                  fixedPoint,
                  destinationCoordinate,
                );
              }
            }
          }

          if (coordinate) {
            const distanceInKM = distance / 1000;

            return {
              coordinate,
              title: arrival.stationName,
              description: arrival.destinationName,
              color:
                distanceInKM < 1
                  ? 'green'
                  : distanceInKM >= 1 && distanceInKM <= 3
                  ? 'orange'
                  : 'red',
            };
          }
        }),
      );

      newMarkers.forEach(marker => {
        if (marker) {
          const key = `${marker.coordinate.latitude},${marker.coordinate.longitude}`;
          newMarkersMap[key] = marker;
        }
      });
    } catch (error) {
      throw new error();
    }
  }

  const newMarkersArray = Object.values(newMarkersMap);
  setMarkers(newMarkersArray);
};
