import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor, FlatList, ScrollView} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header, Left, Body, Right, Button, Icon, Title,  Content,Segment, 
         Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab, Badge, Form, Picker} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LineChart, PieChart, BarChart} from 'react-native-charts-wrapper';
import APIManager from './Managers/APIManager';
var dateFormat = require('dateformat');
    

  let legend={
        enabled: false,
        textSize: 15,
        form: 'CIRCLE',
        
        horizontalAlignment: "RIGHT",
        verticalAlignment: "CENTER",
        orientation: "VERTICAL",
        wordWrapEnabled: true
      }  


    let c0 =   '#056664'   
    let c1 =   '#FECA06'
    let c2 =   '#FFD08C' 
    let c3 =   '#8CEAFF'   
    let c4 =   '#26D7AE'
    let c5 =   '#CC0103'
    let c6 =   '#007ed6'
    let c7 =   '#ff7201'
 
    let cr0 =   processColor(c0)   
    let cr1 =   processColor(c1)
    let cr2 =   processColor(c2) 
    let cr3 =   processColor(c3)
    let cr4 =   processColor(c4)
    let cr5 =   processColor(c5)
    let cr6 =   processColor(c6)
    let cr7 =   processColor(c7)

 let width= Dimensions.get('window').width
 let height= Dimensions.get('window').height    
   


global.SummaryScreen;
export default class SummaryScreen extends Component {
   constructor(props) {  
       super(props);     
      this.state = {       
         Date:new Date(),
         selected:7,
         dayWiseData:[]
     } 
    global.SummaryScreen = this;

   }   

  static navigationOptions = {
       header: null,
            
   };       



  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }  

   onValueChange(value: string) {
     global.AdminScreen.setState({
       selected: value 
     }, ()=>{ global.AdminScreen.getDayWiseSummary()});
   } 

  
 render() { 
    return (
      <ScrollView>
       <Card style={{margin:10, elevation:5, borderRadius:5, padding:10}}>  
                 
                 <View style={{backgroundColor:'#FF7F00'}}>
                  <Text style={{fontSize:18, fontFamily: "Lato-Black",  padding:10, color:'#ffffff', textAlign:'center'}}>Zone Wise Summary</Text> 
                 </View>
                  
 
                  <View style={{flexDirection:'row', paddingVertical:10}}>
                   <View style={{width:'32%'}}>
                    <Text style={{fontFamily: "Lato-Black", color:'#FB7820'}}>Zone Name</Text>
                   </View> 
                    
                   <View style={{width:'32%'}}>
                    <Text style={{textAlign:'center', fontFamily: "Lato-Black", color:'#FB7820'}}>On Date</Text>
                   </View>    
               
                   <View style={{width:'32%'}}> 
                    <Text style={{textAlign:'right', fontFamily: "Lato-Black", color:'#FB7820'}}>AsOn Date</Text>
                   </View>
                  </View> 
          
      {(this.props.zoneWiseData.length > 0)?
        <FlatList     
          data={this.props.zoneWiseData}   
          keyExtractor={item => item.index}  
          renderItem={({item, index}) =>          
               
                  <View style={{flexDirection:'row'}}>
                   <View style={{width:'32%', paddingTop:10}}>
                    <Text style={{fontFamily: "Lato-Black",}}>{item.zoneName}</Text>
                   </View>  

                   <View style={{width:'32%', paddingTop:10}}>  
                    <Text style={{textAlign:'center'}}>{item.totNetWeight}</Text>
                   </View>
      
                  <View style={{width:'32%', paddingTop:10}}>
                    <Text style={{textAlign:'right'}}>{item.asonTotNetWeight}</Text>
                  </View>
                 </View> 
           
    
            }  
       />: <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>} 
    </Card>   

     <Card style={{margin:10, elevation:5, borderRadius:5, padding:10}}>  
                 
                 <View style={{backgroundColor:'#FF7F00', flexDirection:'row', padding:10,  justifyContent:'space-between'}}>
                  <Text style={{fontSize:18, fontFamily: "Lato-Black", color:'#ffffff'}}>Day Wise Summary</Text> 

                   <Form style={{backgroundColor:'#ffffff', borderRadius:5}}>
                      <Picker
                        note 
                        placeholder="Select Days"
                        placeholderIconColor="#007aff"
                        placeholderStyle={{ color: "#bfc6ea", fontSize:12 }}
                        textStyle={{ color: "#5cb85c" }} 
                        iosHeader="Select Days"
                        mode="dropdown"
                        style={{ width: 100, height:30}}
                        selectedValue={global.AdminScreen.state.selected}
                        onValueChange={this.onValueChange.bind(this)}
                      >  
                        <Picker.Item label="07 Days" value="7" />
                        <Picker.Item label="14 Days" value="14" />
                        <Picker.Item label="21 Days" value="21" />
                        <Picker.Item label="28 Days" value="28" />
                      </Picker>
                    </Form>  
                 </View>
                    
 
                  <View style={{flexDirection:'row', paddingVertical:10}}>
                   <View style={{width:'32%'}}>
                    <Text style={{fontFamily: "Lato-Black",color:'#FB7820'}}>Date</Text>
                   </View> 
                    
                   <View style={{width:'32%'}}>
                    <Text style={{textAlign:'center', fontFamily: "Lato-Black", color:'#FB7820'}}>On Date</Text>
                   </View>    
               
                   <View style={{width:'32%'}}> 
                    <Text style={{textAlign:'right', fontFamily: "Lato-Black", color:'#FB7820'}}>AsOn Date</Text>
                   </View>
                  </View>  
          
        
         {(this.props.dayWiseData.length > 0)?
         <FlatList     
          data={this.props.dayWiseData}   
          keyExtractor={item => item.index}  
          renderItem={({item, index}) =>          
               
                 
                  <View style={{flexDirection:'row'}}>
                   <View style={{width:'32%', paddingTop:10}}>
                    <Text style={{fontFamily: "Lato-Black",}}>{item.wsDate}</Text>
                   </View>  

                   <View style={{width:'32%', paddingTop:10}}>  
                    <Text style={{textAlign:'center'}}>{item.onDateTotNetWeight}</Text>
                   </View>
      
                  <View style={{width:'32%', paddingTop:10}}>
                    <Text style={{textAlign:'right'}}>{item.asonTotNetWeight}</Text>
                  </View>
                </View> 
           
    
            }  
       />: <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>} 
    </Card>

    </ScrollView>   
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
  noDataView:{
    alignItems:"center", justifyContent:"center", height:height*0.2
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  }
});
