import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, ScrollView, Alert,
        CheckBox, Dimensions, BackHandler, Button, ImageBackground, AsyncStorage, Image} from 'react-native';
import { Icon } from 'native-base';
import Storage from 'react-native-storage';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import APIManager from './../APIManager';


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


export default class GeoCapturingScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
     fieldImages:[],
     fieldInfo:this.props.navigation.state.params.fieldInfo,
     index:this.props.navigation.state.params.index,
     plotNumber:this.props.navigation.state.params.plotNumber,
     locationPoints:[],
     isCapturing:false,
     stopwatchStart: false,
     farmerData:{},
     geoData:[]
    };
     global.GeoCapturingScreen = this;
      this.handleAndroidBackButton = this.handleAndroidBackButton.bind(this);
  }           

   static navigationOptions =  ({ navigation }) => { 
    return {
        header:null    
   }         
  };     

   componentDidMount(){
    
     this.loadData();
     BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton); 
       
   }     

  handleAndroidBackButton() {   
    if(this.state.isCapturing == false){
       this.props.navigation.goBack();
       return true;
     }else{
     // alert("Please complete the measurement")
     Alert.alert( 
        'क्या आप वाकई वापस जाना चाहते हैं?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.props.navigation.goBack()},
        ],
        {cancelable: false},  
      );
       return true;
     }
  
    }      
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }
   
  

  _handleCameraButtonPress(index) { 

     var options = {
      title: 'Select',
      quality: 0.3,  
      storageOptions: { 
        path: 'images'
      }    
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
              
      else {  
       // let source =  response.uri     
      let source = {uri: response.uri, name: response.fileName, type: response.type }
       // You can also display the image using data:
       //let source = 'data:image/jpeg;base64,' + response.data ;
      //this.state.fieldImages.push(source)
      const fieldImages = this.state.fieldImages
            fieldImages[index] = source

      this.setState({fieldImages}); 

      //alert(JSON.stringify(this.state.locationPoints)) 
      }
    }); 
   }   

  deleteMedia(index){
    var array= this.state.fieldImages
    array.splice(index, 1);
    this.setState({
      fieldImages:array,
    });  
  } 

   watchID: ?number = null; 

 onStartTracking(){

    APIManager.locationEnabler((res)=>{
        this.watchPosition();
       }, (error)=>{
      console.log(JSON.stringify(error));  
      })  
 }   


 watchPosition(){ 

    this.stopLocationTracking();
        
    this.setState({isCapturing:true, stopwatchStart:true})  

    this.watchID = Geolocation.watchPosition(   
      (position) => {
       const coords = { latitude: position.coords.latitude,
                        longitude: position.coords.longitude}
 
        this.setState({
          locationPoints:[...this.state.locationPoints, coords],
           error: null,  
        }); 
         //alert(JSON.stringify(this.state.locationPoints))            
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter:5},
    );


  }

  stopLocationTracking(){
     this.watchID != null && Geolocation.clearWatch(this.watchID);
  }  

  loadData(){ 

      APIManager.getValueForKey('farmerData', (data)=>{
         if(data != null ){
            this.setState({farmerData:data})
          }
        },(error)=>{
           console.log("Farmer Data " + JSON.stringify(error));
      })
    }

onEndPress(){
  if(this.state.fieldImages.length == 4){ 
   Alert.alert( 
      "Please Confirm",
      'Do you want to End this survey ?',
      [
        { 
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.onEnd()},
      ],
      {cancelable: false},
    );
    }
  else {
     Alert.alert("Please select all the images")
  }
}

