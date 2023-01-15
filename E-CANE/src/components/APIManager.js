import React from 'react';
import base64 from 'react-native-base64'
import { AsyncStorage, Platform } from 'react-native';
import axios from 'axios';
const utf8 = require('utf8');
import { encrypt, decrypt, decrypt1 } from "./AESEncryption"
import Storage from 'react-native-storage';
import Geolocation from '@react-native-community/geolocation';
import {StyleSheet, Alert} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';



   const storage = new Storage({
                storageBackend: AsyncStorage, 
                enableCache: true,
                defaultExpires: 1000 * 3600 * 24 * 7,
                sync: {
          
                }
              }); 

export default class APIManager { 

   static ssoId;
   static apiSeceretKey;
   static userId;
   static isDev = false;

   static host_suffix = "mspil-erp-api"

   //static host_suffix = "mspil-erp-pay-api"
   //static host_suffix = "mspil-erp-api-2020-21"


  static getCredentials(success){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));
      const tok = data.ssoId + ':' + data.apiSeceretKey;
      const encode = base64.encode(tok);
      const basic = 'Basic ' + encode;
      console.log("basic " + JSON.stringify(basic));
      success(basic)
    }
    else{ 
      success(null)
    }
  })
  }
    
  /** API Host URL for supervisor login */

    static host = 'http://192.168.1.117:8080/mspil-erp-api/'
    static tok =  "admin:123456";
    static hash = base64.encode(APIManager.tok);
    static Basic = 'Basic ' + APIManager.hash;  
   // static Basic ="Basic YWRtaW46MTIz"


     /** API Host URL for Survey login */

    static host1 = 'http://erp.mspil.in:8080/mspil-erp-api/'
    static tok1 =  'public:OPEN_API1234'; 
    static hash1 = base64.encode(APIManager.tok1);
    static Basic1 = 'Basic ' + APIManager.hash1;  
  //static Basic ="Basic cHVibGljOk9QRU5fQVBJMTIzNA=="

    /**
     * Get value for key
     */
    static getValueForKey(key, success, failure){
      try{    

         storage.load({
            key: key,
            autoSync: true,
            syncInBackground: true,
          })
          .then(data => {
            console.log("Data " + JSON.stringify(data));
            success(data) 
          })
          .catch(err => {
            failure(err) 
            console.log(err.message);
           
           });
        }
        catch (error){
            failure(err) 
            console.log("APIManager - Unable to retrieve value for key " + key +". ", JSON.stringify(error));
        }
    }

  static setValueForKey(key, value){
        try{    
            storage.save({
              key: key, // Note: Do not use underscore("_") in key!
              data: value
            });
       
        }
        catch (error){
            console.log("APIManager - Unable to set value for key " + key +". ", JSON.stringify(error));
        }
    }


  static removeValueForKey(){
        try{    
           storage.remove({
                key: 'farmerData'
              });
            storage.remove({
                key: 'fieldData'
              });
           storage.remove({
                key: 'screenType'
              });
           storage.remove({
                key: 'logData'
              }); 
       
        }
        catch (error){
            console.log("APIManager - Unable to remove value for key. ", JSON.stringify(error));
        }
    }

    static removeValuesForSurvey(){
        try{    
           storage.remove({
                key: 'farmerData'
              });
           
           storage.remove({
                key: 'fieldData'
              });
        }
        catch (error){
            console.log("APIManager - Unable to remove value for key. ", JSON.stringify(error));
        }
    }

  static locationEnabler(success, failure){
   if(Platform.OS == "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
         success(true);

      }).catch(err => {
          failure(false)
      });
   }else {
     success(true);
   }
    
 }



 static logOut(success, failure){

   // APIManager.removeValueForKey();

    APIManager.getValueForKey("userData", (userData) =>{
    APIManager.getValueForKey("logData", (logData) =>{   

      const data = {    
          "pUserLogUserName": userData.mobile,
          "pUserLogPassword":null,
          "pUserLogCounterKey":null,
          "pUserLogDevice": "mobile",
          "pUserLogDeviceId":null,
          "pUserLogLoginLocation":null,
          "puserloghashkey":logData[0].serverResponseId,
          "pUserLogIsSuccess":1
      } 
     console.log("Insert Log data:" + JSON.stringify(data));
    APIManager.insertLog(userData.ssoId, userData.apiSeceretKey, data, (response)=>{
      console.log("Insert Log on logout:" + JSON.stringify(response));
          if(response.data.status == "SUCCESS"){
              //response.data.data = JSON.parse(decrypt1(response.data.data.content));
              //console.log("Insert Log on logout:" + JSON.stringify(response.data.data));
              APIManager.removeValueForKey()
              //this.props.navigation.navigate("LoginScreen")
            }

         success(response.data)
       })
     })
   })
   
  }

  static getCurrentLocation(success, failure){
    Geolocation.getCurrentPosition(      
      (position) => {  
          const coords = { latitude: position.coords.latitude,
                           longitude: position.coords.longitude}
          success(coords)       
      },
      (error) => { failure(error)},
      { enableHighAccuracy: true, timeout: 20000},
    ); 
  }

   static getLocation(success, failure){
    Geolocation.getCurrentPosition(      
      (position) => {  
          const coords = { latitude: position.coords.latitude,
                           longitude: position.coords.longitude}
          success(coords)       
      },
      (error) => { failure(error)},
      { enableHighAccuracy: false, timeout: 20000},
    ); 
  } 
  
  static watchID: ?number = null;

  static watchPosition(success, failure){
    APIManager.stopLocationTracking();
    APIManager.watchID = Geolocation.watchPosition(      
      (position) => {  
          const coords = { latitude: position.coords.latitude,
                           longitude: position.coords.longitude}
          success(coords)       
      },
      (error) => { failure(error)},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    ); 
  } 

 static stopLocationTracking(){
     APIManager.watchID != null && Geolocation.clearWatch(APIManager.watchID);
  }  

  /** Get App configration Details of Public Parameters */
  static getPublicAppConfigList(success, failure) {

    var Authorization = {
      "Authorization": "Basic " + base64.encode("public" + ":" + "OPEN_API1234")
    }

    const encryptedData = {}
     axios.post(APIManager.host + 'sky-api/g1/p/80AF2645-C549-4EE1-A313-9A214CF366F3/get/app/vrsn/conf', encryptedData, {
        headers: Authorization
      })
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
          failure(error)     
      });

  }

  static setHost(){
    APIManager.getValueForKey('multiHost', (data)=>{
    if(data != null ){
      let host = data.split(",")
    for(let i=0; i<host.length; i++){
      let encryptedData = {}
      axios.post("http://" + host[i].trim()  + '/mspil-erp-api/sky-api/g1/p/4EA90071-835E-42E3-B568-ED43597F7D3C/server/ping', encryptedData, {
        headers: {
          "Authorization": "Basic " + base64.encode("public" + ":" + "OPEN_API1234")
        }
      })
     .then((responseJson)=> {
          console.log(host[i].trim(), JSON.stringify(responseJson));
          APIManager.setValueForKey('ipAddress', host[i].trim());
          return
      })  
      .catch((error)=> {
           console.log(JSON.stringify(error));     
      });
         
      }
    }
    },(error)=>{
         console.log("Multi Host" + JSON.stringify(error));
    })
  }


     /**
      * get secret key
      */
     static onLogin(username,password, ipAddress, success, failure) {

       const credentials = 'anil' +':'+ '123456'
        const hash =  base64.encode(credentials)
        const Basic = 'Basic' + hash;
     //alert( APIManager.host + "erp-api-cane/public/ssoskyfin/login?username="+username+'&password='+password)
     fetch( "http://" + ipAddress+ "/mspil-erp-api/public/ssoskyfin/login?username="+username+'&password='+base64.encode(password),  {
           method: 'POST',
         headers: {
          'Authorization': "Basic " + base64.encode("anil:123456"),
          'Content-Type': 'application/json',
         },
         })
       .then((response) => response.json())
         .then((responseJson)=> {
           try {
            // alert(JSON.stringify(responseJson));
             success(responseJson);
           } catch (error) {
             failure(error);
           }
         })
         .catch((error)=> {
           failure(JSON.stringify(error));
       //alert(JSON.stringify(error));
         });

     }
  
  static onLoginWithMobile(mobileNumber, success, failure) {
  
    const data = {    
      "mobile": mobileNumber.trim()           
    } 

    const encryptedData = {
      "content": encrypt(JSON.stringify(data)) 
    }
    APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    //alert("http://"+ipAddress+"/mspil-erp-api/public/ssomobile/otp/login")
     axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/public/ssomobile/otp/login", encryptedData, {
         headers : {'Content-Type':'application/json'}     
      })   
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
          failure(error)
          console.log("Login Failed:",  JSON.stringify(error));
      
      });
     }); 
   }


  static onSignupWithMobile(mobileNumber, success, failure) {
  
    const data = {    
      "psearch": mobileNumber.trim()           
    } 

    const encryptedData = {
      "content": encrypt(JSON.stringify(data)) 
    }
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 

    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/public/ssomobile/otp/register", encryptedData, {
         headers : {'Content-Type':'application/json'}     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })
      .catch((error)=> {
         failure(error);
         console.log("Sign Up failed:",  JSON.stringify(error));
         
      });
     }); 
   }

  
  static validateOTP(data, success, failure) {
  

    const encryptedData = {
      "content": encrypt(JSON.stringify(data)) 
    }
  
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/public/sso/otp/validation", encryptedData, {
         headers : {'Content-Type':'application/json'}     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   }

  static checkForOTP(mobileNumber, success, failure) {
  
   const data = {    
      "pOtpFor": mobileNumber.trim()           
    } 

    const encryptedData = {
      "content": encrypt(JSON.stringify(data)) 
    }
  
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/100E82D8-2F13-44E8-92D9-53BD6F7F4376/chk/otp", encryptedData, {
         headers : {'Content-Type':'application/json',
                    "Authorization": "Basic " + base64.encode("public" + ":" + "OPEN_API1234")}     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   }

   static insertLog(ssoId, apiSeceretKey, data, success, failure) {
  
   console.log(JSON.stringify(data), ssoId, apiSeceretKey);

    const encryptedData = {
      "content": encrypt(JSON.stringify(data))
    }

      const tok = ssoId + ':' + apiSeceretKey;
      const encode = base64.encode(tok);
      const basic = 'Basic ' + encode;
  
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/47090E7E-7430-4D9C-9F48-543AE8F0A7CB/gt/login/log/insrt", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json'}     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   }

 /**
   get Farmer multiple acoounts token details on FarmerMainScreen
 **/
static getFarmerTokenDetails(success, failure) {
  
  APIManager.getValueForKey("userData", (value) =>{ 
 
    const data = {
        "pmobileno": value.mobile
      }


   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

      console.log(JSON.stringify(encryptedData));
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/8EE6380B-F853-4B35-8955-034A12ED2D72/frmr/dtls/fr/mb", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
 }) 
}

/**
   GET_FARMER_TARE_DETAILS
 **/
static getFarmerTareDetails(data, success, failure) {
  

 

   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

      console.log(JSON.stringify(encryptedData));
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/DFB037E2-0F4A-4590-B257-69802C211003/gt/frmr/tr/d/fr/ap", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });
   })
 }) 
}

