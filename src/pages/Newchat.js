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
    KeyboardAvoidingView
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome5';
import Rbsheet from '../components/Rbsheet';
import { Keyboard } from 'react-native';
import { Apicall } from '../components/Apicall';
import { Divider } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet'
import { ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { _Apikeyliste, _Kaydet } from '../server/Firebaseislemleri';
import * as RNLocalize from 'react-native-localize';


const shortid = require('shortid');

const Newchat=({navigation})=> {

  const userTimeZone = RNLocalize.getTimeZone();

  const silref = useRef(null); 
  const kaydetref = useRef(null); 
  const longpressref = useRef(null); 

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
    // const textInputRef = useRef(); // Separate ref for TextInput
    const[Sohbet,setsohbet]=useState([{mesaj:null,tarih:null,gonderen:null,id:null,durum:"array"}]);
    const [chatHistory, setChatHistory] = useState([]);
    const[Mesaj,setmesaj]=useState("");
    const[Textkontrol,settextkontrol]=useState(false);
    const[Longtarih,setlongtarih]=useState();
    const[Longid,setlongid]=useState();
    const[Baslikismi,setbaslikismi]=useState("");
    const [timeoutkaydet, settimeoutkaydet] = useState(false);
  
    const[Apikey,setapikey]=useState("");
    const[Model,setmodel]=useState("");
    const[Contenttype,setcontentype]=useState("");
    const[Anakontrol,setanakontrol]=useState(false);


    useEffect(()=>{   // navbar options
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
      onPress={() => Kaydet()}><Icon color={"white"} size={21} name='folder-plus'></Icon>
      </TouchableOpacity>
            </View>
            <View style={{elevation:10,shadowColor:"black"}}>
            <TouchableOpacity style={{ marginRight:-10, paddingRight: 10, paddingLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",padding: 3, paddingHorizontal: 10, borderRadius: 20, elevation: 2, borderColor: "#C5E1A5" }}
      onPress={() => Sil()}><Icon color={"#30404F"} size={21} name='trash'></Icon>
      </TouchableOpacity></View></>)
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

     const Sil = () => {
      silref.current.open();
    
    };

    const Kaydet=async()=>{
      kaydetref.current.open();

      if(Baslikismi==""){

      }
      else{
          if(Sohbet.length==1){
           
          }
         else{
          var id=auth().currentUser.providerData.map((item)=>item.uid)[0];
          _Kaydet(id,Baslikismi,Sohbet,setbaslikismi,settimeoutkaydet,chatHistory).then(()=>{
            kaydetref.current.close();
          })
         }
         
      }
     
    }

    const Rbkapat=()=>{
      kaydetref.current.close();
      setbaslikismi("");
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
          console.log(Sohbet)
        }
        Keyboard.dismiss();
    }

    const mesajolustur=(gelen)=>{
        setmesaj(gelen)
    }

    const mesajtumsilrbsheet=()=>{
      setsohbet([{mesaj:null,tarih:null,gonderen:null,id:null,durum:"array"}]);
     setChatHistory([]);
     silref.current.close();
    }

  const Paylas=async(gelenmesaj)=>{
    
      try {
        const result = await Share.share({
          message:
          gelenmesaj,
        });

     }catch(error){
        console.log(error=>error)
     }
    
  }


  const Longpress=(gelentarih,gelenid)=>{
    setlongtarih(gelentarih)
    setlongid(gelenid)
    longpressref.current.open();

  }

  const İdsil=(id)=>{

    const Filterarray = Sohbet.filter((item) => item.id !== id);
    setsohbet(Filterarray);
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
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:20}}>Are you sure want to delete the chat ?</Text>
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
        ref={kaydetref}
        height={200}
        openDuration={200}
        customStyles={{container:{justifyContent:"flex-start",alignItems:"center",backgroundColor:"#039BE5"}}}
    >
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20}}>Please enter the title name you want to save.</Text>
            <TextInput value={Baslikismi} onChangeText={(text)=>setbaslikismi(text)} style={{borderRadius:5,elevation:5,paddingTop:0,paddingBottom:0,backgroundColor:"whitesmoke",width:"80%",height:35,marginBottom:10,fontSize:14,marginTop:10}} placeholder='Enter a text..'/>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Quit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Kaydet()} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
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
            <Text style={{fontSize:16,fontWeight:"500",marginBottom:0,marginTop:20}}>Are you sure want to delete this message ?</Text>

            <View style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:20}}>
                <TouchableOpacity onPress={()=>Rbkapat()} style={{padding:10,backgroundColor:"red",elevation:5,borderRadius:5}}>
                <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Negative</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>İdsil(Longid)} style={{padding:10,backgroundColor:"green",marginLeft:20,elevation:5,borderRadius:5}}>
                        <Text style={{fontSize:15,color:"whitesmoke",fontWeight:"500"}}>Definitely</Text>
                </TouchableOpacity>
            </View>

    </RBSheet>
    {timeoutkaydet && 
    <Text style={{fontWeight:"400",textAlign:"center",marginTop:20,elevation:5,shadowColor:"whitesmoke",padding:5,fontSize:14,backgroundColor:"#C5E1A5",color: "#333333",marginHorizontal:30,paddingHorizontal:10,borderRadius:20}}>Chat successfully saved !</Text>
  }
        {Sohbet.length==1 ? <Text style={{textAlign:"center",marginTop:20,elevation:5,shadowColor:"whitesmoke",padding:5,fontSize:14,backgroundColor:"white",color: "#333333",marginHorizontal:30,paddingHorizontal:10,borderRadius:20}}>Please enter a text to start the conversation</Text>  :
          <FlatList
          showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            data={Sohbet.sort((a, b) => a.tarih - b.tarih)}
            renderItem={({item})=>
          
          <>
              {item.gonderen=="admin" && item.gonderen!=null  &&
              <KeyboardAvoidingView>
              <TouchableOpacity onLongPress={()=>Longpress(item.tarih,item.id)} activeOpacity={0.7}>
          <View style={styles.sohbetben}>
                <View style={{ padding: 10 }}>
                  <Text style={{lineHeight:20,textAlign: "left", fontSize: 14, fontWeight: "400", color: "#333333" }}>{item.mesaj}</Text>
                </View>
                <Divider style={{ marginTop: 5, backgroundColor: "#90A4AE" }} bold={true} />
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ textAlign: "right", fontSize: 12, fontWeight: "400", color: "#333333", marginTop: 2 }}>{new Date(item.tarih).toLocaleString(undefined,options)}</Text>
                </View>
              </View>
              </TouchableOpacity>
              </KeyboardAvoidingView>
            }
             {item.gonderen=="ai" && item.gonderen!=null && 
              <KeyboardAvoidingView>
             <TouchableOpacity onLongPress={()=>Longpress(item.tarih,item.id)} activeOpacity={0.7}>
              <View style={styles.sohbetai}>
                  <View style={{ padding: 10 }}>
                    <Text style={{lineHeight:20, textAlign: "left", fontSize: 14, fontWeight: "400", color: "#333333" }}>{item.mesaj}</Text>
                  </View>
                  <Divider style={{ marginTop: 5, backgroundColor: "#607D8B" }} bold={true} />
                  <View style={{ marginBottom: 5,flexDirection:"row",justifyContent:"space-between",alignItems:"center" }}>
                    <TouchableOpacity onPress={()=>Paylas(item.mesaj)} style={{elevation:5,backgroundColor:"#3949AB",padding:1,borderRadius:3,marginTop:3}}>
                    <Icon color={"#C5E1A5"} style={{elevation:5,marginBottom:2,marginLeft:3,marginTop:2}} size={17} name='share'></Icon>
                    </TouchableOpacity>
                    <Text style={{ textAlign: "right", fontSize: 12, fontWeight: "400", color: "#333333", marginTop: 2 }}>{new Date(item.tarih).toLocaleString(undefined,options)}</Text>
                  </View>
                </View>
                </TouchableOpacity>
                </KeyboardAvoidingView>
                 }
                </>
                
          } />

        }
                 
        {Textkontrol==true ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{flex:1,position:"absolute",bottom:6,alignItems:"center",justifyContent:"center",borderRadius:20}}>
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

export default Newchat

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
    flatlist:{marginBottom:60,marginTop:10}

})