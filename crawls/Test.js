import React, {Component,useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet, Button, Image} from 'react-native';
const cheerio = require("cheerio-without-node-native");
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const regex = /[^0-9,.,°]/g;

async function loadWeatherInfo(setWeatherInfo,setNonEmptyArray)
{
  setWeatherInfo({temperatures:"",weathers:""});
  setNonEmptyArray([]);
  const searchUrl = `https://weather.naver.com`;
  const response = await fetch(searchUrl);
  const htmlString = await response.text();
  const $ = cheerio.load(htmlString);
  const theTemperature = $('div.weather_now>div.summary_img>strong').text().replace(regex,'');
  const theWeather = $('div.weather_now>p.summary>span.weather').text();
  const theWeathers = $('div.day_data').text().split(' ');
  const words = theWeathers.filter(word => word.trim() !== '');
  setNonEmptyArray(words);
  setWeatherInfo({temperature:theTemperature, weathers:theWeather});
};

function MatchIcon(props)
{
    const information = props.info;

    if(information==null)
    {
        return (<Text>data not found</Text>);
    }

    if(information.includes("맑음"))
    {
        return (
        <View>
            <Image style={{width:100, height:100, tintColor: '#fff'}}source={require('../assets/images/weather_icon/sun.png')} resizeMode='cover'/>
            <Text style={styles.description}>{information}</Text>
        </View>
        );
    }
    else if(information.includes("구름")||information.includes("흐림"))
    {
        return (
        <View>
            <Image style={{width:100, height:100, tintColor: '#fff'}}source={require('../assets/images/weather_icon/cloud.png')} resizeMode='cover'/>
            <Text style={styles.description}>{information}</Text>
        </View>
        );
    }
    else if(information.includes("비")||information.includes("소나기"))
    {
        return (
        <View>
            <Image style={{width:100, height:100}}source={require('../assets/images/weather_icon/rain.png')} resizeMode='cover'/>
            <Text style={styles.description}>{information}</Text>
        </View>
        );
    }
    else if(information.includes("눈"))
    {
        return (
        <View>
            <Image style={{width:100, height:100}}source={require('../assets/images/weather_icon/snow.png')} resizeMode='cover'/>
            <Text style={styles.description}>{information}</Text>
        </View>
        );
    }
    else if(information.includes("번개")||information.includes("뇌우"))
    {
        return (
        <View>
            <Image style={{width:100, height:100}}source={require('../assets/images/weather_icon/thunder.png')} resizeMode='cover'/>
            <Text style={styles.description}>{information}</Text>
        </View>
        );
    }
    else
    {
        return (<Text>icon not found</Text>);
    }

}

function Celcious(props)
{
    const symbol = props.info;
    if(symbol == null)
    {
        return(<Text>loading</Text>)
    }
    const result = symbol.replace(regex,'')
    if(symbol.includes("최고"))
    {
        return(<Text style={styles.temps_max}>⇧{result}</Text>);
    }
    else if(symbol.includes("최저"))
    {
        return(<Text style={styles.temps_min}>⇩{result}</Text>);
    }
}
function TestScreen()
{
  const [weatherInfo,setWeatherInfo]=useState({temperatures:"",weathers:""});
  const [nonEmptyArray,setNonEmptyArray]=useState([]);

  return(
      <ImageBackground source={require('../assets/images/background1.jpg')} style={{flex:1,width: '100%',height: '100%',alignItems:'center'}}>
          <View style={{flex:1,width:'90%',backgroundColor:'rgba(0,0,0,0.2)',borderRadius:10,paddingVertical:5}}>
              <Text style={styles.title}>Current</Text>
              <View style={styles.current}>
                  <MatchIcon info={weatherInfo.weathers}/>
                  <Text style={{color:'#fff', fontSize:50, textAlign:'center', fontWeight:'100'}}>{weatherInfo.temperature}</Text>
              </View>
              <View>
                  <Text style={styles.title}>Today</Text>
                  <View style={styles.current}>
                      <View>
                          <Text style={styles.time}>{nonEmptyArray[1]}</Text>
                          <MatchIcon info={nonEmptyArray[3]}/>
                      </View>
                      <View>
                          <Text style={styles.time}>{nonEmptyArray[5]}</Text>
                          <MatchIcon info={nonEmptyArray[4]}/>
                      </View>
                  </View>
                  <View style={styles.temps}>
                      <Celcious info={nonEmptyArray[7]}/>
                      <Celcious info={nonEmptyArray[9]}/>
                  </View>
              </View>
              <View>
                  <Text style={styles.title}>Tommorrow</Text>
                  <View style={styles.current}>
                      <View>
                          <Text style={styles.time}>{nonEmptyArray[11]}</Text>
                          <MatchIcon info={nonEmptyArray[13]}/>
                      </View>
                      <View>
                          <Text style={styles.time}>{nonEmptyArray[15]}</Text>
                          <MatchIcon info={nonEmptyArray[14]}/>
                      </View>
                  </View>
                  <View style={styles.temps}>
                      <Celcious info={nonEmptyArray[17]}/>
                      <Celcious info={nonEmptyArray[19]}/>
                  </View>
              </View>
          </View>
          <TouchableOpacity style={styles.loadButton} onPress={() => loadWeatherInfo(setWeatherInfo,setNonEmptyArray)}>
          <Text style={{color:'#fff',textAlign:'center',fontSize:20}}>Load the weather</Text>
          </TouchableOpacity>
      </ImageBackground>
  )

}

const styles = StyleSheet.create({
  loadButton:{
    position: 'absolute',
    width:'70%',
    height:'4%',
    bottom: '1%',
    borderWidth:2,
    borderRadius:20,
    borderColor:'#fff',
    alignItems:'center',
  },
  title:{
    textAlign:'center',
    color:'#fff',
    alignItems: 'center',
    fontSize:30
  },
  time:{
    textAlign:'center',
    color:'#fff',
    fontSize:20,
    fontWeight:'200',
  },
  description:{
    color:'#fff',
    textAlign:'center',
    marginTop:5
  },
  current:{
    flexDirection:"row",
    borderRadius:20,
    paddingVertical:5,
    height:'20',
    alignItems: "center",
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent: 'space-around'
  },
  temps:{
    flexDirection:"row",
     borderRadius:10,
    justifyContent: "space-around",
    backgroundColor:'rgba(0,0,0,0.4)',
    paddingVertical:5
  },
  temps_max:{
    color:'#ff0000',
    fontSize:20,
  },
  temps_min:{
    color:'#0000ff',
    fontSize:20,
  },

});
export default TestScreen;

