 import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  CheckBox,
  Button, AsyncStorage,
  Image, ImageBackground,
  BackHandler,
  ToastAndroid, PermissionsAndroid,
  Keyboard, KeyboardAvoidingView, Dimensions
} from 'react-native';

import { Icon } from 'native-base';
import APIManager from './APIManager';
import { encrypt, decrypt1 } from "./AESEncryption"
import axios from 'axios';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

const {height, width} = Dimensions.get('window');

export default class LoginScreen extends Component {

   constructor(props) {
    super(props);
   
    this.state = {
     isLoading:false,
     username:null,
     password:null,
     ipAddress:"skydev.eastus2.cloudapp.azure.com:8080",
    //  ipAddress:"192.168.1.36:8080",
    // ipAddress:"192.168.0.5",
    // ipAddress:"192.168.1.140:9080",
    // ipAddress:"erp.mspil.in:8080",
     mobileNumber:null,
     otpData:{}
    
    }; 
    global.LoginScreen = this;   
  }
    static navigationOptions =  ({ navigation }) => { return {
 
    header:null  
   } 
  };

 
  async componentDidMount(){
    if(APIManager.isDev != true){ 
       await APIManager.setHost()
      }

     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
     this.requestPermission()
    //   APIManager.getValueForKey('ipAddress', (data)=>{
    //  if(data != null ){ 
    //   this.setState({ipAddress:data})
    // }
    // },(error)=>{
    //      console.log("Ip Address " + JSON.stringify(error));
    // })
   }
   

  handleAndroidBackButton() {
     BackHandler.exitApp();    
    }      
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);

  }


  async requestPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [PermissionsAndroid.PERMISSIONS.CAMERA,
       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
       PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ] 
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
   
  onLogin() {
    
    if(this.state.ipAddress == null || this.state.mobileNumber == null){
         Alert.alert("IP Address and Mobile Number are required")
     }
    else{
      APIManager.setValueForKey('ipAddress', this.state.ipAddress);

          if(this.state.mobileNumber == "1111"){
             this.props.navigation.navigate("TokenDetails")
          }
          else if(this.state.mobileNumber == "2222"){
            this.props.navigation.navigate("LandingSurveyScreen")
          }
          else if(this.state.mobileNumber == "3333"){
            this.props.navigation.navigate("AdminScreen")
          }
          else if(this.state.mobileNumber == "4444"){
            this.props.navigation.navigate("FarmerMainScreen")
          }
          else if(this.state.mobileNumber == "5555"){
            this.props.navigation.navigate("EDPScreen")
          }
  
     }
}

async onLoginWithMobile(){
   Keyboard.dismiss();

   if(APIManager.isDev == true){
       await  APIManager.setValueForKey('ipAddress', this.state.ipAddress);
    }
  if(this.state.mobileNumber != null && this.state.mobileNumber.length == 10){
    this.setState({isLoading:true})

      APIManager.onLoginWithMobile(this.state.mobileNumber,  (response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt1(response.data.data.content));
            console.log("Log IN :" + JSON.stringify(responseJson));
            this.props.navigation.push("OTPScreen", {otpData:responseJson, mobileNumber:this.state.mobileNumber, loginType:0});
            this.setState({isLoading:false, mobileNumber:null})
          }
        else{
           Alert.alert("लॉगिन करने में विफल रहा ", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
      console.log("लॉगिन करने में विफल रहा  " + JSON.stringify(error.message));
      Alert.alert("लॉगिन करने में विफल रहा ", "कृपया दोबारा कोशिश करे ")

    })
  }else{
    Alert.alert("लॉगिन करने में विफल रहा ", "कृपया मान्य मोबाइल नंबर दर्ज करें")
  }

}


async checkForOTP(){
   Keyboard.dismiss();
   if(APIManager.isDev == true){
       await  APIManager.setValueForKey('ipAddress', this.state.ipAddress);
    }

  if(this.state.mobileNumber != null && this.state.mobileNumber.length == 10){
    this.setState({isLoading:true})
    APIManager.checkForOTP(this.state.mobileNumber,  (response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt1(response.data.data.content));
            console.log("Check For Otp :" + JSON.stringify(responseJson));
            if(responseJson[0].serverResponseType == "SUCCESS"){
              this.onLoginWithMobile()
            }else{
              // Alert.alert("लॉगिन करने में विफल रहा ", responseJson[0].serverResponseMsg)
               this.onLoginWithMobile()
            }
        
          }
        else{
              this.onLoginWithMobile()
             //Alert.alert("लॉगिन करने में विफल रहा ", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
      console.log("लॉगिन करने में विफल रहा  " + JSON.stringify(error.message));
      // Alert.alert("लॉगिन करने में विफल रहा ", "कृपया दोबारा कोशिश करे ")                  
      this.onLoginWithMobile()

    })
  }else{
    Alert.alert("लॉगिन करने में विफल रहा ", "कृपया मान्य मोबाइल नंबर दर्ज करें")
  }
}

