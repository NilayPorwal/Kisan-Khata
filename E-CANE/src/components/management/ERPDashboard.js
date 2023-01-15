import React, { Component } from 'react';
import { Dimentions,Text, View, ScrollView, StyleSheet, Animated, TouchableOpacity, Dimensions, processColor, Alert, RefreshControl} from 'react-native';
import GroupBarChart from './BarChart/GroupBarChart'
import APIManager from './../APIManager';
import { encrypt, decrypt } from "./../AESEncryption"
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'native-base';
import SliderEntry from './Statistics/SliderEntry';
import SurveyorStats from './Statistics/SurveyorStats'
import IndentingStats from './Statistics/IndentingStats'
import WeighmentStats from './Statistics/WeighmentStats'
import PaymentStats from './Statistics/PaymentStats'
var dateFormat = require('dateformat');
var now = new Date();


export const ENTRIES1 = [
    {
        id:1,
    },
    {
        id:2,
    },
    {
        id:3,
    },
    {
        id:4,
    },  
]

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height} = Dimensions.get('window');
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class ERPDashboard extends Component {
    constructor() {
    super();
    this.state = {
       slider1ActiveSlide: 0,
       legend: {
        textSize: 15,
        xEntrySpace: 50,
        fontFamily: "Lato-Semibold", 
       },
       xAxis: {
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 2,
        axisMinimum: 0,
        centerAxisLabels: false,
        drawLabels:false,
        drawAxisLine:false,
        drawGridLines:false
        
      },
       yAxis: {
        left: {
          axisMinimum: 0,
          drawLabels: false,
          drawAxisLine: false,
          drawGridLines: false,
          zeroLine: {
            enabled: true,
            lineWidth: 1.5
          }
        },
        right: {
          enabled: false
        }
      },
      marker: {
        enabled: false,
        markerColor: processColor('#8dd8a6'),
        textColor: processColor('#000'),
        markerFontSize: 18,
      },
     dashboardData:[],
     topSurveyor:[],
     areaCovered:[],
     surveyorStats:[],
     caneArrival:[],
     villageWiseIndnt:[],
     avgTime:[],
     indentData:[],
     delayedVehicleCount:[],
     delayedVehcleList:[],
     yardBalance:[],
     burnCaneWeight:[],
     isLoading: false, 
     }
     global.ERPDashboard = this; 
    } 

componentDidMount(){
  this.getDashboardData()
  this.getTopSurveyPerfm()
  this.getAreaCoveredStats()
  this.getSurveyorStats()

  this.getCaneArival()
  this.getVillageWiseIndenting()
  this.getIndentChartData()
  this.getAverageTime()

  this.getDelayedVehicleCount();
  this.getDelayedVehicleInYard();
  this.getYardBalance()
  this.getBurnCaneWeight()
}    

getDashboardData(){

    APIManager.getDashboardData((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("dashboard data :" + JSON.stringify(responseJson));
            this.setState({dashboardData:responseJson})
          }
        else{
         //  Alert.alert("Error in fetching dashboard data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in fetching dashboard data" + JSON.stringify(error.message));
    })
  
}

getTopSurveyPerfm(){

    APIManager.getTopSurveyPerfm((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Top 3 Survey Performance :" + JSON.stringify(responseJson));
            this.setState({topSurveyor:responseJson})
          }
        else{
           //Alert.alert("Top 3 Survey Performance data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
        //Alert.alert("Error in Top 3 Survey Performance data" + JSON.stringify(error.message));
    })
  
}

getAreaCoveredStats(){

    APIManager.getAreaCoveredStats((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Area Covered :" + JSON.stringify(responseJson));
           this.setState({areaCovered:responseJson})
          }
        else{
           //Alert.alert("Error in Area Covered data", response.data.message)
             this.setState({isLoading:false})
          }
    },(error)=>{
       this.setState({isLoading:false})
        //Alert.alert("Error in Area Covered data" + JSON.stringify(error.message));
    })
  
}

