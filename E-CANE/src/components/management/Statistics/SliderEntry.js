import React, { Component } from 'react';
import { Dimentions,Text, View, ScrollView, StyleSheet, Animated, TouchableOpacity, Dimensions, processColor, Alert} from 'react-native';
import GroupBarChart from './../BarChart/GroupBarChart'
import APIManager from './../../APIManager';
import { encrypt, decrypt } from "./../../AESEncryption"
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'native-base';


const {width, height} = Dimensions.get('window');
export default class SliderEntry extends Component {
    constructor() {
    super();
    this.state = {
       legend: {
        textSize: 12,
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
     dashboardData:[]
     }
    } 

componentDidMount(){
  //this.getDashboardData()
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
        //Alert.alert("Error in fetching dashboard data" + JSON.stringify(error.message));
    })
  
}

renderHeader(color, icon, screenName, title){

    return <View  style={{flexDirection:"row", justifyContent:"space-between"}}>
             <TouchableOpacity style={[{backgroundColor:color}, styles.iconView]}>
                <Icon type="FontAwesome5" name={icon} style={{fontSize:25, color:"#ffffff"}} />
             </TouchableOpacity>
              <Text selectable={true} style={{fontSize:18, fontFamily: "Lato-Black", textAlign:"right", padding:10}}>{title}</Text>
           </View>
      
  }


  render() {
    const { data: {id } } = this.props;
    return (

      <View style={{ flex: 1, backgroundColor:'#F1F2F6', paddingTop:10}}>
      {(id==1 )?
         <View  style={styles.cardStyle}>
          {this.renderHeader("#FF922D", "search", "SurveyorStats","Survey")}
              {(this.props.dashboardData.length>0)?
              <GroupBarChart {...this.state}
                             title = "Survey" icon="search"
                             value1 = {[parseInt(this.props.dashboardData[0].TotalFarmer)]} value2 = {[parseInt(this.props.dashboardData[0].SurveryedFarmer)]}
                             label1="Total Farmers" label2="Surveyed Farmers"
                             color1="#FF922D"  color2="#FBB87A"
                             navigate={()=>this.props.navigate("SurveyorStats")} />:
               <View style={{alignItems:"center", justifyContent:"center", height:"90%"}}>                            
                <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:15}}>No Data Found</Text>
               </View>}              
          </View>:null}
          
       {(id==2 )?
        <View style={styles.cardStyle}>

              {this.renderHeader("#39B162", "indent", "IndentingStats","Indenting")}
               {(this.props.dashboardData.length>0)?
               <GroupBarChart {...this.state}
                             value1 = {[parseInt(this.props.dashboardData[0].ExpectedFarmer)]} value2 = {[parseInt(this.props.dashboardData[0].ActualFarmer)]}
                              title = "Indenting" icon="indent"
                             label1="Expected Cane" label2="Actual Cane"
                             color1="#39B162"  color2="#4ADE7D"
                             navigate={this.props.navigate} />:
             <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
             </View>}
          </View>:null}
       
       {(id==3 )?
         <View  style={styles.cardStyle}>

              {this.renderHeader("#FB3B46", "balance-scale", "WeighmentStats","Weighment")}
               {(this.props.dashboardData.length>0)?
              <GroupBarChart {...this.state}
                             title = "Weighment" icon="balance-scale"
                             value1 = {[parseInt(this.props.dashboardData[0].Tokencount)]} value2 = {[parseInt(this.props.dashboardData[0].Grosscount)]}
                             label1="Token" label2="Gross"
                             color1="#FB3B46"  color2="#FF7B82"
                             navigate={this.props.navigate} />:
             <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
             </View>}             
          </View>:null}

        {(id==4 )?
          <View  style={styles.cardStyle}>

              {this.renderHeader("#01B8C9", "rupee-sign", "SurveyorStats", "Payments")}
               {(this.props.dashboardData.length>0)?
                <GroupBarChart {...this.state}
                             title = "Payments" icon="rupee-sign"
                             value1 = {[parseInt(this.props.dashboardData[0].PayExpected)]} value2 = {[parseInt(this.props.dashboardData[0].PaymentActualFarmer)]}
                             label1="Expected Farmers" label2="Actual Farmers"
                             color1="#01B8C9"  color2="#03D7E9"
                             navigate={this.props.navigate} />:
               <View style={styles.noDataView}>                            
                <Text style={styles.noDataText}>No Data Found</Text>
              </View> }          
          </View>:null}
      

      </View>
    );
  }
}


const styles = StyleSheet.create({
  iconView:{
      height:55, width:55, marginLeft:15, marginTop:-25, justifyContent:"center", alignItems:"center"
    },
  cardStyle:{
     backgroundColor:'#FFFFFF', elevation:8, marginHorizontal:10, marginVertical:20,  height:height*0.30
  },
  noDataView:{
    alignItems:"center", justifyContent:"center", height:"80%"
  },
  noDataText:{
    fontFamily: "Lato-Black", fontSize:15
  }
});



