import React, {Component} from 'react';
import {StyleSheet, SafeAreaView,NetInfo, Text, View, TouchableOpacity, TextInput, Dimensions, Button,
        ScrollView, CheckBox, Image, DatePickerAndroid, BackHandler, PermissionsAndroid, 
        Modal,ActivityIndicator, AsyncStorage, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { Icon } from 'native-base';
import axios from 'axios';
var base64 = require('base-64');  
import { encrypt, decrypt } from "./../AESEncryption"
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import APIManager from './../APIManager';
import I18n, { getLanguages } from 'react-native-i18n';
import { Picker} from 'native-base';


   
const buttonColor = "#8db301"
  

global.KissanDetails;   
export default class KissanDetails extends Component {
	
	
    constructor(props) {   
    super(props);     
    this.state = {
		  loggedInID:null,		

			date: new Date(),
			
			codeNumber:null,  
			mobNumber:null,      
			name:null,      
			fatherName:null,     
			village:null,   
			ploteNumber:null,  
      farmerAddress:" ",
      villageCode:null,

			aadharNumber:null,
			khataNumber:null,
			ifsc:null,
			khataName:null,
			sonOf:null,
			bankName:null,
      bankAddress:null,
      bankList:[],

      avatarSource:'', 
			plotImages:[],
			suppFiles:[],      
		  aadharFront:'',
      aadharBack:'',
      bankPassbook:'',	
      acmBnkDetaiId:null,
      bankAiId:"0",
 		  isLoading:false,
      validFarmerCode:false,
      caneData:[], 
      ipAddress:"erp.mspil.in:8080",
        	  
	};                
		global.KissanDetails = this;	    
  }    

   static navigationOptions =  ({ navigation }) => { return {
 
    header:null  
   }        
  };  

  componentDidMount(){
     this.getBanksList()
  }   
     
 
 getFarmerDetails(){
     Keyboard.dismiss();
     
      this.setState({ mobNumber:null, mobNumber1:null, name:null, fatherName:null, village:null,  
                      ploteNumber:null,  farmerAddress:" ", villageCode:null,aadharNumber:null, 
                      khataNumber:null, ifsc:null, khataName:null,bankName:null,bankAddress:null,
                      khataNumber1:null, ifsc1:null, khataName1:null, bankName1:null, bankAddress1:null,
                      isLoading:true, validFarmerCode:false, bankAiId:0, caneData:[]  })
 
     
     const data = {  
      "pFarmerCode": this.state.codeNumber           
     } 

  APIManager.getFarmerDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Details: " + JSON.stringify(response.data));
          this.getCaneType(this.state.codeNumber);
          this.setState({name: response.data.data[0].account_name, 
                         village:response.data.data[0].village_name, 
                         mobNumber1:response.data.data[0].G_MobileNo,
                         aadharNumber1:response.data.data[0].farmer_aadhaar_no,
                         khataNumber1:response.data.data[0].bank_acc_no,
                         khataName1:response.data.data[0].BankAccountHolderName,
                         ifsc1:response.data.data[0].bank_ifsc,    
                         fatherName:response.data.data[0].G_FatherName,
                         bankName1:response.data.data[0].bank_name,
                         bankAddress1:response.data.data[0].bank_branch_address,
                         acmBnkDetaiId:response.data.data[0].acm_bnk_det_ai_id,
                         bankAiId:(response.data.data[0].bank_ai_id == null)?0:response.data.data[0].bank_ai_id,
                         bankAiId1:(response.data.data[0].bank_ai_id == null)?0:response.data.data[0].bank_ai_id,
                         farmerAddress:response.data.data[0].farmer_address,
                         villageCode:response.data.data[0].village_code,
                         isLoading:false,
                         validFarmerCode:true      
                        })   
  
        } else {
          this.setState({isLoading:false})
          Alert.alert("Error", "Invalid farmer code")                   
          console.log('error', response);   
        }  
        
   }, (error)=>{
        this.setState({isLoading:false})
        console.log('error', JSON.stringify(error));   
   })
 }

 

 getCaneType() {
    
    const data = {   
      "pFarmerCode": this.state.codeNumber           
    } 
    const encryptedData = {
      "content": encrypt(JSON.stringify(data)) 
    }   
    console.log("encryptedData :" + encryptedData);  
    
   
   APIManager.getCredentials((basic)=>{
   APIManager.getValueForKey("ipAddress", (ipAddress) =>{ 
    axios.post("http://"+ipAddress+"/mspil-erp-api/sky-api/g1/p/F3D68B03-B302-4D47-A653-497B3D6087A3/gt/srvy/dtls/fc", encryptedData, {
         headers : {'Authorization':APIManager.Basic1,
                 'Content-Type':'application/json'}     
      }) 
      .then((response) => {
        console.log(JSON.stringify(response));    
      if (response.data.status === "SUCCESS") {
          console.log("inside rfid data:" + JSON.stringify(response.data));
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("fffffffffffh :" + JSON.stringify(response.data));
           this.setState({caneData:response.data.data})
       
          //result.success = true;           
        } else {                  
          console.log('Cane Type Error ', response);   
           this.setState({isLoading:false})
         //  alert("Incorrect Farmer Code")

        } 
         
      })      
      .catch((err) => {
         this.setState({isLoading:false})
        console.log(JSON.stringify(err))
      });
     })
    });  
      
  }  

  getBanksList(){

   APIManager.getBanksList((response)=>{
      console.log(JSON.stringify(response));
      if (response.status === "SUCCESS") {
        this.setState({bankList:response.data, loading: false});
       }
    }, 
    (error)=> {
        console.log("Error in getiing bank list : " + JSON.stringify(error.message));
    })
  };
  
  onBankChange(value, index){
   
    if(this.state.bankList.length > 0) {
        const result = this.state.bankList.filter(item => item.acBankAiId == value);
       //const bankName = this.state.bankList[index].acBankName:this.state.bankList[index-1].acBankName

       this.setState({bankAiId:value, bankName:result[0].acBankName});
    }
  }

