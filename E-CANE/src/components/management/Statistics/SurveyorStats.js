import React, { Component } from 'react';
import {SafeAreaView, Text, View, ScrollView, StyleSheet, Animated, TouchableOpacity, Dimensions, processColor, BackHandler, Alert} from 'react-native';
import HorizontalBarChart from './../BarChart/HorizontalBarChart'
import GroupBarChart from './../BarChart/GroupBarChart'
import SimpleBarChart from './../BarChart/SimpleBarChart'
import { encrypt, decrypt } from "./../../AESEncryption"
import APIManager from './../../APIManager';

const {width, height} = Dimensions.get('window');

export default class SurveyorStats extends Component {
    constructor() {
    super();
    this.state = {
       legend: {
        textSize: 15, 
        xEntrySpace: 30,
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
        drawGridLines:false,

      },
      yAxis: {
         left: {axisMinimum: 0,
                drawLabels: false,
                drawAxisLine: false,
                drawGridLines: false,
                zeroLine: {
                  enabled: true,
                  lineWidth: 1.5
                }
            },
         right: {
                axisMinimum: 0,
                drawLabels: false,
                drawAxisLine: false,
                drawGridLines: false,
              
           }   
      },
      marker: {
        enabled: false,
        markerColor: processColor('#8dd8a6'),
        textColor: processColor('#000'),
        markerFontSize: 18,
      },
     topSurveyor:[],
     areaCovered:[],
     surveyorStats:[]
     }
     global.SurveyorStats = this;
    }

componentDidMount(){
  // this.getTopSurveyPerfm()
  // this.getAreaCoveredStats()
  // this.getSurveyorStats()
  // BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
} 

  handleAndroidBackButton() {   
       global.SurveyorStats.props.navigation.goBack();
       return true;
    }      
            
    
  componentWillUnmount() {
     //BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
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

renderHeader(title){

    return <View style={{backgroundColor:"#FF922D", marginHorizontal:15, marginTop:-25}}>
            <Text selectable={true} style={{fontSize:18, fontFamily: "Lato-Black", textAlign:"center", padding:15, color:"#FFFFFF"}}>{title}</Text>
           </View>
      
    
  }

  render() {
    return (
      <View style={{flex: 4, backgroundColor:'#F3F3F3', paddingTop:10}}>

          <View style={styles.cardStyle}>
           {this.renderHeader("Surveyor Statistics")}
          {(this.props.surveyorStats.length>0)?
                <GroupBarChart {...this.state}
                             title = "Surveyor Statistics" icon="search"
                             value1 = {[parseInt(this.props.surveyorStats[0].TotalSurveyors)]} value2 = {[parseInt(this.props.surveyorStats[0].ActiveSurveyors)]}
                             label1="Total Surveyors" label2="Active Surveyors"
                             color1="#FF922D"  color2="#FBB87A"
                             navigate={()=>this.props.navigate("SurveyorStats")}  />:
            <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>}
         </View>

      <View style={styles.cardStyle}>
          {this.renderHeader("Area Covered")}
          {(this.props.areaCovered.length>0)?
            <HorizontalBarChart {...this.state}
                             title = "Area Covered" icon="search"
                             value4 = {[parseInt(this.props.areaCovered[0].TotalArea)]} value3 = {[parseInt(this.props.areaCovered[0].NOORPA)]}  value2 = {[parseInt(this.props.areaCovered[0].MARI)]} value1 = {[parseInt(this.props.areaCovered[0].JADI)]}
                             label4="Total Area" label3="Norpa" label2="Jadi" label1="Madi"
                             color4="#44B502"  color3="#B6D8DA"  color2="#CEE196"  color1="#FD8E56"/>:
           <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>}
      </View>    
      
      
      <View style={styles.cardStyle}>
          {this.renderHeader("Surveyor Performance (Top 3)")}
          {(this.props.topSurveyor.length > 0)?
           <View style={{flexDirection:"row", marginTop:15}}>
                <SimpleBarChart {...this.state}
                               values = {[{y:parseInt(this.props.topSurveyor[0].VillageCount)}, 
                                          {y:(this.props.topSurveyor.length > 1)?parseInt(this.props.topSurveyor[1].VillageCount):0}, 
                                          {y:(this.props.topSurveyor.length > 2)?parseInt(this.props.topSurveyor[2].VillageCount):0}]}
                               label="Villages"
                               color="#C3490E"
                               navigate={this.props.navigate} />

                <SimpleBarChart {...this.state}
                             values = {[{y:parseInt(this.props.topSurveyor[0].farmercount)}, 
                                        {y:(this.props.topSurveyor.length > 1)?parseInt(this.props.topSurveyor[1].farmercount):0}, 
                                        {y:(this.props.topSurveyor.length > 2)?parseInt(this.props.topSurveyor[2].farmercount):0}]}
                             label="Farmers"
                             color="#A2DA8A"
                             navigate={this.props.navigate} />

                <SimpleBarChart {...this.state}
                             values = {[{y:parseInt(this.props.topSurveyor[0].TotalArea)}, 
                                        {y:(this.props.topSurveyor.length > 1)?parseInt(this.props.topSurveyor[1].TotalArea):0}, 
                                        {y:(this.props.topSurveyor.length > 2)?parseInt(this.props.topSurveyor[2].TotalArea):0}]}
                             label="Area Covered"
                             color="#20CBC4"
                             navigate={this.props.navigate} />                   
          </View>:
            <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>}
         </View> 
   
      </View>
    );
  }
}

const styles = StyleSheet.create({  
  cardStyle:{
   backgroundColor:'#FFFFFF', elevation:8, marginHorizontal:10, marginVertical:30,  height:height*0.3
  },
  noDataView:{
    alignItems:"center", justifyContent:"center", height:"90%"
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  }
});




