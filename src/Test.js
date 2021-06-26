import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Slider from '@react-native-community/slider';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Test({
  uri,
  setUri,
  title,
  subTitle,
  sound,
  gravado,
  setGravado,
  time,
  setTime,
}) {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState(time);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const [play, setPlay] = useState(false);
  const [recorder, setRecorder] = useState(false);
  audioRecorderPlayer.setSubscriptionDuration(0.09);

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    onStopPlay();
    return () => {
      isMounted = false;
    };
  }, [sound]);

  async function onStartRecrod() {
    if (gravado) {
      onStopPlay();
      setGravado(false);
    }

    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    console.log('Play');

    const path = Platform.select({
      ios: `audio-${new Date().getTime()}.m4a`,
      android: `sdcard/audio-${sound}${new Date().getTime()}.mp3`,
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    console.log('audioSet', audioSet);

    try {
      const result = await audioRecorderPlayer.startRecorder(path, audioSet);

      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
        setTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      console.log(result);
      setUri(result);
    } catch (error) {
      console.log(error);
    }
  }

  function handleRecorderStop() {
    if (!recorder) {
      onStartRecrod();
      setRecorder(!recorder);
    } else {
      onStopRecord();
      setRecorder(!recorder);
    }
  }
  function handleStartPlayPause() {
    if (!play) {
      onStartPlay();
      setPlay(!play);
    } else {
      onPausePlay();
      setPlay(false);
    }
  }
  async function onStopRecord() {
    console.log('Stop');
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordSecs(0);
      console.log(result);
      setUri(result);
      setGravado(true);
    } catch (error) {
      console.log(error);
    }
  }
  async function onStartPlay() {
    console.log('onStartPlay');
    console.log(isMounted);
    if (isMounted) {
      const msg = await audioRecorderPlayer.startPlayer(uri);
      audioRecorderPlayer.setVolume(1.0);
      console.log(msg);

      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          onStopPlay();
        }

        setCurrentDurationSec(e.duration);
        setCurrentPositionSec(e.currentPosition);
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

        return;
      });
    }
  }

  async function onPausePlay() {
    console.log('onPausePlay');
    await audioRecorderPlayer.pausePlayer();
  }

  async function onStopPlay() {
    console.log('onStopPlay');
    setPlay(false);
    try {
      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isMounted) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>Exemplo: {subTitle}</Text>
      <View style={styles.group}>
        <TouchableOpacity
          onPress={() => handleRecorderStop()}
          style={[styles.touchGroup, recorder && styles.touchGroupRed]}>
          <Feather name="mic" color="#fff" size={20} />
          <Text style={styles.label}> {recorder ? 'Parar' : 'Gravar'}</Text>
        </TouchableOpacity>
        <Text style={styles.conometro}>{recordTime}</Text>
      </View>
      {gravado && (
        <View style={{...styles.group, marginTop: 20, alignItems: 'center'}}>
          <TouchableOpacity onPress={handleStartPlayPause}>
            {play ? (
              <AntDesign name="pausecircle" color="#EB0D0D" size={40} />
            ) : (
              <AntDesign name="play" color="#23aeea" size={40} />
            )}
          </TouchableOpacity>
          <View style={{marginLeft: 20}}>
            <View
              style={{
                position: 'relative',
                width: '100%',
              }}>
              <Slider
                style={{width: width * 0.7, height: 20}}
                minimumValue={0}
                maximumValue={currentDurationSec}
                value={currentPositionSec}
                minimumTrackTintColor="#23aeea"
                maximumTrackTintColor="#000000"
                thumbTintColor="#23aeea"
                tapToSeek={true}
              />
              <View
                style={{
                  width: '100%',
                  height: 20,
                  zIndex: 5,
                  position: 'absolute',
                }}></View>
            </View>
            <Text style={styles.conometroSmall}>
              {playTime} / {duration}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    color: '#132028',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 15,
    color: '#132028',
    marginBottom: 20,
  },
  group: {
    flexDirection: 'row',
  },
  touchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23aeea',
    justifyContent: 'center',
    width: width * 0.3,
    paddingVertical: 10,
    borderRadius: 3,
    marginRight: 30,
  },
  touchGroupRed: {
    backgroundColor: '#EB0D0D',
  },
  label: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 8,
  },
  conometro: {
    fontSize: 35,
    color: '#132028',
    fontWeight: 'bold',
  },
  conometroSmall: {
    fontSize: 15,
    color: '#132028',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginRight: 15,
  },
});