onEnd(){
        const data = {fieldImages:this.state.fieldImages, locationPoints:this.state.locationPoints}

        const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onSelect({"geoCaptured":1, "index":this.state.index, geoData:data});      
  }

   
  render() {     
    return (  
    <SafeAreaView  style={styles.container}> 
     <View style={{flexDirection:"row",  backgroundColor:"#8db301", height:"8%", elevation:10, alignItems:"center"}}>
      <TouchableOpacity onPress={()=>this.handleAndroidBackButton()}>
       <Icon name="left" type="AntDesign" style={{fontSize: 15, color:"#ffffff", paddingLeft:10}} />
      </TouchableOpacity>
      <Text style={{fontSize:18, fontFamily: "Lato-Semibold", color:"#ffffff", paddingLeft:"10%"}}>{"प्लाट  " + (this.state.plotNumber) + " : किसान कोड " + this.state.farmerData.codeNumber }</Text>
    </View>

     <View style={{flexDirection:"row", backgroundColor:"#8db301", height:"7%", justifyContent:"space-between", paddingHorizontal:15, paddingTop:10}}>
       
         {(this.state.fieldInfo.caneValue == 0)?<Text style={{fontSize:18, color:"#ffffff"}}>मड़ी</Text>:null} 
         {(this.state.fieldInfo.caneValue == 1)?<Text style={{fontSize:18, color:"#ffffff"}}>जड़ी</Text>:null} 
         {(this.state.fieldInfo.caneValue == 2)?<Text style={{fontSize:18, color:"#ffffff"}}>नोरपा</Text>:null} 

         <Stopwatch 
            laps 
            start={this.state.stopwatchStart}
            reset={this.state.stopwatchReset}
            options={options}
            getTime={this.getFormattedTime} />
      
        <Text style={{fontSize:18, fontWeight:"bold", color:"#ffffff"}}>{this.state.fieldInfo.prajati_name}</Text>
     </View>
            
  <ScrollView>
     <View style={{alignItems:"center", marginTop:10}}>
      <View style={{width:"80%"}}>
      {(this.state.isCapturing == false)?

       <View style={{alignItems:"center", marginVertical:15}}>
        <TouchableOpacity onPress={()=>this.onStartTracking()} style={[styles.btnStyle, {backgroundColor:"#8db301"}]}>
         <Text style={styles.btnTitle}>Start Geo Capturing</Text>
        </TouchableOpacity>  
      </View> :  
        <View style={{alignItems:"center", marginVertical:15}}>
          <View  style={[styles.btnStyle, {backgroundColor:"#8db301"}]}>
           <Text style={styles.btnTitle}>In Process...</Text>
          </View>  
        </View> 
     
      }
       </View>   
      </View>  

  {(this.state.isCapturing == true)?
       <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
         
        {(this.state.fieldImages[0] == null)?
         <TouchableOpacity style={styles.imageBackground} onPress={()=> this._handleCameraButtonPress(0)} >
          <Icon type="MaterialIcons" name="camera-alt" size={30} color="#900" />
         </TouchableOpacity>: 
        <View style={styles.imageStyle}>  
          <Image source={{uri: this.state.fieldImages[0].uri}}  style={{width:"100%", height:"100%"}}/>
          <TouchableOpacity style={styles.deleteImageBackground} onPress={() => this.deleteMedia(index)}>
             <Icon name="close" type="AntDesign" style={{fontSize: 15}} />
           </TouchableOpacity> 
        </View>
        } 

        {(this.state.fieldImages[1] == null)?
         <TouchableOpacity style={styles.imageBackground} onPress={()=> this._handleCameraButtonPress(1)} >
          <Icon type="MaterialIcons" name="camera-alt" size={30} color="#900" />
         </TouchableOpacity>: 
        <View style={styles.imageStyle}>  
          <Image source={{uri: this.state.fieldImages[1].uri}} style={{width:"100%", height:"100%"}}  />
          <TouchableOpacity style={styles.deleteImageBackground} onPress={() => this.deleteMedia(1)}>
                 <Icon name="close" type="AntDesign" style={{fontSize: 15}} />
           </TouchableOpacity> 
        </View> 
        }  
        </View>

        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
         {(this.state.fieldImages[2] == null)?
         <TouchableOpacity style={styles.imageBackground} onPress={()=> this._handleCameraButtonPress(2)} >
          <Icon type="MaterialIcons" name="camera-alt" size={30} color="#900" />
         </TouchableOpacity>: 
        <View style={styles.imageStyle}>  
          <Image source={{uri: this.state.fieldImages[2].uri}} style={{width:"100%", height:"100%"}} />
          <TouchableOpacity style={styles.deleteImageBackground} onPress={() => this.deleteMedia(2)}>
                 <Icon name="close" type="AntDesign" style={{fontSize: 15}} />
           </TouchableOpacity> 
        </View>
        }        
        
         {(this.state.fieldImages[3] == null)?
         <TouchableOpacity style={styles.imageBackground} onPress={()=> this._handleCameraButtonPress(3)} >
          <Icon type="MaterialIcons" name="camera-alt" size={30} color="#900" />
         </TouchableOpacity>: 
        <View style={styles.imageStyle}>  
          <Image source={{uri: this.state.fieldImages[3].uri}}  style={{width:"100%", height:"100%"}} />
          <TouchableOpacity style={styles.deleteImageBackground} onPress={() => this.deleteMedia(3)}>
                 <Icon name="close" type="AntDesign" style={{fontSize: 15}} />
           </TouchableOpacity> 
        </View>
        } 
        </View> 
       </View>:null}           
   


     {(this.state.isCapturing == true)?

       <View style={{alignItems:"center", marginVertical:15}}>
        <TouchableOpacity onPress={()=>this.onEndPress()} style={[styles.btnStyle, {backgroundColor:"#d8a800"}]}>
         <Text style={styles.btnTitle}>End Geo Capturing</Text>
        </TouchableOpacity>  
      </View> :null} 

       <View style={{alignItems:"center", elevation:8}}>
        <Image source={require('./../../assets/Map.png')}  style={{width:"95%", height:220}}/>  
      </View>    
      </ScrollView>   
    </SafeAreaView> 
    );  
  }
}
       

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#dcdcdc60"
  },
  deleteImageBackground: {
    position: 'absolute',
    right: 0,
    zIndex: 0,  
    margin: 5,
    backgroundColor: "#fff",
    padding:3,
    borderRadius: 10,
    alignItems: 'center',
  },
  imageBackground:{
    width:"45%", height:130, justifyContent:'center', alignItems:'center', borderRadius:10, margin:10, backgroundColor:"#dcdcdc60"
  },
  imageStyle:{
    width:"45%", height:130 ,borderRadius:10,  margin:10
  },
  btnStyle:{
    elevation:8, width:180, borderRadius:25, alignItems:"center"
  },
  btnTitle:{
    color:"#ffffff", paddingVertical:15, fontFamily: "Lato-Semibold", fontSize:15
  }

});  
  