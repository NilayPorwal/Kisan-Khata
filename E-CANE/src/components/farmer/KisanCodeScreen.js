import React, { Component } from 'react';
import {Dimensions, StyleSheet, Text, View, ImageBackground, Image, ScrollView, Modal, TextInput,
        TouchableOpacity, BackHandler, Alert, FlatList, Platform, ActivityIndicator, Animated } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon } from 'native-base';
import APIManager from './../APIManager';
import { encrypt, decrypt } from "./../AESEncryption"
var base64 = require('base-64');  
import axios from 'axios';
var dateFormat = require('dateformat');
import Storage from 'react-native-storage';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Card, Form, Picker} from 'native-base';

const {height, width} = Dimensions.get('window');
I18n.fallbacks = true;
   
I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),

};

export default class KisanCodeScreen extends Component {
      constructor(props) {
          super(props);
          this.state = {
            isLoading:true,
            farmerTokenData:[],
            tareData:[],
            userData:{},
            farmerCodeList:[],
            farmertareData:[],
            language:"English",
            lastToken:[],
            modalVisible:false,
            applyModal:false,
            qty:null,
            requestTypeList:[],
            requestType:1
            }
            global.KisanCodeScreen = this;
          }


    static navigationOptions = {
        header: null,
             
    }; 

  async componentDidMount(){
      if(APIManager.isDev != true){ 
       await APIManager.setHost()
      }
       BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
       this.getFarmerTokenDetails()
       this.getLastTokenActivity()
       //this.getRequestType()
       //this.getLastTokenGrossData()
       this.retriveData()
     
       this._interval = setInterval( () => {
        this.getFarmerTokenDetails()
        this.getLastTokenActivity()
      }, 60000)

    }