/**
   GET_ALL_TARE_SUMMARY_OF_FARMER_FOR_APP
 **/
static getFarmerTotalTareDetails(data, success, failure) {
 

   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

      console.log(JSON.stringify(encryptedData));
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/A52E2771-2B4C-48DC-A861-FC2FDBC67E64/gt/all/tr/smry/fr/ap", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

   })
 }) 
}

  
  static getVehiclesDetails(success, failure) {
  
    
   const data = {} 

   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/86A3B623-ADEB-4299-B154-3A0A05BC4123/gt/cnt/tkn/grs/vrfd", data, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
         // responseJson.data.data = JSON.parse(decrypt1(responseJson.data.data.content));
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


  static lastVehicleVerified(success, failure) {
  
    
   const data = {} 

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/E5DE4377-2A32-4078-A201-1733C0BFDA89/gt/lst/vcl/vrfd/dtls", data, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

  static getTokenDetailsToChange(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/ADD7E902-EB9F-4D25-BC8B-197F0A97700A/gt/dtls/fr/mob/by/tkn", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


   static getTokenDetails(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/CBE51B41-0BD8-4AB2-9C9F-EFCA24958DB2/gt/grs/gtls/cn/mng", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

  static updateTokenDetails(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/5C84490B-D50F-44AE-A344-947C6D916315/updt/tkn/by/mng", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

   static updateRFID(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/8789757B-3085-4826-BD83-34C51815BB19/updt/tkn/rf/frm/mob", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

    static updateMode(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/8BF983C4-9635-45BE-87ED-9A5058C76056/updt/md/of/tkn", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

   static updateFarmer(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/D7E7AA5C-F374-4170-9010-40034135FBA0/updt/frmr/of/tkn/mb", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

 static updateHarvester(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/AF32B811-876A-4457-B158-643E249E2A6C/updt/hrv/tkn/by/mb", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
          console.log(JSON.stringify(error));
      });

     }) 
   })
   }

    static updateTransporter(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/19F7E6B7-6A3B-4292-89DF-443769D0DC68/updt/trns/tkn/by/mob", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

    static tokenLock(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/7563AE72-FAB6-42B1-A28A-3E774B88C3C0/updt/tkn/lck/by/mob", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

  static bypassToken(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data))
      }
  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/388D733A-D767-450C-8ED1-8A89BF16377D/updt/tkn/ps/by/mb", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }
      })  
      .catch((error)=> {
         failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


 /**
   get Farmer details on survey screen
 **/
  static getFarmerDetails(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/92372C30-437E-4D11-94F1-24C5AF7DDA77/gt/frmr/info/srvy", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(error);
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

 /**
   Check if survey is already done
 **/
  static checkForSurvey(data, success, failure) {
  
    
     const encryptedData = {
          "content": encrypt(JSON.stringify(data)) 
        }

    
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
      axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/4B825029-A76B-4BD7-8092-0C0E185AB0A2/chk/frmr/exst/in/srvy", encryptedData, {
           headers : {'Authorization':basic,
                      'Content-Type':'application/json' }     
        })    
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          console.log(JSON.stringify(error));
        });

       }) 
     })
   }

  /**
   get Farmer details on survey screen
 **/
  static getFarmerCaneDetails(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/F3D68B03-B302-4D47-A653-497B3D6087A3/gt/srvy/dtls/fc", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


 /**
   Submit Surver Details on FieldMeasurementScreen
 **/
  static onSubmitSurvey(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/1D695496-1183-4FB0-BCFB-F46E01734AFC/inst/srvy/dtls", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


/**
   Upload images on survey
 **/
  static uploadImages(formData, success, failure) {
  
    
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    fetch( "http://"+ipAddress+'/'+APIManager.host_suffix+"/mspil-erp-api/v1/sinv/mflupld",  {
        method: 'POST', 
          headers: { 
          'Authorization': basic,  
          'Content-Type': 'multipart/form-data'
          },
          body: formData     
        })
     .then((response) => response.json())   
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        alert("Error in Image Upload : " + JSON.stringify(error.message));
      });

     }) 
   })
   }
 
