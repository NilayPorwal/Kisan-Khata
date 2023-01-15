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
import { Card, DatePicker} from 'native-base';

const {height, width} = Dimensions.get('window');
I18n.fallbacks = true;
   
I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),

};

export default class ReportScreen extends Component {
      constructor(props) {
          super(props);
          this.state = {
            isLoading:true,
            userData:{},
            requestList:[],
            from:this.props.navigation.state.params.from,
            farmerCodeList:this.props.navigation.state.params.farmerCodeList,
            fromDate:new Date(),
            toDate:new Date()
          }
          global.ReportScreen =this;
    }


    static navigationOptions = {
        header: null,
             
    }; 

  async componentDidMount(){
      if(APIManager.isDev != true){ 
       await APIManager.setHost()
      }
       BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
     
       this.getRequestReport()

    }

    handleAndroidBackButton() {
        global.ReportScreen.props.navigation.goBack();
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

  getRequestReport() {
    this.setState({requestList:[]})  

    const data = {
      pfarmer_code:(this.state.farmerCodeList.length > 0)?this.state.farmerCodeList[0].account_user_id:"",
    }
    APIManager.getRequestReport(data, (response)=>{
        console.log(JSON.stringify(response));  
        this.setState({isLoading:false})            
         if (response.data.status === "SUCCESS") {
            response.data.data = JSON.parse(decrypt(response.data.data.content));
            console.log("Request List: " + JSON.stringify(response.data));
            let requestList = response.data.data
            for(let i=0; i<requestList.length; i++){
               if(requestList[i].request_status == "0" && this.state.from == "0"){
                this.setState({requestList:[...this.state.requestList, requestList[i]]})  

               }
               else if(requestList[i].request_status != "2" && this.state.from == "1"){
                this.setState({requestList:[...this.state.requestList, requestList[i]]}) 

               }
            }   
          } else {      
            console.log('error', response);
           // Alert.alert('Error',  response.data.message);    
          }  
          
     }, (error)=>{
        this.setState({isLoading:false}) 
         console.log('error', error);
     })

   }

   getRequestReportByDate() {
    this.setState({requestList:[], isLoading:true})  

    const data = {
      pfarmer_code:(this.state.farmerCodeList.length > 0)?this.state.farmerCodeList[0].account_user_id:"",
      pstartdate:dateFormat(this.state.fromDate, "yyyy-mm-dd"),
      penddate:dateFormat(this.state.toDate, "yyyy-mm-dd")
    }
    console.log(JSON.stringify(data));
    APIManager.getRequestReportByDate(data, (response)=>{
        console.log(JSON.stringify(response));  
        this.setState({isLoading:false})            
         if (response.data.status === "SUCCESS") {
            response.data.data = JSON.parse(decrypt(response.data.data.content));
            console.log("Request List: " + JSON.stringify(response.data));
            let requestList = response.data.data
            for(let i=0; i<requestList.length; i++){
               if(requestList[i].request_status == "0" && this.state.from == "0"){
                this.setState({requestList:[...this.state.requestList, requestList[i]]})  

               }
               else if(requestList[i].request_status != "2" && this.state.from == "1"){
                this.setState({requestList:[...this.state.requestList, requestList[i]]}) 

               }
            }   
          } else {      
            console.log('error', response);
           // Alert.alert('Error',  response.data.message);    
          }  
          
     }, (error)=>{
        this.setState({isLoading:false}) 
         console.log('error', error);
     })

   }

  _onCancel(item){
    Alert.alert(
      "कृपया पुष्टि करें",
      'क्या आप आवेदन रद्द करना चाहते हैं ?',
      [
        { 
          text: 'नहीं',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'हाँ', onPress: () => this.cancelRequest(item)},
      ],
      {cancelable: false},
    );
  }

   cancelRequest(item) {
    const data = {
      pRqAiId:item.rq_ai_id,
      pReqstatus:2,
      pUpdateby:this.state.userData.userId
    }
    this.setState({isLoading:true})
    APIManager.cancelRequest(data, (response)=>{
        console.log(JSON.stringify(response));  
         if (response.data.status === "SUCCESS") {
            response.data.data = JSON.parse(decrypt(response.data.data.content));
            console.log("Cancel Request: " + JSON.stringify(response.data));
            this.getRequestReport()
            Alert.alert("", response.data.data[0].serverResponseMsg)
          } else { 
            this.setState({isLoading:false})            
            console.log('error', response);
            Alert.alert('Error',  response.data.message);    
          }  
          
     }, (error)=>{
        this.setState({isLoading:false}) 
         console.log('error', error);
     })

   }



 componentWillMount() {
    I18n.locale = 'hi';
  } 


  onLanguageChange(){
     I18n.locale = (this.state.language=="हिंदी")?"hi":"en";
    this.setState({language:(this.state.language=="हिंदी")?"English":"हिंदी"})
  
  }

  renderContent(item, index){
    return (
      <View style={{flexDirection:"row", padding:10}}> 
      <View style={{width:"15%"}}> 
        <Text style={styles.textStyle}>{index+1}</Text>
       </View>

       <View style={{width:"30%", alignItems:"center"}}> 
        <Text style={styles.textStyle}>{item.request_amt}</Text>
       </View>
       
       <View style={{width:"30%", alignItems:"center"}}> 
         <Text style={styles.textStyle}>{item.request_date}</Text>
       </View>
       <View style={{width:"25%",  alignItems:"flex-end"}}> 
        {(this.state.from == "0")?
           <TouchableOpacity onPress={()=>this._onCancel(item)}  style={{...styles.updateBtn}}>
            <Text style = {styles.btnText}>{I18n.t("Delete")}</Text>
           </TouchableOpacity>:
            <Text style = {styles.textStyle}>{item.approved_date}</Text>
           }
       </View> 
     </View> 
    )
  }


  render() {

    return (
       <ImageBackground source={require('./../../assets/Splash.png')} style={{flex:1}}>
        <View style={styles.header}>
           <TouchableOpacity onPress={()=>this.handleAndroidBackButton()}>
            <Icon  type="AntDesign" name="arrowleft" style={{fontSize:15, color:"#ffffff"}} />         
           </TouchableOpacity>
           <Text style={{fontSize: width*0.04, fontFamily:'Lato-Semibold', color: "#fff", paddingLeft:15}}>{(this.state.from == "0")?I18n.t("Cancel"):I18n.t("Report")}</Text>
         </View>
          <View style={{padding:10}}>
          {(this.state.from == "1")?
            <Card style={{padding:10}}>
              <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
               <Text style={{fontSize: width*0.04, fontFamily:'Lato-Semibold', color: "#000"}}>कब से</Text>
                <View style={{borderWidth:1, borderRadius:5}}>
                    <DatePicker
                        defaultDate={new Date()}
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        textStyle={{ color: "#006344" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={(fromDate)=>this.setState({fromDate})}
                        disabled={false}
                        />
                    </View>
                <Text style={{fontSize: width*0.04, fontFamily:'Lato-Semibold', color: "#000"}}>कब तक</Text>
                <View style={{borderWidth:1, borderRadius:5}}>
                    <DatePicker
                        defaultDate={new Date()}
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        textStyle={{ color: "#006344" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={(fromDate)=>this.setState({fromDate})}
                        disabled={false}
                        />
                 </View>
                </View>    
                <TouchableOpacity onPress={()=>this.getRequestReportByDate()}  style={{...styles.updateBtn, alignSelf:"center", width:"40%", alignItems:"center", marginTop:10}}>
                   <Text style = {styles.btnText}>{I18n.t("Search")}</Text>
               </TouchableOpacity>     
            </Card>:null}
          
            
             <Card style={{margin:15}}>           
             {(this.state.isLoading == false)? 
             <>
             <View style={styles.row}>
                <View style={{width:"15%"}}> 
                  <Text style={styles.textStyle}>{I18n.t("S No")}</Text>
                </View>

                <View style={{width:"30%", alignItems:"center"}}> 
                  <Text style={{...styles.textStyle, textAlign:"center"}}>{I18n.t("Req Qty")}</Text>
                </View>
                
                <View style={{width:"30%", alignItems:"center"}}> 
                    <Text style={styles.textStyle}>{I18n.t("Req Date")}</Text>
                </View>
                <View style={{width:"25%", alignItems:"flex-end"}}> 
                 {(this.state.from == "0")?
                  <Text style={styles.textStyle}>{I18n.t("Action")}</Text>:
                  <Text style={styles.textStyle}>{I18n.t("Accept Date")}</Text>}
                </View>
             </View> 
             {(this.state.requestList.length > 0)?
              <FlatList  
                data={this.state.requestList}
                extraData={this.state}
                renderItem={({item, index}) => this.renderContent(item, index) }
              />:
              <View style={styles.noDataView}>                            
               <Text style={styles.noDataText}>{I18n.t("No Data Found")}</Text>
             </View>}
              </>:<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>}
            
           </Card>

         </View>
              
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    elevation:5, height:50, backgroundColor:"#8db301", flexDirection:"row", alignItems:"center", paddingHorizontal:15
  },

  textStyle:{
    fontSize: width*0.035, fontFamily:'Lato-Semibold', color: "#000000"
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
    margin:15, borderBottomWidth:1, borderColor:'#000', borderRadius:5,
 },
  modalInputInner: {
      width:"82%", fontSize:15,  paddingLeft:10
  },
  updateBtn: {
    backgroundColor:'#8db301', elevation:4, borderRadius:50, paddingHorizontal:12, paddingVertical:7
  },
  btnText:{
    fontSize:width*0.04, fontFamily: "Lato-Semibold", color:'#FFFFFF'
   },   

});