onUpdatePress(){
 if(this.state.validFarmerCode == true){
    Alert.alert(
       I18n.t("Upload Confirmation"),
       I18n.t('You want to Submit data ?'),
        [
          { 
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => this.updateFarmerDetails()},
        ],
        {cancelable: false},
      );
   }
   else {
      Alert.alert("Please Check !!", "Farmer code is incorrect")
    }
}  

updateFarmerDetails(){

    let data = {
               "pAcmBnkDetAiId" : (this.state.acmBnkDetaiId == null)?0:this.state.acmBnkDetaiId,
               "pFarmerCode":this.state.codeNumber,
               "pfarmerName":this.state.name,
               "pFarmerFatherName":this.state.fatherName,
               "pFarmerBankAccName": (this.state.khataName1 == null || this.state.khataName1 == 0 )?this.state.khataName:this.state.khataName1,
               "pFarmerAddress":(this.state.farmerAddress == null || this.state.farmerAddress == 0 )?" ":this.state.farmerAddress,
               "pBankAccNo" : (this.state.khataNumber1 == null || this.state.khataNumber1 == 0 )?this.state.khataNumber:this.state.khataNumber1,
               "pbankAiId" : this.state.bankAiId,
               "pBankName" : (this.state.bankName1 == null || this.state.bankName1 == 0 )?this.state.bankName:this.state.bankName1,  
               "pBankIfsc" :  (this.state.ifsc1 == null || this.state.ifsc1 == 0 )?this.state.ifsc:this.state.ifsc1,
               "pBankBranchAddress" : (this.state.bankAddress1 == null || this.state.bankAddress1 == 0 )?this.state.bankAddress:this.state.bankAddress1,
               "pFarmerAadhaarNo" : (this.state.aadharNumber1 == null || this.state.aadharNumber1 == "null" || this.state.aadharNumber1 === 0 )?this.state.aadharNumber:this.state.aadharNumber1,
               "pVillageCode":this.state.villageCode,
               "pVillageName":this.state.village,
               "pCreatedBy":1, 
               "pmbcreatedBy":this.state.loggedInID,
               "pmobileno": (this.state.mobNumber1 == null || this.state.mobNumber1 == 0 )?this.state.mobNumber:this.state.mobNumber1 
           }
   
   console.log(JSON.stringify(data))

    APIManager.updateFarmerDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("On update farmer details: " + JSON.stringify(response.data));

              Alert.alert(I18n.t("Uploaded Successfully")); 
             this.setState({isLoading:false, codeNumber:null, mobNumber:null, mobNumber1:null, name:null, fatherName:null, village:null,  
                            ploteNumber:null,  farmerAddress:" ", villageCode:null,aadharNumber:null, khataNumber:null, ifsc:null, 
                            khataName:null,bankName:null,bankAddress:null, khataNumber1:null, ifsc1:null, khataName1:null, bankName1:null, 
                            bankAddress1:null, validFarmerCode:false, bankAiId:0, caneData:[]})             
          
        }                     
            
       else {                  
           Alert.alert('Upload Failed !!', response.data.message); 
           this.setState({isLoading:false})  
        }  
         
    })
    
 }    
    

	                                     
   render(){
       const bankList = this.state.bankList.map((item, key) => {  
     return (<Picker.Item label={item.acBankName} value={item.acBankAiId} key={key}/>)    
            })               
         bankList.unshift(<Picker.Item  key="" label="---Select bank---" value='0' />)   
                  
	 return(  
	     
	  <ScrollView style={Styles.container} keyboardShouldPersistTaps='always'>          
    <View>        


		 <View style={{flexDirection:'row', borderBottomWidth:1, borderBottomColor:"#000000"}}>
      <TextInput
             style={{width:"85%", fontSize:18}}
             onChangeText={(codeNumber) => this.setState({codeNumber})}
             value={this.state.codeNumber}
             keyboardType='numeric'
             returnKeyType="next"    
             placeholder="कोड नंबर"  
             //underlineColorAndroid='#000000'
			          
          
         />           
	      <TouchableOpacity onPress={this.getFarmerDetails.bind(this)} style={{margin:10}}>
		     
        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
        <Icon name="search" size={25}  />} 
		  </TouchableOpacity>
     </View>  
  


  {

    (this.state.mobNumber1 == null || this.state.mobNumber1 == 0 )?
    <View style={Styles.textInputView}>
    <TextInput 
             style={Styles.textInput} 
             onChangeText={(mobNumber) => this.setState({mobNumber})}
             value={this.state.mobNumber}
             placeholder="मोबाइल नंबर"
             //underlineColorAndroid='#000000'
              keyboardType='numeric'
      /> 
    </View>:  
     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>मोबाइल नंबर</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.mobNumber1}</Text>
      </View>      
    </View>      
} 

     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>नाम</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.name}</Text>
      </View>      
    </View>

     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>पिता का नाम</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.fatherName}</Text>
      </View>      
    </View>        

     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>ग्राम</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.village}</Text>
      </View>      
    </View>  

