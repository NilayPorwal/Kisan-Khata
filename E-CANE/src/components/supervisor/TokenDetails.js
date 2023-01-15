import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  Alert,
  View,Keyboard,
  Text,Modal,Dimensions,
  TextInput,AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ScrollView,
  BackHandler,Image,
  TouchableWithoutFeedback,
  RefreshControl,
  KeyboardAvoidingView
} from 'react-native';

import { Picker, CheckBox} from 'native-base';
 
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon } from 'native-base';
import APIManager from './../APIManager';

import { encrypt, decrypt } from "./../AESEncryption"
var base64 = require('base-64');  
import axios from 'axios';
var dateFormat = require('dateformat');
var now = new Date();

I18n.fallbacks = true;

I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),
};
  
const themeColor = "#8db301"  
const width= Dimensions.get('window').width
const height= Dimensions.get('window').height

export default class TokenDetails extends Component {

   constructor(props) {
    super(props);
   
    this.state = {
     codeNumber:null,
     isLoading:false,
     data:[],
     checked:false,
     deduction:null,
     reason:null,
     reasonValue:"0",
     ssoId:null,
     apiSeceretKey:null,
     userId:null,
     modalVisible:false,
     ipAddress:"erp.mspil.in:8080",
     tokenDetailsModalVisible:false, 
     language:"हिंदी",
     vehiclesData:[{"GrossGenerated":"","Verified":"","WaitingVerified":"","TokenGenerated":""}],
     //lastVehicleVerified:[{"swtm_tk_farmer_code":""},{"Variety_Name":""},{"cCropType":""},{"swtm_tk_slip_no":""}],
     lastVehicleVerified:[],
     userData:{},
     refreshing:false,
     isInputVisible:false,
     keyboardHeight:0
    };
    global.TokenDetails = this;
  }
   static navigationOptions =  ({ navigation }) => { return {
 
    header:null  
   }        
  };

  componentDidMount(){
     this.retriveData();
     this.getVehiclesDetails();
     this.lastVehicleVerified();
     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);

  }
   

    handleAndroidBackButton() {
      if(global.TokenDetails.state.userData.roleName == "SUPER_ADMIN"){
          global.TokenDetails.props.navigation.goBack();
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
     if(data != null){ 
        console.log("User Data " + JSON.stringify(data));
        this.setState({userData:data})
     }
    }, (error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }


  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
  }
  
 