onSignupWithMobile(){
    Keyboard.dismiss();
    if(this.state.mobileNumber != null && this.state.mobileNumber.length == 10){
      this.setState({isLoading:true})
    APIManager.onSignupWithMobile(this.state.mobileNumber,  (response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt1(response.data.data.content));
            console.log("Sign Up :" + JSON.stringify(responseJson));
            this.props.navigation.navigate("OTPScreen", {otpData:responseJson, mobileNumber:this.state.mobileNumber,  loginType:1});
              this.setState({isLoading:false, mobileNumber:null})
          }
        else{
           Alert.alert("साइन अप करने में विफल रहा  ", response.data.message)
             this.setState({isLoading:false})
          }   
    },(error)=>{
       this.setState({isLoading:false})
       Alert.alert("साइन अप करने में विफल रहा ", JSON.stringify(error.message));
    })
  }else{
    Alert.alert("साइन अप करने में विफल रहा ", "कृपया मान्य मोबाइल नंबर दर्ज करें")
  }
}


   
  
  render() {            
    return (
   <ImageBackground source={require('../assets/Splash.png')} style={{flex:1}}>
    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
     <KeyboardAvoidingView behavior="padding">
     <View style={{alignItems:"center", marginTop:"10%"}}> 
        <Image
            style={{width: width*0.6, height: height*0.2}}
            //resizeMode="contain"
            source={require('../assets/ic_launcher.png')}
          />  
       <View style={{width:"80%"}}> 
        <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
       </View> 
      </View>     
  
     <View style={{flex:1, marginTop:"20%"}}> 
     {
     (APIManager.isDev == true)?
     <View style={styles.textView}>
        <TextInput 
             style={{width:"85%", fontSize:18}}
             onChangeText={(ipAddress) => this.setState({ipAddress})}
             value={this.state.ipAddress}
             returnKeyType="next"    
             placeholder="IP Address or Domain Name"  
             //underlineColorAndroid='#000000'
         />  
      </View>:null  
   }

      <View style={[styles.textView, {marginTop:Platform.OS === 'ios' ? 10 : 0}]}>
         <Icon
          name='mobile1'       
          color='#000000'
          type="AntDesign"
          style={{fontSize:20}} />
        <TextInput
             style={{width:"85%", fontSize:18}}
             onChangeText={(mobileNumber) => this.setState({mobileNumber})}
             value={this.state.mobileNumber}
             returnKeyType="next"    
             placeholder="मोबाइल नंबर"  
              keyboardType='numeric'
             //underlineColorAndroid='#000000'
          
         />
      </View>



 {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>:
  <View style={{alignItems:"center", marginTop:15}}>
    
     <TouchableOpacity onPress={()=>this.onLoginWithMobile()} style={styles.buttonStyle}>
      <Text style={{color:"#ffffff", fontSize:width*0.04}}>लॉगिन</Text>
     </TouchableOpacity>  

    <TouchableOpacity onPress={()=>this.onSignupWithMobile()} style={styles.buttonStyle}>
      <Text style={{color:"#ffffff", fontSize:width*0.04}}>साइन अप</Text>
     </TouchableOpacity>   
 
    </View> } 
    </View>

       <View style={{alignItems:"center", marginTop:height*0.1}}>
                <Image
                  style={{width:width*0.5, height:height*0.1}}
                  resizeMode="contain"
                  source={require('./../assets/logo.png')}
                />
             </View> 
    </KeyboardAvoidingView>
    </ScrollView>
    </ImageBackground>
    )   
  }   
}    

const styles = StyleSheet.create({
  textView :{
    alignItems:"center", flexDirection:"row", borderBottomWidth:1, marginHorizontal:25, padding:Platform.OS === 'ios' ? 10 : 0,
  },
  buttonStyle:{
    backgroundColor:"#8db301", alignItems:"center", paddingVertical:10, width:"85%", elevation:8, borderRadius:3, marginTop:10
  }

});