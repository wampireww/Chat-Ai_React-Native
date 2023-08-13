import { GoogleSignin,GoogleSigninButton  } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

GoogleSignin.configure({
  ////// config ///

});


export const _Googlegiris=async(navigasyon)=>{

    var deger=false;
    await GoogleSignin.signOut();


    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const users = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(users.idToken);
     const user=await auth().signInWithCredential(googleCredential).then(()=>{

     database()
  .ref('/users/')
  .once('value')
  .then(snapshot => {if(snapshot.hasChild(users.user.id)){

    database()
    .ref('/users/'+users.user.id)
    .update({
      username:users.user.givenName ,
      photo:users.user.photo,
      mail:users.user.email,
    })
    .then(() =>{navigasyon.navigate("Home")});

  }
  else{
    database()
    .ref('/users/'+users.user.id)
    .set({
      username:users.user.givenName ,
      id:users.user.id,
      photo:users.user.photo,
      mail:users.user.email,
      apikey:"",
      content_type:"application/json",
      model:"gpt-3.5-turbo",
    })
    .then(() =>{navigasyon.navigate("Home")});
  }

  })

     });

     
}   

export const _Logout=async(navigasyon)=>{
    auth()
  .signOut()
  .then(() =>{navigasyon.navigate("Login")});
}


// export const _Kaydet=async(userid,Baslikismi,Sohbet,setbaslikismi,settimeoutkaydet,chatHistory)=>{

//   const gelenisim=Baslikismi.charAt(0).toLocaleUpperCase('tr-TR')+ Baslikismi.slice(1);
//     const shortid = require('shortid');
//     const zaman=new Date();
//     var sohbetarray=[];
//     Sohbet.forEach(item => {
//         if(item.gonderen!=null){
//             item.durum="veritabani";
//             sohbetarray.push(item)
//         }
//     });

//     if(sohbetarray.length!=0){
//         const yenibaslik=database().ref('/users/'+userid.toString()+"/basliklar").push();
        
//         await yenibaslik.set({
//                Baslikismi:gelenisim,
//                Sohbet:sohbetarray.sort((a,b)=>b.tarih-a.tarih),
//                chatHistory:chatHistory,
//                baslikid:shortid.generate(),
//                basliktarih:zaman.getTime()
//            })
       
//                setbaslikismi("");
//                settimeoutkaydet(true)

//     } 
//     else{
//         setbaslikismi("");
//     }

// }

export const _Kaydet=async(userid,Baslikismi,Sohbet,setbaslikismi,settimeoutkaydet,chatHistory)=>{

  const gelenisim=Baslikismi.charAt(0).toLocaleUpperCase('tr-TR')+ Baslikismi.slice(1);
  const shortid = require('shortid');
  const zaman=new Date();
  var sohbetarray=[];

  // Sohbet dizisinin kopyasını oluşturun
  const updatedSohbet = Sohbet.map(item => {
    if(item.gonderen!=null){
      // Yeni bir obje oluşturarak durumu güncelleyin
      return { ...item, durum: "veritabani" };
    }
    return item;
  });

  // Güncellenmiş Sohbet dizisindeki öğeleri sohbetarray dizisine ekleyin
  sohbetarray = updatedSohbet.filter(item => item.gonderen != null);

  if(sohbetarray.length!=0){
    const yenibaslik=database().ref('/users/'+userid.toString()+"/basliklar").push();
        
    await yenibaslik.set({
      Baslikismi:gelenisim,
      Sohbet:sohbetarray.sort((a,b)=>b.tarih-a.tarih),
      chatHistory:chatHistory,
      baslikid:shortid.generate(),
      basliktarih:zaman.getTime()
    });

    setbaslikismi("");
    settimeoutkaydet(true);

  } else {
    setbaslikismi("");
  }
}

export const _Basliklistele = async (setbaslikliste,setkontrol,Search,setbasliklength) => {
  try {
      setkontrol(true);
      const gelenisim = Search.charAt(0).toLocaleUpperCase('tr-TR') + Search.slice(1);
      var id = auth().currentUser.providerData.map((item) => item.uid)[0];
      var baslikliste = [];

      const snapshot = await database().ref('/users/' + id + '/basliklar').once('value');
      
      snapshot.forEach((item) => {if(item.child("Baslikismi").val().startsWith(gelenisim)){
          baslikliste.push({
              Baslikismi: item.child('Baslikismi').val(),
              Baslikid: item.child('baslikid').val(),
              basliktarih: item.child('basliktarih').val(),
              sohbet: item.child('sohbet').val(),
              mesajsayisi:item.child("Sohbet").numChildren(),
              key:item.key
          });
        }
      });

      setbaslikliste(baslikliste.sort((a, b) => a.basliktarih - b.basliktarih));
      setbasliklength(baslikliste.length)
      setkontrol(false);
  } catch (error) {
      console.log('Hata:', error);
  }
};

export const _Basliksil=async(key)=>{
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];

  await database().ref('/users/'+id+"/basliklar/"+key).remove();

}

export const _Apikeyekle=async(key,setkontrol,settimeoutkaydet)=>{
  setkontrol(true)
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  database()
    .ref('/users/'+id)
    .update({
      apikey:key,
    })
    .then(() =>{
      setkontrol(false);
      settimeoutkaydet(true)
    });
}

