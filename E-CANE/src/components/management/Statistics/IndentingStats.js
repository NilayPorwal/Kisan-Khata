import React, { Component } from 'react';
import {Platform, Text, View, ScrollView, StyleSheet, FlatList, Animated, TouchableOpacity, Dimensions, processColor, BackHandler, Alert} from 'react-native';
import SimpleGroupBarChart from './../BarChart/SimpleGroupBarChart';
import SimpleHorizontalBarChart from './../BarChart/SimpleHorizontalBarChart'
import { encrypt, decrypt } from "./../../AESEncryption"
import APIManager from './../../APIManager';
import { Icon } from 'native-base';

var dateFormat = require('dateformat');
var now = new Date();

const notification = [
  {
    'icon' : 'http://bit.ly/2HVRSx8',
    'Name': 'Rajat Jain',
    'NotificationName':'You have 5 new task',
  },
  {
      'icon' : 'http://bit.ly/2HVRSx8',
      'Name': 'Shubham Pathak',
      'NotificationName':'You are now friend with Andrew',
  },
  {
      'icon' : 'http://bit.ly/2HVRSx8',
      'Name': 'Sumit Tiwari',
      'NotificationName':'Another Notification',
  },
  {
      'icon' : 'http://bit.ly/2HVRSx8',
      'Name': 'Mulayam Yadav',
      'NotificationName':'You have 5 new task',
  },
  {
      'icon' : 'http://bit.ly/2HVRSx8',
      'Name': 'Amit Tiwari',
      'NotificationName':'You are now friend with Andrew',
  },
  {
      'Name': 'Shivam Chauhan',
      'NotificationName':'Another Notification',
  },
  
 ]

const {width, height} = Dimensions.get('window');

export default class IndentingStats extends Component {
  constructor() {
    super();
    this.state = {
       legend: {
        enabled:false
         // textSize: 15,
         // xEntrySpace: 50,
         // fontFamily: "Lato-Semibold", 
       },
       xAxis: {
        granularityEnabled: true,
        granularity: 1,
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
     caneArrival:[],
     villageWiseIndnt:[],
     avgTime:[],
     indentData:[],
     lastWeek:[]
     }
     global.IndentingStats = this;
    } 

    componentDidMount(){
      // this.getCaneArival()
      // this.getVillageWiseIndenting()
      // this.getIndentChartData()
      // this.getAverageTime()
      //BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
    }


  handleAndroidBackButton() {   
       global.IndentingStats.props.navigation.goBack();
       return true;
    }      
            
    
  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }
    
    renderItems = ({ item }) => {
      return (
          
         <ScrollView style={{flex:1,}}>
              <View style={{flexDirection:'row', padding:15,  }} >
                <Icon type="FontAwesome5" name="circle" size={15} color="#5CB460" />
                <Text selectable={true} style={{fontSize:16, fontFamily: "Lato-Black", paddingLeft:10, marginTop:-5}}>{item.Name}</Text>      
              </View>
              <View>
                  <Text selectable={true} style={{paddingLeft:40, marginTop:-15, fontSize:14}}>{item.NotificationName}</Text>
              </View>
         </ScrollView>
          
      )
    } 

