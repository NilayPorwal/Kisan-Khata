import React, { Component } from 'react';
import {Dimensions, Text, View, ImageBackground, Image, ScrollView, TouchableOpacity, BackHandler, StyleSheet, Alert } from 'react-native';
import APIManager from './APIManager';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, Picker } from 'native-base';

const {height, width} = Dimensions.get('window');


export default class SuperAdmin extends Component {
     constructor(props) {
        super(props);
        this.state = {
           userData:{}
        }
      }

    static navigationOptions = {
        header: null,
             
    }; 

    componentDidMount() {
       BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
        this.retriveData();
  
      }
    
      handleAndroidBackButton() {
           
         BackHandler.exitApp(); 
          return true;
       }      
               
       
     componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
       
        }

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      this.setState({userData:data})
       //this.getFarmerTareDetails();

    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

   onLogOut(){
    Alert.alert(
      "Logout Confirmation",
      'Do you want to Logout ?',      
      [
        { 
          text:  "No",
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: "Yes", onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );

 }


 logOut(){
  this.hideMenu();

  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
        this.setState({ userData:{}})
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
  
} 


  render() {
    return (
       <ImageBackground source={require('./../assets/Splash.png')} style={{flex:1}}>
          <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
          <View style={{alignItems:"center", marginTop:height*0.03}}> 
              <Image
                  style={{width: width*0.5, height: height*0.25}}
                  resizeMode="contain"
                  source={require('./../assets/ic_launcher.png')}
                  
                />  
              <View style={{width:"80%"}}>  
                <Text style={styles.compName}>MAHAKAUSHAL SUGAR & POWER INDUSTRIES LIMITED</Text>  
              </View> 

                <Text style={[styles.compName, {paddingTop:10}]}>Welcome Mr. {this.state.userData.displayName}</Text>  
            </View>
            <View style={{marginTop:height*0.03}}>
               <View style={{alignItems:"center"}}>
                  <TouchableOpacity activeOpacity={0.5}  onPress={() => this.props.navigation.navigate('AdminScreen')} style={styles.button}>
                    <Text selectable={true} style={styles.btnText}>MANAGEMENT</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:15, marginHorizontal:10}}>

                  <TouchableOpacity activeOpacity={.5}  onPress={() => this.props.navigation.navigate('TokenDetails')} style={styles.button}>
                    <Text selectable={true} style={styles.btnText}>CANE MANAGER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.5}  onPress={() => this.props.navigation.navigate('LandingSurveyScreen')} style={styles.button}>
                    <Text selectable={true} style={styles.btnText}>SURVEYOR</Text>
                  </TouchableOpacity>

                </View>
               
                <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:15, marginHorizontal:10}}>

                  <TouchableOpacity activeOpacity={.5}  onPress={() => this.props.navigation.navigate('KisanCodeScreen')} style={styles.button}>
                    <Text selectable={true} style={styles.btnText}>FARMER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.5}  onPress={() => this.props.navigation.navigate('EDPScreen')} style={styles.button}>
                    <Text selectable={true} style={styles.btnText}>EDP</Text>
                  </TouchableOpacity>

                </View>

                <View style={{alignItems:"center", marginTop:height*0.08}}>
                <Image
                  style={{width:width*0.5, height:height*0.1}}
                  resizeMode="contain"
                  source={require('./../assets/logo.png')}
                
                />
             </View>

              
            </View>
                <TouchableOpacity  onPress={this.showMenu} style={{position:"absolute", right:10, top:(Platform.OS === "ios")?20:10}}>
                 <Menu 
                  ref={this.setMenuRef}
                  button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                                 style={{fontSize:25, color:'#000000'}}
                                 onPress={this.showMenu} /> 
                 }
                >
                  <MenuItem onPress={() => this.onLogOut()}>Log Out</MenuItem>
                </Menu>
             </TouchableOpacity>
            </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create ({
compName: {
       fontSize:18, fontFamily: "Lato-Semibold", color:"#000000", textAlign:"center"
    },
button: {
     elevation:8, width:'45%', justifyContent:'center', alignItems:'center', backgroundColor:'#8db301', padding:15, borderRadius:25, marginTop:10
   },
btnText:{
    fontSize:14, fontFamily: "Lato-Semibold", color:'#FFFFFF'
   }, 
  })