export const _Modalekle=async(model,setkontrol,settimeoutkaydet)=>{
  setkontrol(true)
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  database()
    .ref('/users/'+id)
    .update({
      model:model,
    })
    .then(() =>{
      setkontrol(false);
      settimeoutkaydet(true)
    });
}

export const _Contenttypeekle=async(Contenttype,setkontrol,settimeoutkaydet)=>{
  setkontrol(true)
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  database()
    .ref('/users/'+id)
    .update({
      content_type:Contenttype,
    })
    .then(() =>{
      setkontrol(false);
      settimeoutkaydet(true)
    });
}

export const _Apikeyliste=async(setapikey,setmodel,setcontentype,setanakontrol)=>{
  setanakontrol(true);
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];

  const apikey = await database().ref('/users/' +id).once('value');
  setapikey(apikey.child("apikey").val());

  const model = await database().ref('/users/' +id).once('value');
  setmodel(model.child("model").val());

  const content = await database().ref('/users/' +id).once('value');
  setcontentype(content.child("content_type").val());
  
  setanakontrol(false);

}

// export const Chatidlistele=async(key,setsohbet,setChatHistory,setchatkontrol)=>{
//   setchatkontrol(true)
//   var id = auth().currentUser.providerData.map((item) => item.uid)[0];

//   const snapshot = await database().ref('/users/' + id + '/basliklar/'+key).once('value');
//       console.log(snapshot.child("chatHistory").val())
//  setsohbet(snapshot.child("Sohbet").val());
//  setChatHistory(snapshot.child("chatHistory").val());
//   setchatkontrol(false);

// }

export const Chatidlistele = (key, setsohbet, setChatHistory, setchatkontrol) => {
  setchatkontrol(true);
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];

  database()
    .ref('/users/' + id + '/basliklar/' + key)
    .on('value', (snapshot) => {
      console.log(snapshot.child('chatHistory').val());
      setsohbet(snapshot.child('Sohbet').val());
      setChatHistory(snapshot.child('chatHistory').val());
      setchatkontrol(false);
    });
};

// export const _Degisiklikkaydet=async(Baslikismi,userid,key,Sohbet,chatHistory,id,settimeoutkaydet)=>{

//  const gelenisim=Baslikismi.charAt(0).toLocaleUpperCase('tr-TR')+ Baslikismi.slice(1);
   
//     const zaman=new Date();
//     var sohbetarray=[];
//     Sohbet.forEach(item => {
//         if(item.gonderen!=null){
//             item.durum="veritabani";
//             sohbetarray.push(item)
//         }
//     });

//     if(sohbetarray.length!=0){
//         const yenibaslik=database().ref('/users/'+userid.toString()+"/basliklar/"+key);
    
//         await yenibaslik.set({
//                Baslikismi:gelenisim,
//                Sohbet:sohbetarray.sort((a,b)=>b.tarih-a.tarih),
//                chatHistory:chatHistory,
//                baslikid:id,
//                basliktarih:zaman.getTime()
//            })
       
             
//                settimeoutkaydet(true)

//     } 
//     else{
       
//     }

// }
export const _Degisiklikkaydet=async(Baslikismi,userid,key,Sohbet,chatHistory,id,settimeoutkaydet)=>{

  const gelenisim=Baslikismi.charAt(0).toLocaleUpperCase('tr-TR')+ Baslikismi.slice(1);
    
     const zaman=new Date();
     var sohbetarray=[];
     Sohbet.forEach(item => {
         if(item.gonderen!=null){
             // Yeni bir obje oluşturarak durumu güncelleyin
             const updatedItem = { ...item, durum: "veritabani" };
             sohbetarray.push(updatedItem);
         }
     });
 
     if(sohbetarray.length!=0){
         const yenibaslik=database().ref('/users/'+userid.toString()+"/basliklar/"+key);
     
         await yenibaslik.set({
                Baslikismi:gelenisim,
                Sohbet:sohbetarray.sort((a,b)=>b.tarih-a.tarih),
                chatHistory:chatHistory,
                baslikid:id,
                basliktarih:zaman.getTime()
            });
        
         settimeoutkaydet(true);
 
     } 
     else{
         // Sohbetarray boş ise bir şey yapmanız gerekiyorsa buraya ekleyebilirsiniz
     }
 }
 

export const _Chatidtumsil=async(key)=>{

  var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  await database().ref('/users/'+id+"/basliklar/"+key).remove();


}

 export const _Chatidyegoresil=async(key,mesajid)=>{

   var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  var sohbetyeni=[]
   const mesajsil=database().ref('users/'+id+"/basliklar/"+key+"/Sohbet").once("value");
   (await mesajsil).forEach((item)=>{
     if(item.child("id").val()==mesajid){
    
       console.log(item.ref)
    }
    else{
      sohbetyeni.push(item.val())
    } 
   })
    database().ref('users/'+id+"/basliklar/"+key+"/").update({Sohbet:sohbetyeni.sort((a,b)=>b.tarih-a.tarih)})
 }

 export const _Chatsohbet1sil=async(key)=>{
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];

  await database().ref('/users/'+id+"/basliklar/"+key).remove();

}

export const _Hesapsil=async()=>{
  var id = auth().currentUser.providerData.map((item) => item.uid)[0];
  await database().ref('/users/'+id).remove();

}