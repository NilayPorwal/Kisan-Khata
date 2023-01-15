import React, { Component } from 'react';
import { SafeAreaView,Dimensions, Text, View, Image, ScrollView, BackHandler, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { encrypt, decrypt } from "./../AESEncryption"
import APIManager from './../APIManager';
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon, Card } from 'native-base';
var base64 = require('base-64');  
import axios from 'axios';
var dateFormat = require('dateformat');
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Storage from 'react-native-storage';

const {height, width} = Dimensions.get('window');

export default class FarmerDetails extends Component {
   constructor(props) {
    super(props);
    this.state = {  
      farmerCode:this.props.navigation.state.params.farmerCode,
      farmerDetails:this.props.navigation.state.params.farmerDetails,
      language:this.props.navigation.state.params.language,
      caneData:[]
   }
      global.FarmerDetails = this;
    }
  static navigationOptions =  ({ navigation }) => {
    return {  
        header:null  
   }        
  };

   componentDidMount(){
       BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
       this.getCaneType();
      //this.getFarmerDetails();
    //alert(this.state.farmerDetails[0].account_name_hindi.trim().length)
  }
 

  handleAndroidBackButton() {
      //BackHandler.exitApp();    
      global.FarmerDetails.props.navigation.goBack();
       return true;
    }      
            
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
  }

 componentWillMount() {
    I18n.locale = this.state.language;
  } 


   getFarmerDetails(){

     const data = {  
      "pFarmerCode": this.state.farmerCode           
     } 

  APIManager.getFarmerDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Details: " + JSON.stringify(response.data));
          //this.getCaneType();
          this.setState({farmerDetails:response.data.data})   
  
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
      "pFarmerCode": this.state.farmerCode          
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
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Get Cane Data :" + JSON.stringify(response.data));
           this.setState({caneData:response.data.data})
      
        } else {                  
          console.log('Cane Type Error ', response);   
           this.setState({isLoading:false})
        } 
         
      })      
      .catch((err) => {
         this.setState({isLoading:false})
        console.log(JSON.stringify(err))
      });
     })
    });  
      
  } 

  render() {
    return (
      <SafeAreaView style={{flex:1}}>  
         <View style={styles.header}>
           <TouchableOpacity onPress={()=>this.handleAndroidBackButton()}>
            <Icon  type="AntDesign" name="arrowleft" style={{fontSize:15, color:"#ffffff"}} />
           </TouchableOpacity>
            <Image
                style={{width: "30%", height: "90%"}}
                source={require('./../../assets/logo_white.png')}
            />
         </View>
   {(this.state.farmerDetails.length > 0)?     
      <ScrollView style={{paddingHorizontal:5}} >
     
        
        {
            // <View style={{ marginTop:20, width:'40%', height:'20%', borderWidth:1, borderRadius:10, alignSelf:'center'}}>
            // <Image
            //     style={{height:'100%', width:"100%"}}
            //     source={require('./../../assets/ic_launcher.png')}
            //     /> 
            // </View>
         }   

         <Card style={styles.cardStyle}> 
             <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={styles.textStyle}>{I18n.t("Farmer Code")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerCode}</Text>
              </View>
    
             <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff',}}>
                <View style={{width:"20%"}}> 
                  <Text style={styles.textStyle}>{I18n.t("Name")}</Text>
                </View>
                <View style={{width:"80%"}}>
                {(this.state.farmerDetails[0].account_name_hindi == null || this.state.farmerDetails[0].account_name_hindi == "null" || this.state.farmerDetails[0].account_name_hindi.trim().length === 0)?  
                  <Text style={[styles.textStyle, {textAlign:"right"}]}>{this.state.farmerDetails[0].account_name}</Text>:
                  <Text style={[styles.textStyle, {textAlign:"right"}]}>{this.state.farmerDetails[0].account_name_hindi}</Text>}
                </View>
              </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <View style={{width:"30%"}}> 
                   <Text style={styles.textStyle}>{I18n.t("Father's Name")}</Text>
                  </View>
                  <View style={{width:"70%"}}>
                {(this.state.farmerDetails[0].fatherNameHindi == null || this.state.farmerDetails[0].fatherNameHindi == "null" || this.state.farmerDetails[0].fatherNameHindi.trim().length === 0)?  
                  <Text style={[styles.textStyle, {textAlign:"right"}]}>{this.state.farmerDetails[0].G_FatherName}</Text>:
                  <Text style={[styles.textStyle, {textAlign:"right"}]}>{this.state.farmerDetails[0].fatherNameHindi}</Text>}
                </View>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff'}}>
                  <Text style={styles.textStyle}>{I18n.t("Address")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].village_name}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={styles.textStyle}>{I18n.t("Mobile Number")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].G_MobileNo}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10,  backgroundColor:'#ffffff',}}>
                  <Text style={styles.textStyle}>{I18n.t("Bank Name")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].bank_name}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={styles.textStyle}>{I18n.t("Bank Account Number")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].bank_acc_no}</Text>
              </View>

             <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff',}}>
                  <Text style={styles.textStyle}>{I18n.t("IFSC Code")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].bank_ifsc}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={styles.textStyle}>{I18n.t("Bank Address")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].bank_branch_address}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff',}}>
                  <Text style={styles.textStyle}>{I18n.t("Aadhaar Card Number")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].farmer_aadhaar_no}</Text>
              </View>
        
        </Card>

      {(this.state.caneData.length !== 0)?
        <Card style={styles.cardStyle}>  
         <FlatList  
                data={this.state.caneData}
                extraData={this.state}
                numColumns={1}
                renderItem={({item, index}) =>
                <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:(index % 2 === 0)?"#CEE196":"#ffffff"}}>
                 {(item.cane_type.toLowerCase() === "madi")?<Text style={styles.textStyle}>{I18n.t("Madi")}</Text>:null}
                 {(item.cane_type.toLowerCase() === "jadi")?<Text style={styles.textStyle}>{I18n.t("Jadi")}</Text>:null}
                 {(item.cane_type.toLowerCase() === "norpa")?<Text style={styles.textStyle}>{I18n.t("Norpa")}</Text>:null}
                  <Text style={styles.textStyle}>{item.calculated_area}</Text>
              </View>
                }
              />
        </Card>:null}

        <Card style={styles.cardStyle}> 
           <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff',}}>
                  <Text style={styles.textStyle}>{I18n.t("Supervisor Name")}</Text>
          {( this.state.farmerDetails[0].supervisor_hindi_name == null || this.state.farmerDetails[0].supervisor_hindi_name.trim().length === 0)?  
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].supervisor_name}</Text>:
                   <Text style={styles.textStyle}>{this.state.farmerDetails[0].supervisor_hindi_name}</Text>}
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={styles.textStyle}>{I18n.t("Mobile Number")}</Text>
                  <Text style={styles.textStyle}>{this.state.farmerDetails[0].supvr_mobno}</Text>
              </View>
     
        
        </Card>

      </ScrollView>:
         <View style={styles.noDataView}>                            
          <Text style={styles.noDataText}>No Data Found</Text>
         </View>}
     </SafeAreaView> 
    );
  }
}

const styles = StyleSheet.create({
 header: {
    elevation:5, height:height*0.075, backgroundColor:"#8db301", flexDirection:"row", alignItems:"center", paddingHorizontal:15
  },
  cardStyle:{
   margin:10, backgroundColor:'#ffffff', borderRadius:5
  },
  textStyle:{fontSize:width*0.04, fontFamily: "Lato-Semibold"},
 
  noDataView:{
    alignItems:"center", justifyContent:"center", height:"100%"
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  },

});
            