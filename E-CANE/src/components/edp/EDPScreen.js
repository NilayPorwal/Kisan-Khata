import React, { Component } from 'react';
import {Platform, Text, View, ImageBackground, Image, ScrollView, TouchableOpacity,Alert, Keyboard,Dimensions,
         StyleSheet, Modal, TouchableHighlight, ActivityIndicator, Button, TextInput, BackHandler } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon, Picker } from 'native-base';
import APIManager from './../APIManager';
import { encrypt, decrypt } from "./../AESEncryption"
import base64 from 'react-native-base64'
import axios from 'axios';
var dateFormat = require('dateformat');
import Storage from 'react-native-storage';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
const IMEI = require('react-native-imei');
import DeviceInfo,{ getUniqueId, getMacAddress} from 'react-native-device-info';

const {height, width} = Dimensions.get('window');
let deviceInfo = {}

export default class EDPScreen extends Component {
    constructor(props) {
        super(props);
    this.state = {
               modalVisible: false,
               modalVisible1: false,
               modalVisible2: false,
               modalVisible3: false,
               modalVisible4: false,
               modalVisible5: false,
               modalVisible6: false,
               codeNumber:null,
               token:null,
               userData:{},
               tokenData:[],
               canUpdate:false,
               rfid:null,
               reason:null,
               mode:0,
               transport:0,
               harvester:null,
               farmerCode:null,
               modeList:[],
               transporterList:[],
               harvesterList:[],
               orderBy:0,
               authPersonList:[],
               authPersonId:0
            }
            global.EDPScreen = this;
        }


