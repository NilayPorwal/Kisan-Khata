import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor,TouchableOpacity, Modal, TextInput,
             AsyncStorage, RefreshControl, ScrollView, AppState, BackHandler, Alert, Image} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header,Item,Input, Left, Body, Right, Button, Icon, Title,  Content, Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LineChart} from 'react-native-charts-wrapper';
//import APIManager from './Managers/APIManager';
import APIManager from './../APIManager';
import ERPDashboard from './ERPDashboard'
import  StatsScreen from './StatsScreen';
import SummaryScreen from './SummaryScreen'
import LiveDataScreen from './LiveDataScreen'
import PaymentScreen from './PaymentScreen'
import LoginScreen from './LoginScreen'
import util from 'util';
let dateFormat = require('dateformat');
let now =  new Date()
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
    
    
    let c0 =   '#056664'   
    let c1 =   '#FECA06'
    let c2 =   '#FFD08C' 
    let c3 =   '#69330D'   
    let c4 =   '#63358F'
    let c5 =   '#CC0103'
    let c6 =   '#007ed6'
    let c7 =   '#ff7201'
    let c8 =   '#63105F'
    let c9 =   '#4F5150'
    let c10 =  '#966EFB'
    let c11 =  '#C8857E'
 
    let cr0 =   processColor(c0)   
    let cr1 =   processColor(c1)
    let cr2 =   processColor(c2) 
    let cr3 =   processColor(c3)
    let cr4 =   processColor(c4)
    let cr5 =   processColor(c5)
    let cr6 =   processColor(c6)
    let cr7 =   processColor(c7)
    let cr8 =   processColor(c8)
    let cr9 =   processColor(c9)
    let cr10 =   processColor(c10)
    let cr11 =   processColor(c11)

    //const tableTitle = []
    //const tableData = []
 
 
export default class AdminScreen extends Component {
   constructor(props) {  
       super(props);    
         global.AdminScreen = this; 
      this.state = { 
        tableData:[],
        tableTitle:[], 
        tableData1:[],
        villageList:[],
        selected:7, 
         refreshing: false,  
         loading:true,  
         selectedTab:'live',
         Date:new Date(),
         curTime:'',
          data:{}, 
          ModalVisible:false,
          api:'http://erp.mspil.in:8080/',
         modeWiseData:[], 
         zoneWiseData:[],
         dayWiseData:[],  
      data1: { 
        dataSets: [{
          values: [{y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}, {y: 0}],
          label: 'HOURELY TARE WEIGHT',
          config: {
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 90,
            highlightColor: processColor('red'),
            lineWidth: 3,
            drawCubicIntensity: 0.4,
            circleRadius: 5, 
            drawHighlightIndicators: true,
            color: processColor('#0d7fde'),
            drawFilled: true,
            fillColor: processColor('#0d7fde'),
            fillAlpha: 20,   
            circleColor: processColor('#0d7fde'),
            drawValues: true,
            valueTextSize: 12,
          }
        }], 
      },
  
      taredata1:{},
      taredata2:{}, 
      taredata3:{}, 
      message:123,
      userData:{}  
       
     }    

    global.AdminScreen = this;
   }      

    static navigationOptions = {
       header: null,
            
   };  