/**
   get bank list
 **/
  static getBanksList(success, failure) {
  
   APIManager.getCredentials((basic)=>{
    console.log(JSON.stringify(basic));
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{
     fetch( "http://"+ipAddress+'/'+APIManager.host_suffix+"/v1/sf/bank/lst",  {
        method: 'POST',
        headers: { 
        'Authorization': basic,
        'Content-Type': 'application/json',
        },
      })  
       .then((response) => response.json())
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
           failure(error);
           console.log("Error in getiing bank list : " + JSON.stringify(error.message));
        });

       }) 
     })
   }

 /**
   Submit Farmer Details on FarmerDetails Screen
 **/
  static updateFarmerDetails(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/4CA5D6CF-32E3-420C-AF50-F818EE58E6FA/inst/bk/dtls/fm", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }


 /**
   Send Survyer location
 **/
  static sendSurveyerLocation(data, success, failure) {
  
    
   const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

  
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/7666701D-2A61-4D8D-8570-79A91A9338FE/srvyr/geo/lctn/add", encryptedData, {
         headers : {'Authorization':basic,
                    'Content-Type':'application/json' }     
      })    
     .then((responseJson)=> {
      console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        console.log(JSON.stringify(error));
      });

     }) 
   })
   }

  /**
   get mode list
 **/
  static getModeList(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/EC591C71-CF66-44E2-89F8-1AAB12CD77FE/mode/lst", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
           failure(error);
           console.log("Error in getiing Mode list : " + JSON.stringify(error.message));
        });

       }) 
     })
   }

     /**
   get transporter list
 **/
  static getTranportList(success, failure) {
    const data = {
      "pIsActive": 0,
      "pAcCounterId": 0
    }
    const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/3E61C1EA-0C1D-47D2-B9C8-D992506BFE5F/gt/trnsprter/dtls", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
           failure(error);
           //console.log("Error in getiing Mode list : " + JSON.stringify(error.message));
        });

       }) 
     })
   }

        /**
   get harvester list
 **/
  static getharvesterList(success, failure) {
    const data = {
      "pAcCounterId": 0
    }
    const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/CD4C187D-BCCD-4239-B567-C30EDE544703/harv/lst", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
           failure(error);
          // console.log("Error in getiing Mode list : " + JSON.stringify(error.message));
        });

       }) 
     })
   }

 /**
   get variety list
 **/
  static getVarietyList(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/BB921EAA-3335-4993-9DE0-B0B353B52012/var/lst", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
           console.log("Error in getiing Mode list : " + JSON.stringify(error.message));
        });

       }) 
     })
   }



 /**
   GET_DETAILS_FOR_DASHBOARD_CARDS
 **/
  static getDashboardData(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/C26A5437-0C50-419D-92D6-4B413D8DA524/gt/dtld/fr/crd", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

  /**
   GET_TOP_3_SURVEY_PERFORMANCE_API
 **/
  static getTopSurveyPerfm(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/304E7129-C1BE-4CA7-B16F-1CC61E688135/gt/tp/prfnce", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }
  

    /**
   GET_AREA_GRAPH_DETAILS
 **/
  static getAreaCoveredStats(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/5A6B58B8-347C-4FEA-B481-D63AA5E3F144/gt/area/grp/dtls", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }


 /**
   GET_SURVEYOR_STATICS
 **/
  static getSurveyorStats(success, failure) {
   const data = {} 
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/9A695BBA-397B-4FF1-900A-5E4C7967DF5D/gt/srvyr/sttics", data, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

/**
   GET_CAN_ARRIVAL_CHART_DETAILS
 **/
  static getCaneArival(data,success, failure) {
    const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/0F6BAADE-FC25-4C4D-B45F-A0074836DD4D/gt/cn/arival/dtls", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

   /**
   VILLAGE_WISE_INDENT_CHART_DETAILS
 **/
  static getVillageWiseIndenting(data,success, failure) {
    const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/5256D7C1-0A4F-405D-BDC3-EEBA5C84BCC5/gt/ct/dtls/vlg/wis/indnt", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

  /**
   AVERAGE_TIME_GRAPH_DETAILS
 **/
  static getAverageTime(success, failure) {
    const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/E3749DCB-1A5A-4E38-810F-B3802023A301/avg/tm/grp", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }


  /**
   GET_INDENT_CHART_DATA
 **/
  static getIndentChartData(data,success, failure) {
        const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/7B70ACF0-4796-44FF-A37E-652E1565729C/gt/indnt/chrt/data", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

 /**
   GET_DELYAED_VEHICLE_COUNT
 **/
  static getDelayedVehicleCount(success, failure) {
   const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/1E65FEB2-B267-4B78-8DDB-E2A822C45109/gt/dlyd/vcl/cnt", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

 /**
   GET_DELAYED_VEHICLE_DETAILS_IN_YARD
 **/
  static getDelayedVehicleInYard(success, failure) {
   const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/8924767B-D553-4BE7-A19B-8287F45B5413/gt/dlyd/vcl/dtls", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });

       }) 
     })
   }

   /**            
   * get tare wise summary         
   */
  static getTareSummary(date,  success, failure) {

   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
  fetch( "http://"+ipAddress+'/'+APIManager.host_suffix+'/public/sso/tare/hrsummary?strtDate='+date+'&endDate='+date+'&shiftType=1',  {
        method: 'POST',    
      headers: {  
       'Authorization': basic,   
       'Content-Type': 'application/json',     
      }, 
      })      
    .then((response) => response.json()) 
      .then((responseJson)=> {
        try {
          success(responseJson);
        } catch (error) {
          failure(error);
        }      
      })  
      .catch((error)=> {
        failure(JSON.stringify(error));
      });
    })
   })
  }

    /**            
   * GET_YARD_BALANCE_FOR_DASHBOARD        
   */
  static getYardBalance(success, failure) {
   const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
      axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/E94A1512-B3BE-415F-A4CB-BBB51A683232/gt/yrdblnc/dshbrd", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });
    })
   })
  }

  /**            
   * GET_TOTAL_BURNTCANE_WEIGHT     
   */
  static getBurnCaneWeight(success, failure) {
   const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
      axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/DBBA84BA-BA5C-48CB-AB99-10418DD835EA/gt/totl/brntcn/wt", encryptedData, {
             headers : {'Authorization': basic,
                        'Content-Type':'application/json'} 
      })
       .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error);
          }      
        })  
        .catch((error)=> {
          failure(error);
        });
    })
   })
  }

    /**            
   * get mode wise summary     
   */
  static getModeWiseSummary(date, success, failure) {
    const encryptedData = {}
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
  axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/public/sso/mode/wise/summary?strtDate=2019-10-07&endDate=2019-10-07&shiftType=1", encryptedData, {   
      headers: { 
       'Authorization': basic,   
       'Content-Type': 'application/json',     
      }
      })
      .then((responseJson)=> {
        try {
          success(responseJson);
        } catch (error) {
          failure(error); 
        }      
      })  
      .catch((error)=> {
        failure(JSON.stringify(error));
      });
       })
   })
 
  }

    /**            
   * get live mode wise summary         
   */
  static getLiveModeWiseSummary(date,  success, failure) {
    const encryptedData = {}
  APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
  axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+'/public/sso/mode/wise/summary?strtDate='+date+'&endDate='+date+'&shiftType=1', encryptedData, {   
      headers: {  
       'Authorization': basic,   
       'Content-Type': 'application/json',     
      },
      })
      .then((responseJson)=> {
        try {
         // alert(JSON.stringify(responseJson));
          success(responseJson);
        } catch (error) {
          failure(error); 
        }      
      })  
      .catch((error)=> {
        failure(JSON.stringify(error));
    //alert(JSON.stringify(error));
      });
       })
   })
 
  }

  /**            
   * get tare wise summary         
   */
  static getTareSummary(date,  success, failure) {
    const encryptedData = {}
     APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
  axios.post( "http://"+ipAddress+'/'+APIManager.host_suffix+'/sso/tare/hrsummary?strtDate='+date+'&endDate='+date+'&shiftType=1',encryptedData,  {   
      headers: {  
       'Authorization': basic,   
       'Content-Type': 'application/json',     
      },
      })
      .then((responseJson)=> {
        try {
         // alert(JSON.stringify(responseJson));
          success(responseJson);
        } catch (error) {
          failure(error); 
        }      
      })  
      .catch((error)=> {
        failure(JSON.stringify(error));
    //alert(JSON.stringify(error));
      });
       })
   })
 }


   /**            
   * get zone wise summary         
   */
  static getZoneWiseSummary(date,  success, failure) {
    const encryptedData = {}
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    
    axios.post( "http://"+ipAddress+'/'+APIManager.host_suffix+'/public/ssotare/zonewise/summary?searchDate='+date, encryptedData,  {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        },
        })
        .then((responseJson)=> {
          try {
           // alert(JSON.stringify(responseJson));
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
      //alert(JSON.stringify(error));
        });
         })
     })

  }

   /**            
   * get zone wise summary         
   */
  static getDayWiseSummary(date,days,  success, failure) {
     const encryptedData = {}
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    axios.post( "http://"+ipAddress+'/'+APIManager.host_suffix+'/public/ssotare/daywise/summary?searchDate='+date+'&noDays='+days, encryptedData,  {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        },
        })
        .then((responseJson)=> {
          try {
           // alert(JSON.stringify(responseJson));
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
      //alert(JSON.stringify(error));
        });
         })
     })

  }

   /**            
   * get zone wise summary         
   */
  static getVillageList(success, failure) {
      const encryptedData = {}
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    axios.post( "http://"+ipAddress+'/'+APIManager.host_suffix+'/v1/f/placemst/list', encryptedData, {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        },
        })
        .then((responseJson)=> {
          try {
           // alert(JSON.stringify(responseJson));
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
      //alert(JSON.stringify(error));
        });
         })
     })

  }

    /**
     * get Payment Report
     */
    static getPaymentReport(pType, payAmount, date, villageCode, success, failure) {
      const encryptedData = {}
    APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/v1/f/payout/schsum?paymentType="+pType+'&paymentFilterValue='+payAmount+'&transactionDate='+date+'&shiftType='+'1'+'&villageCode='+villageCode, encryptedData,  {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        },
        })
        .then((responseJson)=> {
          try {
           // alert(JSON.stringify(responseJson));
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
          //alert(JSON.stringify(error));
        });
         })
     })
   }

      /**
     * get Auth Person List
     */
    static getAuthPersonList(success, failure) {
     const data = {
      "pCameraUrl": "AUTHORIZED_PERSON_LIST"
    };
     
     const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }
    
    APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/6023CD9F-C754-40CD-8A42-0172D167F381/get/camera/config",encryptedData,  {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        },
        })
        .then((responseJson)=> {
          try {
           // alert(JSON.stringify(responseJson));
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
          //alert(JSON.stringify(error));
        });
         })
     })
   }

    /**
      * get secret key
      */
     static onLoginForPayment(username, password, success, failure) {

       const credentials = 'anil' +':'+ '123456'
        const hash =  base64.encode(credentials)
        const Basic = 'Basic' + hash;
     //alert( APIManager.host + "erp-api-cane/public/ssoskyfin/login?username="+username+'&password='+password)
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
     axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/public/ssoskyfin/login?username="+username+'&password='+base64.encode(password),  {
         headers: {
          'Authorization': basic,
          'Content-Type': 'application/json',
         },
         })
         .then((responseJson)=> {
           try {
            // alert(JSON.stringify(responseJson));
             success(responseJson);
           } catch (error) {
             failure(error);
           }
         })
         .catch((error)=> {
           failure(JSON.stringify(error));
       //alert(JSON.stringify(error));
         });
         })
      })
     }

       /**            
   * get notification        
   */
  static getNotification(data, success, failure) {
       const encryptedData = {
        "content": encrypt(JSON.stringify(data)) 
      }

     console.log(JSON.stringify(encryptedData))
     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
     //alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/725C6F6B-CE42-4827-A2CE-AAE3904A4D13/gt/psh/msg') 
     axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/725C6F6B-CE42-4827-A2CE-AAE3904A4D13/gt/psh/msg", encryptedData, {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        }, 
        })
        .then((responseJson)=> {
          try {
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(JSON.stringify(error));
      //alert(JSON.stringify(error));
        });
         })
     })

  }

  static getIpAddress(success, failure) {

       axios.post( "http://erp.mspil.in:8080/skyroute/api/skycane/mspil",   {
         headers: {
          'Content-Type': 'application/json',
         },
         })
         .then((responseJson)=> {
           try {
            // alert(JSON.stringify(responseJson));
             success(responseJson);
           } catch (error) {
             failure(error);
           }
         })
         .catch((error)=> {
           failure(JSON.stringify(error));
         });

     }

    static getLastTokenGrossData(success, failure) {
      const encryptedData = { }

     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    // alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
     axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/DB0288F9-D361-47FB-A8C1-840686C33327/insert/reqbyapp/data", encryptedData, {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        }, 
        })
        .then((responseJson)=> {
            console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(error);
        });
         })
     })

  }

  static getLastTokenActivity(success, failure) {
      const encryptedData = { }

     APIManager.getCredentials((basic)=>{
     APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
    // alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
     axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/F6F4945A-F8CF-48D8-9849-979C99D882C5/cuntr/actvity/rpt", encryptedData, {   
        headers: {  
         'Authorization': basic,   
         'Content-Type': 'application/json',     
        }, 
        })
        .then((responseJson)=> {
            console.log(JSON.stringify(responseJson));
          try {
            success(responseJson);
          } catch (error) {
            failure(error); 
          }      
        })  
        .catch((error)=> {
          failure(error);
        });
         })
     })

  }

  static getRequestType(success, failure) {
    const encryptedData = { }

   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
  // alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
   axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/8C891CFA-C5F1-43C4-A0EC-A46320C87AF0/get/requesttype/data", encryptedData, {   
      headers: {  
       'Authorization': basic,   
       'Content-Type': 'application/json',     
      }, 
      })
      .then((responseJson)=> {
          console.log(JSON.stringify(responseJson));
        try {
          success(responseJson);
        } catch (error) {
          failure(error); 
        }      
      })  
      .catch((error)=> {
        failure(error);
      });
       })
   })

}