getSurveyorStats(){

    APIManager.getSurveyorStats((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Surveyor Statistics :" + JSON.stringify(responseJson));
           this.setState({surveyorStats:responseJson})
          }
        else{
          // Alert.alert("Error in Surveyor Statistics data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
        //Alert.alert("Error in Surveyor Statistics data" + JSON.stringify(error.message));
    })
  
}


   getCaneArival(){

   const data = {
      "pSearchDate":dateFormat(now, "yyyy-mmm-dd")
    }
    console.log(data)
    APIManager.getCaneArival(data,(response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Cane Arrival :" + JSON.stringify(responseJson));
            this.setState({caneArrival:responseJson})
          }
        else{
         //  Alert.alert("Error in Cane Arrival data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in Cane Arrival data" + JSON.stringify(error.message));
    })
  
}

   getIndentChartData(){
   
   const data = {
      "pSearchDate":dateFormat(now, "yyyy-mmm-dd"),
      "pNoOfDays":6
    }
    APIManager.getIndentChartData(data,(response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Indent Data :" + JSON.stringify(responseJson));
              const value = [{y:parseInt(responseJson[0].indentcount)}, 
                               {y:parseInt(responseJson[1].indentcount)}, 
                               {y:parseInt(responseJson[2].indentcount)},
                               {y:parseInt(responseJson[3].indentcount)},
                               {y:parseInt(responseJson[4].indentcount)},
                               {y:parseInt(responseJson[5].indentcount)},
                               {y:parseInt(responseJson[6].indentcount)}]
              this.setState({indentData:value})
             // console.log("Indent Data :" + JSON.stringify(this.state.indentData));
          }
        else{
           //Alert.alert("Error in Indent data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in Indent data" + JSON.stringify(error));
    })
  
}

   getVillageWiseIndenting(){
   
    const data = {
      "pSearchDate":dateFormat(now, "yyyy-mmm-dd")
    }
    console.log(data)
    APIManager.getVillageWiseIndenting(data,(response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Village wise indenting :" + JSON.stringify(responseJson));
            this.setState({villageWiseIndnt:responseJson})
          }
        else{
           //Alert.alert("Error in Village wise indenting data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in Village wise indenting data" + JSON.stringify(error.message));
    })
  
}

 getAverageTime(){

    APIManager.getAverageTime((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Average Time :" + JSON.stringify(responseJson));
            this.setState({avgTime:responseJson})
          }
        else{
          // Alert.alert("Error in Average Time data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
    })
  
}

   getLiveTareSummary(){ 

    //let date = dateFormat(now, "yyyy-mm-dd"); 
    let date = dateFormat(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "yyyy-mm-dd")

    APIManager.getTareSummary(date, 
        (responseJson)=> {
      
      console.log("Live Tare Summary" + JSON.stringify(responseJson));
    
    }, (error)=>{
         this.setState({isLoading:false})
         // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
         console.log("Error in Live Tare Summary" + JSON.stringify(error));
      })
  }
  getDelayedVehicleCount(){

    APIManager.getDelayedVehicleCount((response)=>{
        if(response.data.status == "SUCCESS"){
            const responseJson = JSON.parse(decrypt(response.data.data.content));
            console.log("Delayed Vehicle Count :" + JSON.stringify(responseJson));
            this.setState({delayedVehicleCount:responseJson})
          }
        else{
          // Alert.alert("Error in Average Time data", response.data.message)
             this.setState({isLoading:false})
          }
    }, (error)=>{
       this.setState({isLoading:false})
       // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
       console.log("Error in Delayed Vehicle Count data" + JSON.stringify(error.message));
    })
  
}


    getDelayedVehicleInYard(){

        APIManager.getDelayedVehicleInYard((response)=>{
            if(response.data.status == "SUCCESS"){
                const responseJson = JSON.parse(decrypt(response.data.data.content));
                console.log("Delayed Vehicle In Yard :" + JSON.stringify(responseJson));
                this.setState({delayedVehcleList:responseJson})
              }
              else{
              // Alert.alert("Error in Average Time data", response.data.message)
                 this.setState({isLoading:false})
              }
        }, (error)=>{
           this.setState({isLoading:false})
           // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
           console.log("Error in Delayed Vehicle In Yard data" + JSON.stringify(error.message));
        })
  
   }

