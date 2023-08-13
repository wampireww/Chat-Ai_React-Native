import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Newchat from '../pages/Newchat'
import Apicallsettings from '../pages/Apicallsettings'
import Chatid from '../pages/Chatid'

const Navigation=()=> {

    const Stack=createNativeStackNavigator();
    
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
            <Stack.Screen options={{headerShown:false}} name='Login' component={Login}/>
           <Stack.Screen name='Home' component={Home}  />
           <Stack.Screen name='Newchat' component={Newchat}/>
           <Stack.Screen name='Settings'component={Apicallsettings}/>
           <Stack.Screen name='Chatid'component={Chatid}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
  
export default Navigation