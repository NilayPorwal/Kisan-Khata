import React from 'react';
import base64 from 'react-native-base64'
import { AsyncStorage } from 'react-native';
import axios from 'axios';


export default class APIManager {  
    
  /** API Host URL for login */

              static host = 'http://192.168.1.117:8080/'
   //          static host = 'http://104.208.136.178:8080/'
   //            static host = 'http://erp.mspil.in:8080/'
   //          static host = "skydev.eastus2.cloudapp.azure.com:8080",                    
                                                                    
    static getAPI(){  
      AsyncStorage.getItem('api').then((value) => {APIManager.host = value}) 
     }  


     /**
      * get secret key
      */
     static onLogin(username, password, success, failure) {

       const credentials = 'anil' +':'+ '123456'
        const hash =  base64.encode(credentials)
        const Basic = 'Basic' + hash;
     //alert( APIManager.host + "erp-api-cane/public/ssoskyfin/login?username="+username+'&password='+password)
     axios.post( APIManager.host + "mspil-erp-api/public/ssoskyfin/login?username="+username+'&password='+base64.encode(password),  {
         headers: {
          'Authorization': "Basic " + base64.encode("anil:123456"),
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

     }
    
  /**             
   * get token data ssoskyfin/login
   */
  static getTokenData(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/caneboard/summary?searchDate='+date,  {
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

  /**            
   * get token data        
   */
  static getGraphData(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/caneboard/hrsummary?startDate='+date+'&endDate='+date,  {
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


 /**            
   * get token data        
   */
  static getGraphData(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/caneboard/hrsummary?startDate='+date+'&endDate='+date,  {
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

  /**            
   * get mode wise summary         
   */
  static getModeWiseSummary(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/mode/wise/summary?strtDate='+date+'&endDate='+date+'&shiftType=1',  {
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


  /**            
   * get live mode wise summary         
   */
  static getLiveModeWiseSummary(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/mode/wise/summary?strtDate='+date+'&endDate='+date+'&shiftType=1',  {
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
  
 /**            
   * get tare wise summary         
   */
  static getTareSummary(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/sso/tare/hrsummary?strtDate='+date+'&endDate='+date+'&shiftType=1',  {
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

   /**            
   * get zone wise summary         
   */
  static getZoneWiseSummary(date,  success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
  
  // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/ssotare/zonewise/summary?searchDate='+date,  {
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



   /**            
   * get zone wise summary         
   */
  static getDayWiseSummary(date, days, success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'public/ssomobile/login?username='+ username + '&password='+ password)
  fetch( APIManager.host + 'erp-api-cane/public/ssotare/daywise/summary?searchDate='+date+'&noDays='+days,  {
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



   /**
   * get village list
   */
  static getVillageList(success, failure) {

    const credentials = 'anil' +':'+ '123456'
     const hash =  base64.encode(credentials)
     const Basic = 'Basic' + hash;
 // alert( APIManager.host + 'erp-api-cane/v1/f/placemst/list')
  fetch( APIManager.host + 'erp-api-cane/v1/f/placemst/list',  {
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

     /**
     * get Payment Report
     */
    static getPaymentReport(pType, payAmount,date,villageCode,  success, failure) {

      const credentials = 'anil' +':'+ '123456'
       const hash =  base64.encode(credentials)
       const Basic = 'Basic' + hash;
   //alert(APIManager.host + 'erp-api-cane/v1/f/payout/schsum?paymentType='+pType+'&paymentFilterValue='+payAmount+'&transactionDate='+date+'&shiftType='+'1'+'&villageCode='+villageCode)
    fetch( APIManager.host + 'erp-api-cane/v1/f/payout/schsum?paymentType='+pType+'&paymentFilterValue='+payAmount+'&transactionDate='+date+'&shiftType='+'1'+'&villageCode='+villageCode, {
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

} 