static _onRequest(data, success, failure) {
  const encryptedData = {
    "content": encrypt(JSON.stringify(data)) 
  }

 APIManager.getCredentials((basic)=>{
 APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
// alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
 axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/DB0288F9-D361-47FB-A8C1-840686C33327/insert/reqbyapp/data", encryptedData, {   
    headers: {  
     'Authorization': basic,   
     'Content-Type': 'application/json',     
    }, 
    })
    .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
      try {
        success(responseJson);
      } catch (error) {
        failure(error); 
      }      
    })  
    .catch((error)=> {
      failure(error);
    });
     })
 })

}

static getRequestReport(data, success, failure) {
  const encryptedData = {
    "content": encrypt(JSON.stringify(data)) 
  }

 APIManager.getCredentials((basic)=>{
 APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
// alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
 axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/CBD0BA6D-0693-4808-9774-D2381715499B/get/reqbyfarmerapp/data", encryptedData, {   
    headers: {  
     'Authorization': basic,   
     'Content-Type': 'application/json',     
    }, 
    })
    .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
      try {
        success(responseJson);
      } catch (error) {
        failure(error); 
      }      
    })  
    .catch((error)=> {
      failure(error);
    });
     })
 })

}

static getRequestReportByDate(data, success, failure) {
  const encryptedData = {
    "content": encrypt(JSON.stringify(data)) 
  }

 APIManager.getCredentials((basic)=>{
 APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
// alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
 axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/DCB36B7A-CD91-444A-BE46-29F425E3713D/get/rqfrmrpt/data", encryptedData, {   
    headers: {  
     'Authorization': basic,   
     'Content-Type': 'application/json',     
    }, 
    })
    .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
      try {
        success(responseJson);
      } catch (error) {
        failure(error); 
      }      
    })  
    .catch((error)=> {
      failure(error);
    });
     })
 })

}

static cancelRequest(data, success, failure) {
  const encryptedData = {
    "content": encrypt(JSON.stringify(data)) 
  }

 APIManager.getCredentials((basic)=>{
 APIManager.getValueForKey("ipAddress", (ipAddress) =>{  
// alert("http://"+ipAddress+ '/mspil-erp-api/sky-api/g1/p/E1B59EB0-1938-4154-88ED-CFC4A8426598/gt/cntr/rpt') 
 axios.post("http://"+ipAddress+'/'+APIManager.host_suffix+"/sky-api/g1/p/9ABE6D14-1DBE-4A11-9B3B-48D2A01CBDEF/get/reqcancelbyapp/updt", encryptedData, {   
    headers: {  
     'Authorization': basic,   
     'Content-Type': 'application/json',     
    }, 
    })
    .then((responseJson)=> {
        console.log(JSON.stringify(responseJson));
      try {
        success(responseJson);
      } catch (error) {
        failure(error); 
      }      
    })  
    .catch((error)=> {
      failure(error);
    });
     })
 })

}


}

