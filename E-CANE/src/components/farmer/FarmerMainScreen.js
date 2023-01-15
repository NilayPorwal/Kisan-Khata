import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Alert,
  View,
  Text,Modal,FlatList,
  TextInput,AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  CheckBox, Button,
  Picker, ScrollView,
  BackHandler, TouchableHighlight,
  RefreshControl
} from 'react-native';
 
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon } from 'native-base';
import APIManager from './../APIManager';
import { encrypt, decrypt } from "./../AESEncryption"
var base64 = require('base-64');  
import axios from 'axios';
var dateFormat = require('dateformat');
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Storage from 'react-native-storage';

    
I18n.fallbacks = true;
   
I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),

};

const isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToRight = 20;
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
}

export default class FarmerMainScreen extends Component {

   constructor(props) {
    super(props);
   
    this.state = {    
       codeNumber:null,
       isLoading:true,
       data:[],
       checked:false,
       deduction:null,
       reason:null,   
       ssoId:null, 
       apiSeceretKey:null,
       userId:null,
       modalVisible:false,
       language:"English",
       farmerData:[],
       farmerCodeList:[],
       selectedAll:true,
       selectedCode:null,
       userData:{},
       refreshing:false,
       notoficationModalVisible:false,
       notifications:[],
       tareData:[],
       totalTareData:[],
       showRight:true,
       showLeft:false
   
    };   
    global.FarmerMainScreen = this;
  }
   static navigationOptions =  ({ navigation }) => { return {  
 
    header:null  
   }        
  };
  
  componentDidMount(){
   BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
   this.getFarmerTokenDetails();
   this.retriveData()

  }
 

  handleAndroidBackButton() {
      BackHandler.exitApp();    
      // global.FarmerMainScreen.props.navigation.goBack();
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
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }



