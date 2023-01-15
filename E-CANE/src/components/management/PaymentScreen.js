import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor, FlatList, TextInput, Alert, Modal, ScrollView} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header, Left, Body, Right, Button, Icon, Title,  Content,Segment, Tabs, Tab, 
         Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab, Badge, Form, Picker, Spinner} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LineChart, PieChart, BarChart} from 'react-native-charts-wrapper';
import APIManager from './Managers/APIManager';
import LinearGradient from 'react-native-linear-gradient';

var dateFormat = require('dateformat');


  const height = Dimensions.get('window').height


global.PaymentScreen;
export default class PaymentScreen extends Component {
   constructor(props) {
       super(props);
      this.state = {
       villCode:'0',
       payType:'1',
       amount:null,
       villCode:null,
       Date:new Date(),
       payDetails:null,
       error:'1'
     }
    global.PaymentScreen = this;

   }

    static navigationOptions = {
       header: null,

   };

  setDate(newDate) {
     let now =  newDate
     let date = dateFormat(now, "dd-mm-yyyy");
     this.setState({ Date: newDate });
   }

   getPaymentReport(){
     this.setState({refreshing:true})
     const date =  dateFormat(this.state.Date, "yyyy-mm-dd")
     const villCode = (this.state.villCode != null)?this.state.villCode:'0'
     
     if(this.state.amount != null){

      APIManager.getPaymentReport(this.state.payType, this.state.amount, date, villCode,
          (responseJson)=> {
          //alert(JSON.stringify(responseJson));
          if(responseJson.status=='SUCCESS'){
           this.setState({payDetails:responseJson.data, refreshing:false})
          }
          else{
            this.setState({error:'0', refreshing:false})
          }
         })    
       }
       else{
         Alert.alert('Please select amount')
         this.setState({error:'0', refreshing:false})
       }
     }
  

  render() {
    const villageList = this.props.villageList.map((item, key) => {
                return (<Picker.Item label={item.placeName} value={item.placeId} key={key}/>)
                })
           villageList.unshift(<Picker.Item  label="All Village" value="0" />)

 

    return (    
    <View> 
       <Tabs  >
          <Tab heading="Tab1" tabStyle={{backgroundColor:(Platform.OS == 'android')?'#3F7DB5':null}} activeTabStyle={{backgroundColor:(Platform.OS == 'android')?'#3F7DB5':null}}  >
              <ScrollView style={{padding:10}}>

    <View style={{flexDirection:'row'}}>
     <Card style={{ borderWidth:1, width:'50%', flexDirection:'row'}}>
      <Icon name='ios-calendar' style={{color:'#000000', paddingLeft:10, paddingTop:5}} />
       <DatePicker
               defaultDate={new Date()}
               minimumDate={new Date(2015, 1, 1)}
               maximumDate={new Date()}
               locale={"en"}
               timeZoneOffsetInMinutes={undefined}
               modalTransparent={false}
               animationType={"fade"}
               androidMode={"default"}
               placeHolderText={dateFormat(this.state.Date, "dd/mm/yyyy")}
               textStyle={{ color: "#000000"}}
               placeHolderTextStyle={{ color: "#000000" }}
               onDateChange={this.setDate.bind(this)}
               />
     </Card>


     <Card style={{ borderWidth:1, width:'48%'}}>
     <Picker
        selectedValue={this.state.villCode}
        style={{ height: 40, width: '95%'}}
              mode = 'dialog'
              placeholder="All Village"
              placeholderStyle={{ color: "#000000" }}
        onValueChange={(value)=>this.setState({villCode:value})}>

      {villageList} 
         </Picker>
     </Card>
      </View>
        <View style={{flexDirection:'row'}}>
      <Card style={{ borderWidth:1, width:'50%'}}>
             <Picker
                  selectedValue={this.state.payType}
                  style={{ height: 40, width: '100%'}}
                  mode = 'dialog'
                  onValueChange={(value)=>this.setState({payType:value})}>
               
               <Picker.Item label="Fixed" value="1" />
               <Picker.Item label="Percentage" value="2" />

              </Picker>
           </Card>

           <Card style={{width:'48%'}}>
              <TextInput
                 style={{height: 40, paddingLeft:10}}
                 onChangeText={(text) => this.setState({amount:text})}
                 value={this.state.amount}
                 placeholder = {(this.state.payType == '2')?'Percentage(%)':'Amount'}
                 keyboardType ='numeric'
               />
           </Card>
         </View>


         <Button info block onPress={()=>this.getPaymentReport()}>
          <Text> Payment Report </Text>
         </Button>

      {(this.state.payDetails != null)?
         <Card style={{marginTop:20}}>
          <View style={{paddingVertical:10, backgroundColor:'#406E95'}}>
             <Text style={{padding:5, fontFamily: "Lato-Black", color:'#ffffff', textAlign:'center'}}>Kisan Payment Report</Text>
          </View>

        {(this.state.refreshing == false)?<View>  
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{padding:5, fontFamily: "Lato-Black"}}>Total Cane Weight</Text>
            <Text style={{padding:5}}>{this.state.payDetails.rcvdCaneWt}</Text>
          </View>

           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
             <Text style={{padding:5, fontFamily: "Lato-Black"}}>Total Amount</Text>
              <Text style={{padding:5}}>{this.state.payDetails.frpAmount}</Text>
            </View>


           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
             <Text style={{padding:5, fontFamily: "Lato-Black"}}>Amount To Be Paid</Text>
             <Text style={{padding:5}}>{this.state.payDetails.amtTobePaid}</Text>
            </View>



           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
             <Text style={{padding:5, fontFamily: "Lato-Black"}}>Paid Amount</Text>
             <Text style={{padding:5}}>{this.state.payDetails.drPayout}</Text>
            </View>

           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{padding:5, fontFamily: "Lato-Black"}}>Transporter Amount</Text>
            <Text style={{padding:5}}>{this.state.payDetails.transporterAmt}</Text>
           </View>

           <View style={{flexDirection:'row', justifyContent:'space-between'}}>
             <Text style={{padding:5, fontFamily: "Lato-Black"}}>Harvester Amount</Text>
             <Text style={{padding:5}}>{this.state.payDetails.drPayout}</Text>
            </View>


            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={{padding:5, fontFamily: "Lato-Black"}}>Burnt Cane Amount</Text>
              <Text style={{padding:5}}>{this.state.payDetails.burntCaneAmount}</Text>
            </View>
          </View>: <Spinner color='blue' />}
         </Card>:null}