{(this.state.aadharNumber1 == null || this.state.aadharNumber1 === 0 || this.state.aadharNumber1 == "null")?
		<View style={Styles.textInputView}> 
	  <TextInput 
             style={Styles.textInput} 
             onChangeText={(aadharNumber) => this.setState({aadharNumber})}
             value={this.state.aadharNumber}
             placeholder="आधार कार्ड नंबर "
			       //underlineColorAndroid='#000000'
              keyboardType='numeric'
			/> 
		</View>:  
     <View style={{}}>
      <View style={{marginTop:10, borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>आधार कार्ड नंबर</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.aadharNumber1}</Text>
      </View>      
    </View> 		 
}
 
 

 
    <View style={{marginTop:10, borderBottomWidth:1}}>
     <Picker  
        selectedValue={this.state.bankAiId}  
        style={{ height: 40, width: '95%'}}       
        mode = 'model' 
        //enabled={(this.state.bankAiId == 0)?true:false} 
        onValueChange={(itemValue, itemIndex) => this.onBankChange(itemValue, itemIndex)}
        >
      {bankList}  
     </Picker>   
     </View>    
 

    
{(this.state.khataNumber1 == null || this.state.khataNumber1 == 0 )?
    <View style={Styles.textInputView}> 
    <TextInput 
             style={Styles.textInput} 
             onChangeText={(khataNumber) => this.setState({khataNumber})}
             value={this.state.khataNumber}
             placeholder="बैंक खाता नंबर"
             //underlineColorAndroid='#000000'
              keyboardType='numeric'
      /> 
    </View>:  
     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>बैंक खाता नंबर</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.khataNumber1}</Text>
      </View>      
    </View>      
} 


