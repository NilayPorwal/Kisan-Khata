import React, { Component } from 'react';
import {
  Dimensions,
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
  RefreshControl, Image
} from 'react-native'; 
 
import I18n, { getLanguages } from 'react-native-i18n';
import { Icon, Card } from 'native-base';
import APIManager from './../APIManager';
import { encrypt, decrypt } from "./../AESEncryption"
var base64 = require('base-64');  
import axios from 'axios';
var dateFormat = require('dateformat');
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Storage from 'react-native-storage';
const {height, width} = Dimensions.get('window');

    
I18n.fallbacks = true;
   
I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),

};

const isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToRight = 20;
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
}

export default class TareDetailsScreen extends Component {

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
       refreshing:true,
       notoficationModalVisible:false,
       notifications:[],
       tareData:[],
       totalTareData:{},
       showRight:true,
       showLeft:false,
       farmerCode:this.props.navigation.state.params.farmerCode,
       farmerDetails:this.props.navigation.state.params.farmerDetails
   
    };   
    global.TareDetailsScreen = this;
  }
   static navigationOptions =  ({ navigation }) => {
    return {
        header:null  
   }        
  };
  
  componentDidMount(){
   BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
   //this.getFarmerTokenDetails();
   this.getFarmerTareDetails();
   this.getFarmerTotalTareDetails();
   this.retriveData()

  }
 

  handleAndroidBackButton() {
      //BackHandler.exitApp();    
      global.TareDetailsScreen.props.navigation.goBack();
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
  
  getFarmerTareDetails() {
    const data = {
        "pSwtmTrFarmerCode": this.state.farmerCode 
      }
  
  APIManager.getFarmerTareDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Tare Details: " + JSON.stringify(response.data));
          this.setState({tareData:response.data.data.reverse(), refreshing:false})

            
            // for(let i=0; i<response.data.data.length; i++){
            //   if(response.data.data[i].swtm_tr_farmer_code == this.state.farmerCode){
            //      this.setState({tareData:[...this.state.tareData, response.data.data[i]]})
            //   }
            // }
            
        } else { 
          this.setState({isLoading:false, refreshing:false})           
          console.log('error', JSON.stringify(response));
         // Alert.alert('Error',  response.data.message);    
        }  
        
   }, (error)=>{
       this.setState({isLoading:false, refreshing:false})           
       console.log('error', error);
   })

 }  

 getFarmerTotalTareDetails() {
  const data = {
        "pSwtmTrFarmerCode": this.state.farmerCode 
      }
    
  APIManager.getFarmerTotalTareDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Total Tare Details: " + JSON.stringify(response.data));

             //this.setState({totalTareData:response.data.data})
              for(let i=0; i<response.data.data.length; i++){
              if(response.data.data[i].swtm_tr_farmer_code == this.state.farmerCode){
                 this.setState({totalTareData:response.data.data[i]})
              }
            }
  
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
   this.getFarmerTareDetails();
   this.getFarmerTotalTareDetails()
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
      global.TareDetailsScreen.setState({showLeft:true})
   }else if(event.nativeEvent.contentOffset.x == 0){
      global.TareDetailsScreen.setState({showLeft:false})
   } 

   if(isCloseToRight(event.nativeEvent)){
     global.TareDetailsScreen.setState({showRight:false})
   }else{
     global.TareDetailsScreen.setState({showRight:true})
   }
 }



  render() {      
    return (
     <SafeAreaView style={{flex:1,backgroundColor:"#dcdcdc80"}}> 
     
      <View style={styles.header}>
       <View style={{flexDirection:"row",alignItems:"center"}}>
         <TouchableOpacity onPress={()=>this.handleAndroidBackButton()}>
          <Icon type="AntDesign" name="arrowleft" style={{fontSize:15, color:"#ffffff"}} />
         </TouchableOpacity> 
         <Image
                style={{width:100, height:50}}
                resizeMode="contain"
                source={require('./../../assets/logo_white.png')}
            />
       </View> 
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

    <ScrollView style={{paddingHorizontal:5}} refreshControl={ <RefreshControl  refreshing={this.state.refreshing}
                                                                                onRefresh={this.onRefresh.bind(this)}
                                                                            />  }>  

      <View>
      {

       <Card style={styles.cardStyle}>  
         <View style={{ paddingVertical:12, alignItems:"center", backgroundColor:"#d8a800"}}>
          <Text style={{color:"#ffffff", fontSize:15, fontFamily: "Lato-Semibold",}}>{I18n.t("Farmer Information")}</Text>
         </View> 
      {(this.state.farmerDetails.length > 0)?
         <View style={{padding:10}}>
            <View style={[styles.farmerDetailsView]}>
                <Text style={styles.farmerDetailsText}>{I18n.t("Farmer Code")} :</Text>
                <Text style={styles.farmerDetailsText}>{this.state.farmerDetails[0].account_user_id}</Text>
            </View>
            <View style={[styles.farmerDetailsView]}>
              <View style={{width:"20%"}}>
                <Text style={styles.farmerDetailsText}>{I18n.t("Name")} :</Text>
              </View>  
               <View style={{width:"80%"}}>
              {(this.state.farmerDetails[0].account_name_hindi == null || this.state.farmerDetails[0].account_name_hindi == "null" || this.state.farmerDetails[0].account_name_hindi.trim().length == 0)?  
                <Text style={[styles.farmerDetailsText, {textAlign:"right"}]}>{this.state.farmerDetails[0].account_name}</Text>:
                <Text style={[styles.farmerDetailsText, {textAlign:"right"}]}>{this.state.farmerDetails[0].account_name_hindi}</Text>}
              </View>
            </View>
             <View style={[styles.farmerDetailsView]}>
                <Text style={styles.farmerDetailsText}>{I18n.t("Village")} :</Text>
                <Text style={styles.farmerDetailsText}>{this.state.farmerDetails[0].village_name}</Text>
            </View>
           </View>:
           <View style={styles.noDataView}>                            
            <Text style={styles.noDataText}>No Data Found</Text>
           </View>}
          
       </Card>
     }

     <Card style={styles.cardStyle}> 
     
      <View style={{ paddingVertical:15, alignItems:"center"}}>
        <Text style={{color:"#000000", fontSize:15, fontWeight:"bold"}}>{I18n.t("Weight Details")}</Text>

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
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Date")}</Text>
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
              <Text style={{fontSize:15, fontFamily: "Lato-Semibold", margin:10, }}>{I18n.t("Slip No")}</Text>
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
        
     </Card>
      
     
         <Card style={styles.cardStyle}> 
     
             <View style={{ paddingVertical:12, alignItems:"center", backgroundColor:"#d8a800"}}>
              <Text style={{color:"#ffffff", fontSize:15, fontFamily: "Lato-Semibold",}}>{I18n.t("Total")}</Text>
             </View>
            <View>
             <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Slip")}</Text>
                  <Text style={{}}>{this.state.totalTareData.totalslip}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold" }}>{I18n.t("Total Wt")}</Text>
                  <Text style={{}}>{this.state.totalTareData.totalwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Harvesting Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData.harvesterwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold"}}>{I18n.t("Total")} {I18n.t("Transport Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData.transporterwt}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:10, backgroundColor:'#CEE196',}}>
                  <Text style={{fontSize:15, fontFamily: "Lato-Semibold" }}>{I18n.t("Total")} {I18n.t("Amt")}</Text>
                  <Text style={{}}>{this.state.totalTareData.totalamount}</Text>
              </View>
            </View> 
        </Card>

     </View>
    </ScrollView>


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
    
    </SafeAreaView>     
    )   
  }   
}         

const styles = StyleSheet.create({
  header: {
    elevation:5, height:height*0.075, backgroundColor:"#8db301", justifyContent:"space-between", flexDirection:"row", alignItems:"center", paddingHorizontal:15
  },

  cardStyle:{
   margin:10, backgroundColor:'#ffffff', borderRadius:5
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