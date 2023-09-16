// AppStyles.js
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  checkBoxContainer: {flexDirection: 'row', flex: 1, alignItems: 'center'},

  checkBoxText: {color: '#434343', fontSize: 14},
  headerText: {
    textAlign: 'center',
    color: '#434343',
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {padding: 16, marginTop: 8},
  fabIcon: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
