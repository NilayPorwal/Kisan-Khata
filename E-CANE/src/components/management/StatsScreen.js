import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor, Modal, ActivityIndicator, TouchableOpacity, TextInput, AsyncStorage, FlatList, ScrollView} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header, Left, Body, Right, Button, Icon, Title,Segment,Badge,  
        Content, Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LineChart, PieChart, BarChart, HorizontalBarChart} from 'react-native-charts-wrapper';
import APIManager from './Managers/APIManager';
import Shift1Screen from './Shift1Screen';
import Shift2Screen from './Shift2Screen';
var dateFormat = require('dateformat');

  





 let width= Dimensions.get('window').width
 let height= Dimensions.get('window').height    


export default class StatsScreen extends Component {
   constructor(props) {  
      super(props);     
      this.state = {       
        data:{},
        Date:new Date(), 
        status : 'first',  
     
     }                      
   }      
 

    static navigationOptions = {
       header: null,
            
     };


  
 handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }  


      
  render() {
    return (
        <ScrollView>

       <View style={{flexDirection:'row', marginLeft:3}}>
          
           <View style={{backgroundColor:'#f86c6b', width:'30%', margin:5, elevation:5, borderRadius:3}}>
             <View style={{width:'80%'}}>  
              <Text style={{fontFamily: "Lato-Black", color:'#ffffff', padding:10}}>Yard Balance</Text>
             </View> 
             <Text style={{fontFamily: "Lato-Black",color:'#ffffff', padding:10}}>{this.props.yardBalance}</Text>  
              <Icon type="FontAwesome" name="industry" style={{fontSize: 18, color: '#ffffff', position:'absolute', top:5, right:5}} />
           </View>  
          
          
          <View style={{backgroundColor:'#ffc107', width:'30%', margin:5, elevation:5, borderRadius:3}}> 
           <View style={{width:'80%'}}>
            <Text  style={{fontFamily: "Lato-Black", color:'#ffffff', padding:10}}>Total Crushing</Text>
          </View>
           <Text  style={{fontFamily: "Lato-Black",color:'#ffffff', padding:10}}>{this.props.crushingWeight}</Text>  
           <Icon type="FontAwesome" name="gavel" style={{fontSize: 18, color: '#ffffff', position:'absolute', top:5, right:5}} /> 
          </View>  
             
          <View style={{backgroundColor:'#4dbd74', width:'30%', margin:5, elevation:5, borderRadius:3}}>    
           <View style={{width:'80%'}}> 
            <Text style={{fontFamily: "Lato-Black", color:'#ffffff', padding:10}}>Total Weight</Text>
           </View>
           <Text style={{fontFamily: "Lato-Black",color:'#ffffff', padding:10}}>{this.props.totalWeight}</Text>   
            <Icon type="FontAwesome" name="balance-scale" style={{fontSize: 18, color: '#ffffff', position:'absolute', top:5, right:5}} />
          </View>  
         </View>

      
        <Segment style={{backgroundColor:'#B9D3EE'}}>
          <Button first onPress={()=>this.setState({status:'first'})} active = {(this.state.status == 'first')?true:false}>
            <Text>08 AM-08 PM</Text>
          </Button>
          <Button onPress={()=>this.setState({status:'second'})} active = {(this.state.status == 'second')?true:false} >
            <Text>08 PM-08 AM</Text>
          </Button>
       
        </Segment>    

        {
        (this.state.status == 'first')?
            <Shift1Screen  dataBar1={this.props.dataBar1}   dataLine1={this.props.dataLine1} dataPie1={this.props.dataPie1} />:null }      

            {
        (this.state.status == 'second')?
            <Shift2Screen  dataBar2={this.props.dataBar2}   dataLine2={this.props.dataLine2} dataPie2={this.props.dataPie2} />:null }       

       
 
         
   

        <FlatList     
          data={this.props.modeWiseData} 
          keyExtractor={item => item.index}  
          renderItem={({item, index}) =>         
               
            <Card style={{margin:10, borderRadius:3, elevation:5, backgroundColor:'#ffffff'}}>
             <View style={{backgroundColor:'#75249D'}}>
              <Text style={{fontSize:18, fontFamily: "Lato-Black",  padding:10, color:'#ffffff'}}>{item.pMName}</Text> 
             </View>
             
             <View style={{borderBottomWidth:1, borderBottomColor:'#888C8F',  marginTop:10, padding:10}}>  
              <Text style={{fontSize:15, fontFamily: "Lato-Black", color:'#77459F'}}>TOKEN</Text> 
              
             <View style={{flexDirection:'row', marginTop:10,}}> 
              <View style={{flexDirection:'row',justifyContent:'space-between', width:'40%'}}>
               <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Count</Text> 
               <Text>-</Text> 
               <Text style={{fontSize:15}}>{item.pTotToken}</Text>  
              </View>

              <View style={{width:'20%'}}>  
              </View>

              <View style={{flexDirection:'row',justifyContent:'space-between',  width:'40%'}}>
               <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Weight </Text> 
                <Text>-</Text>  
               <Text style={{fontSize:15}}>{item.pAvgTkYardBal}</Text>  
              </View>
             </View> 
            </View> 

             <View style={{borderBottomWidth:1, borderBottomColor:'#888C8F', marginTop:10,  padding:10}}>  
              <Text style={{fontSize:15, fontFamily: "Lato-Black", color:'#77459F'}}>GROSS</Text> 
              
             <View style={{flexDirection:'row', marginTop:10,}}> 
              <View style={{flexDirection:'row',justifyContent:'space-between', width:'40%'}}>
               <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Count</Text> 
               <Text>-</Text>  
               <Text style={{fontSize:15}}>{item.pTotGross}</Text>  
              </View>
   
              <View style={{width:'20%'}}>  
              </View>  
              
              <View style={{flexDirection:'row',justifyContent:'space-between', width:'40%'}}>
               <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Weight </Text> 
                <Text>-</Text>  
               <Text style={{fontSize:15}}>{item.pAvgGrYardBal}</Text>  
              </View>
             </View> 
             </View>         

              <View style={{ marginTop:10,  padding:10}}>  
              <Text style={{fontSize:15, fontFamily: "Lato-Black", color:'#77459F'}}>CRUSHING</Text> 
              
               <View style={{flexDirection:'row',  marginTop:10}}> 
                <View style={{width:'32%'}}></View>
                <View style={{width:'32%'}}>
                 <Text style={{fontSize:15, fontFamily: "Lato-Black", color:'#9979AD',  textAlign:'center'}}>OnDate</Text>
                </View>
                <View style={{width:'32%'}}>
                 <Text style={{fontSize:15, fontFamily: "Lato-Black",  color:'#9979AD', textAlign:'right'}}>AsOn Date</Text>
                </View>
               </View>  
 
              <View style={{flexDirection:'row',marginTop:10}}> 
                 <View style={{width:'32%'}}> 
                  <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Count</Text> 
                 </View>  
                 <View style={{width:'32%'}}>
                  <Text style={{fontSize:15, textAlign:'center'}}>{item.pCurWeightCount}</Text>  
                </View>
                 <View style={{width:'32%'}}>
                  <Text style={{fontSize:15, textAlign:'right'}}>{item.pTotWeightCount}</Text>
                 </View>  
               </View> 

               <View style={{flexDirection:'row',  marginTop:10}}> 
                  <View style={{width:'32%'}}>
                    <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Weight</Text>
                  </View>   
                  <View style={{width:'32%'}}>
                   <Text style={{fontSize:15, textAlign:'center'}}>{item.pCurNetWeight}</Text></View>  
                  <View style={{width:'32%'}}>
                   <Text style={{fontSize:15, textAlign:'right'}}>{item.pTotNetWeight}</Text> 
                  </View> 
               </View>   

               <View style={{flexDirection:'row',  marginTop:10}}> 
                  <View style={{width:'32%'}}>
                   <Text style={{fontSize:15, fontFamily: "Lato-Black"}}>Avg. Weight</Text>
                  </View>   
                  <View style={{width:'32%'}}>
                   <Text style={{fontSize:15, textAlign:'center'}}>{item.pCurAvgWt}</Text> 
                  </View> 
                  <View style={{width:'32%'}}>
                   <Text style={{fontSize:15, textAlign:'right'}}>{item.pTotAvgWt}</Text>
                 </View> 
               </View>  

   

             </View>   
            </Card>   
           }                            
        />   
    
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
});
