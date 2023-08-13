import { useNavigation } from '@react-navigation/native';
import React ,{ useRef, useState } from 'react'
import { useEffect } from 'react'
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
    FlatList,
    TouchableWithoutFeedback,
    Share,
    KeyboardAvoidingView,
    Animated
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome5';
import Rbsheet from '../components/Rbsheet';
import { Keyboard } from 'react-native';
import { Apicall } from '../components/Apicall';
import { Divider } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet'
import { ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Chatidlistele, _Apikeyliste, _Chatidtumsil, _Chatidyegoresil, _Chatsohbet1sil, _Degisiklikkaydet, _Kaydet } from '../server/Firebaseislemleri';
import * as RNLocalize from 'react-native-localize';


const shortid = require('shortid');

const Chatid=({navigation, route })=> {

  const userTimeZone = RNLocalize.getTimeZone();


  const { chatid } = route.params;
  const {baslikismi}=route.params;
  const {key}=route.params;

  const silref = useRef(null); 
  const degisiklikref = useRef(null); 
  const longpressref = useRef(null); 
  const flatListRef = useRef(null);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: userTimeZone,
  };

  
    const navigasyon=useNavigation();
    const[Sohbet,setsohbet]=useState([{mesaj:null,tarih:null,gonderen:null,id:null,durum:"array"}]);
    const [chatHistory, setChatHistory] = useState([]);
    const[Mesaj,setmesaj]=useState("");
    const[Textkontrol,settextkontrol]=useState(false);
    const[Longtarih,setlongtarih]=useState();
    const[Longid,setlongid]=useState();
    const [timeoutkaydet, settimeoutkaydet] = useState(false);
    const[Chatkontrol,setchatkontrol]=useState(false)

    const[Apikey,setapikey]=useState("");
    const[Model,setmodel]=useState("");
    const[Contenttype,setcontentype]=useState("");
    const[Anakontrol,setanakontrol]=useState(false);
    const[LongDurum,setlongdurum]=useState("");


    useEffect(()=>{ 
        navigation.setOptions({
          headerStyle:{backgroundColor:"#039BE5",elevation:0},
          headerTitleAlign:"center",
          headerTitleStyle:{fontWeight:"700",fontSize:21,fontFamily:"notoserif"},
          title:null,
          headerTintColor:null,
          headerLeft:()=>(<TouchableOpacity style={{elevation:5,marginLeft:-10,paddingRight:10,paddingLeft:10,display:"flex",flexDirection:"row",
          alignItems:"center",justifyContent:"center",borderWidth:0,padding:2,paddingHorizontal:5,borderRadius:20,elevation:5,borderColor:"#C5E1A5"}} 
          onPress={()=>Geridon()}><Icon color={"#C5E1A5"} size={26} name='arrow-circle-left'></Icon></TouchableOpacity>),
          headerRight:()=>(<>
         
          <View style={{elevation:10,shadowColor:"white",shadowOpacity:0.5}}>
          <TouchableOpacity style={{ marginRight:10,paddingTop:5,paddingBottom:5, paddingRight: 10, paddingLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",padding: 3, paddingHorizontal: 10, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
      onPress={() => Kaydet()}><Icon color={"#FFA726"} size={21} name='folder-plus'></Icon>
      </TouchableOpacity>
            </View>
            <View style={{elevation:10,shadowColor:"black"}}>
            <TouchableOpacity style={{ marginRight:-10, paddingRight: 10, paddingLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",padding: 3, paddingHorizontal: 10, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
      onPress={() => Sil()}><Icon color={"#30404F"} size={21} name='trash'></Icon>
      </TouchableOpacity></View></>)
      });
    
      })

      useEffect(()=>{
        _Apikeyliste(setapikey,setmodel,setcontentype,setanakontrol);
        Chatidlistele(key,setsohbet,setChatHistory,setchatkontrol)
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

     const Sil = () => {
      silref.current.open();
    
    };

    const Kaydet=()=>{
        degisiklikref.current.open();
          
    }

    const Degisiklikkaydet=async()=>{

        var id=auth().currentUser.providerData.map((item)=>item.uid)[0];
        _Degisiklikkaydet(baslikismi,id,key,Sohbet,chatHistory,chatid,settimeoutkaydet).then(()=>{
          degisiklikref.current.close();
        })
        
       
    }


    const Rbkapat=()=>{
        degisiklikref.current.close();
      silref.current.close();
      longpressref.current.close();

    }

    const Gonder=()=>{
      
        if(Mesaj!=""){
          const zaman=new Date()
          setsohbet(old=>[...old,{mesaj:Mesaj,tarih:zaman.getTime(),gonderen:"admin",id:shortid.generate(),durum:"array"}]);
          setChatHistory(prevHistory =>[...prevHistory, { role: 'user', content: Mesaj }]);  
          Apicall(Mesaj,setsohbet,settextkontrol,chatHistory,Apikey,Model,Contenttype)
          setmesaj("");
         
        }
      
    }

    const mesajolustur=(gelen)=>{
        setmesaj(gelen)
    }

    const mesajtumsilrbsheet=()=>{
    _Chatidtumsil(key).then(()=>{
      silref.current.close();
      navigasyon.navigate("Home")
    })
   
    }

  const Paylas=async(gelenmesaj)=>{
    
      try {
        const result = await Share.share({
          message:gelenmesaj
            ,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        Alert.alert(error.message);
      }

  }


  const Longpress=(gelentarih,gelenid,durum)=>{
    setlongtarih(gelentarih)
    setlongid(gelenid)
    setlongdurum(durum)
    longpressref.current.open();

  }


  const İdsil=(id,durum)=>{
    if(Sohbet.length==1){
        _Chatsohbet1sil(key).then(()=>{navigasyon.navigate("Home")})
    }
    else{
      if(durum=="veritabani"){
        _Chatidyegoresil(key,id).then(()=>{
        //  Chatidlistele(key,setsohbet,setChatHistory,setchatkontrol);
    
        })
      }
      else {
        const Filterarray = Sohbet.filter((item) => item.id !== id);
        setsohbet(Filterarray);
      }
    }
   
    longpressref.current.close();

  }

  return (  
    <SafeAreaView style={styles.main}>
         <RBSheet
        ref={silref}
        height={150}
        openDuration={200}
        customStyles={{container:{justifyContent:"center",alignItems:"center",backgroundColor:"#039BE5"}}}
    >
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:20,marginHorizontal:5}}>Are you sure want to delete the entire chat ? If you choose "Definitely" the chat will be deleted along with its title.</Text>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Negative</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>mesajtumsilrbsheet()} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Definitely</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
    <RBSheet
        ref={degisiklikref}
        height={150}
        openDuration={200}
        customStyles={{container:{justifyContent:"flex-start",alignItems:"center",backgroundColor:"#039BE5"}}}
    >
            {/* <Text style={{fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20,marginHorizontal:3}}>Yapılan değişiklikleri</Text> */}
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20,marginHorizontal:3}}>Are you sure want to save the changes ?</Text>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:20}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Quit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Degisiklikkaydet()} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Save</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
    <RBSheet
        ref={longpressref}
        height={150}
        openDuration={200}
        customStyles={{container:{justifyContent:"flex-start",alignItems:"center",backgroundColor:"#039BE5"}}}
    >                     
    {/* <Text style={{color:"black",fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20}}>{new Date(Longtarih).toLocaleString('tr-TR',options)}</Text> */}
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20}}>Are you sure want to delete this message ??</Text>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:20}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Negative</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>İdsil(Longid,LongDurum)} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Definitely</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
    <View style={styles.arama}>
       <Text style={{elevation:10,backgroundColor:"#ECEFF1",padding:1,borderRadius:10,paddingHorizontal:20,marginLeft:5,fontSize:14,fontWeight:"400"
       ,color:"#30404F",marginRight:5}}>{baslikismi}</Text>
      </View>
      <View>
    {timeoutkaydet &&  ( 
    <Text style={{fontWeight:"400",textAlign:"center",marginTop:20,elevation:5,shadowColor:"whitesmoke",padding:5,fontSize:14,backgroundColor:"#C5E1A5",color: "#333333",marginHorizontal:30,paddingHorizontal:10,borderRadius:20}}>Changes have been saved !</Text>
  )}    
  </View> 
     {Chatkontrol==true ? (
   <View style={{flex:0,alignItems:"center",justifyContent:"center",borderRadius:20}}>
          <ActivityIndicator style={{marginTop:10,alignItems:"center",justifyContent:"center"}} size={35} animating={Chatkontrol} color={"#039BE5"} />
          </View>           
        ) :( <View style={{marginBottom:25,marginTop:10}}>

          
          <FlatList
            ref={flatListRef}
            keyExtractor={(item)=>item.id}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            data={Sohbet && Sohbet.sort((a, b) => a.tarih - b.tarih)}
            renderItem={({item})=>
    
          <>
              {item.gonderen=="admin" && item.gonderen!=null  &&
              <KeyboardAvoidingView>
              <TouchableOpacity onLongPress={()=>Longpress(item.tarih,item.id,item.durum)} activeOpacity={0.7}>
          <View style={styles.sohbetben}>
                <View style={{ padding: 10 }}>
                  <Text style={{lineHeight:19,textAlign: "left", fontSize: 14, fontWeight: "400", color: "#333333" }}>{item.mesaj}</Text>
                </View>
                <Divider style={{ marginTop: 5, backgroundColor: "#90A4AE" }} bold={true} />
                <View style={{ marginBottom: 5,display:"flex" ,flexDirection:"row",alignItems:"center",justifyContent:"flex-end" }}> 
                  <Text style={{ textAlign: "right", fontSize: 12, fontWeight: "400", color: "#333333", marginTop: 2 }}>{new Date(item.tarih).toLocaleString(undefined,options)}</Text>
                  {item.durum=="veritabani" &&
                    <Icon color={"#455A64"} style={{elevation:5,marginBottom:0,marginLeft:6,marginTop:3,marginRight:1}} size={17} name='save'></Icon>
                  }
                </View>
              </View>
              </TouchableOpacity>
              </KeyboardAvoidingView>
            }
             {item.gonderen=="ai" && item.gonderen!=null && 
                           <KeyboardAvoidingView>

             <TouchableOpacity onLongPress={()=>Longpress(item.tarih,item.id,item.durum)} activeOpacity={0.7}>
              <View style={styles.sohbetai}>
                  <View style={{ padding: 10 }}>
                    <Text style={{lineHeight:19, textAlign: "left", fontSize: 14, fontWeight: "400", color: "#333333" }}>{item.mesaj}</Text>
                  </View>
                  <Divider style={{ marginTop: 5, backgroundColor: "#607D8B" }} bold={true} />
                  <View style={{ marginBottom: 5,flexDirection:"row",justifyContent:"space-between",alignItems:"center" }}>
                    <TouchableOpacity onPress={()=>Paylas(item.mesaj)} style={{elevation:5,backgroundColor:"#3949AB",padding:1,borderRadius:3,marginTop:3}}>
                    <Icon color={"#C5E1A5"} style={{elevation:5,marginBottom:2,marginLeft:3,marginTop:2}} size={17} name='share'></Icon>
                    </TouchableOpacity>
                    <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                     
                    <Text style={{ textAlign: "right", fontSize: 12, fontWeight: "400", color: "#333333", marginTop: 2 }}>{new Date(item.tarih).toLocaleString(undefined,options)}</Text>
                    {item.durum=="veritabani" &&
                    <Icon color={"#455A64"} style={{elevation:5,marginBottom:0,marginLeft:6,marginTop:3,marginRight:1}} size={17} name='save'></Icon>
                  }
                    </View>
                  </View>
                </View>
                </TouchableOpacity>
                </KeyboardAvoidingView>

                 }
                </>
                
          } />
        
          </View>)}
               
          

                 
        {Textkontrol==true ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <View style={{flex:1,position:"absolute",bottom:40,alignItems:"center",justifyContent:"center",borderRadius:20}}>
          <ActivityIndicator style={{alignItems:"center",justifyContent:"center"}} size={29} animating={Textkontrol} color={"#039BE5"} />
            <Text style={{fontSize:15,color:"#039BE5",fontWeight:"600"}}>Typing...</Text>
          </View> 
          </View>
         ) : (
           
        <View style={styles.footer}>
          <View style={styles.massagebox}>
          <TextInput editable={!Anakontrol} placeholderTextColor={"#333333"} value={Mesaj} onChangeText={(text)=>mesajolustur(text)} style={{marginLeft:52,paddingLeft:10,marginRight:5,width:"94%",elevation:5,paddingTop:0,paddingBottom:0,height:35,fontSize:14,backgroundColor:"whitesmoke",borderRadius:30}} placeholder='Enter a text..'/>
          <TouchableOpacity onPress={()=>Gonder()} style={styles.gonderbuton}>
          <Icon color={"#30404F"} style={{marginLeft:-3}} size={32} name='arrow-circle-up'></Icon>
          
          </TouchableOpacity>
            </View> 
        </View>
         )
          }
   
    </SafeAreaView>
  )
}

export default Chatid

const styles=StyleSheet.create({
    main:{backgroundColor:"#30404F",flex:1},
    footer:{backgroundColor:"#039BE5",flex:1,justifyContent:"center",position:"absolute",bottom:0,width:"100%"},
    massagebox:{display:"flex",flexDirection:"row",padding:10,justifyContent:"center",alignItems:"center"},
    gonderbuton:{marginRight:55,elevation:5,padding:0},
    sohbetana:{display:"flex",flexDirection:"column",marginTop:0,marginBottom:70},
    sohbetben:{display:"flex",flexDirection:"column",padding:5,backgroundColor:"#F8FCFE",marginTop:20,marginHorizontal:50,
    borderRadius:20,elevation:5,marginLeft:20,shadowColor:"white",shadowOpacity: 0.5},
    sohbetai:{display:"flex",flexDirection:"column",padding:5,backgroundColor:"#039BE5",
    marginHorizontal:50,borderRadius:20,elevation:5,marginTop:20
    ,shadowColor:"white",marginRight:20,shadowOpacity: 0.5},
    flatlist:{marginBottom:75},
    arama:{paddingVertical:8,backgroundColor:"#039BE5",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",elevation:5},
    
})