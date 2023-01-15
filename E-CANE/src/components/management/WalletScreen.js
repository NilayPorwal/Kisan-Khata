import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, Dimensions, TextInput, AsyncStorage, ScrollView} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button,Text , Spinner, Icon, Body, Title, Tabs, Tab} from 'native-base';
import APIManager from './Managers/APIManager';
import PaymentScreen from './PaymentScreen'
import DetailScreen from './DetailScreen'
import LinearGradient from 'react-native-linear-gradient';

 

export default class WalletScreen extends Component {

    constructor(props) {
    super(props);
    this.state ={
      username:null,
      password:null, 
      stage:null,
      isRefreshing:false
     }

    }
 
       static navigationOptions = {
           header: null,

       };  

  
 render() {
     const {height: screenHeight} = Dimensions.get('window');
    return(

     <View style={{flex:1}}>
      {
       // <Header style={{backgroundColor:'#3473c3'}} > 
       //  <Body>
       //    <Title style={{color:'#ffffff'}}>MSPIL Kissan Wallet</Title>
       //  </Body> 
       // </Header> 
      }     
         
      <LinearGradient colors={['#192f6a', '#3473c3', '#3b5998']} >
       
       <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>  
        <Icon type = 'FontAwesome' name="google-wallet"  style={{fontSize: 20, color:'#ffffff'}} />
        <Text style={{color:'#ffffff', textAlign:'center', fontFamily:'Charm-Bold', fontSize:20, paddingLeft:5}}>Your Wallet</Text>
       </View>

       <View style={{padding:10}}>
         <Text style={{color:'#ffffff', fontFamily:'serif', fontSize:18}}>Available Balance</Text>
         
         <View style={{flexDirection:'row'}}>
          <Icon type = 'FontAwesome'  name="rupee"  style={{fontSize: 20, color:'#ffffff', paddingTop:4}} />
          <Text style={{color:'#ffffff', fontFamily:'serif', fontSize:18, fontFamily: "Lato-Black", paddingLeft:5}}>20,000</Text>
         </View>
       </View> 
      </LinearGradient>     
 
        <Tabs>
          <Tab heading="Details" tabStyle={{backgroundColor:'#3b5998'}}  activeTabStyle={{backgroundColor:'#3b5998'}} >
            <DetailScreen />
          </Tab>
          <Tab heading="Transactions" tabStyle={{backgroundColor:'#3b5998'}} activeTabStyle={{backgroundColor:'#3b5998'}}>
            <View style={{flex:1}}> 
             
           </View>  
          </Tab>  
           
        </Tabs>
     </View>

     ); 
  } 
}