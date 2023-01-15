import React, { Component } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator, CheckBox,FlatList,
        Button, AsyncStorage, Image, ImageBackground, BackHandler, ToastAndroid, PermissionsAndroid,Keyboard, KeyboardAvoidingView, Dimensions} from 'react-native';
import { Icon } from 'native-base';
import APIManager from './APIManager';
import { encrypt, decrypt1, decrypt } from "./AESEncryption"

const {height, width} = Dimensions.get('window');
const themeColor = "#8db301"  

export default class NotificationScreen extends Component {

   constructor(props) {
    super(props);
   
    this.state = {
     isLoading:true,
     userData:{},
     notifications:[]
    }; 
    global.NotificationScreen = this;   
  }
    
  static navigationOptions =  ({ navigation }) => { 
    return { header:null } 
  };

 
  componentDidMount(){
     this.retriveData()
     BackHandler.addEventListener('hardwareBackPress',  global.NotificationScreen.handleAndroidBackButton);

   }
   

  handleAndroidBackButton() {
      global.NotificationScreen.props.navigation.goBack()
      return true;  
    }      
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress',  global.NotificationScreen.handleAndroidBackButton);

  }

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      this.setState({userData:data})
       this.getNotification();

    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }

 getNotification(){
    const data = {
               "pUserId":this.state.userData.userId
                }
   APIManager.getNotification(data, (response)=>{ 
      this.setState({isLoading:false})
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Notification List :" + JSON.stringify(response.data));
         
          this.setState({notifications: response.data.data })
   
        } else {
          console.log('Notification list error', JSON.stringify(response));

        }
    }, (error)=>{
      this.setState({isLoading:false})
      Alert.alert('Notification list error', JSON.stringify(response));
    })
  };


  
  render() { 
    return (
    <View style={{flex:1}}>   
     <View style={styles.header}>
      <TouchableOpacity onPress={()=>this.props.navigation.goBack()} >
       <Icon  name='arrow-left' type="MaterialCommunityIcons"  style={{fontSize:20, color:'#ffffff'}} /> 
      </TouchableOpacity>
       <Text style={{fontSize:18, color:"#ffffff", fontFamily: "Lato-Semibold", paddingLeft:10}}>Notifications</Text>   
      </View>      

      
       {(this.state.isLoading == false)?
         <View>
          {(this.state.notifications.length > 0)?
              <FlatList  
                data={this.state.notifications}
                extraData={this.state}
                renderItem={({item, index}) => 
                   <View style={{padding:10, flexDirection:"row"}}>
                     <Icon  name='bell' type="MaterialCommunityIcons"  style={{fontSize:18, color:'#4dbd74', paddingTop:3}} /> 
                     <Text style={{color:"#000000", fontSize:15, fontFamily: "Lato-Semibold", paddingLeft:10}}>{item.PUSH_MSG}</Text> 
                  </View >
                }
              />:
             <View style={{alignItems:"center", marginTop:"20%"}}> 
              <Image
                  style={{width: width*0.5, height: height*0.3}}
                  resizeMode="contain"
                  source={require('../assets/ic_launcher.png')}
                />  
             <View style={{width:"80%"}}> 
              <Text style={{fontSize:18, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"}}>Notification Not Found</Text>  
             </View>

            </View> }  
         </View>:<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>}

      </View>
    )   
  }   
}    


const styles = StyleSheet.create({
  header: {
    elevation:8, backgroundColor:themeColor, flexDirection:"row", alignItems:"center", padding:15
  },

});