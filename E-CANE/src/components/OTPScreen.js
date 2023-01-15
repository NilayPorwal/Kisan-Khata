import React, { Component } from 'react';
import {
  StyleSheet,Dimensions,
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  CheckBox,
  Button, AsyncStorage,
  Image, ImageBackground,
  BackHandler,
  Keyboard, KeyboardAvoidingView
} from 'react-native';

import { Icon } from 'native-base';
import APIManager from './APIManager';
import { encrypt, decrypt, decrypt1 } from "./AESEncryption"
var dateFormat = require('dateformat');
import Storage from 'react-native-storage'
const IMEI = require('react-native-imei');
import DeviceInfo,{ getUniqueId, getMacAddress} from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

const options = {
  container: {
   // backgroundColor: '#000',
    padding: 5,
  }, 
  text: {
    fontSize: 18,
    color: '#000000',
  }
};

const {height, width} = Dimensions.get('window');


export default class OTPScreen extends Component {

   constructor(props) {
    super(props);
   
    this.state = {    
     isLoading:false,
     otp:null,
     otpData:this.props.navigation.state.params.otpData,
     mobileNumber:this.props.navigation.state.params.mobileNumber,
     loginType:this.props.navigation.state.params.loginType,
     loginData:{},
     deviceInfo:{},
     coords:{},
     timerStart: true,
     currentTime:null,
     totalDuration: 20000,
     timerReset: false,
     fcmToken:null
    };
     this.handleTimerComplete = this.handleTimerComplete.bind(this);
  }
   static navigationOptions =  ({ navigation }) => { return {
 
    header:null  
   }        
  }; 

 
  componentDidMount(){
    
     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);  

