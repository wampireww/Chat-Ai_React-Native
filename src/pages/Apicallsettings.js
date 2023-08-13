import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState ,useRef} from 'react'
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
  import Icon from 'react-native-vector-icons/FontAwesome';
  import { Divider } from 'react-native-paper';
import { _Apikeyekle, _Apikeyliste, _Contenttypeekle, _Hesapsil, _Logout, _Modalekle } from '../server/Firebaseislemleri';
import { ActivityIndicator } from 'react-native-paper';
import { Switch } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet'


const Apicallsettings=({navigation})=> {

  const hesapsil = useRef(null)

    const navigasyon=useNavigation();
    const[Apikey,setapikey]=useState("");
    const[Model,setmodel]=useState("");
    const[Contenttype,setcontentype]=useState("");
    const[Kontrol,setkontrol]=useState(false);
    const[timeoutkaydet,settimeoutkaydet]=useState(false);
    const[Anakontrol,setanakontrol]=useState(true);

    const [Dswitch,setdswitch] =useState(false);


    useEffect(()=>{   // navbar options
        navigation.setOptions({
          headerStyle:{backgroundColor:"#039BE5",elevation:0},
          headerTitleAlign:"center",
          headerTitleStyle:{fontWeight:"700",fontSize:21,fontFamily:"notoserif"},
          title:null,
          headerTintColor:null,
          headerLeft:()=>(<TouchableOpacity style={{elevation:5,marginLeft:-10,paddingRight:10,paddingLeft:10,display:"flex",flexDirection:"row",
          alignItems:"center",justifyContent:"center",borderWidth:0,padding:2,paddingHorizontal:5,borderRadius:20,elevation:5,borderColor:"#C5E1A5"}} 
          onPress={()=>Geridon()}><Icon color={"#C5E1A5"} size={29} name='arrow-circle-left'></Icon></TouchableOpacity>),
    
      });
    
      })

      useEffect(()=>{
        _Apikeyliste(setapikey,setmodel,setcontentype,setanakontrol)    

      },[])


      useEffect(() => {
        let timeoutId;
      
        if (timeoutkaydet) {
          timeoutId = setTimeout(() => {
          
            settimeoutkaydet(false);
          }, 1000);
        }
      
        return () => {
          clearTimeout(timeoutId);
        };
      }, [timeoutkaydet]);


   const Geridon=()=>{
    navigasyon.navigate("Home")
   }

   const Apikeykaydet=()=>{
        if(Dswitch==true){
          
        _Apikeyekle(Apikey,setkontrol,settimeoutkaydet)
        _Apikeyliste(setapikey,setmodel,setcontentype,setanakontrol)    

        }
        else{

        }

   }

   const Modelkaydet=()=>{

    if(Dswitch==true){
      _Modalekle(Model,setkontrol,settimeoutkaydet)
      _Apikeyliste(setapikey,setmodel,setcontentype,setanakontrol)   
    }
    else{

    }
    

   }

   const Contenttypekaydet=()=>{

    if(Dswitch==true){
      _Contenttypeekle(Contenttype,setkontrol,settimeoutkaydet)
      _Apikeyliste(setapikey,setmodel,setcontentype,setanakontrol)    
    }
    else{

    }
   
   }


  const Hesapsil=()=>{
    _Hesapsil();
    _Logout(navigasyon);
    hesapsil.current.close();
  } 

  const Rbac=()=>{
    hesapsil.current.open();

  }

  const Rbkapat=()=>{
    hesapsil.current.close();
  }

  
  return (
        <SafeAreaView style={styles.main}>
          <RBSheet
        ref={hesapsil}
        height={150}
        openDuration={200}
        customStyles={{container:{justifyContent:"center",alignItems:"center",backgroundColor:"#039BE5"}}}
    >         
            {/* <Text  numberOfLines={1} ellipsizeMode="tail" style={{color:"red",marginLeft:5,marginRight:5,fontSize:16,fontWeight:"500",marginBottom:0}}>{Rbgelenbaslik}</Text> */}
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:20}}>Are you sure you want to delete your account ?</Text>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Hesapsil()} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Yes</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
            <ScrollView
            showsVerticalScrollIndicator={false}
            >
            <View style={styles.section1}>
                <View style={{backgroundColor:"#30404F",marginTop:0,paddingHorizontal:50,padding:5,borderRadius:15,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <Icon color={"#C5E1A5"} size={28} name='android'></Icon>
                    <Text style={{fontSize:16,fontWeight:"500",color:"#039BE5",marginLeft:7}}>ChatGPT APİ Settings</Text> 
                </View>
              

                {timeoutkaydet==true && 
                <View style={{ flex: 0, alignItems: "center", justifyContent: "center", borderRadius: 20}}>
              <Text style={{
                textAlign: "center", marginTop: 10, elevation: 5, shadowColor: "whitesmoke", padding: 5, fontSize: 14, backgroundColor: "white", color: "#333333",
                marginHorizontal: 40, paddingHorizontal: 30, borderRadius: 20
              }}>Successfully saved !
              </Text>
            </View>
                    }
                    {Anakontrol==true ? 

                    <View style={{flex:0,alignItems:"center",justifyContent:"center",borderRadius:20}}>
          <ActivityIndicator style={{marginTop:10,alignItems:"center",justifyContent:"center"}} size={35} animating={Anakontrol} color={"#039BE5"} />
          </View> 

          :
          <><><View style={{
              padding: 0, backgroundColor: "#039BE5", display: "flex", flexDirection: "row",
              alignItems: "center", justifyContent: "flex-end", borderRadius: 5, marginTop: 10,elevation:5
            }}>
              <Text style={{ marginLeft: 10, textAlign: "left", fontSize: 15, fontWeight: "400", marginRight: 10 }}>To scroll for editing.</Text>
              <Switch color='#30404F' value={Dswitch} onValueChange={() => setdswitch(!Dswitch)} />
            </View><><View style={{ backgroundColor: "#30404F", maxWidth: "100%", padding: 10, marginTop: 5, borderRadius: 15, flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon color={"#C5E1A5"} size={22} name='key'></Icon>
                <Text style={{ textAlign: "left", fontSize: 15, fontWeight: "500", color: "#039BE5", marginLeft: 5, padding: 0, marginBottom: 5, marginTop: 0 }}>Api Key</Text>
              </View>
              <TextInput editable={Dswitch} numberOfLines={3} multiline={true} defaultValue={Apikey} onChangeText={(text) => setapikey(text)} placeholder="Please enter your API key.." placeholderTextColor={"black"}
                style={{ elevation: 20, borderRadius: 15, paddingBottom: 2, marginTop: 5, paddingTop: 2, backgroundColor: "whitesmoke", minWidth: 350, maxWidth: 380, height: "auto" }} />
              <TouchableOpacity disabled={Kontrol} onPress={() => Apikeykaydet()} style={{ borderRadius: 10, padding: 3, width: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#039BE5" }}>
                <Icon color={"#C5E1A5"} size={22} name='save'></Icon>
                <Text style={{ marginLeft: 6, fontSize: 14, fontWeight: "400", color: "#333333" }}>Save</Text>
              </TouchableOpacity>
              <Divider style={{ marginTop: 20, backgroundColor: "#039BE5" }} bold={true} />
            </View><View style={{ backgroundColor: "#30404F", width: "100%", padding: 10, marginTop: -10, borderRadius: 15, flexDirection: "column" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon color={"#C5E1A5"} size={22} name='star'></Icon>
                    <Text style={{ textAlign: "left", fontSize: 15, fontWeight: "500", color: "#039BE5", marginLeft: 5, padding: 0, marginBottom: 5, marginTop: 2 }}>Model</Text>
                  </View>
                  <TextInput editable={Dswitch} defaultValue={Model} onChangeText={(text) => setmodel(text)} placeholder='Please enter your model value.' placeholderTextColor={"black"}
                    style={{ elevation: 20, borderRadius: 15, paddingBottom: 0, marginTop: 5, paddingTop: 0, backgroundColor: "whitesmoke", width: "100%", height: 35 }} />
                  <TouchableOpacity disabled={Kontrol} onPress={() => Modelkaydet()} style={{ borderRadius: 10, padding: 3, width: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#039BE5" }}>
                    <Icon color={"#C5E1A5"} size={22} name='save'></Icon>
                    <Text style={{ marginLeft: 6, fontSize: 14, fontWeight: "400", color: "#333333" }}>Save</Text>
                  </TouchableOpacity>
                  <Divider style={{ marginTop: 20, backgroundColor: "#039BE5" }} bold={true} />
                </View><View style={{ backgroundColor: "#30404F", width: "100%", padding: 10, marginTop: -10, borderRadius: 15, flexDirection: "column" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon color={"#C5E1A5"} size={22} name='font'></Icon>
                    <Text style={{ textAlign: "left", fontSize: 15, fontWeight: "500", color: "#039BE5", marginLeft: 5, padding: 0, marginBottom: 5, marginTop: 2 }}>Content-Type</Text>
                  </View>
                  <TextInput editable={Dswitch} defaultValue={Contenttype} onChangeText={(text) => setcontentype(text)} placeholder='Please enter your Content-Type value.' placeholderTextColor={"black"}
                    style={{ elevation: 20, borderRadius: 15, paddingBottom: 0, marginTop: 5, paddingTop: 0, backgroundColor: "whitesmoke", width: "100%", height: 35 }} />
                  <TouchableOpacity disabled={Kontrol} onPress={() => Contenttypekaydet()} style={{ borderRadius: 10, padding: 3, width: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#039BE5" }}>
                    <Icon color={"#C5E1A5"} size={22} name='save'></Icon>
                    <Text style={{ marginLeft: 6, fontSize: 14, fontWeight: "400", color: "#333333" }}>Save</Text>
                  </TouchableOpacity>
                  <Divider style={{ marginTop: 20, backgroundColor: "#039BE5" }} bold={true} />
                </View></></><View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", marginBottom: 10 }}>
                <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: "500", color: "#039BE5", marginBottom: 5 }}>İmportant !</Text>
                <Text style={{ marginLeft: 5, fontSize: 14, textAlign: "left", fontWeight: "400", color: "#039BE5" }}>- Content-Type is set to "application/json", and the Model is "gpt-3.5-turbo" by default.</Text>
                <Text style={{ marginLeft: 5, fontSize: 14, textAlign: "left", fontWeight: "400", color: "#039BE5" }}>- If you are using the free trial version of ChatGPT, do not change the default values, just enter your Api-Key.</Text>
                <Text style={{ marginLeft: 5, fontSize: 14, textAlign: "left", fontWeight: "400", color: "#039BE5" }}>- You can learn your Api-Key by signing up at openai.com.</Text>
                <Text style={{ marginLeft: 5, fontSize: 14, textAlign: "left", fontWeight: "400", color: "#039BE5" }}>- If you have a paid subscription for ChatGPT, you can find the personalized values mentioned above by visiting openai.com and accessing your account details.</Text>


              </View>
              <Divider style={{ marginTop: 5, backgroundColor: "#039BE5" }} bold={true} />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10,}}>
                <TouchableOpacity onPress={()=>Rbac()} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"
                ,backgroundColor:"#039BE5",paddingHorizontal:30,paddingVertical:2,elevation:5,borderRadius:5 }}>
                  <Icon color={"#C5E1A5"} size={25} name='remove'></Icon>
                  <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "500", color: "#30404F", marginBottom: 0 }}>Delete My Account</Text>
                </TouchableOpacity>
              </View></>
                  }
            </View>
            </ScrollView>
        </SafeAreaView>
  )
}

export default Apicallsettings

const styles=StyleSheet.create({
    main:{backgroundColor:"#30404F",flex:1,alignItems:"center"},
    section1:{flex:1,backgroundColor:"#30404F",width:"100%",marginTop:0,height:"50%",justifyContent:"flex-start",alignItems:"center",elevation:0,flexDirection:"column"}
})