{(this.state.khataName1 == null || this.state.khataName1 == 0 )?
    <View style={Styles.textInputView}> 
    <TextInput 
             style={Styles.textInput} 
             onChangeText={(khataName) => this.setState({khataName})}
             value={this.state.khataName}
             placeholder="कृषक का बैंक खाता अनुसार नाम"
             //underlineColorAndroid='#000000'
            //  keyboardType='numeric'
      /> 
    </View>:  
     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>बैंक खाता अनुसार नाम</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.khataName1}</Text>
      </View>      
    </View>      
}    
          
{(this.state.ifsc1 == null || this.state.ifsc1 == 0 )?
    <View style={Styles.textInputView}> 
    <TextInput 
             style={Styles.textInput} 
             onChangeText={(ifsc) => this.setState({ifsc})}
             value={this.state.ifsc}
             placeholder="आई.एफ.एस.सी. कोड"
             //underlineColorAndroid='#000000'
             // keyboardType='numeric'
      /> 
    </View>:  
     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>आई.एफ.एस.सी. कोड</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.ifsc1}</Text>
      </View>      
    </View>      
} 
      

   {(this.state.bankAddress1 == null || this.state.bankAddress1 == 0 )?
    <View style={Styles.textInputView}> 
    <TextInput 
             style={Styles.textInput} 
             onChangeText={(bankAddress) => this.setState({bankAddress})}
             value={this.state.bankAddress}
             placeholder="बैंक का पता"
             //underlineColorAndroid='#000000'
             //keyboardType='numeric'
      /> 
    </View>:  
     <View style={{marginTop:10}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>बैंक का पता</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.bankAddress1}</Text>
      </View>      
    </View>      
}  

   
 {this.state.caneData.map((item)=>
     <View style={{flexDirection:"row", justifyContent:"space-between",marginTop:10}}>
        {(item.cane_type.toLowerCase() === "madi" || item.cane_type.toLowerCase() === "mari")?<Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>मड़ी</Text>:null}
        {(item.cane_type.toLowerCase() === "jadi")?<Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>जड़ी</Text>:null}
        {(item.cane_type.toLowerCase() === "norpa")?<Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>नोरपा</Text>:null}
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{item.calculated_area} वर्ग मीटर</Text>
     </View>
  )
   

 }

   
   <View style={{alignItems:"center", marginVertical:15}}>
		<TouchableOpacity onPress={()=>this.onUpdatePress()}  style={{elevation:10, margin:10, paddingVertical:15, width:180, backgroundColor:buttonColor, borderRadius:50}}>
		  <Text style={{color:'#ffffff', fontSize:15, textAlign:"center", fontFamily: "Lato-Black"}}>SUBMIT</Text>  
		</TouchableOpacity>
   </View>
</View>	               
           
             
 	     
  </ScrollView>  

	)}            

}     
  
const Styles = StyleSheet.create({  
	container:{    
		flex:1, backgroundColor:'#f3f3f3f3', padding:20
	},
	headline:{
		color:'black', padding:10, fontFamily: "Lato-Black", fontSize:20
	},
	text:{
		color:'black', fontSize:15
	},  
	textInput:{
		width:"100%", fontSize:18, padding:5
	},
 cardStyle:{
   margin:10, elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10
  },
	checkBoxView:{
		flexDirection: 'row', paddingLeft:20
	},  
  textInputView:{
     marginTop:10, borderBottomWidth:1, borderBottomColor:"#000000"
   },   
	  
	deleteImageBackground: {
		position: 'absolute',
		right: 0,
		zIndex: 0,  
		margin: 5,
		backgroundColor: "#fff",
		padding:3,
		borderRadius: 10,
		alignItems: 'center',
  },
  signature: {
      flex: 1,
      borderColor: '#000033',
      borderWidth: 1,
    },
  btnStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex:999
  },	
})	  