         {(this.state.error == '0')?  
            
           <Card style={{justifyContent:'center', alignItems:'center', marginTop:20, height:height*0.5}}>
            <Text>No Details Found</Text>
           </Card>:null     
 
          }
 
      </ScrollView>  
           
      </Tab>
          
        <Tab heading="Tab2" tabStyle={{backgroundColor:(Platform.OS == 'android')?'#3F7DB5':null}} activeTabStyle={{backgroundColor:(Platform.OS == 'android')?'#3F7DB5':null}}  >
         <View style={{padding:15}}> 
           <Card>
              <LinearGradient colors={['#FFEDB4', '#FEB4C5', '#F694CF']} style={styles.cardStyle} >
               <Text style={{color:'#000000', textAlign:'center', fontSize:20, fontFamily:'Amazon-Ember-Regular'}}> Total Amount </Text>
               <Text style={{color:'#000000', textAlign:'center', fontFamily: "Lato-Black", fontSize:20, fontFamily:'Amazon-Ember-Regular'}}>₹ xxxxxxx </Text> 
                
              </LinearGradient> 
           </Card>

            <Card >
              <LinearGradient colors={['#F7CF4B', '#F78C3F', '#F75D37']} style={styles.cardStyle} >
                <Text style={{color:'#000000', textAlign:'center', fontSize:20, fontFamily:'Amazon-Ember-Regular'}}> Today's Amount </Text>
                <Text style={{color:'#000000', textAlign:'center', fontFamily: "Lato-Black", fontSize:20, fontFamily:'Amazon-Ember-Regular'}}>₹ xxxxxxx </Text> 

    
              </LinearGradient>
           </Card>

            <Card >
              <LinearGradient colors={['#D8EB01', '#89C300', '#0A8501']} style={styles.cardStyle} >
                <Text style={{color:'#000000', textAlign:'center', fontSize:20, fontFamily:'Amazon-Ember-Regular'}}> Current Balance </Text>
               <Text style={{color:'#000000', textAlign:'center', fontFamily: "Lato-Black", fontSize:20, fontFamily:'Amazon-Ember-Regular'}}>₹ xxxxxxx </Text> 
 
 
              </LinearGradient>  
           </Card>  
         </View> 
        </Tab>
         
      </Tabs>
   
     </View> 
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

  cardStyle:{
    height:height*0.2, 
    justifyContent:'center'

  }
});
