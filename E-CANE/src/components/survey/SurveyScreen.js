import React, {Component} from 'react';
import {StyleSheet, SafeAreaView,Text, View, TouchableOpacity, TextInput, ScrollView, CheckBox, Dimensions, BackHandler, Alert} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import  SurveyForm from './SurveyForm';
import  FarmerDetails from './FarmerDetails';
//import Icon from 'react-native-vector-icons/Feather';
import { Icon } from 'native-base';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import I18n, { getLanguages } from 'react-native-i18n';
import APIManager from './../APIManager';


const FirstRoute = () => (
  <SurveyForm navigate = {global.SurveyScreen.props.navigation.navigate}  />
); 

const SecondRoute = () => ( 
  <FarmerDetails  />
);   


I18n.fallbacks = true;

I18n.translations = {
  'en': require('./../../translations/en'),
  'hi': require('./../../translations/hi'),
 };
   
export default class SurveyScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      index: 0,    
      routes: [
        { key: 'first', title: 'सर्वे फॉर्म' },
        { key: 'second', title: 'किसान की डिटेल्स' },
      ],
       stopwatchStart: true,
       currentTime:null,
       language:"English"
    };
     global.SurveyScreen = this;
  }           

   static navigationOptions =  ({ navigation }) => { return {
      header:null  
   }
  };   

   componentDidMount(){
    
     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton); 
     this.retriveData()
        
   }
   

  handleAndroidBackButton() {
     //BackHandler.exitApp(); 
      global.SurveyScreen.props.navigation.goBack();
       return true;   
    }      
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }

   getFormattedTime(time) {
    //alert(time)
    //   global.SurveyScreen.setState({currentTime:time});
  };  

   setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide(); 
  };

  showMenu = () => {
    this._menu.show();
  };

  onLanguageChange(){
     I18n.locale = (this.state.language=="हिंदी")?"hi":"en";
    this.setState({language:(this.state.language=="हिंदी")?"English":"हिंदी"})
    global.SurveyForm.onLanguageChange(this.state.language)
  
  } 

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));

      this.setState({userData:data})

    }
    }, (error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
  } 
  
   onLogOut(){
    Alert.alert( 
      "Logout Confirmation",
      'Do you want to Logout ?',
      [
        { 
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );

 }

 logOut(){
 
  this.hideMenu()
  APIManager.logOut((response)=>{
    if(response.status == "SUCCESS"){
          this.props.navigation.navigate("LoginScreen")
     }
    else{
        Alert.alert("Logout Failed", response.message)
  
     } 
  })
  
} 
    
  
  render() { 
    return (
      <SafeAreaView style={styles.container}>  
        <View style={{flexDirection:'row', backgroundColor: '#8db301', padding:15, justifyContent:'space-between', elevation:10}}>
         <Text style={{fontFamily: "Lato-Semibold",fontSize:20, color:'#ffff'}}>E-CANE</Text>
         
          <Stopwatch 
            laps 
            start={this.state.stopwatchStart}
            reset={this.state.stopwatchReset}
            options={options}
            getTime={this.getFormattedTime} />

          <Menu 
            ref={this.setMenuRef}
            button={<Icon  name='dots-vertical' type="MaterialCommunityIcons"     
                           style={{fontSize:25, color:'#ffffff'}}
                           onPress={this.showMenu} /> 
           }
          >
            <MenuItem onPress={()=>this.onLanguageChange()}>{this.state.language}</MenuItem>
            <MenuDivider />
            <MenuItem onPress={() => this.onLogOut()}>Log Out</MenuItem>
          </Menu>  
       {
       // <TouchableOpacity  onPress={()=>this.props.navigation.navigate('SurveyDetails')}>
       //   <Icon name="file-text" size={25} color="#ffffff" />
       // </TouchableOpacity> 
       }
      </View>          
         
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,   
        })}   
        style={styles.tabContainer}
        sceneContainerStyle={styles.scene}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}

        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabContainer}
            labelStyle={{fontSize:18}}
          />
        )}
      />  
     </SafeAreaView>  
    );
  }
}
const options = {
  container: {
   // backgroundColor: '#000',
    padding: 5,
  }, 
  text: {
    fontSize: 18,
    color: '#FFF',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    backgroundColor: '#8db301',
  },
  indicator: {
    backgroundColor: '#fff',
  }, 
  scene: {
    overflow: 'visible',
  },
});  
  