  handleAndroidBackButton() {
      if(global.AdminScreen.state.userData.roleName == "SUPER_ADMIN"){
          global.AdminScreen.props.navigation.goBack();
        }else{
            BackHandler.exitApp(); 
        }
         return true;
       }        
            
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }
    

 async componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton); 
   
   setInterval( () => {
      this.setState({
        curTime : new Date().toLocaleTimeString()
      })
    },1000)
   
     
    await   this.getLiveTareSummary()
    await   this.getLiveModeWiseSummary()
    await   this.getTareSummary()  
    await   this.getModeWiseSummary()  
    await   this.getZoneWiseSummary() 
    await   this.getDayWiseSummary()
    await   this.getVillageList() 
    await   this.retriveData() 

      
  
  }

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));
      this.setState({userData:data})
       //this.getFarmerTareDetails();

    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }

 
 
  setDate(newDate) {
    let now =  newDate
    let date = dateFormat(now, "yyyy-mm-dd"); 
    this.setState({ Date: date, modeWiseData:[], zoneWiseData:[],  dayWiseData:[],dataBar1:{}, dataBar2:{}, dataLine1:{}, 
                    dataLine2:{}, dataPie1:{}, dataPie2:{}, yardBalance:null, crushingWeight:null, totalWeight:null }, ()=>{this.getTareSummary(); this.getModeWiseSummary(); this.getZoneWiseSummary(); this.getDayWiseSummary()});
  } 
 

 async onSubmit(){  
    await AsyncStorage.setItem('api', this.state.api);
    await AsyncStorage.getItem('api').then((value) => {APIManager.host = value}) 
    await this.getLiveTareSummary()
    await this.getLiveModeWiseSummary()
    await this.getTareSummary()
    await this.getModeWiseSummary() 
    await this.getZoneWiseSummary() 
    await this.getDayWiseSummary()
    await this.setState({ModalVisible:false}) 
   }
   
  