 getFarmerTokenDetails() {
 
  APIManager.getFarmerTokenDetails((response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Token Details: " + JSON.stringify(response.data));

            this.setState({farmerData:response.data.data, farmerCodeList:[...response.data.data, {"account_user_id":"All"}], 
                           selectedCode:response.data.data.length, isLoading:false, refreshing:false}) 
  
        } else { 
          this.setState({isLoading:false, refreshing:false})           
          console.log('error', response);
         // Alert.alert('Error',  response.data.message);    
        }  
        
   }, (error)=>{
       console.log('error', error);
   })

 }  
  
  getFarmerTareDetails(selectedCode) {
  
  APIManager.getFarmerTareDetails((response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Tare Details: " + JSON.stringify(response.data));

            this.setState({tareData:response.data.data}) 
  
        } else { 
          this.setState({isLoading:false, refreshing:false})           
          console.log('error', response);
         // Alert.alert('Error',  response.data.message);    
        }  
        
   }, (error)=>{
       console.log('error', error);
   })

 }  

 getFarmerTotalTareDetails(selectedCode) {
    const data ={
      "pSwtmTrFarmerCode":selectedCode
    }
 
  APIManager.getFarmerTotalTareDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Total Tare Details: " + JSON.stringify(response.data));

             this.setState({totalTareData:response.data.data}) 
  
        } else { 
          this.setState({isLoading:false, refreshing:false})           
          console.log('error', response);
         // Alert.alert('Error',  response.data.message);    
        }  
        
   }, (error)=>{
       console.log('error', error);
   })

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
 
 componentWillMount() {
    I18n.locale = 'hi';
  } 
 
 onCodePress(index){
  if(index < this.state.farmerData.length){
     this.setState({selectedCode:index, selectedAll:false})
     this.getFarmerTareDetails(this.state.farmerData[index].account_user_id)
     this.getFarmerTotalTareDetails(this.state.farmerData[index].account_user_id)
  }else{
     this.setState({selectedCode:index,selectedAll:true})
  }
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
  this.hideMenu()
  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
  
} 

 onRefresh(){
   this.setState({selectedAll:true})
   this.getFarmerTokenDetails();
  }

  onNotificationPress(){
    //this.setState({notoficationModalVisible:!this.state.notoficationModalVisible})
     APIManager.getValueForKey('notifications', (data)=>{
       //alert(JSON.stringify(data))
       this.setState({notifications:data, notoficationModalVisible:!this.state.notoficationModalVisible})
     }, (error)=>{
       console.log(JSON.stringify(error))
     })
  }  
   
 handleScroll(event) {

   if(event.nativeEvent.contentOffset.x > 0){
      global.FarmerMainScreen.setState({showLeft:true})
   }else if(event.nativeEvent.contentOffset.x == 0){
      global.FarmerMainScreen.setState({showLeft:false})
   } 

   if(isCloseToRight(event.nativeEvent)){
     global.FarmerMainScreen.setState({showRight:false})
   }else{
    global.FarmerMainScreen.setState({showRight:true})
   }
 }



  render() {      
    return (
     <SafeAreaView style={{flex:1,backgroundColor:"#dcdcdc80"}}> 
     
      <View style={styles.header}>
        <Text style={{fontSize:18, color:"#ffffff"}}>E-CANE</Text>
        
        <View style={{flexDirection:"row"}}>
        {
          // <Icon  name='bell' type="MaterialCommunityIcons"     
          //                   style={{fontSize:25, color:'#ffffff', paddingRight:15}}
          //                   onPress={()=>this.onNotificationPress()} /> 
         } 
          <Menu 
            ref={this.setMenuRef}
            button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                           style={{fontSize:25, color:'#ffffff'}}
                           onPress={this.showMenu} /> 
           }
          >
            <MenuItem onPress={()=>this.onLanguageChange()}>{this.state.language}</MenuItem>
            <MenuDivider />
            <MenuItem onPress={() => this.onLogOut()}>Log Out</MenuItem>
          </Menu>
        </View>
      </View>


 {
   //  <View style={{ backgroundColor:'#8db301', paddingVertical:15, alignItems:"center"}}>
   //     <Text style={{color:"#ffffff", fontSize:15, fontWeight:"bold"}}>{I18n.t("My Accounts")}</Text>
   // </View>
 }
  <ScrollView>
  <View style={{backgroundColor:'#8db301', padding:15, flexDirection:"row"}}>
      <View style={{width:"60%"}}>
       <Text style={{color:"#ffffff", fontSize:15, fontFamily:"Lato-Semibold"}}>{this.state.userData.displayName}</Text>
      </View> 
      <View style={{width:"40%"}}>
       <Text style={{color:"#ffffff", fontSize:15, fontFamily:"Lato-Semibold", textAlign:"right"}}>{this.state.userData.mobile}</Text>
      </View> 
    </View>

  {(this.state.farmerData.length > 0)?
    <ScrollView refreshControl={ <RefreshControl  refreshing={this.state.refreshing}
                                                  onRefresh={this.onRefresh.bind(this)}
                                              />  }> 
                     
     <View style={[{padding:10, flexDirection:"row", justifyContent:"space-between"},styles.cardStyle]}> 
       <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Black", paddingLeft:15}}>{I18n.t("Financial Year")}</Text>
        <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Black", paddingLeft:15}}>2019 - 2020</Text>
     </View> 

     <View style={[{padding:10},styles.cardStyle]}>  
     
        <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold", paddingLeft:15}}>{I18n.t("Farmer Code")}</Text>
 
         
        <FlatList  
          data={this.state.farmerCodeList}
          extraData={this.state}
          numColumns={2}
          renderItem={({item, index}) => 
            <TouchableOpacity activeOpacity={0.5}  onPress={()=>this.onCodePress(index)} style={{elevation:8, backgroundColor:(index == this.state.selectedCode)?'#d8a800':'#006344', borderRadius:25, padding:15, margin:10, width:"45%", alignItems:"center"}}>
             <Text style={{color:"#ffffff", fontSize:15, fontFamily: "Lato-Semibold"}}>{item.account_user_id}</Text> 
            </TouchableOpacity>
          }
        />
      
     </View>    

     {(this.state.selectedAll == false)?
      <View>
       <View style={styles.cardStyle}>  
             <View style={{ paddingVertical:15, alignItems:"center", backgroundColor:"#d8a800"}}>
              <Text style={{color:"#ffffff", fontSize:18, fontFamily: "Lato-Semibold",}}>{I18n.t("Farmer Information")}</Text>
             </View> 
             <View style={{padding:10}}>
                <View style={[styles.farmerDetailsView]}>
                    <Text style={styles.farmerDetailsText}>{I18n.t("Farmer Code")} :</Text>
                    <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].account_user_id.trim()}</Text>
                </View>
                <View style={[styles.farmerDetailsView]}>
                    <Text style={styles.farmerDetailsText}>{I18n.t("Name")} :</Text>
                    <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].account_name.trim()}</Text>
                </View>
                 <View style={[styles.farmerDetailsView]}>
                    <Text style={styles.farmerDetailsText}>{I18n.t("Father's Name")}:</Text>
                    <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].G_FatherName.trim()}</Text>
                </View>
                 <View style={[styles.farmerDetailsView]}>
                    <Text style={styles.farmerDetailsText}>{I18n.t("Village")} :</Text>
                    <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].place_name.trim()}</Text>
                </View>
               </View>
               {
                //   <View style={[styles.farmerDetailsView, styles.farmerDetailsView2]}>
                //     <Text style={styles.farmerDetailsText}>{I18n.t("Token")} :</Text>
                //     <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].TokenCount}</Text>
                // </View>
                //   <View style={[styles.farmerDetailsView, styles.farmerDetailsView2]}>
                //     <Text style={styles.farmerDetailsText}>{I18n.t("Gross")} :</Text>
                //     <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].GrossCount}</Text>
                // </View>
                //   <View style={[styles.farmerDetailsView, styles.farmerDetailsView2]}>
                //     <Text style={styles.farmerDetailsText}>{I18n.t("Tare")} :</Text>
                //     <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].TareCount}</Text>
                // </View>
                //  <View style={[styles.farmerDetailsView, styles.farmerDetailsView2]}>
                //     <Text style={styles.farmerDetailsText}>{I18n.t("Net Supplied Cane (qtl)")} :</Text>
                //     <Text style={styles.farmerDetailsText}>{this.state.farmerData[this.state.selectedCode].NetSupplied}</Text>
                // </View>
              }
            </View>

          <View style={styles.cardStyle}>  
           <View style={{ paddingVertical:15, alignItems:"center"}}>
            <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Active Token")}</Text>
           </View>
            <View style={{flexDirection:"row", backgroundColor:'#d8a800', padding:10}}>
              <View style={{width:"50%"}}> 
               <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Token")}</Text> 
              </View>
              <View style={{width:"50%"}}> 
               <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Gross")}</Text>
              </View>
            </View>  
            
            <View style={{flexDirection:"row",  backgroundColor:'#ffffff'}}>   
    
              <View style={{width:"50%", paddingVertical:10}}>
               <Text style={styles.tableText}>{this.state.farmerData[this.state.selectedCode].TokenCount}</Text> 
             </View> 

             <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
             </View>
      
              <View style={{width:"50%", paddingVertical:10}}>
               <Text style={styles.tableText}>{this.state.farmerData[this.state.selectedCode].GrossCount}</Text> 
             </View>  

     
            </View> 
           
         </View>

     <View style={styles.cardStyle}> 
     
      <View style={{ paddingVertical:15, alignItems:"center"}}>
        <Text style={{color:"#000000", fontSize:15, fontWeight:"bold"}}>{I18n.t("Slip Details")}</Text>

         {(this.state.showRight == true)?
         <View style={{position:"absolute", right:10, top:15}}>
            <Icon  name='rightcircle' type="AntDesign"     
                   style={{fontSize:20, color:'#000000'}}
                     />
           </View>:null} 
        
         {(this.state.showLeft == true)?
            <View style={{position:"absolute", left:10, top:15}}>
            <Icon  name='leftcircle' type="AntDesign"     
                   style={{fontSize:20, color:'#000000'}}
                      />
           </View>:null} 
       </View>
    
       <ScrollView style={{flexDirection:'row'}} 
                   horizontal={true} 
                   showsHorizontalScrollIndicator={true}
                   onScroll={this.handleScroll}
          >
         <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Weight Date")}</Text>
            </View>
              <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_date}</Text>
                  </View> 
                } 
              />
          </View>
          <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View>  
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800',}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Weight Slip No")}</Text>
            </View>
             <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tk_slip_no}</Text>
                  </View> 
                } 
              />
          </View>
           <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Gross Wt")}</Text>
            </View>
            <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_gr_weight}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Tare Wt")}</Text>
            </View>
            <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_weight}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15,fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Deduction Wt")}</Text>
            </View>
             <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.DeductionWt}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Net Wt")}</Text>
            </View>
             <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_net_weight}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
           <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Cane Rate")}</Text>
            </View>
             <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.canerate}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Harvesting Amt")}</Text>
            </View>
            <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_harvester_amt}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Transport Rate")}</Text>
            </View>
            <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_transporter_rate}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Transport Amt")}</Text>
            </View>
             <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_transporter_amt}</Text>
                  </View> 
                } 
              />
          </View>
            <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
          </View> 
          <View style={{flexDirection:'column'}}>
            <View style={{alignItems:'center', backgroundColor:'#d8a800'}}>
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Payable Amt")}</Text>
            </View>
           <FlatList 
                data={this.state.tareData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#CEE196", alignItems:'center',}}>
                    <Text style={{padding:10}}>{item.swtm_tr_net_amt}</Text>
                  </View> 
                } 
              />
          </View>
        </ScrollView> 
       {
         // <View style={{backgroundColor:"#", position:"absolute", right:10, bottom:10, borderRadius:80, width:40, height:40, alignItems:"center", justifyContent:"center"}}>
         //    <Icon  name='bell' type="MaterialCommunityIcons"     
         //              style={{fontSize:20, color:'#000000'}}
         //              onPress={()=>this.onNotificationPress()} />
         //   </View>  
       }  
        
     </View>
      
     
         <View style={styles.cardStyle}> 
     
             <View style={{ paddingVertical:15, alignItems:"center", backgroundColor:"#d8a800"}}>
              <Text style={{color:"#ffffff", fontSize:18, fontFamily: "Lato-Semibold",}}>{I18n.t("Total")}</Text>
             </View>
          {(this.state.totalTareData.length > 0)?
            <View>
             <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Slip")}</Text>
                  <Text style={{}}>{this.state.totalTareData[0].totalslip}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold" }}>{I18n.t("Total Wt")}</Text>
                  <Text style={{}}>{this.state.totalTareData[0].totalwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Harvesting Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData[0].harvesterwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Transport Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData[0].transporterwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold" }}>{I18n.t("Total")} {I18n.t("Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData[0].totalamount}</Text>
              </View>
            </View>:
             <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
             </View>}  
        </View>

     </View>:  
    
     <View>

     <View style={styles.cardStyle}>  
       <View style={{ paddingVertical:15, alignItems:"center"}}>
        <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Black"}}>{I18n.t("Active Token")}</Text>
       </View>
        <View style={{flexDirection:"row", backgroundColor:'#d8a800', padding:10}}>
          <View style={{width:"28%"}}>
           <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Farmer Code")}</Text> 
          </View>
          <View style={{width:"24%"}}> 
           <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Token")}</Text> 
          </View>
          <View style={{width:"24%"}}> 
           <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Gross")}</Text>
          </View>
          <View style={{width:"24%"}}>  
           <Text style={{color:"#000000", fontSize:15,fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Tare")}</Text> 
          </View> 
        </View>  
        
        <View style={{flexDirection:"row",  backgroundColor:'#ffffff'}}>   
         <View style={{width:"28%"}}>
          
             <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.account_user_id}</Text> 
                  </View> 
                } 
              />
             
          
         </View>   

         <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
         </View>     
       
          <View style={{width:"24%"}}>
           
            <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.TokenCount}</Text> 
                  </View> 
                }
              />
             
         </View>  

         <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
         </View>
  
           <View style={{width:"24%"}}>
           
            <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.GrossCount}</Text> 
                  </View> 
                }
              />
          
         </View>  

 
         <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
         </View>
 
           <View style={{width:"24%"}}>
           
            <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.TareCount}</Text> 
                  </View> 
                }
              />
         
         </View>  
        </View> 
       
     </View> 
   
    <View style={styles.cardStyle}> 
      <View style={{ paddingVertical:15, alignItems:"center"}}>
        <Text style={{color:"#000000", fontSize:15,fontFamily: "Lato-Black"}}>{I18n.t("Supplied Cane")}</Text>
       </View> 
        <View style={{flexDirection:"row", backgroundColor:'#d8a800', padding:10}}>
          <View style={{width:"30%"}}>
           <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Farmer Code")}</Text> 
          </View>
          <View style={{width:"70%"}}> 
           <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold",  textAlign:"center"}}>{I18n.t("Net Supplied Cane (qtl)")}</Text> 
          </View>
        </View>  
        
        <View style={{flexDirection:"row",  backgroundColor:'#ffffff'}}>   
         <View style={{width:"30%"}}>
           
              <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                  <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.account_user_id}</Text> 
                  </View>
                }
              />
         
         </View> 

         <View style={{width: StyleSheet.hairlineWidth, borderWidth: StyleSheet.hairlineWidth, borderColor:"#dcdcdc",}}>
         </View> 
          
          <View style={{width:"70%"}}>
           
             <FlatList 
                data={this.state.farmerData}
                renderItem={({item, index}) => 
                 <View style={{backgroundColor:(index % 2 === 0)?"#ffffff":"#d3d3d3", paddingVertical:10}}>
                   <Text style={styles.tableText}>{item.NetSupplied}</Text> 
                  </View>
               }
              />
         
         </View>  
   
        </View> 
     
     </View> 
  
     </View>}
 
    </ScrollView>:
      <View style={{height:"90%", justifyContent:"center", alignItems:"center"}}>
       <Text style={{fontSize:20, fontFamily: "Lato-Semibold"}}>No Data Found</Text>
      </View>}


   <Modal              
        animationType="slide"   
        transparent={true}   
        visible={this.state.notoficationModalVisible}
        onRequestClose={() => {
          this.setState({notoficationModalVisible:false});
        }}>
       <View  style={{ flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'}}>
        <View style={{ width: '85%', height:"85%", backgroundColor:'#ffffff', borderRadius:10, padding:15}}>
          <Text style={{fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center", fontSize:18}}>Notifications</Text>

           <FlatList  
            data={this.state.notifications}
            extraData={this.state}
            numColumns={1}
            renderItem={({item, index}) => 
              <View style={{paddingTop:10}}>
               <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold"}}>{item.body}</Text> 
              </View >
            }
          />
        </View>
       </View>
    </Modal>
    
        </ScrollView>
    </SafeAreaView>     
    )   
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

});