import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Test from './Test';

export default function protolocos() {
  const [protocolaPA, setProtocoloPA] = useState();
  const [protocolaTA, setProtocoloTA] = useState();
  const [protocolaKA, setProtocoloKA] = useState();
  const [recorderPA, setRecorderPA] = useState(false);
  const [recorderTA, setRecorderTA] = useState(false);
  const [recorderKA, setRecorderKA] = useState(false);
  const [timePA, setTimePA] = useState('00:00:00');
  const [timeTA, setTimeTA] = useState('00:00:00');
  const [timeKA, setTimeKA] = useState('00:00:00');

  const [protocolos, setProtocolos] = useState('PA');

  async function handleSubmit() {
    console.log('oio');
    if (
      timePA === '00:00:00' &&
      timeTA === '00:00:00' &&
      timeKA === '00:00:00'
    ) {
      alert('Todos os protocolos de audio são obrigatorio');
      return;
    }

    alert('Envio com sucesso!');
    return;
  }

  return (
    <ScrollView style={{width: '100%', height: '100%'}}>
      <View style={styles.groupButton}>
        <TouchableOpacity
          style={[styles.button, protocolos === 'PA' && styles.buttonActive]}
          onPress={() => setProtocolos('PA')}>
          <Text
            style={[
              styles.textButton,
              protocolos === 'PA' && styles.textButtonActive,
            ]}>
            Protocolo PA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, protocolos === 'TA' && styles.buttonActive]}
          onPress={() => setProtocolos('TA')}>
          <Text
            style={[
              styles.textButton,
              protocolos === 'TA' && styles.textButtonActive,
            ]}>
            Protocolo TA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, protocolos === 'KA' && styles.buttonActive]}
          onPress={() => setProtocolos('KA')}>
          <Text
            style={[
              styles.textButton,
              protocolos === 'KA' && styles.textButtonActive,
            ]}>
            Protocolo KA
          </Text>
        </TouchableOpacity>
      </View>
      {protocolos === 'PA' && (
        <Test
          title="Protocolo PA"
          sound="ProtocoloPA"
          uri={protocolaPA}
          setUri={setProtocoloPA}
          subTitle="PA PA PA PA..."
          gravado={recorderPA}
          setGravado={setRecorderPA}
          time={timePA}
          setTime={setTimePA}
        />
      )}
      {protocolos === 'TA' && (
        <Test
          title="Protocolo TA"
          uri={protocolaTA}
          sound="ProtocoloTA"
          setUri={setProtocoloTA}
          subTitle="TA TA TA TA..."
          gravado={recorderTA}
          setGravado={setRecorderTA}
          time={timeTA}
          setTime={setTimeTA}
        />
      )}
      {protocolos === 'KA' && (
        <Test
          title="Protocolo KA"
          uri={protocolaKA}
          sound="ProtocoloKA"
          setUri={setProtocoloKA}
          subTitle="KA KA KA KA..."
          gravado={recorderKA}
          setGravado={setRecorderKA}
          time={timeKA}
          setTime={setTimeKA}
        />
      )}
      <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
        <Text style={{...styles.textButtonActive, fontSize: 20}}>
          Enviar Protocolos
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  groupButton: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  button: {
    width: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#23aeea',
  },
  textButton: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonActive: {
    backgroundColor: '#23aeea',
  },
  textButtonActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonSubmit: {
    alignSelf: 'center',
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23aeea',
    borderRadius: 5,
    paddingVertical: 20,
    marginTop: 100,
  },
});
