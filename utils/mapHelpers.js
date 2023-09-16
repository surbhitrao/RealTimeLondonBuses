// MapHelpers.js

import {AppStrings} from './strings';

export const onRegionChange = (
  region,
  mapRef,
  setError,
  setSnackbarVisible,
) => {
  const LONDON_LAT = 51.5074;
  const LONDON_LNG = -0.1278;
  const LAT_LNG_DELTA = 0.5;
  if (
    Math.abs(region.latitude - LONDON_LAT) > LAT_LNG_DELTA ||
    Math.abs(region.longitude - LONDON_LNG) > LAT_LNG_DELTA
  ) {
    // The user has moved too far away. Re-center the map.
    recenterMap(mapRef);
    setError(AppStrings.movedTooFarAway);
    setSnackbarVisible(true);
  }
};

export const recenterMap = mapRef => {
  mapRef.current.animateToRegion(
    {
      latitude: 51.5074,
      longitude: -0.1278,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    1000,
  );
};

export const initialRegion = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