     this.getDeviceInfo()
     //this.getCurrentLocation()
   }
   

  handleAndroidBackButton() {
     BackHandler.exitApp();    
    }      
        
    
  // componentWillUnmount() {
  //    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
  //    }

   async getDeviceInfo(){
    //const imei = await  IMEI.getImei();
      let imei;
    IMEI.getImei()
    .then((res)=>{
        imei = res;
    })
    .catch((error)=>{
         imei = null
    })
    const deviceID = await DeviceInfo.getDeviceId();
    const deviceBrand = await DeviceInfo.getBrand();
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    const deviceType = (Platform.OS == "ios")?"IOS":"Android";
    // const deviceUniqueId = await getUniqueId;
    // const deviceMacAddress = await getMacAddress;

    const diviceInfo = {imei:imei, deviceID: deviceID, deviceBrand: deviceBrand, fcmToken:fcmToken, deviceType:deviceType}

    console.log(JSON.stringify(diviceInfo))
    this.setState({deviceInfo:{imei:imei, deviceID: deviceID, deviceBrand: deviceBrand, fcmToken:fcmToken, deviceType:deviceType}, fcmToken})

  } 

  getCurrentLocation(){
    Geolocation.getCurrentPosition(      
      (position) => {  
          const coords = { latitude: position.coords.latitude,
                           longitude: position.coords.longitude}
        this.setState({coords});           
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
    );   

  }

  validateOTP(){
     
     Keyboard.dismiss();
     this.setState({isLoading:true})
  if(this.state.otp != null && this.state.otp.length < 7 && this.state.otp.length > 4){
   APIManager.locationEnabler((res)=>{
    const data = {    
        "mobile": this.state.mobileNumber.trim(),
        "hash":this.state.otpData.mh,
        "otpValue":this.state.otp.trim()    
    }

    APIManager.validateOTP(data, (response)=>{
      //console.log(JSON.stringify(response))
     
        if(response.data.status == "SUCCESS"){
            response.data.data = JSON.parse(decrypt1(response.data.data.content));
            console.log("Validate OTP :" + JSON.stringify(response.data));
            APIManager.setValueForKey('userData', response.data.data) 
            this.insertLog(response.data.data)
          }
        else{
            this.setState({isLoading:false})
            Alert.alert("OTP सत्यापन विफल हो गया", response.data.message)
          }   
    },(error)=>{
     this.setState({isLoading:false})
      Alert.alert("OTP सत्यापन विफल हो गया", error.message)
      console.log(JSON.stringify(error));  
    })
  }, (error)=>{
     this.setState({isLoading:false})
      console.log(JSON.stringify(error));
    })  
  }else{
     this.setState({isLoading:false})
     Alert.alert("OTP सत्यापन विफल हो गया", "कृपया एक वैध OTP दर्ज करें")
  }
}  

insertLog(userData){
  APIManager.getLocation((location)=>{
    const data = {    
        "pUserLogUserName": this.state.mobileNumber.trim(),
        "pUserLogPassword":null,
        "pUserLogCounterKey":null,
        "pUserLogDevice": "mobile",
        "pUserLogDeviceId":this.state.deviceInfo,
        "pUserLogLoginLocation":location,
        "puserloghashkey":"",
        "pUserLogIsSuccess":1
      }
 // alert(JSON.stringify(data))
  APIManager.insertLog(userData.ssoId, userData.apiSeceretKey, data, (response)=>{
    this.setState({isLoading:false})
        if(response.data.status == "SUCCESS"){
            response.data.data = JSON.parse(decrypt1(response.data.data.content));
            console.log("Insert Log:" + JSON.stringify(response.data));
            APIManager.setValueForKey('logData', response.data.data)
            this.redirectTo("KisanCodeScreen")
 
          //  if(userData.roleName == "FARMER"){
          //         this.redirectTo("KisanCodeScreen")
          //  }
          //  else {
          //    Alert.alert("Log In failed", "Role does not exist")
          //  }
          }
        else{
           Alert.alert("Log failure", response.data.message)
             
          }   
        }, (error)=>{
           this.setState({isLoading:false})
             Alert.alert("Log failure", JSON.stringify(error))
            console.log("लॉगिन करने में विफल रहा ", "कृपया दोबारा कोशिश करे ")

        })
    }, (error)=>{
          console.log("Unable to fetch location", "Please try again")
          Alert.alert("लॉगिन करने में विफल रहा ", "कृपया दोबारा कोशिश करे ")

          this.setState({isLoading:false})
    })
} 

  redirectTo(screen){
         const screenType =  {
                  "screenType": screen,
                }

          APIManager.setValueForKey('screenType', screenType) 
          this.props.navigation.push(screen)
  }

  onResendPress(){
      if(this.state.loginType == 0){
         this.onLoginWithMobile()
      }else{
        this.onSignupWithMobile() 
      }
  }

  onLoginWithMobile(){
    this.setState({isLoading:true})
    APIManager.onLoginWithMobile(this.state.mobileNumber, (response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt1(response.data.data.content));
            console.log("Log IN :" + JSON.stringify(responseJson));
            //APIManager.setValueForKey('ipAddress', this.state.ipAddress);
            //this.props.navigation.navigate("OTPScreen", {otpData:responseJson, mobileNumber:this.state.mobileNumber});
              this.setState({isLoading:false,  otpData:responseJson, timerReset:false, timerStart:true, resendOTP:false})
          }
        else{
           Alert.alert("Login Failed", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       Alert.alert("Login Failed " + JSON.stringify(error.message));
    })
}
                                                      
onSignupWithMobile(){

    this.setState({isLoading:true})
    APIManager.onSignupWithMobile(this.state.mobileNumber, (response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt1(response.data.data.content));
            console.log("Sign Up :" + JSON.stringify(responseJson));
            //APIManager.setValueForKey('ipAddress', this.state.ipAddress);
            //this.props.navigation.navigate("OTPScreen", {otpData:responseJson, mobileNumber:this.state.mobileNumber});
              this.setState({isLoading:false,  otpData:responseJson, timerReset:false, timerStart:true})
          }
        else{
           Alert.alert("Signup Failed", response.data.message)
             this.setState({isLoading:false})
          }   
    },(error)=>{
       this.setState({isLoading:false})
       Alert.alert("Signup Failed " + JSON.stringify(error.message));
    })
 }



   handleTimerComplete(){
      this.setState({timerReset:true, timerStart:false})
   }
    
  
   
  render() {            
  return (
   <ImageBackground source={require('../assets/Splash.png')} style={{flex:1}}>
    <ScrollView keyboardShouldPersistTaps='handled'  showsVerticalScrollIndicator={false}>
    <KeyboardAvoidingView behavior="padding">
      <View style={{alignItems:"center", marginTop:"10%"}}> 
        <Image
            style={{width: width*0.6, height: height*0.2}}
            source={require('../assets/ic_launcher.png')}
          />  
       <View style={{width:"80%"}}>  
        <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
       </View> 
      </View>

  
    <View style={{marginTop:"20%"}}>
      <View style={styles.textView}>
         <Icon
          name='mobile1'       
          color='#000000'
          type="AntDesign"
          style={{fontSize:20}} /> 
       <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{this.state.mobileNumber}</Text>      
      </View>  
     
      <View style={[styles.textView, { borderBottomWidth:1}]}>
         <Icon
          name='sms'       
          color='#000000'
          type="MaterialIcons"
          style={{fontSize:20}} /> 
        <TextInput
             style={{width:"85%", fontSize:18}}
             onChangeText={(otp) => this.setState({otp})}
             value={this.state.otp}
             returnKeyType="next"    
             placeholder="OTP"  
             keyboardType='numeric'
             //underlineColorAndroid='#000000'
          />          
      </View>    

     <View style={{alignItems:"center", marginTop:10}}>
      <View style={{width:300}}>
       {(this.state.isLoading==true)?
        <ActivityIndicator size="small" color="#000000"  style={{marginTop:10}} />:
        <TouchableOpacity onPress={()=>this.validateOTP()} style={styles.buttonStyle}>
         <Text style={{color:"#ffffff", fontSize:width*0.04}}>OTP सत्यापित करें</Text>
        </TouchableOpacity>  
      }
       </View>   
      </View>

      {(this.state.isLoading==false)?
       <View style={{alignItems:"center"}}>
        {(this.state.timerReset == false)?
        <Timer 
          totalDuration={this.state.totalDuration}  
          start={this.state.timerStart}
          reset={this.state.timerReset}
          options={options}
          handleFinish={this.handleTimerComplete}
          />:
           <TouchableOpacity onPress={()=>this.onResendPress()} style={{margin:10}} >
              <Text style={{ textDecorationLine: 'underline', fontSize:15, fontFamily: "Lato-Semibold"}}>Resend OTP</Text>
            </TouchableOpacity >}
       </View>:null} 
      </View>
     </KeyboardAvoidingView>
     </ScrollView>
    </ImageBackground>   
    )   
  }   
}    

const styles = StyleSheet.create({
   textView :{
    alignItems:"center", flexDirection:"row", marginHorizontal:25, padding:Platform.OS === 'ios' ? 10 : 0,
  },
  buttonStyle:{
    backgroundColor:"#8db301", alignItems:"center", paddingVertical:10, width:"100%", elevation:8, borderRadius:3, marginTop:10
  }

});