// ./utils/turfHelpers.js
import * as turf from '@turf/turf';

export const calculateCoordinate = (
  distance,
  fixedPoint,
  destinationCoordinate,
) => {
  let coordinate;
  const to = turf.point([
    destinationCoordinate.longitude,
    destinationCoordinate.latitude,
  ]);
  const from = turf.point([fixedPoint.longitude, fixedPoint.latitude]);
  const options = {units: 'meters'};
  coordinate = turf.destination(to, distance, turf.bearing(to, from), options)
    .geometry.coordinates;

  coordinate = {
    longitude: coordinate[0],
    latitude: coordinate[1],
  };
  return coordinate;
};
