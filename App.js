import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  Appearance,
  StatusBar,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {mapStyle} from './utils/mapStyle';
import {Checkbox, FAB, Snackbar} from 'react-native-paper';
import {fetchBusLines} from './utils/api';
import {onRegionChange, initialRegion} from './utils/mapHelpers';
import {fetchAndCalculateMarkers} from './utils/realTimeDataHelpers';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AppStrings} from './utils/strings';
import {styles} from './styles/appStyles';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

const deviceHeight = Dimensions.get('window').height;
const colorScheme = Appearance.getColorScheme();

const App = () => {
  const mapRef = useRef(null);
  const [busLines, setBusLines] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [checkedItems, setCheckedItems] = useState({1: true});
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const onDismissSnackBar = () => setSnackbarVisible(false);
  const [fixedPoint, setFixedPoint] = useState({
    latitude: 51.5074,
    longitude: -0.1278,
  });
  const [netInfo, setNetInfo] = useState('');

  const handleCheckboxChange = item => {
    setCheckedItems(prevState => ({
      ...prevState,
      [item.id]: !prevState[item.id],
    }));
  };

  useEffect(() => {
    const fetchAndSetBusLines = async () => {
      try {
        const result = await fetchBusLines();
        setBusLines(result.data);
      } catch (networkErrorBusLine) {
        setError(AppStrings.networkErrorBusLine);
        setSnackbarVisible(true);
      }
    };

    fetchAndSetBusLines();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state.isConnected);
      if (state.isConnected === false) {
        setError(AppStrings.internetConnectivityLost);
        setSnackbarVisible(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      const selectedLines = Object.keys(checkedItems).filter(
        key => checkedItems[key],
      );

      if (selectedLines.length === 0) {
        return;
      }

      try {
        await fetchAndCalculateMarkers(selectedLines, fixedPoint, setMarkers);
      } catch (networkError) {
        setError(AppStrings.networkErrorRealTimeData);
        setSnackbarVisible(true);
      }
    };

    const intervalId = setInterval(fetchRealTimeData, 2000);
    return () => clearInterval(intervalId);
  }, [checkedItems, fixedPoint]);

  return (
    <SafeAreaProvider style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={colorScheme === 'dark' ? mapStyle : null}
        onRegionChangeComplete={region =>
          onRegionChange(region, mapRef, setError, setSnackbarVisible)
        }
        style={styles.container}
        initialRegion={initialRegion}
        onPress={e => {
          setFixedPoint(e.nativeEvent.coordinate);
          setMarkers([]);
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.color}
          />
        ))}
        {fixedPoint && <Marker coordinate={fixedPoint} pinColor="#2196F3" />}
      </MapView>

      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={deviceHeight * 0.7}
        closeOnDragDown={true}>
        <>
          <Text style={styles.headerText}>{AppStrings.selectBusLines}</Text>
          <FlatList
            data={busLines}
            style={styles.listContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.checkBoxContainer}
                onPress={() => handleCheckboxChange(item)}>
                <Checkbox
                  status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                  color="green"
                />
                <Text style={styles.checkBoxText}>
                  {AppStrings.busLineNumber} {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </>
      </RBSheet>

      {!snackbarVisible && (
        <FAB
          icon="bus"
          style={styles.fabIcon}
          color="white"
          onPress={() => this.RBSheet.open()}
        />
      )}

      {snackbarVisible && (
        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: onDismissSnackBar,
          }}>
          {error}
        </Snackbar>
      )}
    </SafeAreaProvider>
  );
};

export default App;