    handleAndroidBackButton() {
        BackHandler.exitApp(); 
        return true;
      }       
    
  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
      clearInterval(this._interval);

    
  }

 retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));
      this.setState({userData:data})

    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }

  getFarmerTokenDetails() {
     setTimeout(()=>{
          if(this.state.isLoading == true){
           this.setState({isLoading:false})
         }
        }, 10000)
    APIManager.getFarmerTokenDetails((response)=>{
        console.log(JSON.stringify(response));   
         if (response.data.status === "SUCCESS") {
            response.data.data = JSON.parse(decrypt(response.data.data.content));
            console.log("Farmer Token Details: " + JSON.stringify(response.data));

              this.setState({farmerTokenData:response.data.data, farmerCodeList:[...response.data.data], 
                             selectedCode:response.data.data.length, isLoading:false}) 
    
          } else { 
            this.setState({isLoading:false})           
            console.log('error', response);
           // Alert.alert('Error',  response.data.message);    
          }  
          
     }, (error)=>{
        this.setState({isLoading:false}) 
         console.log('error', error);
     })

   }


  getLastTokenActivity(){
    //this.setState({lastToken:[]})
    
      APIManager.getLastTokenActivity((responseJson)=> {
        this.setState({loading:false})
         if(responseJson.data.status=='SUCCESS'){
           responseJson.data.data = JSON.parse(decrypt(responseJson.data.data.content));
           console.log("Last Token Activity " + JSON.stringify(responseJson.data));
           this.setState({lastToken:responseJson.data.data})
         }    
       },(error)=>{
         this.setState({loading:false})
         console.log(JSON.stringify(error));
       })
      
   }

   getRequestType(){
    //this.setState({lastToken:[]})
    
      APIManager.getRequestType((responseJson)=> {
        this.setState({loading:false})
         if(responseJson.data.status=='SUCCESS'){
           responseJson.data.data = JSON.parse(decrypt(responseJson.data.data.content));
           console.log("Request Type " + JSON.stringify(responseJson.data));
           this.setState({requestTypeList:responseJson.data.data, })
         }    
       },(error)=>{
         this.setState({loading:false})
         console.log(JSON.stringify(error));
       })
      
   }

   _onRequest(){
     if(this.state.qty == null || this.state.qty.trim() == ""){
      return;
     }
    this.setState({isLoading:true})
    const data ={
      pRequestQty:this.state.qty,
      pRequestTypeAiId:this.state.requestType,
      pRequestBy:this.state.userData.userId,
      pFarmercode:(this.state.farmerCodeList.length > 0)?this.state.farmerCodeList[0].account_user_id:""

    }
    
      APIManager._onRequest(data, (responseJson)=> {
        this.setState({isLoading:false})
         if(responseJson.data.status=='SUCCESS'){
           responseJson.data.data = JSON.parse(decrypt(responseJson.data.data.content));
           console.log("On Submit Request " + JSON.stringify(responseJson.data));
           this.setState({applyModal:false, qty:null})
           Alert.alert("", responseJson.data.data[0].serverResponseMsg)   
         }else{
          Alert.alert("", responseJson.data.message)
         }
        
       },(error)=>{
         this.setState({isLoading:false})
         console.log(JSON.stringify(error));
       })
      
   }




 onCodePress(index){
   this.props.navigation.push("WeightDetailsScreen", {
    farmerCode:this.state.farmerTokenData[index].account_user_id,
    language:(this.state.language=="हिंदी")?"en":"hi"
   })
  // if(index < this.state.farmerTokenData.length){
  //    // this.setState({selectedCode:index, selectedAll:false})
  //    // this.getFarmerTareDetails(this.state.farmerData[index].account_user_id)
  //    // this.getFarmerTotalTareDetails(this.state.farmerData[index].account_user_id)
  //    this.props.navigation.push("WeightDetailsScreen", {
  //     farmerCode:this.state.farmerTokenData[index].account_user_id,
  //     language:(this.state.language=="हिंदी")?"en":"hi"
  //    })
  // }else{
  //    this.setState({selectedCode:index,selectedAll:true})
  // }
 }   


 onLogOut(){
    Alert.alert(
      I18n.t("Logout Confirmation"),
      I18n.t('Do you want to Logout ?'),      
      [
        { 
          text:  I18n.t("No"),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: I18n.t("Yes"), onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );

 }

 logOut(){
  this.hideMenu();

  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
     
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
     this.setState({farmertareData:[], farmerCodeList:[], userData:{}})
     this.props.navigation.push("LoginScreen")
      APIManager.removeValueForKey()
  
} 

 componentWillMount() {
    I18n.locale = 'hi';
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

  onLanguageChange(){
     I18n.locale = (this.state.language=="हिंदी")?"hi":"en";
    this.setState({language:(this.state.language=="हिंदी")?"English":"हिंदी"})
  
  }



  render() {
    const requestTypeList = this.state.requestTypeList.map((item, key) => {  
      return (<Picker.Item label={item.req_type_hindiname} value={item.req_typ_ai_id} key={item.req_typ_ai_id}/>)    
             })               
             requestTypeList.unshift(<Picker.Item  key="" label="---चयन करे---" value='0' />)	
    return (
       <ImageBackground source={require('./../../assets/Splash.png')} style={{flex:1}}>
          <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
          <View style={{alignItems:"center", marginTop:"5%"}}> 
              <Image
                  style={{width: width*0.6, height: height*0.2}}
                  //resizeMode="contain"
                  source={require('./../../assets/ic_launcher.png')}
                />  
              <View style={{width:"80%"}}>  
                <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
              </View>
            </View>

            <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center", paddingTop:10}}>{I18n.t("Financial Year")} - 2020 - 21</Text>
            <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center", paddingTop:10}}>{this.state.userData.mobile}</Text>  

          <View style={{margin:10}}>
           <Card>
          {(this.state.lastToken.length > 0)?
            <View style={styles.row}>
              <View style={{width:"30%"}}> 
                <Text style={{ fontSize: width*0.035, fontFamily:'Lato-Semibold', color: "#000000",}}>{I18n.t("Slip")} ({I18n.t("Counter")})</Text>
                <Text style={{ fontSize: width*0.035, fontFamily:'Lato-Black', color: "#000000",}}>{this.state.lastToken[0].stage} ({this.state.lastToken[0].counter_no})</Text>
               </View>

               <View style={{width:"25%", alignItems:"flex-start"}}> 
                <Text style={{fontSize: width*0.035, fontFamily:'Lato-Semibold', color: "#000000",}}>{I18n.t("Current")} {I18n.t("Slip No")}</Text>
                <Text style={{ fontSize: width*0.035, fontFamily:'Lato-Black', color: "#000000",}}>{this.state.lastToken[0].swtm_tk_slip_no}</Text>
               </View>
              
               <View style={{width:"45%", alignItems:"flex-end"}}> 
                <Text style={{fontSize: width*0.035, fontFamily:'Lato-Semibold', color: "#000000",}}>{I18n.t("Date")}</Text>
                <Text style={{ fontSize: width*0.035, fontFamily:'Lato-Black', color: "#000000", textAlign:"right"}}>{this.state.lastToken[0].lastuseddate}</Text>
               </View>
            </View>:null} 
           <TouchableOpacity onPress={()=>this.props.navigation.navigate("LastTokenDetails", {language:I18n.locale})}>
            <Text style={{color:"#3473c3", fontSize:width*0.04, fontFamily:"Lato-Semibold", textAlign:"center", padding:10}}>{I18n.t("Show Token Activity")}</Text>
           </TouchableOpacity> 
          </Card>
          </View> 

          <TouchableOpacity activeOpacity={0.5}  onPress={()=>this.setState({modalVisible:true})} style={{...styles.btnStyle, alignSelf:"center", width:"50%",}}>
            <Text style={{color:"#ffffff", fontSize:width*0.04, fontFamily: "Lato-Semibold"}}>{I18n.t("Apply for Diesel")}</Text> 
          </TouchableOpacity>

           {(this.state.isLoading == false && this.state.farmerCodeList.length == 0)? 
            <Text style={{marginTop:height*0.04,fontSize:18, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center", paddingBottom:15}}>{I18n.t("No Accounts Available")}</Text>:
            
             <View style={[{padding:10, marginTop:height*0.01}]}>  
              <Text style={{fontSize:width*0.045, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center", paddingBottom:10}}>{I18n.t("Your Accounts")}</Text>  
              
             {(this.state.isLoading == false)? 
              <FlatList  
                data={this.state.farmerCodeList}
                extraData={this.state}
                numColumns={2}
                renderItem={({item, index}) => 
                  <TouchableOpacity activeOpacity={0.5}  onPress={()=>this.onCodePress(index)} style={styles.btnStyle}>
                   <Text style={{color:"#ffffff", fontSize:width*0.04, fontFamily: "Lato-Semibold"}}>{item.account_user_id}</Text> 
                  </TouchableOpacity>
                }
              />:<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>}
            
           </View>}

             <View style={{alignItems:"center", marginTop:10}}>
                <Image
                  style={{width:width*0.5, height:height*0.1}}
                  resizeMode="contain"
                  source={require('./../../assets/logo.png')}
                />
             </View> 

         </ScrollView>

         <Modal animationType = {"slide"}
                      transparent = {true}
                      visible = {this.state.modalVisible}
                      onRequestClose = {() => this.setState({modalVisible:false})}>
               <View  style={styles.modal}>
                 <View style={styles.modalView1}>
                    <Text style={{fontSize:width*0.05, fontFamily: "Lato-Semibold", paddingTop:15, textAlign:"center"}}>{I18n.t("Request")}</Text>

                   <TouchableOpacity onPress={()=>this.setState({modalVisible:false, applyModal:true})} style={{flexDirection:"row", justifyContent:"space-between",  borderBottomWidth:0.2, padding:15}}>
                    <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold"}}>{I18n.t("Apply")}</Text>
                    <Icon  name='right' type="AntDesign"  style={{fontSize:20, color:'#006344'}} /> 
                   </TouchableOpacity>
                  
                   <TouchableOpacity onPress={()=>{this.setState({modalVisible:false});  this.props.navigation.navigate("ReportScreen", {from:"0", farmerCodeList:this.state.farmerCodeList})}} style={{flexDirection:"row", justifyContent:"space-between",  borderBottomWidth:0.2, padding:15}}>
                    <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold"}}>{I18n.t("Cancel")}</Text>
                    <Icon  name='right' type="AntDesign"  style={{fontSize:20, color:'#006344'}} /> 
                   </TouchableOpacity>
                   
                   <TouchableOpacity onPress={()=>{this.setState({modalVisible:false});  this.props.navigation.navigate("ReportScreen", {from:"1", farmerCodeList:this.state.farmerCodeList})}} style={{flexDirection:"row", justifyContent:"space-between",  borderBottomWidth:0.2, padding:15}}>
                      <Text style={{fontSize:width*0.04, fontFamily: "Lato-Semibold"}}>{I18n.t("Report")}</Text>
                      <Icon  name='right' type="AntDesign"  style={{fontSize:20, color:'#006344'}} /> 
                   </TouchableOpacity>
                   <TouchableOpacity onPress = {() => this.setState({modalVisible:false})} style={{position:'absolute', top:10, right:10}}>
                    <Icon name="closecircleo" type="AntDesign" style={{fontSize:15}}  />
                  </TouchableOpacity>
                </View>
         
              </View>
             </Modal>

             <Modal animationType = {"slide"}
                    transparent = {true}
                    visible = {this.state.applyModal}
                    onRequestClose = {() => this.setState({applyModal:false, qty:null}) }>
               <View  style={styles.modal}>
                 <View style={styles.modalView1}>
                    <Text style={{fontSize:width*0.05, fontFamily: "Lato-Semibold", paddingTop:15, textAlign:"center"}}>{I18n.t("Required")}</Text>

                    {/* <Form style={{backgroundColor:'#ffffff', borderRadius:5, borderWidth:1, marginTop:10, width: "80%", alignSelf:"center"}}>
                      <Picker
                        note 
                        placeholder="Select Type"
                        placeholderIconColor="#007aff"
                        placeholderStyle={{ color: "#bfc6ea", fontSize:12 }}
                        textStyle={{ color: "#5cb85c" }} 
                        iosHeader="Select Type"
                        mode="dropdown"
                        style={{ width: "100%", height:35,  borderWidth:1}}
                        selectedValue={this.state.requestType}
                        onValueChange={(value)=>this.setState({requestType:value})}
                      >  
                       {requestTypeList}
                      </Picker>
                    </Form>   */}
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                      <TextInput
                              onChangeText={(qty) => this.setState({qty})}
                              value={this.state.qty}
                              style={styles.modalInput}
                              placeholder={I18n.t("Quantity")}
                              maxLength={3}
                              keyboardType = 'numeric'

                              />
                    </View>
                    
                    {(this.state.isLoading==true)?<ActivityIndicator style={{margin:10}}  size="small" color="#000000" />:
                      <TouchableOpacity onPress = {() => this._onRequest() }   style={styles.updateBtn}>
                        <Text style = {styles.btnText}>{I18n.t("Submit")}</Text>
                      </TouchableOpacity>}  
                      <TouchableOpacity onPress = {() => this.setState({applyModal:false, qty:null})} style={{position:'absolute', top:10, right:10}}>
                        <Icon name="closecircleo" type="AntDesign" style={{fontSize:15}}  />
                      </TouchableOpacity>
                </View>
              </View>
             </Modal>
             

             <TouchableOpacity  onPress={this.showMenu} style={{position:"absolute", right:10, top:(Platform.OS === "ios")?20:10}}>
                 <Menu 
                  ref={this.setMenuRef}
                  button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                                 style={{fontSize:25, color:'#000000'}}
                                 onPress={this.showMenu} /> 
                 }
                >
                  <MenuItem onPress={()=>this.onLanguageChange()}>{this.state.language}</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={() => this.onLogOut()}>Log Out</MenuItem>
                </Menu>
             </TouchableOpacity>

              <TouchableOpacity  onPress={()=>this.props.navigation.navigate("NotificationScreen")} style={{position:"absolute", right:50, top:(Platform.OS === "ios")?20:10}}>
               <Icon  name='bell' type="MaterialCommunityIcons"  style={{fontSize:25, color:'#000000'}} /> 
             </TouchableOpacity>
              
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    elevation:5, height:50, backgroundColor:"#8db301", justifyContent:"space-between", flexDirection:"row", alignItems:"center", paddingHorizontal:15
  },

  cardStyle:{
   margin:10, elevation:8, backgroundColor:'#ffffff', borderRadius:5
  },
  tableText:{
     fontFamily: "Lato-Semibold", color:"#000000", fontSize:15,  textAlign:"center"
  },
  farmerDetailsText:{
     color:'#000000', fontSize:15,  fontFamily: "Lato-Semibold", paddingTop:5
  }, 
  farmerDetailsView:{
    flexDirection: 'row', justifyContent:"space-between"
  },
  farmerDetailsView2:{
    backgroundColor:"#d3d3d3", borderBottomColor:"#ffffff", borderBottomWidth:1, padding:10
  },
  noDataView:{
    alignItems:"center", justifyContent:"center", height:100
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  },
  row:{
    flexDirection: 'row', padding:10,backgroundColor: "#d8a800",
  },
  btnStyle:{
    elevation:8, backgroundColor:'#006344', borderRadius:25, padding:10, marginTop:10, marginHorizontal:10, width:"45%", alignItems:"center"
  },
  modal: {
    flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'
  },
  modalView1:{
   width: '85%',backgroundColor:'#ffffff', borderRadius:10, justifyContent:'center' 
  },
  modalInput: {
    margin:15, borderWidth:1, borderColor:'#000', width:"50%", borderRadius:5
 },
  modalInputInner: {
      width:"82%", fontSize:15,  paddingLeft:10
  },
  updateBtn: {
    marginTop:10, backgroundColor:'#8db301', elevation:4, borderRadius:50, alignSelf:'center', padding:10, marginVertical:10, width:"50%", alignItems:"center"
  },
  btnText:{
    fontSize:width*0.04, fontFamily: "Lato-Semibold", color:'#FFFFFF'
   }, 

});
