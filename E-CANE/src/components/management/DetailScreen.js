import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, Dimensions, TextInput, AsyncStorage, ScrollView} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button,Text , Spinner, Icon} from 'native-base';
import APIManager from './Managers/APIManager';
import PaymentScreen from './PaymentScreen'
import LinearGradient from 'react-native-linear-gradient';


 
export default class DetailScreen extends Component {

    constructor(props) {
    super(props);
    this.state ={
      
     }

    }
 
   static navigationOptions = {
       header: null,

   };
  
  
 render() {
    
    return(
     <ScrollView style = {{flex:1}}>
     </ScrollView>

     );
  } 
}    