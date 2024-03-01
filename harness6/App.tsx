import React from 'react';

import {StyleSheet, Text, View,   Alert} from 'react-native';
import {
  initialize,
  Event,
  Event as FFEvent,
  Result,
  VariationValue,
} from '@harnessio/ff-javascript-client-sdk';
import {useState, useEffect} from 'react';
import {setJSExceptionHandler} from 'react-native-exception-handler';

const flagName = 'apptestflag';
const cfTarget = {identifier: 'HarnessRNSampleApp'};
const apiKey = '061fd856-9437-4467-abd7-099274d1d28f';
let client: Result;

const errorHandler = (e: any, _isFatal: boolean) => {
  Alert.alert('Error', `Global handler received an error : '${e}'`, [{text: 'Ok'}]);
};

function initClient() {
  const options = {
    streamEnabled: false,
  };


    client = initialize(apiKey, cfTarget, options);

    client.on(FFEvent.ERROR_AUTH, (e: any) => { 
      console.info('Event.ERROR_AUTH', e);
    })
 

 

}

setJSExceptionHandler(errorHandler, true);

initClient();

function App(): React.JSX.Element {
  console.log('App');
  const [flagValue, setFlagValue] = useState<VariationValue | null>(null);

 

  useEffect(() => {
 
    client.on(Event.CHANGED, (flagInfo) => {
      console.log('CHANGED: ', flagInfo);
      if (flagInfo.flag == flagName) {
        setFlagValue(flagInfo.value);
      }
    });

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Feature flag '{flagName}' is {JSON.stringify(flagValue)}
      </Text>
 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
