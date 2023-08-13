import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { useEffect, useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    TouchableOpacity
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome5';
import { _Googlegiris, _Logout } from '../server/Firebaseislemleri';
import auth from '@react-native-firebase/auth';


const Login=({navigation})=> {

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      const checkUser = async () => {
        const user = auth().currentUser;
        if (user) {
          navigasyon.navigate("Home");
        }
      };
  
      checkUser();
    });
    return focusHandler;
}, [navigation]);



  const navigasyon=useNavigation();

  const Googlegiris=()=>{
    _Googlegiris(navigasyon);
  }

  useEffect(() => {
    const checkUser = async () => {
      const user = auth().currentUser;
      if (user) {
        navigasyon.navigate("Home");
      }
    };

    checkUser();
  },[])
  
  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.viev1}>
        <View style={styles.vievlogo}>
        <Icon size={85} color={"#039BE5"} name="globe" />
        <Text style={{fontSize:50,marginLeft:10,color:"#039BE5",fontWeight:"bold"}}>Chat</Text>
        <Text style={{borderRadius:5,fontSize:50,backgroundColor:"#039BE5",paddingHorizontal:5,marginLeft:10,color:"#333333",fontWeight:"bold"}}>AI</Text>
        </View>
        <View style={{marginTop:-40,justifyContent:"center",alignItems:"flex-end",marginBottom:20}}>
          <Text style={{color:"#333333",borderRadius:5,fontSize:14,backgroundColor:"#039BE5",paddingHorizontal:20,paddingVertical:1}}>V1.0</Text>
        </View>
        <View style={{elevation:40,shadowColor:"black",display:"flex"}}>
        <TouchableOpacity onPress={()=>Googlegiris()} style={{borderRadius:10,elevation:5,shadowColor:"#FFFFFF",marginHorizontal:20,padding:8,display:"flex",flexDirection:"row",backgroundColor:"#039BE5",alignItems:"center",justifyContent:"center",marginTop:15}}>
        <Icon style={{padding:5,backgroundColor:"#FFFFFF",borderRadius:15,paddingHorizontal:7}} color={"#039BE5"} size={23} name='google'></Icon>
        <Text style={{marginLeft:10,textAlign:"center",color:"#30404F",fontSize:17,elevation:0,fontWeight:"400"}}>Sign in with Google</Text>
        </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default Login

const styles=StyleSheet.create({
      background:{backgroundColor:"#30404F",flex:1,alignItems:"center",justifyContent:"center"},
      viev1:{display:"flex",flexDirection:"column",padding:50,marginBottom:50,marginHorizontal:20},
      vievlogo:{backgroundColor:"#30404F",elevation:5,
      display:"flex",flexDirection:"row",alignItems:"center",
      justifyContent:"center",marginBottom:20,paddingHorizontal:40,paddingVertical:15,elevation:0,borderRadius:5,marginHorizontal:-15,shadowColor:"black"}
})