import React, { Component } from 'react';
import {
  Alert,
  View,
  BackHandler,
  Dimensions
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

const width= Dimensions.get('window').width
const height= Dimensions.get('window').height

export default class Scanner extends Component {

   constructor(props) {
    super(props);

    this.state = {    
      torchMode: 'off',
      cameraType: 'back',
    };
    global.Scanner = this;
  }

  componentDidMount(){
   
     BackHandler.addEventListener('hardwareBackPress',  global.Scanner.handleAndroidBackButton);
  }
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', global.Scanner.handleAndroidBackButton);
  } 


  handleAndroidBackButton() {
     //BackHandler.exitApp(); 
      global.Scanner.props.navigation.goBack();
       return true;   
    }      
      

  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
  }
 
  onBarCodeRead(res){
    //Alert.alert('Note', res.data) 
    this.goBack(res.data)

  } 

  goBack(token) {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({ token });
  }

  onReadBarCodeByGalleryFailure(){
    Alert.alert('Note', 'Not found barcode!')
  }
 
  render() {            
    return ( 
   <View style={{flex:1}}>  
    
      <RNCamera style={{flex:1}}
       onBarCodeRead={(data)=> this.onBarCodeRead.call(this, data)}>
        <BarcodeMask width={width*0.9} height={height*0.15} />
      </RNCamera> 
    
     </View> 

    )
  }
} 