getYardBalance(){

      APIManager.getYardBalance((response)=>{
          if(response.data.status == "SUCCESS"){
              const responseJson = JSON.parse(decrypt(response.data.data.content));
              console.log("Yard Balance:" + JSON.stringify(responseJson));
              this.setState({yardBalance:responseJson})
            }
            else{
            // Alert.alert("Error in Average Time data", response.data.message)
               this.setState({isLoading:false})
            }
      }, (error)=>{
         this.setState({isLoading:false})
         // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
         console.log("Error in Yard Balance data" + JSON.stringify(error));
      })
  
}

getBurnCaneWeight(){
  APIManager.getBurnCaneWeight((response)=>{
          if(response.data.status == "SUCCESS"){
              const responseJson = JSON.parse(decrypt(response.data.data.content));
              console.log("Burn Cane Weight:" + JSON.stringify(responseJson));
              this.setState({burnCaneWeight:responseJson})
            }
            else{
            // Alert.alert("Error in Average Time data", response.data.message)
               this.setState({isLoading:false})
            }
      }, (error)=>{
         this.setState({isLoading:false})
         // Alert.alert("Error in Average Timedata" + JSON.stringify(error.message));
         console.log("Error in Yard Balance data" + JSON.stringify(error));
      })
  
}

renderHeader(color, icon, screenName, title){

    return <View  style={{flexDirection:"row", justifyContent:"space-between"}}>
             <TouchableOpacity style={[{backgroundColor:color}, styles.iconView]} onPress={()=>this.props.navigate(screenName)}>
                <Icon type="FontAwesome5" name={icon} size={25} color="#FFF" />
             </TouchableOpacity>
              <Text selectable={true} style={{fontSize:18, fontFamily: "Lato-Black", textAlign:"right", padding:10}}>{title}</Text>
           </View>
      
  }

 _renderItemWithParallax ({item, index}, parallaxProps) {
    return (   <SliderEntry
                  {...global.ERPDashboard.state}
                  data={item}
                  even={(index + 1) % 2 === 0}
                  parallax={true}
                  parallaxProps={parallaxProps}
                />
        );
    }

 onRefresh(){
   this.getDashboardData();
   this.getTopSurveyPerfm();
   this.getAreaCoveredStats();
   this.getBurnCaneWeight();
   this.getCaneArival();
   this.getYardBalance();
 }   

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#F1F2F6', paddingTop:10}} refreshControl={<RefreshControl
                                                                                                refreshing={this.state.isLoading}
                                                                                                onRefresh={this.onRefresh.bind(this)}
                                                                                              />
            }>
             <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={0}
                  inactiveSlideScale={0.9}
                  inactiveSlideOpacity={0.8}
                  loop={true}
                  autoplay={false}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />

                    {
                        (this.state.slider1ActiveSlide == 0)?
                        <SurveyorStats {...this.state} />:null
                    }
                    {
                        (this.state.slider1ActiveSlide == 1 )?
                        <IndentingStats {...this.state} />:null
                    }
                    {
                        (this.state.slider1ActiveSlide == 2 )?
                        <WeighmentStats {...this.state}  />:null
                    }
                    {
                        (this.state.slider1ActiveSlide ==3 )?
                        <WeighmentStats {...this.state} />:null
                    }
      
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({  
  iconView:{
      height:55, width:55, marginLeft:15, marginTop:-25, justifyContent:"center", alignItems:"center"
    },
  cardStyle:{
     backgroundColor:'#FFFFFF', elevation:8, marginHorizontal:10, marginVertical:20,  height:height*0.3
  },
  noDataView:{
    alignItems:"center", justifyContent:"center", height:"80%"
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  }
});