getVillageList(){

     APIManager.getVillageList(
        (responseJson)=> {
       //  alert(JSON.stringify(responseJson));
        if(responseJson.status=='SUCCESS'){
         this.setState({villageList:responseJson.data, refreshing:false})

          }
       }, (error)=>{
         this.setState({loading:false})
         console.log(JSON.stringify(error));
       })
  
   }

  getModeWiseSummary(){
   
    let date = dateFormat(this.state.Date, "yyyy-mm-dd"); 
   
    APIManager.getModeWiseSummary(date, 
        (responseJson)=> {
         console.log("Mode Wise Summary", JSON.stringify(responseJson));
         if(responseJson.data.status=='SUCCESS'){
         this.setState({modeWiseData:responseJson.data.data, refreshing:false}) 
          
          }    
       }, (error)=>{
        this.setState({loading:false})
         console.log(util.inspect(error, {showHidden: false, depth: null}));
       })     
      
     }

  getLiveModeWiseSummary(){
     
    let date = dateFormat(now, "yyyy-mm-dd"); 
 
    APIManager.getLiveModeWiseSummary(date, 
        (responseJson)=> {
        console.log("Live Mode Wise Summary", JSON.stringify(responseJson));   
      this.setState({refreshing:false})
        // alert(JSON.stringify(responseJson));
        if(responseJson.data.status=='SUCCESS'){
        this.setState({tableData:[], tableTitle:[], loading:false}, ()=>{
         arr = responseJson.data.data  
         for(var i=0; i<arr.length; i++){
          
           const tableRow = [arr[i].pTotToken, arr[i].pAvgTkYardBal, arr[i].pTotGross, arr[i].pAvgGrYardBal ]
           this.state.tableTitle.push(arr[i].pMName)
           this.state.tableData.push(tableRow)
          } 
          })  
         }    
       }, (error)=>{
        this.setState({loading:false})
         console.log(JSON.stringify(error));
       })     
      
   }  


  getZoneWiseSummary(){
     
    let date = dateFormat(this.state.Date, "yyyy-mm-dd");


    APIManager.getZoneWiseSummary(date,
        (responseJson)=> {
          console.log("Zone Wise summary", JSON.stringify(responseJson));
        if(responseJson.data.status=='SUCCESS'){
          this.setState({zoneWiseData:responseJson.data.data, refreshing:false}) 
        
         }      
       }, (error)=>{
         this.setState({loading:false})
         console.log(JSON.stringify(error));
       })       
      
   }    

   getDayWiseSummary(){
       

    let date = dateFormat(this.state.Date, "yyyy-mm-dd"); 

      APIManager.getDayWiseSummary(date,  this.state.selected, 
        (responseJson)=> {
         console.log("day wise summary", JSON.stringify(responseJson));
        if(responseJson.data.status=='SUCCESS'){
          this.setState({dayWiseData:responseJson.data.data, refreshing:false})  
         }    
       }, (error)=>{
         console.log(JSON.stringify(error));
       })      
       
   } 

   getLiveTareSummary(){
     

    let date = dateFormat(now, "yyyy-mm-dd"); 


    APIManager.getTareSummary(date, 
        (response)=> {
        console.log("Live tare Summary" + JSON.stringify(response));
        const responseJson = response.data
        if(responseJson.status=='SUCCESS'){

        this.setState({liveYardBalance: responseJson.data[0].pYardBalance, liveCrushingWeight: responseJson.data[0].pNetWeightCrush, liveTotalWeight:responseJson.data[0].pTotApxNetWeight, refreshing:false}) 
        
        //this.handleAppStateChange(responseJson.data[0].pYardBalance.toString())
            

          const tableData1= [
              [ responseJson.data[0].pH8Twt,  responseJson.data[0].pH8Tcwt],
              [ responseJson.data[0].pH9Twt , responseJson.data[0].pH9Tcwt],
              [ responseJson.data[0].pH10Twt, responseJson.data[0].pH10Tcwt],
              [ responseJson.data[0].pH11Twt, responseJson.data[0].pH11Tcwt],
              [ responseJson.data[0].pH12Twt, responseJson.data[0].pH12Tcwt],
              [ responseJson.data[0].pH13Twt, responseJson.data[0].pH13Tcwt], 
              [ responseJson.data[0].pH14Twt, responseJson.data[0].pH14Tcwt],            
              [ responseJson.data[0].pH15Twt, responseJson.data[0].pH15Tcwt], 
              [ responseJson.data[0].pH16Twt, responseJson.data[0].pH16Tcwt], 
              [ responseJson.data[0].pH17Twt, responseJson.data[0].pH17Tcwt], 
              [ responseJson.data[0].pH18Twt, responseJson.data[0].pH18Tcwt], 
              [ responseJson.data[0].pH19Twt, responseJson.data[0].pH19Tcwt], 
              [ responseJson.data[0].pH20Twt, responseJson.data[0].pH20Tcwt], 
              [ responseJson.data[0].pH21Twt, responseJson.data[0].pH21Tcwt], 
              [ responseJson.data[0].pH22Twt, responseJson.data[0].pH22Tcwt], 
              [ responseJson.data[0].pH23Twt, responseJson.data[0].pH23Tcwt],
              [ responseJson.data[0].pH0Twt,  responseJson.data[0].pH0Tcwt],
              [ responseJson.data[0].pH1Twt,  responseJson.data[0].pH1Tcwt],
              [ responseJson.data[0].pH2Twt,  responseJson.data[0].pH2Tcwt],
              [ responseJson.data[0].pH3Twt,  responseJson.data[0].pH3Tcwt],
              [ responseJson.data[0].pH4Twt,  responseJson.data[0].pH4Tcwt],
              [ responseJson.data[0].pH5Twt,  responseJson.data[0].pH5Tcwt],
              [ responseJson.data[0].pH6Twt,  responseJson.data[0].pH6Tcwt],
              [ responseJson.data[0].pH7Twt,  responseJson.data[0].pH7Tcwt], 
              [responseJson.data[0].pHTwt,    responseJson.data[0].pHTcwt]
         ]
         this.setState({tableData1:tableData1 }) 

      }
     }, (error)=>{
         console.log(JSON.stringify(error));
       })
    }  
  

  getTareSummary(){
     let value1 = []
     let value2 = []

    let date = dateFormat(this.state.Date, "yyyy-mm-dd"); 
    APIManager.getTareSummary(date, 
        (response)=> {
         console.log("Tare Summary" + JSON.stringify(response));
        const responseJson = response.data
        
        if(responseJson.status=='SUCCESS'){

            this.setState({yardBalance: responseJson.data[0].pYardBalance, crushingWeight: responseJson.data[0].pNetWeightCrush, totalWeight:responseJson.data[0].pTotApxNetWeight, refreshing:false}) 

             value1 = [{y:parseInt(responseJson.data[0].pH8Twt)}, {y: parseInt(responseJson.data[0].pH9Twt)}, {y:parseInt(responseJson.data[0].pH10Twt)}, {y:parseInt(responseJson.data[0].pH11Twt)},
                          {y:parseInt(responseJson.data[0].pH12Twt)}, {y:parseInt(responseJson.data[0].pH13Twt)}, {y:parseInt(responseJson.data[0].pH14Twt)}, {y:parseInt(responseJson.data[0].pH15Twt)}, 
                          {y:parseInt(responseJson.data[0].pH16Twt)}, {y: parseInt(responseJson.data[0].pH17Twt)},{y:parseInt(responseJson.data[0].pH18Twt)}, {y:parseInt(responseJson.data[0].pH19Twt)}]
            
             value2 = [{y:parseInt(responseJson.data[0].pH20Twt)}, {y:parseInt(responseJson.data[0].pH21Twt)}, {y:parseInt(responseJson.data[0].pH22Twt)}, {y:parseInt(responseJson.data[0].pH23Twt)},
                           {y:parseInt(responseJson.data[0].pH0Twt)}, {y: parseInt(responseJson.data[0].pH1Twt)}, {y:parseInt(responseJson.data[0].pH2Twt)}, {y:parseInt(responseJson.data[0].pH3Twt)}, 
                           {y:parseInt(responseJson.data[0].pH4Twt)}, {y:parseInt(responseJson.data[0].pH5Twt)},  {y:parseInt(responseJson.data[0].pH6Twt)}, {y:parseInt(responseJson.data[0].pH7Twt)},]

               
            
           this.setState({

                 dataBar1: {
                     dataSets: [{
                       values:value1,
                       label: 'HOURELY TARE WEIGHT',
                       config: {
                         color: processColor('teal'),
                         barShadowColor: processColor('lightgrey'),
                         highlightAlpha: 90,
                         highlightColor: processColor('red'),
                       }
                     }],

                       config: {
                         barWidth: 0.6,
                       }
                   },
                      

                    dataBar2: {
                        dataSets: [{
                          values:value2,
                          label:  'HOURELY TARE WEIGHT',
                          config: {
                            color: processColor('teal'),
                            barShadowColor: processColor('lightgrey'),
                            highlightAlpha: 90,
                            highlightColor: processColor('red'),
                          }
                        }],

                          config: {
                            barWidth: 0.6,
                          }
                      } 
               }) 

             this.setState({        
           
                dataLine1: {
                  dataSets: [{

                    values: value1,
                    label: 'HOURELY TARE WEIGHT', 
                    config: {  
                      barShadowColor: processColor('lightgrey'),
                      highlightAlpha: 90,
                      highlightColor: processColor('red'),
                      lineWidth: 2,
                      drawCubicIntensity: 0.4,
                      circleRadius: 5, 
                      drawHighlightIndicators: true,
                      color: processColor('#0d7fde'),    
                      drawFilled: true,  
                      fillColor: processColor('#0d7fde'),
                      fillAlpha: 20,   
                      circleColor: processColor('#0d7fde'),
                      drawValues: true,
                      valueTextSize: 10,

           
                    }        
                  }], 
                },

                 dataLine2: {
                  dataSets: [{

                    values: value2,
                    label: 'HOURELY TARE WEIGHT', 
                    config: {  
                      barShadowColor: processColor('lightgrey'),
                      highlightAlpha: 90,
                      highlightColor: processColor('red'),
                      lineWidth: 3,
                      drawCubicIntensity: 0.4,
                      circleRadius: 5, 
                      drawHighlightIndicators: true,
                      color: processColor('#0d7fde'),    
                      drawFilled: true,
                      fillColor: processColor('#0d7fde'),
                      fillAlpha: 20,   
                      circleColor: processColor('#0d7fde'),
                      drawValues: true,
                      valueTextSize: 10,
           
                    }        
                  }], 
                }
              })

             


          this.setState({
                 dataPie1: {
                  dataSets: [{
                    values: [{value: parseInt(responseJson.data[0].pH8Tcwt), label:responseJson.data[0].pH8Twt},
                      {value: parseInt(responseJson.data[0].pH9Tcwt), label: responseJson.data[0].pH9Twt},
                      {value: parseInt(responseJson.data[0].pH10Tcwt), label: responseJson.data[0].pH10Twt},
                      {value: parseInt(responseJson.data[0].pH11Tcwt), label: responseJson.data[0].pH11Twt},
                      {value: parseInt(responseJson.data[0].pH12Tcwt), label: responseJson.data[0].pH12Twt},
                      {value: parseInt(responseJson.data[0].pH13Tcwt), label: responseJson.data[0].pH13Twt},  
                       {value: parseInt(responseJson.data[0].pH14Tcwt), label: responseJson.data[0].pH14Twt}, 
                       {value: parseInt(responseJson.data[0].pH15Tcwt), label: responseJson.data[0].pH15Twt},
                       {value: parseInt(responseJson.data[0].pH16Tcwt), label:responseJson.data[0].pH16Twt},
                      {value: parseInt(responseJson.data[0].pH17Tcwt), label: responseJson.data[0].pH17Twt},
                      {value: parseInt(responseJson.data[0].pH18Tcwt), label: responseJson.data[0].pH18Twt},
                      {value: parseInt(responseJson.data[0].pH19Tcwt), label: responseJson.data[0].pH19Twt}
                     ],
                    label: 'Pie dataset',
                    config: { 
                      colors: [cr0, cr1, cr2, cr3,cr4, cr5, cr6, cr7, cr8, cr9, cr10, cr11,],
                      valueTextSize: 12, 
                      valueTextColor: processColor('green'),
                      sliceSpace: 5,  
                      selectionShift: 13,  
                      xValuePosition: "OUTSIDE_SLICE",
                       yValuePosition: "OUTSIDE_SLICE",
                     // valueFormatter: "#.#'%'",
                      valueLineColor: processColor('green'),
                      valueLinePart1Length: 0.8 
                    }
                  }],  
                }, 
                
                dataPie2: {
                  dataSets: [{
                    values: [{value: parseInt(responseJson.data[0].pH20Tcwt), label:responseJson.data[0].pH20Twt},
                      {value: parseInt(responseJson.data[0].pH21Tcwt), label: responseJson.data[0].pH21Twt},
                      {value: parseInt(responseJson.data[0].pH22Tcwt), label: responseJson.data[0].pH22Twt},
                      {value: parseInt(responseJson.data[0].pH23Tcwt), label: responseJson.data[0].pH23Twt},
                      {value: parseInt(responseJson.data[0].pH0Tcwt), label: responseJson.data[0].pH0Twt},
                      {value: parseInt(responseJson.data[0].pH1Tcwt), label: responseJson.data[0].pH1Twt},  
                       {value: parseInt(responseJson.data[0].pH2Tcwt), label: responseJson.data[0].pH2Twt}, 
                       {value: parseInt(responseJson.data[0].pH3Tcwt), label: responseJson.data[0].pH3Twt},
                       {value: parseInt(responseJson.data[0].pH4Tcwt), label: responseJson.data[0].pH4Twt},
                       {value: parseInt(responseJson.data[0].pH5Tcwt), label: responseJson.data[0].pH5Twt},  
                       {value: parseInt(responseJson.data[0].pH6Tcwt), label: responseJson.data[0].pH6Twt}, 
                       {value: parseInt(responseJson.data[0].pH7Tcwt), label: responseJson.data[0].pH7Twt}
                     ],
                    label: 'Pie dataset',
                    config: { 
                      colors: [cr0, cr1, cr2, cr3,cr4, cr5, cr6, cr7, cr8, cr9, cr10, cr11],
                      valueTextSize: 12, 
                      valueTextColor: processColor('green'),
                      sliceSpace: 5,  
                      selectionShift: 13,  
                      xValuePosition: "OUTSIDE_SLICE",
                       yValuePosition: "OUTSIDE_SLICE",
                     // valueFormatter: "#.#'%'",
                      valueLineColor: processColor('green'),
                      valueLinePart1Length: 0.8 
                    }
                  }], 
                } 

          })

        } 

               
       }, (error)=>{
         console.log(JSON.stringify(error));
       })    
        
   }     

   onRefresh(){
     this.getLiveTareSummary()
     this.getLiveModeWiseSummary()
    }
  
 logOutPress(){
  this.hideMenu()
  Alert.alert( 
      "Logout Confirmation",
      'You want to Logout ?',
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

  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  }, (error)=>{
         console.log(JSON.stringify(error));
       })
  
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
 
  renderSelectedTab () {
    switch (this.state.selectedTab) {
      case 'stats':
        return (<StatsScreen data={this.state.data}  modeWiseData={this.state.modeWiseData}  dataBar1 = {this.state.dataBar1}  dataBar2 = {this.state.dataBar2}
                                                     dataLine1={this.state.dataLine1} dataLine2={this.state.dataLine2}  
                                                     dataPie1={this.state.dataPie1} dataPie2={this.state.dataPie2} 
                                                     yardBalance = {this.state.yardBalance}  crushingWeight = {this.state.crushingWeight} totalWeight = {this.state.totalWeight}/>);
        break;
      case 'summary':
        return (<SummaryScreen zoneWiseData={this.state.zoneWiseData} dayWiseData={this.state.dayWiseData} date={this.state.Date} />);
        break;

       case 'live':
        return (<LiveDataScreen modeWiseData={this.state.modeWiseData} tableData = {this.state.tableData} tableData1 = {this.state.tableData1} tableTitle={this.state.tableTitle}
                                liveYardBalance = {this.state.liveYardBalance}  liveCrushingWeight = {this.state.liveCrushingWeight} liveTotalWeight = {this.state.liveTotalWeight} 
                                loading = {this.state.loading}  />);
        break;  
     case 'payment':
          return (<LoginScreen villageList={this.state.villageList} />);
          break;
     case 'ERPDashboard':
        return ( <ERPDashboard navigate = {this.props.navigation.navigate}  />);
        break;      

      default:  
    }       
  } 
      
  render() {  
    return (
       <Container>
        <Header style={{backgroundColor:'#3473c3'}}  hasTabs >  
          <Body>
                  <Image
                    style={{width: 100, height: 40}}
                    resizeMode="contain"
                    source={require('./../../assets/logo_white.png')}
                  /> 
          </Body>
           <Right>   
      
        {   
         (this.state.selectedTab==='stats' || this.state.selectedTab==='summary')?   
          <DatePicker 
            defaultDate={new Date()}
            minimumDate={new Date(2015, 1, 1)}
            maximumDate={new Date()} 
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText={<Icon name='ios-calendar' style={{color:'#ffffff'}} />}
            textStyle={{ color: "#ffffff" }}
            placeHolderTextStyle={{ color: "#ffffff" }}
            onDateChange={this.setDate.bind(this)}   
            />:
            <Menu 
              ref={this.setMenuRef}
              button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                             style={{fontSize:25, color:'#ffffff'}}
                             onPress={this.showMenu} /> 
             }
            >
              <MenuItem onPress={() => this.setState({ModalVisible:true}, ()=> this.hideMenu())} >Change API</MenuItem>
              <MenuDivider />
              <MenuItem onPress={() => this.logOutPress()}>Log Out</MenuItem>
            </Menu>}
           
          </Right>       
             
        </Header>   


        {   
         (this.state.selectedTab==='stats' || this.state.selectedTab==='summary')?   
        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', backgroundColor:'#B9D3EE'}}>
          <View style={{flexDirection:'row'}}>
           <Text>Date :- </Text> 
           <Text>{dateFormat(this.state.Date, "dd-mmm-yyyy")}</Text> 
          </View> 

           <View style={{flexDirection:'row'}}>
           <Text>Time :- </Text> 
           <Text>{ this.state.curTime}</Text> 
          </View>
        </View> :null}  
   
          <View style={{flex:1}} >
            {this.renderSelectedTab()}
          </View>  
 
     
         <Footer>     
       
           <FooterTab style={{backgroundColor:'#ffffff'}}>
            <Button vertical  style={{backgroundColor:(this.state.selectedTab==='live')?"#007ed6":"#f1f8ff"}} active={this.state.selectedTab==='live'} onPress={() => this.setState({selectedTab: 'live'})}>
              <Icon type="FontAwesome"  name="feed" style={{color:(this.state.selectedTab==='live')?'#ffffff':"#000000"}} />
              <Text style={{color:(this.state.selectedTab==='live')?'#ffffff':"#000000", fontSize:8}}>LIVE</Text>
            </Button>
            <Button vertical style={{backgroundColor:(this.state.selectedTab==='stats')?"#007ed6":"#f1f8ff"}} active={this.state.selectedTab==='stats'} onPress={() => this.setState({selectedTab: 'stats'})}>
              <Icon type="FontAwesome" name="bar-chart" style={{color:(this.state.selectedTab==='stats')?'#ffffff':"#000000"}}/>
              <Text style={{color:(this.state.selectedTab==='stats')?'#ffffff':"#000000", fontSize:8}}>STATS</Text>
            </Button>
            <Button vertical  style={{backgroundColor:(this.state.selectedTab==='summary')?"#007ed6":"#f1f8ff"}} active={this.state.selectedTab==='summary'} onPress={() => this.setState({selectedTab: 'summary'})}>
              <Icon type="FontAwesome" name="table" style={{color:(this.state.selectedTab==='summary')?'#ffffff':"#000000"}} />
              <Text style={{color:(this.state.selectedTab==='summary')?'#ffffff':"#000000", fontSize:8}}>SUMMARY</Text>
            </Button>
            <Button vertical  style={{backgroundColor:(this.state.selectedTab==='payment')?"#007ed6":"#f1f8ff"}} active={this.state.selectedTab==='payment'} onPress={() => this.setState({selectedTab: 'payment'})}>
              <Icon type="FontAwesome" name="calculator" style={{color:(this.state.selectedTab==='payment')?'#ffffff':"#000000"}} />
              <Text style={{color:(this.state.selectedTab==='payment')?'#ffffff':"#000000", fontSize:8}}>PAYMENT</Text>
            </Button>
            <Button vertical  style={{backgroundColor:(this.state.selectedTab==='ERPDashboard')?"#007ed6":"#f1f8ff",}} active={this.state.selectedTab==='ERPDashboard'} onPress={() => this.setState({selectedTab: 'ERPDashboard'})}>
              <Icon type="FontAwesome" name="database" style={{color:(this.state.selectedTab==='ERPDashboard')?'#ffffff':"#000000"}} />
              <Text style={{color:(this.state.selectedTab==='ERPDashboard')?'#ffffff':"#000000", fontSize:8}}>DATA</Text>
            </Button>
          </FooterTab>
        </Footer>             
            
        <Modal  
          //animationType="slide"
          transparent={true} 
          visible={this.state.ModalVisible}  
          onRequestClose={() => {
            this.setState({ModalVisible:false});
          }}>
           <View onPress={()=>this.setState({ModalVisible:false})} style={{ flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'}}>
           <View style={{ width: '70%', backgroundColor:'#ffffff',padding:10,borderRadius:10, justifyContent:'center'}}>
        
              <Text>Enter API</Text>
         <TextInput    
                 style={{borderBottomWidth:1, marginVertical:15}}
                 onChangeText={(api) => this.setState({api})}
                 value={this.state.api}
                 placeholder="API"
           //underlineColorAndroid='#141F25'
          />     
            
        <Button rounded onPress={()=> this.onSubmit()}  style={{marginTop:10}}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </Button> 
     
            <TouchableOpacity onPress={()=>this.setState({ModalVisible:false})} style={{position:'absolute', top:0, right:5}}>
             <Icon name="close" size={22} color="black" />  
            </TouchableOpacity>  
             
        </View>
        </View>     
    </Modal>     

      </Container> 
    );     
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
