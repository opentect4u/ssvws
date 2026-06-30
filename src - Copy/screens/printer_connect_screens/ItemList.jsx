import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {usePaperColorScheme} from '../../theme/theme';

const ItemList = ({label, value, onPress, connected, actionText, color}) => {
  const theme = usePaperColorScheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      <View>
        <Text style={[styles.label, {color: theme.colors.onSurface}]}>
          {label || 'UNKNOWN'}
        </Text>
        <Text style={{color: theme.colors.onSurface}}>{value}</Text>
      </View>
      {connected && (
        <Text style={[styles.connected, {color: theme.colors.onSurface}]}>
          Connect
        </Text>
      )}
      {!connected && (
        <TouchableOpacity onPress={onPress} style={styles.button(color)}>
          <Text style={{color: theme.colors.onSurface}}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 4,
  },
  label: {fontWeight: 'bold'},
  connected: {fontWeight: 'bold'},
  button: color => ({
    backgroundColor: color,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  }),
});