            toggleModal(visible)  {
               this.setState({ modalVisible: visible });
            }
            toggleModal1(visible)  {
                this.setState({ modalVisible1: visible });
             }
             toggleModal2(visible)  {
                this.setState({ modalVisible2: visible });
             }
             toggleModal3(visible)  {
                this.setState({ modalVisible3: visible });
             }
             toggleModal4(visible)  {
                this.setState({ modalVisible4: visible });
             }
             toggleModal5(visible)  {
                this.setState({ modalVisible5: visible });
             }
             toggleModal6(visible)  {
                this.setState({ modalVisible6: visible });
             }



    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
        this.retriveData();
        this.getDeviceInfo();
        this.getModeList()
        this.getTranportList()
        this.getharvesterList()
        this.getAuthPersonList()

      }
    
      handleAndroidBackButton() {
        if(global.EDPScreen.state.userData.roleName == "SUPER_ADMIN"){
          global.EDPScreen.props.navigation.goBack();
        }else{
            BackHandler.exitApp(); 
        }
         return true;
       }      
               
       
     componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
       
        }


        static navigationOptions = {
            header: null,        
        };

   async getDeviceInfo(){
    const imei = await  IMEI.getImei();
    const deviceBrand = await DeviceInfo.getBrand();
    const deviceType = (Platform.OS == "ios")?"IOS":"Android";
    deviceInfo = {imei:imei, deviceBrand: deviceBrand, deviceType:deviceType}
    console.log(deviceInfo)
    //this.setState({deviceInfo:{imei:imei, deviceBrand: deviceBrand, deviceType:deviceType}})

  }       

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      this.setState({userData:data})
       //this.getFarmerTareDetails();

    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }

  getTokenDetailsToChange() { 
  this.setState({ tokenData:[], canUpdate:false})
  if(this.state.codeNumber == null){
    Alert.alert("Token Required")
  } else { 
    this.setState({isLoading: true, data:[]})
    const data = {
      "pSwtmTkSlipNo": this.state.codeNumber
    } 
   APIManager.getTokenDetailsToChange(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
           console.log("get token details to change :" + JSON.stringify(response.data));
           
           if(response.data.data[0].serverResponseId === 404){
              this.setState({isLoading:false})
               Alert.alert("Token not found")
             
           }else if(response.data.data[0].serverResponseId === 500){
              Alert.alert("Tare already done")
              this.setState({isLoading:false}) 
           }else{
              this.setState({isLoading:false, tokenData:response.data.data, canUpdate:true})
           }

        } else {    
           console.log('error', response);  
           Alert.alert("Error", response.data.message)
           this.setState({isLoading:false})
        } 
   },(error)=>{
      this.setState({isLoading:false})
      console.log('Token details error', JSON.stringify(response));
    })
  }
 } 



  getModeList(){

   APIManager.getModeList((response)=>{
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Mode List :" + JSON.stringify(response.data));
         
          this.setState({modeList: response.data.data })
   

        } else {
          console.log('Mode list error', JSON.stringify(response));

        }
    }, (error)=>{
      console.log('Mode list error', JSON.stringify(response));
    })
  }

  getTranportList(){

   APIManager.getTranportList((response)=>{   
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Transporter List :" + JSON.stringify(response.data));
         
          this.setState({transporterList: response.data.data })
   

        } else {
          console.log('Transporter list error', JSON.stringify(response));

        }
    }, (error)=>{
      console.log('Transporter list error', JSON.stringify(response));
    })
  };

   getharvesterList(){
    
   APIManager.getharvesterList((response)=>{   
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Harvester List :" + JSON.stringify(response.data));
         
          this.setState({harvesterList: response.data.data })
   

        } else {
          console.log('Harvester list error', JSON.stringify(response));

        }
    }, (error)=>{
      console.log('Harvester list error', JSON.stringify(response));
    })
  };

    getAuthPersonList(){

   APIManager.getAuthPersonList((response)=>{ 
      //console.log('Auth Persons list', JSON.stringify(response));
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
           console.log("Auth Persons List :" + JSON.stringify(response.data));
          const data = JSON.parse(base64.decode(response.data.data[0].config_value))
          console.log("Auth Persons List1 :" + JSON.stringify(data));
         
          this.setState({authPersonList:data })
   

        } else {
          console.log('Auth Persons list error', JSON.stringify(response));

        }
    }, (error)=>{
      console.log('Auth Persons list error', JSON.stringify(response));
    })
  }


 updateRFID(){
      Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.rfid == null || this.state.reason == null || this.state.rfid.trim() == "" || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'New RFID' and 'Reason to change' is required")
   }else if(this.state.rfid != null && this.state.rfid.length < 5){
     return Alert.alert("Wait !!", "Invalid RFID")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pOldRfId":this.state.tokenData[0].RF_NO,   
                "pNewRfId": this.state.rfid, 
                "pReasonToUpdate":this.state.reason,
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }  
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.updateRFID(data, (response)=>{
                 console.log(JSON.stringify(response));

                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on update Details :" + JSON.stringify(response.data));
                   
                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                           this.setState({isLoading:false, reason:null, canUpdate:false, rfid:null })
                           Alert.alert("UPDATED")
                       }
                    //result.success = true;
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to update RFID", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  } 

  

  updateMode(){
       Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.mode == null || this.state.reason == null || this.state.mode == 0 || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'New Mode' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pOldModeAiId":this.state.tokenData[0].MOD_ID,   
                "pNewModeAiId": this.state.mode,
                "pReasonToUpdate":this.state.reason,
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.updateMode(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on update Details :" + JSON.stringify(response.data));
                   
                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                           this.setState({isLoading:false,  reason:null, canUpdate:false,mode:0 })
                           Alert.alert("UPDATED")
                       }
                    //result.success = true;
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to update mode", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  } 

  updateFarmer(){
       Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.farmerCode == null || this.state.reason == null || this.state.farmerCode.trim() == 0 || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'New Farmer Code' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pOldFarmerCode":this.state.tokenData[0].FARMER_CODE,   
                "pNewFarmerCode": this.state.farmerCode,
                "pReasonToUpdate":this.state.reason,
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.updateFarmer(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on update Details :" + JSON.stringify(response.data));

                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                            this.setState({isLoading:false,  reason:null, canUpdate:false, farmerCode:null })
                           Alert.alert("UPDATED")
                       }
                    //result.success = true;
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to update farmer", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  } 

   updateHarvester(){
       Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.harvester == 0 || this.state.reason == null || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'New Harvester' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pOldHrCode":this.state.tokenData[0].HR_ID,   
                "pNewHrCode": this.state.harvester,
                "pReasonToUpdate":this.state.reason,
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.updateHarvester(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on update Details :" + JSON.stringify(response.data));

                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                               this.setState({isLoading:false,  reason:null, canUpdate:false, farmerCode:null, harvester:0 })
                           Alert.alert("UPDATED")
                       }
                    //result.success = true;
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to update Harvester", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  } 

   updateTransporter(){
       Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.transport == 0 || this.state.reason == null || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'New Transporter' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pOldTrCode":this.state.tokenData[0].TR_ID,   
                "pNewTrCode": this.state.transport,
                "pReasonToUpdate":this.state.reason,
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.updateTransporter(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on update Details :" + JSON.stringify(response.data));

                      if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                          this.setState({isLoading:false,  reason:null, canUpdate:false, farmerCode:null, transport:0 })
                           Alert.alert("UPDATED")
                       }
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to update Transporter", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  }

 tokenLock(){
     Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.authPersonId == 0 || this.state.reason == null || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'Order By' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pLockType":"A",         
                "pReasonToUpdate":this.state.reason,
                "pOrderBy":  this.getOrderby(),
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.tokenLock(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on token lock :" + JSON.stringify(response.data));

                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                           this.setState({isLoading:false,  reason:null, canUpdate:false, authPersonId:0 })
                           Alert.alert("UPDATED")
                       }
                    //result.success = true;
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to lock token", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  }


 bypassToken(){
     Keyboard.dismiss();
   if(this.state.canUpdate == false){
     return Alert.alert("Wait !!", "Please provide a valid token number")
   }else if(this.state.authPersonId == 0 || this.state.reason == null || this.state.reason.trim() == ""){
     return Alert.alert("Wait !!", "'Order By' and 'Reason to change' is required")
   }
  
   APIManager.locationEnabler((res)=>{

            this.setState({isLoading: true})
           
             APIManager.getCurrentLocation((location)=>{
              //deviceInfo.push(location) 
              deviceInfo.location = location
              
              const data = {   
                "pTokenNo":this.state.codeNumber,  
                "pTokenAiId": this.state.tokenData[0].TKN_AI_ID,    
                "pByPassType":"A",         
                "pReasonToUpdate":this.state.reason,
                "pOrderBy": this.getOrderby(),
                "pUpdateUserId":this.state.userData.userId,
                "pDeviceInfo":deviceInfo
              }
               
              console.log("Device Info", JSON.stringify(data))

               APIManager.bypassToken(data, (response)=>{
                 console.log(JSON.stringify(response));   
                if (response.data.status === "SUCCESS") {
                    response.data.data = JSON.parse(decrypt(response.data.data.content));
                    console.log("on token lock :" + JSON.stringify(response.data));
                       if(response.data.data[0].serverResponseId === 404){
                          this.setState({isLoading:false})
                          Alert.alert(response.data.data[0].serverResponseMsg)
                         
                       }else if(response.data.data[0].serverResponseId === 500){
                          Alert.alert(response.data.data[0].serverResponseMsg)
                          this.setState({isLoading:false}) 
                       }else{
                           this.setState({isLoading:false,  reason:null, canUpdate:false,  authPersonId:0 })
                           Alert.alert("UPDATED")
                       }
                  } else {                  
                     console.log('error', response);   
                     this.setState({isLoading:false})
                     Alert.alert("Failed to lock token", response.data.message)
                   //  alert("Incorrect Farmer Code")
                }
              }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
              })
             }, (error)=>{
                   this.setState({isLoading:false})
                    console.log(JSON.stringify(error));
                    Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))

                    //Alert.alert("Location Error", "Please turn on your mobile GPS location")
                   
             })
            }, (error)=>{
                    this.setState({isLoading:false})
                    Alert.alert(JSON.stringify(error));
            
          })     
       
      
  }

  getOrderby(){
    //console.log(JSON.stringify(this.state.authPersonList))
    for(let i = 0; i<this.state.authPersonList.length; i++){
      console.log(this.state.authPersonId == this.state.authPersonList[i].id)
      if(this.state.authPersonId == this.state.authPersonList[i].id){
        const data = {"personName": this.state.authPersonList[i].person_name, "mobile_no":this.state.authPersonList[i].mobile_no}
         return data
      }
    }
  }

  modalClose(){
    this.setState({modalVisible:false, modalVisible1:false, modalVisible2:false, modalVisible3:false, modalVisible4:false, 
                   modalVisible5:false, modalVisible6:false, codeNumber:null, tokenData:[], isLoading:false, mode:0, transport:0, 
                   authPersonId:0, reason:null, canUpdate:false})
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

   onLogOut(){
    Alert.alert(
      "Logout Confirmation",
      'Do you want to Logout ?',      
      [
        { 
          text:  "No",
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: "Yes", onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );

 }

 logOut(){
  this.hideMenu();

  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
        this.setState({ userData:{}})
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
  
} 


  render() {
         const modeList = this.state.modeList.map((item, key) => {  
         return (<Picker.Item label={item.M_Name } value={item.M_Code} key={key}/>)    
            })               
         modeList.unshift(<Picker.Item  key="" label="---New Mode---" value='0' />)

        const transporterList = this.state.transporterList.map((item, key) => {  
         return (<Picker.Item label={item.TR_Name } value={item.transport_ai_id} key={key}/>)    
            })               
         transporterList.unshift(<Picker.Item  key="" label="---New Transporter---" value='0' />)  

          const harvesterList = this.state.harvesterList.map((item, key) => {  
         return (<Picker.Item label={item.HR_Name } value={item.har_ai_id} key={key}/>)    
            })               
         harvesterList.unshift(<Picker.Item  key="" label="---New Harvester---" value='0' />) 

        const authPersonList = this.state.authPersonList.map((item, key) => {  
         return (<Picker.Item label={item.person_name } value={item.id} key={key}/>)    
            })               
         authPersonList.unshift(<Picker.Item  key="" label="---Order By---" value='0' />)  
    return (
       <ImageBackground source={require('./../../assets/Splash.png')} style={{flex:1}}>
          <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
          <View style={{alignItems:"center", marginTop:20}}> 
              <Image
                  style={{width: width*0.5, height: height*0.25}}
                  resizeMode="contain"
                  source={require('./../../assets/ic_launcher.png')}
                />  
              <View style={{width:"80%"}}>  
                <Text style={styles.compName}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
              </View> 

              <Text style={[styles.compName, {paddingTop:10}]}>Welcome Mr. {this.state.userData.displayName}</Text>  
            </View>
            <View style={{marginTop:15, paddingHorizontal:10}}>
              <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal(true)} style={styles.button}>
                    <Text style={styles.btnText}>RFID Change</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal1(true)} style={styles.button}>
                    <Text style={styles.btnText}>Cancel Token</Text>
                </TouchableOpacity> 
              </View>   

              <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal2(true)} style={styles.button}>
                    <Text style={styles.btnText}>Bypass Token</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal3(true)} style={styles.button}>
                    <Text style={styles.btnText}>Change Mode</Text>
                </TouchableOpacity>
               </View>

              <View style={{justifyContent:"space-between", flexDirection:"row"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal4(true)} style={styles.button}>
                    <Text style={styles.btnText}>Change Farmer</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal5(true)} style={styles.button}>
                    <Text style={styles.btnText}>Change Transporter</Text>
                </TouchableOpacity>
              </View>

                <TouchableOpacity activeOpacity={.5} onPress={() => this.toggleModal6(true)} style={[styles.button, {alignSelf:"center"}]}>
                    <Text style={styles.btnText}>Change Harvester</Text>
                </TouchableOpacity>
            </View>

             <View style={{alignItems:"center", marginTop:height*0.05}}>
                <Image
                  style={{width:width*0.5, height:height*0.1}}
                  resizeMode="contain"
                  source={require('./../../assets/logo.png')}
                />
             </View> 
            <Modal animationType = {"slide"} 
                   transparent = {true}
                    visible = {this.state.modalVisible}
                    onRequestClose = {() => {  global.EDPScreen.modalClose() } }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose()}} style={{}}>
                         <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>RFID Change</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                        style={styles.modalInputInner}
                        onChangeText={(codeNumber) => this.setState({codeNumber})}
                        value={this.state.codeNumber}
                        keyboardType='numeric'
                        returnKeyType="next"    
                        placeholder="Token No" 
                            //underlineColorAndroid='#000000'
                        /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()} style={styles.searchView}>
           
                          {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>
                  
                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>RFID</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].RF_NO.trim()}</Text>:null}
                     </View>
                    </View>
          

                    <View style={styles.modalInput}>
                      <TextInput
                              onChangeText={(rfid) => this.setState({rfid})}
                              value={this.state.rfid}
                              style={styles.modalText}
                              placeholder="New RFID"
                              />
                    </View>

                    <View style={styles.modalInput}>
                      <TextInput
                              onChangeText={(reason) => this.setState({reason})}
                              value={this.state.reason}
                              style={styles.modalText}
                              placeholder="Reason"
                              />
                    </View>
                    {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.updateRFID()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
                </View>
             </Modal>




             <Modal animationType = {"slide"} 
                    transparent = {true}
                    visible = {this.state.modalVisible1}
                    onRequestClose = {() => {  global.EDPScreen.modalClose()  } }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                         <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Lock Token</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                      style={styles.modalInputInner}
                      onChangeText={(codeNumber) => this.setState({codeNumber})}
                      value={this.state.codeNumber}
                      keyboardType='numeric'
                      returnKeyType="next"    
                      placeholder="Token No" 
                      /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
           
                          {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>


                    <View style={{marginTop:10}}>
                    <View style={{ borderWidth:1, borderRadius:5, borderColor:"#000000",}}>     
                     <Picker
                      selectedValue={this.state.authPersonId} 
                      placeholder="Order By"     
                      style={{ height: 40, width: '95%'}}
                      mode = 'dropdown'  
                      onValueChange={(itemValue, itemIndex) => this.setState({authPersonId:itemValue})}        
                      > 
                        {authPersonList}               
                       </Picker>                                
                   </View>
                  </View>  

                    <View style={styles.modalInput}>
                    <TextInput
                            onChangeText={(reason) => this.setState({reason})}
                            value={this.state.reason}
                            style={styles.modalText}
                            placeholder="Reason"
                            />
                    </View>
                  
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.tokenLock()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
                </View>
             </Modal>



             <Modal animationType = {"slide"} transparent = {true}
                visible = {this.state.modalVisible2}
                onRequestClose = {() => {global.EDPScreen.modalClose()} }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                          <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Bypass Token</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                        style={styles.modalInputInner}
                        onChangeText={(codeNumber) => this.setState({codeNumber})}
                        value={this.state.codeNumber}
                        keyboardType='numeric'
                        returnKeyType="next"    
                        placeholder="Token No" 
                      /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
                        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={{marginTop:10}}>
                    <View style={{ borderWidth:1, borderRadius:5, borderColor:"#000000",}}>     
                     <Picker
                        selectedValue={this.state.authPersonId}
                        placeholder="Order By"      
                        style={{ height: 40, width: '95%'}}
                        mode = 'dropdown'  
                        onValueChange={(itemValue, itemIndex) => this.setState({authPersonId:itemValue})}        
                        > 
                        {authPersonList}               
                       </Picker>                                
                   </View>
                  </View>  

                    <View style={styles.modalInput}>
                    <TextInput
                            onChangeText={(reason) => this.setState({reason})}
                            value={this.state.reason}
                            style={styles.modalText}
                            placeholder="Reason"
                            />
                    </View>
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.bypassToken()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
                </View>
             </Modal>



             <Modal animationType = {"slide"} 
                    transparent = {true}
                    visible = {this.state.modalVisible3}
                    onRequestClose = {() => {  global.EDPScreen.modalClose()  } }>
               
                <View  style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                         <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Change Mode</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                      style={styles.modalInputInner}
                      onChangeText={(codeNumber) => this.setState({codeNumber})}
                      value={this.state.codeNumber}
                      keyboardType='numeric'
                      returnKeyType="next"    
                      placeholder="Token No" 
                      /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
           
                          {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Mode</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].MODE_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                

                   
                    <View style={{marginTop:10}}>
                    <View style={{ borderWidth:1, borderRadius:5, borderColor:"#000000",}}>     
                     <Picker
                      selectedValue={this.state.mode}      
                      style={{ height: 40, width: '95%'}}
                      placeholder="New Mode"
                      mode = 'dropdown'  
                      onValueChange={(itemValue, itemIndex) => this.setState({mode:itemValue})}        
                      > 
                        {modeList}               
                       </Picker>                                
                   </View>
                  </View>    

                    <View style={styles.modalInput}>
                      <TextInput
                              onChangeText={(reason) => this.setState({reason})}
                              value={this.state.reason}
                              style={styles.modalText}
                              placeholder="Reason"
                              />
                    </View>
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.updateMode()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
                </View>
             </Modal>


             <Modal animationType = {"slide"} transparent = {true}
                visible = {this.state.modalVisible4}
                onRequestClose = {() => {  global.EDPScreen.modalClose()  } }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                         <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Change Farmer</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                        style={styles.modalInputInner}
                        onChangeText={(codeNumber) => this.setState({codeNumber})}
                        value={this.state.codeNumber}
                        keyboardType='numeric'
                        returnKeyType="next"    
                        placeholder="Token No" 
                      /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
           
                          {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                 
                    <View style={styles.modalView}>
                     <View style={{width:"40%"}}>
                      <Text style={styles.modalText}>Farmer Code</Text>
                     </View> 
                     <View style={{width:"60%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_CODE.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                   

                    <View style={styles.modalInput}>
                    <TextInput
                        onChangeText={(farmerCode) => this.setState({farmerCode})}
                        value={this.state.farmerCode}
                        style={styles.modalText}
                        placeholder="New Code"
                            />
                    </View>

                    <View style={styles.modalInput}>
                    <TextInput
                          onChangeText={(reason) => this.setState({reason})}
                          value={this.state.reason}
                          style={styles.modalText}
                          placeholder="Reason"
                            />
                    </View>
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.updateFarmer()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
                </View>
             </Modal>


             <Modal animationType = {"slide"} transparent = {true}
                visible = {this.state.modalVisible5}
                onRequestClose = {() => {  global.EDPScreen.modalClose()  } }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                        <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Change Transporter</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                        style={styles.modalInputInner}
                        onChangeText={(codeNumber) => this.setState({codeNumber})}
                        value={this.state.codeNumber}
                        keyboardType='numeric'
                        returnKeyType="next"    
                        placeholder="Token No" 
                      /> 
                    <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
         
                        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                        <Icon name="search" size={25}  />} 
                    </TouchableOpacity>
                    </View>

                   
                   <View style={styles.modalView}>
                     <View style={{width:"40%"}}>
                      <Text style={styles.modalText}>Farmer Code</Text>
                     </View> 
                     <View style={{width:"60%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_CODE.trim()}</Text>:null}
                     </View>
                    </View>
                  
                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                   <View style={styles.modalView}>
                     <View style={{width:"35%"}}>
                      <Text style={styles.modalText}>Transporter</Text>
                     </View> 
                     <View style={{width:"65%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].TR_Name.trim()}</Text>:null}
                     </View>
                    </View>

    
                   <View style={{marginTop:10}}>
                    <View style={{ borderWidth:1, borderRadius:5, borderColor:"#000000",}}>     
                     <Picker
                      selectedValue={this.state.transport}      
                      style={{ height: 40, width: '95%'}}
                      mode = 'dropdown'
                      placeholder="New Transporter"
                      onValueChange={(itemValue, itemIndex) => this.setState({transport:itemValue})}        
                      > 
                        {transporterList}               
                       </Picker>                                
                   </View>
                  </View> 

                      <View style={styles.modalInput}>
                      <TextInput
                              onChangeText={(reason) => this.setState({reason})}
                              value={this.state.reason}
                              style={styles.modalText}
                              placeholder="Reason"
                              />
                    </View>
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.updateTransporter()}  style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
               </View> 
             </Modal>

             <Modal animationType = {"slide"}
                    transparent = {true}
                    visible = {this.state.modalVisible6}
                    onRequestClose = {() => {  global.EDPScreen.modalClose()  } }>
               <View  style={styles.modal}>
                 <View style={styles.modalView1}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'90%', }}></View>
                        <TouchableHighlight onPress = {() => { global.EDPScreen.modalClose() }} style={{}}>
                          <Icon name="closecircleo" type="AntDesign" size={10}  />
                        </TouchableHighlight>

                    </View>
                   <Text style = {styles.text}>Change Harvester</Text>
                   <View style={styles.modalInnerView}>
                     <TextInput
                      style={styles.modalInputInner}
                      onChangeText={(codeNumber) => this.setState({codeNumber})}
                      value={this.state.codeNumber}
                      keyboardType='numeric'
                      returnKeyType="next"    
                      placeholder="Token No" 
                      /> 
                      <TouchableOpacity onPress={()=>this.getTokenDetailsToChange()}  style={styles.searchView}>
                        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
                          <Icon name="search" size={25}  />} 
                      </TouchableOpacity>
                    </View>

                     
                   <View style={styles.modalView}>
                     <View style={{width:"40%"}}>
                      <Text style={styles.modalText}>Farmer Code</Text>
                     </View> 
                     <View style={{width:"60%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_CODE.trim()}</Text>:null}
                     </View>
                    </View>

                   
                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Name</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].FARMER_NAME.trim()}</Text>:null}
                     </View>
                    </View>

                    <View style={styles.modalView}>
                     <View style={{width:"25%"}}>
                      <Text style={styles.modalText}>Village</Text>
                     </View> 
                     <View style={{width:"75%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].VILL_NAME.trim()}</Text>:null}
                     </View>
                    </View>


                   <View style={styles.modalView}>
                     <View style={{width:"30%"}}>
                      <Text style={styles.modalText}>Harvester</Text>
                     </View> 
                     <View style={{width:"70%"}}>
                      {(this.state.tokenData.length > 0)? 
                      <Text style={[styles.modalText, {textAlign:"right"}]}>{this.state.tokenData[0].HR_Name.trim()}</Text>:null}
                     </View>
                    </View>
               

                  <View style={{marginTop:10}}>
                    <View style={{ borderWidth:1, borderRadius:5, borderColor:"#000000",}}>     
                     <Picker
                      selectedValue={this.state.harvester}      
                      style={{ height: 40, width: '95%'}}
                      mode = 'dropdown'
                      placeholder="New Harvester" 
                      onValueChange={(itemValue, itemIndex) => this.setState({harvester:itemValue})}        
                      > 
                        {harvesterList}               
                       </Picker>                                
                   </View>
                  </View> 

                    <View style={styles.modalInput}>
                    <TextInput
                            onChangeText={(reason) => this.setState({reason})}
                            value={this.state.reason}
                            style={styles.modalText}
                            placeholder="Reason"
                            />
                    </View>
                   {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                   <TouchableHighlight onPress={()=>this.updateHarvester()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>}
                </View>
              </View>
             </Modal>
            </ScrollView>
              <TouchableOpacity  onPress={this.showMenu} style={{position:"absolute", right:10, top:(Platform.OS === "ios")?20:10}}>
                 <Menu 
                  ref={this.setMenuRef}
                  button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                                 style={{fontSize:25, color:'#000000'}}
                                 onPress={this.showMenu} /> 
                 }
                >
                  <MenuItem onPress={() => this.onLogOut()}>Log Out</MenuItem>
                </Menu>
             </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create ({
   compName: {
       fontSize:15, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center",
    },
   button: {
    elevation:8,  width:'48%', justifyContent:'center', alignItems:'center', backgroundColor:'#8db301', paddingVertical:15, borderRadius:25, marginTop:15
   },
   btnText:{
    fontSize:15, fontFamily: "Lato-Semibold", color:'#FFFFFF'
   },  
  modal: {
      flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'
    },
  modalView1:{
     width: '85%',backgroundColor:'#ffffff', borderRadius:10, justifyContent:'center', padding:15 
    },
    text: {
       color: '#000', fontSize:18, fontFamily: "Lato-Semibold", textAlign:'center', marginVertical:10
    },
    modalView:{
      flexDirection:'row',  marginTop:5
    },
    modalInnerView:{
      flexDirection:'row', borderWidth:1, borderColor:'#000', borderRadius:5
    },
    searchView:{
        padding:10,  alignItems:"center"
    },
    modalText:{
        fontSize:15, color:'#000', padding:5,fontFamily: "Lato-Semibold"
    },
    modalInput: {
        marginTop:10, borderBottomWidth:1, borderColor:'#000', borderRadius:5,
    },
    modalInputInner: {
        width:"82%", fontSize:15,  paddingLeft:10
    },
    updateBtn: {
      marginTop:10, backgroundColor:'#8db301', elevation:4, borderRadius:50, alignSelf:'center', padding:10, marginVertical:10, width:"50%", alignItems:"center"
    },
 })
