import {AppRegistry} from 'react-native';
import App from './App';
import AppContext from './src/context/AppContext';
import {PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {usePaperColorScheme} from './src/theme/theme';

export default function Main() {
  const theme = usePaperColorScheme();
  return (
    <PaperProvider theme={theme} settings={{rippleEffectEnabled: true}}>
      <AppContext>
        <App />
      </AppContext>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
