import { useNavigation } from '@react-navigation/native';
import React, { useEffect,useState,useRef } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    TouchableOpacity,
    View,
    TextInput,
    FlatList
  } from 'react-native';
  import auth from '@react-native-firebase/auth';
  import Icon from 'react-native-vector-icons/FontAwesome';
import { _Basliklistele, _Basliksil, _Logout } from '../server/Firebaseislemleri';
import { Avatar } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet'


const Home=({navigation})=> {

  const silbaslikref = useRef(null); 

  const navigasyon=useNavigation();
  const[Baslikliste,setbaslikliste]=useState([]);
  const[Basliklength,setbasliklength]=useState();
  const[Yenileliste,setyenileliste]=useState(false);
  const[Kontrol,setkontrol]=useState(false);
  const[Search,setsearch]=useState("");
  const[Rbgelenbaslik,setrbgelenbaslik]=useState("");
  const[Rbgelenbaslikid,setrbgelenbaslikid]=useState("");

  useEffect(() => {
    
    const focusHandler = navigation.addListener('focus', () => {
      _Basliklistele(setbaslikliste,setkontrol,Search,setbasliklength);
      setsearch("");
    });
    return focusHandler;
}, [navigation]);


  useEffect(()=>{

    _Basliklistele(setbaslikliste,setkontrol,Search,setbasliklength);
    
  
  },[Yenileliste,Search])

  useEffect(()=>{   // navbar options
    navigation.setOptions({
      headerStyle:{backgroundColor:"#039BE5"},
      headerTitleAlign:"center",
      headerTitleStyle:{fontWeight:"700",fontSize:21,fontFamily:"notoserif"},
      title:"",
      headerTintColor: "#C5E1A5",
      headerLeft:()=>(<View style={{elevation:5,display:"flex",flexDirection:"row",alignItems:"center"}}>
        <Avatar.Image style={{marginLeft:-10,elevation:5}} size={35} source={{uri: (auth().currentUser.photoURL)}} />
        <Text style={{marginLeft:5,fontSize:14,fontWeight:"500",color:"#30404F"}} >{auth().currentUser.displayName}</Text>
        </View>),
      headerRight:()=>(
      <TouchableOpacity style={{ marginRight:-10, paddingRight: 5, paddingLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",padding: 3, paddingHorizontal: 10, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
      onPress={() => Cikisyap()}><Icon color={"red"} size={25} name='sign-out'></Icon>
      </TouchableOpacity>)
  });

  })

  const Cikisyap=()=>{
      _Logout(navigasyon);
  }

  const Yenisohbet=()=>{
    navigasyon.navigate("Newchat")
  }

  const Settings=()=>{
    navigasyon.navigate("Settings")

  }

  const Yenile=()=>{
setyenileliste(!Yenileliste)
  }

  const Rbkapat=()=>{
  
    silbaslikref.current.close();
  
  }

  const Basliklongpress=(gelen,gelenid)=>{
    setrbgelenbaslik(gelen)
    setrbgelenbaslikid(gelenid)
    silbaslikref.current.open();

  }

  const Basliksil=()=>{

      _Basliksil(Rbgelenbaslikid);
      _Basliklistele(setbaslikliste,setkontrol,Search,setbasliklength);
      silbaslikref.current.close();

  }

  return (
    <SafeAreaView style={style.main}>
        <RBSheet
        ref={silbaslikref}
        height={150}
        openDuration={200}
        customStyles={{container:{justifyContent:"center",alignItems:"center",backgroundColor:"#039BE5"}}}
    >         
            {/* <Text  numberOfLines={1} ellipsizeMode="tail" style={{color:"red",marginLeft:5,marginRight:5,fontSize:16,fontWeight:"500",marginBottom:0}}>{Rbgelenbaslik}</Text> */}
            <Text style={{fontSize:16,fontWeight:"500",marginTop:20}}>Are you sure want to delete the title named</Text>
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:20}}>"{Rbgelenbaslik}"</Text>

            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Negative</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Basliksil()} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Definitely</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
      <View style={style.arama}>
        <TextInput value={Search} onChangeText={(text)=>setsearch(text)} placeholderTextColor={"#333333"} style={{alignSelf:"stretch",minWidth:350,paddingLeft:20,paddingRight:30,elevation:5,paddingTop:0,paddingBottom:0,height:30,fontSize:14,backgroundColor:"whitesmoke",borderRadius:30}} placeholder='Enter the title you want to search for'/>
        <Icon style={{marginBottom:3,marginLeft:-26}} color={"#45515F"} size={19} name='search'></Icon>
      </View>
      {Kontrol==true ? 
      <View style={{flex:0,alignItems:"center",justifyContent:"center",borderRadius:20}}>
          <ActivityIndicator style={{marginTop:10,alignItems:"center",justifyContent:"center"}} size={35} animating={Kontrol} color={"#039BE5"} />
          </View> 
         : 
         <><View>
          {Basliklength == 0 &&
            <View style={{ flex: 0, alignItems: "center", justifyContent: "center", borderRadius: 20}}>
              <Text style={{
                textAlign: "center", marginTop: 20, elevation: 5, shadowColor: "whitesmoke", padding: 5, fontSize: 14, backgroundColor: "white", color: "#333333",
                marginHorizontal: 50, paddingHorizontal: 30, borderRadius: 20
              }}>No title found !
              </Text>
            </View>}
        </View><View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ backgroundColor: "#30404F", width: "88%" }}>
              <FlatList
                style={style.flatlist}
                showsVerticalScrollIndicator={false}
                data={Baslikliste}
                renderItem={({ item }) => <View style={{ paddingRight: 55, width: "100%", marginTop: 10, marginLeft: 5, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                  <TouchableOpacity onPress={()=>navigasyon.navigate("Chatid", { key:item.key,chatid: item.Baslikid ,baslikismi:item.Baslikismi})} onLongPress={()=>Basliklongpress(item.Baslikismi,item.key)} style={{ padding: 3, width: "100%", flexDirection: "row", alignItems: "center" }}>
                    <Icon color={"#A0A0A4"} size={24} name="commenting-o"></Icon>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 5, fontSize: 15, color: "#A0A0A4" }}>({item.mesajsayisi})</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 10, fontSize: 15, color: "#DFECE4" }}>{item.Baslikismi}</Text>
                  </TouchableOpacity>
                </View>} />

            </View>
            <View style={{ elevation: 0, backgroundColor: "#30404F", width: "12%", position: "relative", right: 5, top: 50, marginVertical: 0, justifyContent: "flex-start", borderRadius: 15 }}>
              <TouchableOpacity style={{ height: 40, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0, padding: 0, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
                onPress={() => Yenisohbet()}><Icon color={"#C5E1A5"} size={27} name='plus-circle'></Icon>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 20, height: 40, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0, padding: 0, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
                onPress={() => Settings()}><Icon color={"#F39C12"} size={27} name='gear'></Icon>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 20, height: 40, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0, padding: 0, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
                onPress={() => Yenile()}><Icon color={"#039BE5"} size={25} name='refresh'></Icon>
              </TouchableOpacity>
            </View>
          </View></>
      }
    </SafeAreaView>
  )
}

export default Home

const style=StyleSheet.create({
  main:{backgroundColor:"#30404F",flex:1},
  arama:{paddingVertical:8,backgroundColor:"#039BE5",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",elevation:5},
  flatlist:{marginBottom:10}
})