    renderHeader(title){

      return <View style={{backgroundColor:"#5AB25E", marginHorizontal:15, marginTop:-25}}>
              <Text selectable={true} style={{fontSize:18, fontFamily: "Lato-Black", textAlign:"center", padding:15, color:"#FFFFFF"}}>{title}</Text>
             </View>
      
    
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



  render() {

    return (
      <View style={{ flex: 1, backgroundColor:'#F1F2F6',  paddingTop:10,}}>

    {
        // <View style={{backgroundColor:'#FFFFFF', elevation:8, margin:10, marginTop:25}}>

        //     <View style={styles.S_S_A_N_View}>
        //         <Text selectable={true} style={styles.S_S_A_N_Text}>Notification</Text>
        //     </View>
        //     <View style={{marginVertical:15,}}>
        //         <FlatList
        //         data={notification}
        //         renderItem={this.renderItems}
        //         />
        //     </View>
        // </View>
    }  
        
        <View style={[styles.cardStyle, {height:height*0.4, marginVertical:30}]}>
           {this.renderHeader("Cane Arrival")}
        {(this.props.caneArrival.length>0)?
        <View> 
          <SimpleGroupBarChart {...this.state}
               title = "Survey" icon="search"
              // value1 = {[3570, 1209, 7908]} value2 = {[5229,7809, 5019]}
               value1 = {[this.props.caneArrival[1].ExpectedCount, this.props.caneArrival[0].ExpectedCount, this.props.caneArrival[2].ExpectedCount]} 
               value2 ={[this.props.caneArrival[1].ArrivalCount, this.props.caneArrival[0].ArrivalCount, this.props.caneArrival[2].ArrivalCount]} 
               label1="Expected Cane" label2="Actual Cane"
               color1="#A9CFD2"  color2="#C5DA88"/>
          <View style={{flexDirection:"row"}}>
            <View style={{width:"34%", alignItems:"center"}}>
             <Text>{dateFormat(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            </View> 
            <View style={{width:"30%",  alignItems:"center"}}> 
             <Text>{dateFormat(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            </View>  
            <View style={{width:"30%",  alignItems:"center"}}> 
             <Text>{dateFormat(now, "dd-mmm")}</Text>
            </View>  
          </View>
          
          <View style={{flexDirection:'row', justifyContent:"space-between", paddingLeft:20, marginTop:10}}>
          
            <View style={{width:"40%", flexDirection:'row'}}>
              <Icon type="FontAwesome5" name="square-full"   style={{fontSize:12, paddingTop:3, color:'#A9CFD2'}} />
              <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:12}}>Expected Cane</Text>
            </View>
            
            <View style={{width:"40%", flexDirection:'row'}}>
               <Icon type="FontAwesome5" name="square-full"  style={{fontSize:12, paddingTop:3, color:'#C5DA88' }} />
               <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:12}}>Actual Cane</Text>
            </View>
        </View>
        </View>:
              <View style={styles.noDataView}>                            
                <Text style={styles.noDataText}>No Data Found</Text>
              </View> }
       </View>

       <View style={[styles.cardStyle, {height:height*0.25, marginVertical:25}]}>
       
        {this.renderHeader("Average Time")}
        <View style={{flexDirection:'row',margin:15, justifyContent:"space-between"}}>
         
          <View style={{width:"30%", borderWidth:2, borderColor:'#5DD7E9', alignItems:'center', paddingVertical:10 }}>
            <Text style={{fontSize:12}}>HRS</Text>
            <Text style={styles.avgTimeText}>{(this.props.avgTime.length>0)?this.props.avgTime[0].AvgTokenTare:0}</Text>
          </View>
         
          <View style={{width:"30%", borderWidth:2, borderColor:'#ED3A46', alignItems:'center', paddingVertical:10}}>
            <Text style={{fontSize:12}}>HRS</Text>
            <Text style={styles.avgTimeText}>{(this.props.avgTime.length>0)?this.props.avgTime[0].AvgTokenGross:0}</Text>
          </View>
         
          <View style={{width:"30%", borderWidth:2, borderColor:'#46B162', alignItems:'center', paddingVertical:10}}>
            <Text style={{fontSize:12}}>HRS</Text>
            <Text style={styles.avgTimeText}>{(this.props.avgTime.length>0)?this.props.avgTime[0].AvgGrossTare:0}</Text>
          </View>
        </View>
       
        <View style={{flexDirection:'row', padding:15, justifyContent:"space-between"}}>
          
          <View style={{width:"30%", flexDirection:'row'}}>
            <Icon type="FontAwesome5" name="square-full"  style={{fontSize:10, paddingTop:3,  color:'#05D7EA'}} />
            <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:12}}>Token → Tare</Text>
          </View>
          
          <View style={{width:"30%", flexDirection:'row'}}>
             <Icon type="FontAwesome5" name="square-full"   style={{fontSize:10, paddingTop:3, color:'#FB3C46'}} />
            <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:12}}>Token → Gross</Text>
          </View>
          
          <View style={{width:"30%", flexDirection:'row'}}>
            <Icon type="FontAwesome5" name="square-full"  color='#39B162' style={{fontSize:10, paddingTop:3, color:'#FB3C46'}} />
            <Text style={{fontFamily: "Lato-Black", paddingHorizontal:5, fontSize:12}}>Gross → Tare</Text>
          </View>
        </View>
       </View>

       <View style={[styles.cardStyle, {height:height*0.4, marginVertical:25}]}>  
         {this.renderHeader("Indenting")}
          {(this.state.indentData.length > 0)?
        <View style={{flexDirection:"row"}}>
         <View style={{marginTop:10}}>
            <Text style={styles.dateText}>{dateFormat(now, "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
            <Text style={styles.dateText}>{dateFormat(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), "dd-mmm")}</Text>
         </View>  
        <SimpleHorizontalBarChart {...this.state}
                                   value1 = {this.state.indentData}
                                   color1 = "#89DAA5" />
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
  container: {
      flex: 1,
    },
  cardStyle:{
   backgroundColor:'#FFFFFF', elevation:8, marginHorizontal:10
  },
  noDataView:{
    alignItems:"center", justifyContent:"center", height:"90%"
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  },
  dateText:{
    padding:5, fontSize:12, marginTop:5,  fontFamily: "Lato-Semibold",
  },
  tableText:{
    fontSize:15,fontFamily: "Lato-Semibold"
  },
  avgTimeText:{
    fontSize:30, fontFamily:Platform.OS =="android"?'Digital-7':null
  }

});