getTokenDetails(token) {
   Keyboard.dismiss();
  if(token == null){
    Alert.alert("Token Required")
  } else { 
    this.setState({isLoading: true, data:[], codeNumber:token, checked:false,deduction:null,reason:null, reasonValue:"0",})
    const data = {   
      "pSwtmTkSlipNo": token
    } 
   APIManager.getTokenDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
           console.log("get token details :" + JSON.stringify(response.data));
           
           if(response.data.data[0].swtm_gr_verify_flg === 0){
              this.setState({isLoading:false, data:response.data.data, deduction:response.data.data[0].swtm_gr_extra_deduction.toString(), tokenDetailsModalVisible:true})
               if(response.data.data[0].swtm_tk_burnt_cane_flg == 0){
                  this.setState({checked:false})
               }
               else if(response.data.data[0].swtm_tk_burnt_cane_flg == 1){
                      this.setState({checked:true})
               }
           }else{
              Alert.alert(I18n.t("Token has been verified"))
              this.setState({isLoading:false}) 
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

  getVehiclesDetails() {
   APIManager.getVehiclesDetails((response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Vehicle Details :" + JSON.stringify(response.data));
       
         this.setState({isLoading:false, vehiclesData:response.data.data, refreshing:false})
  
        } else {       
           this.setState({isLoading:false,  refreshing:false})           
           console.log('error', response);
           //alert("Vehicle Details Error: " + response.data.message) 
        }  
        
   })

 } 

  lastVehicleVerified() {
   APIManager.lastVehicleVerified((response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("last Vehicle Verified :" + JSON.stringify(response.data));
          this.setState({isLoading:false, lastVehicleVerified:response.data.data})
  
        } else {                  
           console.log('error', response); 
           //alert("Last Vehicle verified Error : " + response.data.message)   
        }  
        
   })

 } 

 
 onUpdatePress(){
   if(this.state.deduction != null && this.state.deduction > 25){
        return  Alert.alert("Wait !!", "Deduction can not be greater than 25" )
   }
    if(this.state.deduction != null && this.state.deduction < this.state.data[0].swtm_gr_extra_deduction){
        return  Alert.alert("Wait !!", "Deduction can not be less than " + this.state.data[0].swtm_gr_extra_deduction.toString())
   }


   if(this.state.deduction != null && this.state.deduction % 1 !== 0){
        return  Alert.alert("Wait !!", "Deduction should be an integer" )
   }

    if(this.state.deduction != null && this.state.deduction > this.state.data[0].swtm_gr_extra_deduction && this.state.reason == null){
        return  Alert.alert("Wait !!", "Deduction reason is required")
    }


    Alert.alert( 
    (this.state.deduction == null)?  'Deduction = ' + 0+ "%":'Deduction = ' + this.state.deduction + "%",
      'Do you want to Submit ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.updateDetails()},
      ],
      {cancelable: false},
    );

  }


  updateDetails() {
   

      APIManager.locationEnabler((res)=>{

        this.setState({isLoading: true})
       
         APIManager.getLocation((location)=>{

          const data = {   
            "pSwtmTkAiId":parseFloat(this.state.data[0].swtm_tk_ai_id),  
            "pburnflag": (this.state.checked == true)?1:0,    
            "pSwtmGrExtraDeduction": (this.state.deduction != null)?parseFloat(this.state.deduction):0,   
            "pSwtmGrDeductionRemark": this.state.reason, 
            "pSwtmTkUpdatedBy":(this.state.userData.userId == null)?1:parseInt(this.state.userData.userId),
            "pSwtmGrGeoLocation":JSON.stringify(location)      
          }  
           
          console.log("Update token details", JSON.stringify(data))


           APIManager.updateTokenDetails(data, (response)=>{
             console.log(JSON.stringify(response));   
            if (response.data.status === "SUCCESS") {
                response.data.data = JSON.parse(decrypt(response.data.data.content));
                console.log("on update Details :" + JSON.stringify(response.data));
                this.setState({isLoading:false, codeNumber:null, reason:null, reasonValue:"0",deduction:null, tokenDetailsModalVisible:false, })
                 this.getVehiclesDetails();
                 this.lastVehicleVerified();
                 Alert.alert("Verified")
                //result.success = true;
              } else {                  
                 console.log('error', response);   
                 this.setState({isLoading:false,  tokenDetailsModalVisible:false})
                 Alert.alert("Token Verification Failed", respons.data.message)
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
      
      
 onSelect(token){
  //alert(JSON.stringify(token.token))
  global.TokenDetails.getTokenDetails(token.token)

 } 

 logOutPress(){
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
    this.hideMenu();
    APIManager.logOut((response)=>{
      if(response.status == "SUCCESS"){
            this.props.navigation.navigate("LoginScreen")
       }
      else{
          Alert.alert(response.message)
    
       } 
    })
  
} 

 onScanPress(){
  this.hideMenu();
  this.props.navigation.navigate("Scanner", { onSelect: this.onSelect })
 }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  onLanguageChange(){
     I18n.locale = (this.state.language=="हिंदी")?"hi":"en";
    this.setState({language:(this.state.language=="हिंदी")?"English":"हिंदी"})
  
  }
 
 componentWillMount() {
    I18n.locale = 'en';
  } 

 onRefresh(){
   this.getVehiclesDetails();
   this.lastVehicleVerified();
 }

 onReasonSelect(value){
    if(value === "2"){
       this.setState({reason:null, reasonValue:value})
    }
    else if(value === "1"){
      this.setState({reason:"Bad Cane", reasonValue:value})
    }else{
      this.setState({reason:null, reasonValue:"0"})
    }
 }

  render() {          
    return (  
     <SafeAreaView style={{flex:1, backgroundColor:"#dcdcdc80"}}  > 
      <View style={styles.header}>
       <Text style={{fontSize:18, color:"#ffffff", fontFamily: "Lato-Semibold"}}>E-CANE</Text>
        <View style={{flexDirection:"row"}}> 
       <Menu 
          ref={this.setMenuRef}
          button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                         style={{fontSize:25, color:'#ffffff'}}
                         onPress={this.showMenu} /> 
         }
        >
          <MenuItem onPress={() =>  this.onScanPress()} >{I18n.t("Scan Token")}</MenuItem>
          <MenuItem onPress={()=>this.onLanguageChange()}>{this.state.language}</MenuItem>
          <MenuDivider />
          <MenuItem onPress={() => this.logOutPress()}>Log Out</MenuItem>
        </Menu>
        </View>  

      </View>    

   <ScrollView keyboardShouldPersistTaps='handled'  refreshControl={ <RefreshControl  refreshing={this.state.refreshing}
                                                                                      onRefresh={this.onRefresh.bind(this)}
                                                                      />  }>  
     <View style={{backgroundColor:'#8db301', padding:15, flexDirection:"row"}}>
      <View style={{width:"60%"}}>
       <Text style={{color:"#ffffff", fontSize:15, fontFamily:"Lato-Semibold"}}>{this.state.userData.displayName}</Text>
      </View> 
      <View style={{width:"40%"}}>
       <Text style={{color:"#ffffff", fontSize:15, fontFamily:"Lato-Semibold", textAlign:"right"}}>{this.state.userData.mobile}</Text>
      </View> 
    </View>

   
    <View style={[styles.cardStyle, {flexDirection:'row'}]}>
     <View style={{flexDirection:'row', borderWidth:1, borderColor:themeColor, borderRadius:5, width:"80%"}}>
      <TextInput
           style={{width:"82%", fontSize:18,  paddingLeft:10}}
           onChangeText={(codeNumber) => this.setState({codeNumber})}
           value={this.state.codeNumber}
           keyboardType='numeric'
           returnKeyType="next"    
           placeholder={I18n.t("Search Token")}  
             //underlineColorAndroid='#000000'
           
         />           
        
      <TouchableOpacity onPress={()=>this.getTokenDetails(this.state.codeNumber)} style={{padding:10, alignItems:"center"}}>
        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
        <Icon name="search" size={25}  />} 
      </TouchableOpacity>

     </View>  
     <View style={{justifyContent:"center", alignItems:"center", width:"20%"}}>
      <Icon
        name='barcode-scan' 
        type="MaterialCommunityIcons"     
        style={{fontSize:25,  color:'#000000'}}
        onPress={() =>  this.props.navigation.navigate("Scanner", { onSelect: this.onSelect })} /> 
     </View>
     </View>

     
      <View style={styles.vehiclesContainer}>
        <Text style={styles.vehiclesTextContainer}>{I18n.t("Vehicles")}</Text>
        <Text style={styles.vehiclesTextContainer}>{dateFormat(now, "mmm dd, yyyy")}</Text>
      </View>  

       <View style={styles.cardStyle}>
        <View style={{flexDirection:"row", paddingVertical:10}}> 
         <View style={{ width:"30%", alignItems:"center"}}>
          <Image source={require('./../../assets/Circle.png')} resizeMode="contain" /> 
         </View>
        
         <View style={{ width:"70%", alignItems:"center"}}>

            <View style={{width:"100%",borderRadius:5, borderWidth:1, borderColor:"#dcdcdc", paddingHorizontal:15, paddingVertical:18}}>
               <Text style={{fontSize:14, color:"#000000", fontFamily: "Lato-Semibold"}}>{I18n.t("Token Generated")} : {this.state.vehiclesData[0].TokenGenerated}</Text>
            </View>
 
            <View style={{height:58}}>
            </View>
   
            <View style={{width:"100%",borderRadius:5, borderWidth:1,borderColor:"#dcdcdc", paddingHorizontal:15, paddingVertical:18}}>
               <Text style={{fontSize:14, color:"#000000",  fontFamily: "Lato-Semibold"}}>{I18n.t("Gross Weight Taken")} : {this.state.vehiclesData[0].GrossGenerated}</Text>
            </View>
  
            <View style={{height:52,}}>
            </View>
 
            <View style={{width:"100%",borderRadius:5, borderWidth:1,borderColor:"#dcdcdc", paddingHorizontal:15, paddingVertical:18}}>
               <Text style={{fontSize:14, color:"#000000",fontFamily: "Lato-Semibold"}}>{I18n.t("Waiting For Verification")} : {this.state.vehiclesData[0].WaitingVerified}</Text>
            </View>   
 
            <View style={{height:52,}}>
            </View>

           <View style={{width:"100%", borderRadius:5, borderWidth:1,borderColor:"#dcdcdc", paddingHorizontal:15, paddingVertical:18}}>
               <Text style={{fontSize:14, color:"#000000",  fontFamily: "Lato-Semibold"}}>{I18n.t("Verified")} : {this.state.vehiclesData[0].Verified}</Text>
            </View>
         </View> 

        </View>
       </View>

          <View style={{ backgroundColor:themeColor, justifyContent:"space-between", padding:15}}>
            <Text style={{fontSize:18, color:'#fff',  fontFamily: "Lato-Black", textAlign:'center'}}>{I18n.t("Last Vehicle Verified")}</Text>
          </View>
             
          <View style={styles.cardStyle}>
          {(this.state.lastVehicleVerified.length != 0)? 
             <View style={{}}>
                <View style={styles.lastTokenVerifiedtextView}>
                    <Text style={styles.lastTokenVerifiedtext}>{I18n.t("Farmer Code")} :</Text>
                    <Text style={styles.lastTokenVerifiedtext}>{this.state.lastVehicleVerified[0].swtm_tk_farmer_code}</Text>
                </View>
                 <View style={styles.lastTokenVerifiedtextView}>
                    <Text style={styles.lastTokenVerifiedtext}>{I18n.t("Cane Type")}:</Text>
                    <Text style={styles.lastTokenVerifiedtext}>{this.state.lastVehicleVerified[0].cCropType.trim()}</Text>
                </View>
                 <View style={styles.lastTokenVerifiedtextView}>
                    <Text style={styles.lastTokenVerifiedtext}>{I18n.t("Variety")} :</Text>
                    <Text style={styles.lastTokenVerifiedtext}>{this.state.lastVehicleVerified[0].Variety_Name}</Text>
                </View>
               
   
              <View style={{alignSelf:'center'}}>
                  <Text style={{fontSize:18, textAlign:'center', color:"#d8a800",  fontFamily: "Lato-Black"}}>{I18n.t("Token")} {this.state.lastVehicleVerified[0].swtm_tk_slip_no}</Text>
              </View> 
             </View>:
             <View style={{padding:5}}>
                  <Text style={{fontSize:18, textAlign:'center', color:"#d8a800",  fontFamily: "Lato-Black"}}>{I18n.t("No Vehicle Verified")}</Text>
              </View> }
          </View>  
         
</ScrollView>

   <Modal              
        animationType="slide"   
        transparent={true}   
        visible={this.state.tokenDetailsModalVisible}
        onRequestClose={() => {
          this.setState({tokenDetailsModalVisible:false});
        }}>
  
    <SafeAreaView style={{flex: 1, backgroundColor:'#ffffff'}}>
         <View style={{ backgroundColor:themeColor,  flexDirection:"row", padding:15}}>
           <TouchableOpacity  onPress={() =>  this.setState({tokenDetailsModalVisible:false}) } >
            <Icon name="arrowleft" type="AntDesign" style={{fontSize:20, color:"#ffffff"}} />
          </TouchableOpacity>  
          <Text style={{fontSize:18, color:'#fff', fontFamily:"Lato-Semibold", paddingLeft:10}}>Token Details</Text>
        </View> 
     
     <ScrollView style={{marginHorizontal:10}}>    
   {this.state.data.map((item, index)=> 
    <View>
     <View style={{elevation:8, backgroundColor:'#cbd6d5', borderRadius:5, padding:10, marginTop:10}}>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={styles.textStyle}>Token No:</Text>
        <Text style={styles.textStyle}>{this.state.codeNumber}</Text>
      </View>

       <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={styles.textStyle}>Farmer Code:</Text>
        <Text style={styles.textStyle}>{item.swtm_gr_farmer_code.trim()}</Text>
      </View> 


       <View style={{flexDirection:"row",}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Farmer Name:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle, {textAlign:"right"}]}>{item.account_name.trim()}</Text>
         </View> 
      </View> 

        <View style={{flexDirection:"row",}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Father Name:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle, {textAlign:"right"}]}>{item.G_FatherName.trim()}</Text>
         </View> 
      </View> 

       <View style={{flexDirection:"row",}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Village:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle,{textAlign:"right"}]}>{item.place_name.trim()}</Text>
         </View> 
      </View>     
     </View> 

    
     <View style={{elevation:8, backgroundColor:'#f9b89d', borderRadius:5, padding:10, marginTop:10}}>
      <View style={{marginTop:10}}>
       <Text style={{fontSize:18,  fontFamily: "Lato-Black"}}>Token Status</Text>
  
       <View style={{flexDirection:"row", marginTop:10}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Token at:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle,{textAlign:"right"}]}>{item.Token_Insert_Time}</Text>
         </View> 
      </View> 

       <View style={{flexDirection:"row"}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Token Counter:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle,{textAlign:"right"}]}>{item.Token_Counter_Number}</Text>
         </View> 
      </View> 

      <View style={{flexDirection:"row"}}>
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Gross at:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle,{textAlign:"right"}]}>{item.Gross_Insert_Time}</Text>
         </View> 
      </View> 

       <View style={{flexDirection:"row"}}>  
         <View style={{width:"40%"}}>
          <Text style={styles.textStyle}>Gross Counter:</Text>
         </View>
         <View style={{width:"60%"}}> 
          <Text style={[styles.textStyle, {textAlign:"right"}]}>{item.Gross_Counter_Number}</Text>
         </View> 
      </View> 
       </View>
      </View>
   
  
   <View style={{elevation:8, backgroundColor:'#f2d0a5', borderRadius:5, padding:10, marginTop:10}}>
     <View style={{flexDirection:"row"}}>
      
      <Text style={styles.textStyle}>Burnt Cane:</Text> 
      
       <TouchableOpacity disabled = {(item.swtm_tk_burnt_cane_flg == 1)?true:false} onPress={() => this.setState({ checked: !this.state.checked })} style={{ flexDirection: 'row', marginLeft:15, marginTop:10}}>
        <CheckBox
          checked={this.state.checked}
          color="#000000"
          onPress={() => this.setState({ checked: !this.state.checked })}
          disabled = {(item.swtm_tk_burnt_cane_flg == 1)?true:false}
        /> 
        <Text style={{paddingLeft:10}}> Yes</Text>
      </TouchableOpacity> 
   </View>  
  
    <View style={{flexDirection:"row"}}>
    <Text style={[styles.textStyle, {paddingTop:10}]}>Other Deduction :</Text> 
        <TextInput
             style={{width:"45%", fontSize:18, marginLeft:10, borderBottomWidth:1}}
             onChangeText={(deduction) => this.setState({deduction})}
             value={this.state.deduction}   
             placeholder=""  
             keyboardType='numeric'
             maxLength={5}
             //underlineColorAndroid='#000000'
          
         /> 
         <Text style={{paddingTop:15, paddingLeft:10, fontSize:18}}>%</Text>   
      </View> 


      <View style={{backgroundColor:"#ffffff", width:"95%", borderRadius:5, marginTop:10}}>
       <Picker
        selectedValue={this.state.reasonValue}
        style={{}}
        onValueChange={(itemValue, itemIndex) => this.onReasonSelect(itemValue)}>
          <Picker.Item label="--Deduction Reason--" value="0" />
          <Picker.Item label="Bad Cane" value="1" />
          <Picker.Item label="Other" value="2" />
       </Picker>  
      </View>

   {(this.state.reasonValue === "2")?
      <View style={{flexDirection:"row"}}>
            <Text style={[styles.textStyle, {paddingTop:10}]}>Deduction Reason:</Text> 
            <TextInput
                 style={{width:"50%", fontSize:18, marginLeft:10, borderBottomWidth:1}}
                 onChangeText={(reason) => this.setState({reason})}
                 value={this.state.reason}   
                 placeholder=""
                 //underlineColorAndroid='#000000'
              
             />  
      </View>:null}

  </View>

      <View style={{alignItems:"center", marginVertical:10}}>
      <View style={{width:200}}>
       {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
        <Button
          onPress={()=>this.onUpdatePress()}
          title="Update and Verify"
          color= {themeColor}
           style={{width:200}}
        />
       }
       </View> 
      </View> 
      
  
     </View> )}
     </ScrollView>       
      
    </SafeAreaView>

     
    </Modal>   
  
    </SafeAreaView>     
    )
  }   
}    

const styles = StyleSheet.create({
  header: {
    elevation:8, backgroundColor:themeColor, justifyContent:"space-between", flexDirection:"row", alignItems:"center", padding:15, borderBottomWidth:StyleSheet.hairlineWidth
  },

  cardStyle:{
   margin:10, elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10
  },

  textStyle:{
    fontSize:17, color:"#000000", paddingVertical:5,  fontFamily: "Lato-Semibold", 
  },
 
  vehiclesContainer:{
      flexDirection:'row', backgroundColor:themeColor, justifyContent:"space-between", padding:15,
  },
  vehiclesTextContainer:{
        fontSize:18, color:'#fff', fontFamily: "Lato-Semibold",
    },
 
  lastTokenVerifiedtext:{
     color:'#000000', fontSize:15,  fontFamily: "Lato-Semibold", padding:5
   }, 
  lastTokenVerifiedtextView: {
    flexDirection: 'row', justifyContent:"space-between", borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:"#dddddd"
  },

});