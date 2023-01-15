import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor, FlatList, ScrollView} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header, Left, Body, Right, Button, Icon, Title,  Content,Segment, 
         Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab, Badge, Spinner} from 'native-base';

import {LineChart, PieChart, BarChart} from 'react-native-charts-wrapper';
import APIManager from './Managers/APIManager';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

var dateFormat = require('dateformat');
    

 

 const height = Dimensions.get('window').height


global.LiveDataScreen;
export default class LiveDataScreen extends Component {
   constructor(props) {  
       super(props);     
      this.state = {       
         Date:new Date(),
      tableHead: ['Vehicle Type', 'Count\n(Token)', 'Weight\n(Token)', 'Count\n(Gross)', 'Weight\n(Gross)'],
      
      tableHead1: ['Hours',  'Weight', 'Count',],
      tableTitle1: [ '08-09 AM', '09-10 AM', '10-11 AM', '11AM-12PM', '12-01 PM', '01-02 PM', '02-03 PM', '03-04 PM', '04-05 PM', '05-06 PM', '06-07 PM', '07-08 PM',
                     '08-09 PM', '09-10 PM', '10-11 PM', '11PM-12AM', '12-01 AM', '01-02 AM', '02-03 AM', '03-04 AM', '04-05 AM', '05-06 AM', '06-07 AM', '07-08 AM','TOTAL'],
     }                      
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




  
 render() {   
    const data = [1, 2, 3, 4, 5];
    return (  
  (this.props.loading == false)?  
      <ScrollView>

        <Card style={{backgroundColor:'#f86c6b',  margin:10,  borderRadius:3, height:height*0.13, paddingHorizontal:15, justifyContent:'center'}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
           <View style={{flexDirection:'row'}}> 
            <Icon type="FontAwesome" name="industry" style={{fontSize: 18, color: '#ffffff'}} /> 
            <Text style={{fontFamily: "Lato-Black", color:'#ffffff',fontSize:20, paddingLeft:5 }}>Yard Balance</Text>
           </View>  
             <Text style={{color:'#ffffff', fontFamily: "Lato-Black",fontSize:20, paddingLeft:15}}>{this.props.liveYardBalance}</Text>  
            
           </View> 
          </Card>   
     
        
        <Card style={{backgroundColor:'#ffc107',margin:10,  borderRadius:3, height:height*0.13, paddingHorizontal:15, justifyContent:'center'}}> 
         <View style={{flexDirection:'row', justifyContent:'space-between'}}>
         <View style={{flexDirection:'row'}}> 
          <Icon type="FontAwesome" name="gavel" style={{fontSize: 18, color: '#ffffff'}} />
          <Text  style={{fontFamily: "Lato-Black", color:'#ffffff', fontSize:20, paddingLeft:5}}>Today's Crushing</Text>
         </View> 
          <Text style={{color:'#ffffff', fontFamily: "Lato-Black", fontSize:20}}>{this.props.liveCrushingWeight}</Text>  
         
         </View>

         </Card>  
           
         <Card style={{backgroundColor:'#4dbd74',  margin:10,  borderRadius:3,  height:height*0.13, paddingHorizontal:15, justifyContent:'center'}}>    
          <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
          <View style={{flexDirection:'row'}}> 
           <Icon type="FontAwesome" name="balance-scale" style={{fontSize: 18, color: '#ffffff'}} />
           <Text style={{fontFamily: "Lato-Black", color:'#ffffff', fontSize:20, paddingLeft:5}}>Total Weight</Text>
          </View> 
           <Text style={{color:'#ffffff', fontFamily: "Lato-Black", fontSize:20, paddingLeft:10}}>{this.props.liveTotalWeight}</Text>  
          </View>  
         </Card>  
      
   
        <Card style={{marginTop:15,  backgroundColor:'#f1f8ff'}}> 
         <View style={{backgroundColor:'#FF7F00', marginVertical:10, marginHorizontal:5}}>
          <Text style={{fontSize:18, fontFamily: "Lato-Black",  padding:10, color:'#ffffff', textAlign:'center'}}>Mode Wise Summary </Text> 
         </View>

         {(this.props.tableData.length>0)?
         <Table>
          <Row data={this.state.tableHead} flexArr={[1, 1, 1, 1, 1]} style={styles.head} textStyle={{textAlign: 'center', fontFamily: "Lato-Black", color:'#000000'}}/>
          
          <TableWrapper style={styles.wrapper}> 
            <Col data={this.props.tableTitle} style={styles.title} heightArr={[35, 35, 35, 35, 35, 35, 35, 35]} textStyle={{textAlign:'center',  color:'#000000'}}/>
            <Rows data={this.props.tableData} flexArr={[1, 1, 1, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>: 
          <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>} 
       </Card>

         

       <Card style={{marginTop:15, backgroundColor:'#f1f8ff'}}> 
         <View style={{backgroundColor:'#FF7F00', marginVertical:10, marginHorizontal:5}}>
          <Text style={{fontSize:18, fontFamily: "Lato-Black",  padding:10, color:'#ffffff', textAlign:'center'}}>Hourely Tare Summary </Text> 
         </View>

        {(this.props.tableData1.length>0)?
         <Table>
          <Row data={this.state.tableHead1} flexArr={[1, 1, 1]} style={styles.head} textStyle={{textAlign: 'center', fontFamily: "Lato-Black", color:'#000000'}}/>
          
          <TableWrapper style={styles.wrapper}> 
            <Col data={this.state.tableTitle1} style={styles.title} heightArr={[35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35]} textStyle={{textAlign:'center',  color:'#000000'}}/>
            <Rows data={this.props.tableData1} flexArr={[1, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table>: 
          <View style={styles.noDataView}>                            
              <Text style={styles.noDataText}>No Data Found</Text>
           </View>} 
       </Card>
    
    </ScrollView>: 
      <Spinner color='blue' />
    
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

  head: {  height: 40,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f1f8ff' },
  row: {  height: 35  },
  text: { textAlign: 'right', paddingRight:5 },
   noDataView:{
    alignItems:"center", justifyContent:"center", height:height*0.2
  },
  noDataText:{
    fontFamily: "Lato-Semibold", fontSize:15
  }


});
