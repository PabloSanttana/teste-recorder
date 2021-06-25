import React ,{useState, useEffect} from 'react'
import { View, Text, StyleSheet, Dimensions, Button, PermissionsAndroid,Platform } from 'react-native'

import AudioRecorderPlayer, { 
    AVEncoderAudioQualityIOSType,
    AVEncodingOption, 
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType, 
} from 'react-native-audio-recorder-player';


export default function Test() {
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [recordSecs, setRecordSecs] = useState(0)
    const [recordTime, setRecordTime] = useState('00:00:00')
    const [currentPositionSec, setCurrentPositionSec] = useState(0)
    const [currentDurationSec, setCurrentDurationSec] = useState(0)
    const [playTime, setPlayTime] = useState('00:00:00')
    const [duration, setDuration] = useState('00:00:00')

    const audioRecorderPlayer = new AudioRecorderPlayer();

    let uri =""


   async function onStartRecrod(){
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

     
        console.log("Play")

        const path = Platform.select({
            ios: `audio-${new Date().getTime()}.m4a`,
            android: `sdcard/audio-${new Date().getTime()}.mp3`
          });

          const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac
          };

        console.log('audioSet', audioSet);

        const result = await audioRecorderPlayer.startRecorder(path, audioSet);


        // const result = await audioRecorderPlayer.startRecorder();

        audioRecorderPlayer.addRecordBackListener((e) =>{
            /* 
            setRecordSecs(e.currentPosition)
            setRecordTime(audioRecorderPlayer.mmssss(
                Math.floor(e.currentPosition),
              )) */
              console.log("time........." ,e.currentPosition)
              return;
        })
        console.log(result);
        uri=result

    }
   async function onStopRecord(){
        console.log("Stop")
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener()
        setRecordSecs(0)
        console.log(result)
        uri=result
    }
   async  function onStartPlay(){
        console.log('onStartPlay');
        const msg = await audioRecorderPlayer.startPlayer(uri);
        console.log(msg);

      audioRecorderPlayer.addPlayBackListener((e) => {
        /*     this.setState({
              currentPositionSec: e.currentPosition,
              currentDurationSec: e.duration,
              playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
              duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
            }); */
            console.log("currentPositionSec....", e.currentPosition)
            console.log("currentDurationSec....", e.duration)
            console.log("playTime....", audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
            console.log("duration....",audioRecorderPlayer.mmssss(Math.floor(e.duration)))
        
            return;
          });
    };
    
    async function onPausePlay(){
        console.log("oio")
        await audioRecorderPlayer.pausePlayer();
    }

    async function onStopPlay () {
        console.log('onStopPlay');
       await audioRecorderPlayer.stopPlayer();
       await audioRecorderPlayer.removePlayBackListener();
      };


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Gravador</Text>
            <Text style={styles.text}>{recordTime}</Text>
            <View style={styles.grupButton}>
                <Button  title="Start" onPress={()=>onStartRecrod()} />
                <Button  color="red" title="Stop" onPress={()=>onStopRecord()} />
            </View>
            <Text style={styles.text}>{playTime} / {duration}</Text>
            <View style={styles.grupButton}>
                <Button  title="Play" onPress={()=>onStartPlay()} />
                <Button  color="red" title="PAUSE" onPress={()=>onPausePlay()} />
            </View>
            <View style={{width: width*0.5, marginTop:30}}>
            <Button  color="red" title="STOP" onPress={()=>onStopPlay()} />
            </View>
           
        </View>
    )
}


const {width,height} = Dimensions.get("window")
const styles = StyleSheet.create({
    container:{
        width,
        height,
        justifyContent:"center",
        alignItems:"center"
        
    },
    text:{
        color: "#000",
        marginVertical:10,
        fontSize:40
    },
    button:{
        width: width *0.5,
    },
    grupButton:{
        width: "50%",
        flexDirection:"row",
       justifyContent:"space-around"
    }
})