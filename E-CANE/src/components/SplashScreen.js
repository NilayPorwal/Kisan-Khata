import React, {Component} from 'react';
import {Linking, Platform, StyleSheet, View, Image, Dimensions, TextInput, AsyncStorage, ImageBackground, Text, Modal, TouchableHighlight} from 'react-native';
import Storage from 'react-native-storage';
import APIManager from './APIManager';
import { encrypt, decrypt1,  decrypt} from "./AESEncryption"
import VersionCheck from 'react-native-version-check';
import RateModal from 'react-native-store-rating'


 const storage = new Storage({
          storageBackend: AsyncStorage, 
          enableCache: true,
        });

const {height, width} = Dimensions.get('window');

export default class SplashScreen extends Component {

constructor(props) {
  super(props);
  this.state ={
     isRefreshing:true,
     modalVisible:false
    }
}

static navigationOptions = {
          header: null,
 };
 
async componentDidMount(){
  if(APIManager.isDev != true){ 
   await this.getIpAddress()
  }
  //this.checkVersion();
  //this.getPublicAppConfigList();
  this.loadData();
}

redirectTo(screen){
   this.props.navigation.push(screen)
}

loadData(){
  setTimeout(()=>{
  
    APIManager.getValueForKey('screenType', (data)=>{
       if(data != null){ 
        console.log("Screen Type " + data);
        this.redirectTo(data.screenType)
       }
       else{
        this.redirectTo("LoginScreen")
       }

    }, (error)=>{
       this.redirectTo("LoginScreen")
    })
  },2000 ) 

}

getIpAddress(){
   
    APIManager.getIpAddress((response)=>{
       // APIManager.setValueForKey('ipAddress', response.data.sky_MSPIL_ERP_API_HOST);
        APIManager.setValueForKey('multiHost', response.data.sky_MSPIL_ERP_API_HOST_MULTI);
        APIManager.setValueForKey('lanHost', response.data.sky_MSPIL_ERP_API_HOST_LAN);
    }, (error)=>{
       console.log(JSON.stringify(error))

    })
  
}


checkVersion(){
  VersionCheck.needUpdate()
    .then(async res => {
      //alert(JSON.stringify(res))
      if (res.isNeeded) {
       this.setState({modalVisible:true})
      } 
    });
} 

  getPublicAppConfigList() {

  APIManager.getPublicAppConfigList((response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Get Public Configuration: " + JSON.stringify(response.data));

        
        } else { 
          console.log('Get Public Configuration error', response);
         // Alert.alert('Error',  response.data.message);    
        }  
        
   }, (error)=>{
       console.log('Get Public Configuration error', error);
   })

 }

 onUpdate(){
  if(Platform.OS == "android"){
    Linking.openURL("https://play.google.com/store/apps/details?id=in.skyras.kissanmitra"); 
   }
 }


   
render() {

  return(

      <ImageBackground source={require('../assets/splash-bg.png')} style={{width: '100%', height: '100%'}}>
       <View style={styles.mainContainer}>
          
      <Image
          style={{width: width*0.6, height: height*0.2}}
          //resizeMode="contain"
          source={require('../assets/ic_launcher.png')}
        /> 

      <View style={{width:"80%"}}>  
        <Text style={{fontSize:18, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
       </View> 
   
       <View style={{marginTop:height*0.2}}>
          <Image
           style={{width:width*0.5, height:height*0.1}}
           resizeMode="contain"
           source={require('../assets/logo.png')} />
       </View>   

       </View>

         <Modal animationType = {"slide"} 
                transparent = {true}
                visible = {this.state.modalVisible}
                onRequestClose = {() => this.setState({modalVisible:false}) }>
               
                <View style = {styles.modal}>
                <View style={styles.modalView1}>
                    <Text style={{fontSize:18, fontFamily:"Lato-Black", paddingTop:15,  textAlign:"center"}}>App Update</Text>
                   {(Platform.OS === "ios")? 
                    <Text style={{fontSize:15, fontFamily:"Lato-Semibold", paddingTop:15,  textAlign:"center"}}>New version of app is available on App Store</Text>:
                    <Text style={{fontSize:15, fontFamily:"Lato-Semibold", paddingTop:15,  textAlign:"center"}}>New version of app is available on Play Store</Text>}

                  <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                   <TouchableHighlight onPress={()=>this.onUpdate()} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>UPDATE</Text>
                   </TouchableHighlight>
                    <TouchableHighlight onPress={()=>this.setState({modalVisible:false})} style={styles.updateBtn}>
                      <Text style = {styles.btnText}>CANCEL</Text>
                   </TouchableHighlight>
                  </View>
                </View>
                </View>
             </Modal>

      
    </ImageBackground>  

     );
  }
}

// Styles
const styles = StyleSheet.create({

  // Containers
  mainContainer: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center"

  },
   modal: {
      flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'
    },
  modalView1:{
     width: '85%',backgroundColor:'#ffffff', borderRadius:10, justifyContent:'center', padding:15 
    },
   updateBtn: {
      marginTop:10, backgroundColor:'#8db301', elevation:4, borderRadius:50, alignSelf:'center', padding:10, marginVertical:10, width:"45%", alignItems:"center"
    },
   btnText:{
    fontSize:15, fontFamily: "Lato-Semibold", color:'#FFFFFF'
   },  

});