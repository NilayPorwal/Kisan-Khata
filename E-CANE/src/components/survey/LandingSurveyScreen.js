import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert,
        CheckBox, Dimensions, BackHandler, Button, ImageBackground, AsyncStorage, Image} from 'react-native';
//import Icon from 'react-native-vector-icons/Feather';
import { Icon } from 'native-base';
import Storage from 'react-native-storage';
import APIManager from './../APIManager';

const {height, width} = Dimensions.get('window');

export default class LandingSurveyScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
       userData:{}
    };
     global.LandingScreen = this;
  }           

   static navigationOptions =  ({ navigation }) => { 
    return {
 
    header:null  
   }        
  };   


  componentDidMount(){
     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton); 
     this.retriveData();   
   }
     

  handleAndroidBackButton() {
      if(global.LandingScreen.state.userData.roleName == "SUPER_ADMIN"){
          global.LandingScreen.props.navigation.goBack();
        }else{
            BackHandler.exitApp(); 
        }
         return true;
       }     
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }

       

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));

      this.setState({userData:data})

    }
    }, (error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }  
   
 onStart(){

     APIManager.locationEnabler((res)=>{
        this.props.navigation.navigate("SurveyScreen")
       }, (error)=>{
      console.log(JSON.stringify(error));  
      })     
        
 }

   onLogOut(){
    Alert.alert( 
      "Logout Confirmation",
      'Do you want to Logout ?',
      [
        { 
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );

 }

 logOut(){

  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
  
} 
    
  
  
  render() { 
    return (
    <ImageBackground source={require('./../../assets/Splash.png')} style={styles.container}> 
     
     <View style={{alignItems:"center", marginTop:height*0.1}}> 
      <Image
          style={{width: width*0.5, height: height*0.3}}
          resizeMode="contain"
          source={require('./../../assets/ic_launcher.png')}
        /> 
 
       <View style={{width:"80%"}}>  
        <Text style={{fontSize:18, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
       </View> 
     </View>  

     <View style={{marginTop:15}}>  
       <Text style={{fontSize:18,fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>Welcome Mr. {this.state.userData.displayName}</Text>  
     </View>

    <View style={{alignItems:"center", marginTop:20}}>
      <TouchableOpacity onPress={()=>this.onStart()} style={styles.btnStyle}>
       <Text style={styles.btnTitle}>GO FOR SURVEY</Text>
      </TouchableOpacity>    
    </View>  

     <View style={{alignItems:"center", marginTop:20}}>
      <TouchableOpacity onPress={()=>this.onLogOut()} style={styles.btnStyle}>
       <Text style={styles.btnTitle}>LOG OUT</Text>
      </TouchableOpacity>    
    </View>  

      <View style={{alignItems:"center", marginTop:height*0.05}}>
                <Image
                  style={{width:width*0.5, height:height*0.1}}
                  resizeMode="contain"
                  source={require('./../../assets/logo.png')}
                />
             </View>  
        
       
    </ImageBackground> 
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
  }, 
  btnStyle:{
    elevation:8, borderRadius:25, backgroundColor:"#8db301", width:180
  },
  btnTitle:{
    color:"#ffffff", paddingVertical:15, paddingHorizontal:20, fontFamily: "Lato-Semibold", fontSize:15, textAlign:"center"
  }

});  
  