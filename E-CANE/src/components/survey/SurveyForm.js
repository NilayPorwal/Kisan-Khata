import React, {Component} from 'react';
import {StyleSheet,NetInfo, Text, View, TouchableOpacity, TextInput, Dimensions, Button,
        ScrollView, CheckBox, Image, DatePickerAndroid, BackHandler, PermissionsAndroid, 
        Modal,ActivityIndicator, AsyncStorage, Alert, Keyboard } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'native-base';
import axios from 'axios';
var base64 = require('base-64');   
import { encrypt, decrypt } from "./../AESEncryption"
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import APIManager from './../APIManager';
import Geolocation from '@react-native-community/geolocation';
import Storage from 'react-native-storage';
import I18n, { getLanguages } from 'react-native-i18n';
import { Picker} from 'native-base';

    
 
var radio_props = [
  {label: 'मड़ी', value: 0 },
  {label: 'जड़ी', value: 1 },
  {label: 'नोरपा', value: 2 }
]; 
     
var radio_props1 = [
  {label: 'स्वयं', value: 0 },
  {label: 'फैक्ट्री', value: 1 }
];         
        
const buttonColor = "#8db301"
const buttonColor1 = "#8db30190"

 const storage = new Storage({
          storageBackend: AsyncStorage, 
          enableCache: true,
   }); 

 //const buttonColor = "#232f3e"

global.SurveyForm;   
export default class SurveyForm extends Component {
	
	 
    constructor(props) {   
    super(props);     
    this.state = {  
				
			date: new Date(),
			
			zone: '',      
			codeNumber:null,  
			mobNumber:null,      
			name:null,      
			fatherName:'',     
			village:null,   
			ploteNumber:null,  
			     
			caneValue:0, 
			dimension1:null,
			dimension2:null,
			dimension3:null,
			dimension4:null,
			dimension5:null,      
 
		
			variety:[],  
			vehicleList:[],
			prajati_code:0,
			prajati_name:null,
			gannaRakva:'',
			totalRakva:'',
			totalRakwa:'', 
			aadharNumber:'',
			khataNumber:'',
			ifsc:'',
			khataName:'',
			sonOf:'',

			
			latitude: null,  
			longitude: null,
      error: null,	  
            
			avatarSource:'', 
			plotImages:[],
      fieldImages:[],
			suppFiles:[],      
		  aadharFront:'',
      aadharBack:'',
      bankPassbook:'',	
		

		 initialPosition: 'unknown',  
		 lastPosition: 'unknown',	
		 zoneDetails:[],
		 villageDetails:[],   
		 sign:'',      
     signModalVisible:false,
     villName:'',
		 farmerDetails:[], 
		 checked: 'first',
		 transport:0,
		 harvesting:0,
		 mode_code:"0",
		 mode_name:null,
     isConnected:null, 
     netinfoModalVisible:false,
     isLoading:false,
     mapModalVisible:false,
     fieldArea:null,
     validFarmerCode:false,
     caneData:[], 
     loggedInID:null, 
     crusher:"0",
     locationPoints:[],
     fieldDataCount:[1], 
     fieldData:[],
     ipAddress:"erp.mspil.in:8080",
     language:"हिंदी",
     isSurveyDone:false,

	};                
		global.SurveyForm = this;	    
  }        
     
 watchID: ?number = null;	     
    
         
       
       
static navigationOptions =  ({ navigation }) => { return {
 
	  header:null  
   }        
  };      
  

getFarmerDetails(){
      Keyboard.dismiss();
     
     this.setState({name: null, village:null, mobNumber:null, isLoading:true, validFarmerCode:false, isSurveyDone:false})  
     
     const data = {  
      "pFarmerCode": this.state.codeNumber           
     } 
  APIManager.getFarmerDetails(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Farmer Details: " + JSON.stringify(response.data));
       
         this.checkForSurvey()
          this.setState({name: response.data.data[0].account_name, 
                         village:response.data.data[0].village_name, 
                         mobNumber:response.data.data[0].G_MobileNo,
                         isLoading:false,
                         validFarmerCode:true      
                        }) 
  
        } else {    
          this.setState({isLoading:false})
          Alert.alert(I18n.t("Error"), I18n.t("Please enter a valid farmer code"))     
          console.log('error', response);
        }
        
   }, (error)=>{
        this.setState({isLoading:false})
        console.log('error', JSON.stringify(error));   
   })
 }

 checkForSurvey(){

  const data = {  
      "pFarmerCode": this.state.codeNumber           
     } 
  APIManager.checkForSurvey(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Survey Already Done: " + JSON.stringify(response.data));
          if(response.data.data[0].serverResponseType === "SUCCESS"){ 
           this.setState({isSurveyDone:true}) 
          }
        } else {        
          this.setState({isLoading:false})
          Alert.alert("Error","Invalid farmer code")         
          console.log('error', response);   
        }  
        
   })

 }
    
    
	_total(){
		const a= this.state.madi   
		const b= this.state.jadi
        const c= this.state.norpa	
        const z= parseInt(a) + parseInt(b) + parseInt(c)	
        this.setState({kul:z})
	}  
	      
	        
	
  _handleCameraButtonPress() { 

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
      this.state.plotImages.push(source)
		  this.setState({
			  avatarSource:response.uri,    
			  avatarSourceData:response.data
			}); 
		  }
		});    
      
}   
 
 _handleCameraButtonPress1() { 

     var options = {
      title: 'Select',
      quality: 0.3,  
      storageOptions: {
        path: 'images'
      }    
    };
    ImagePicker.showImagePicker(options, (response) => {
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
      this.setState({  
        fieldImages:[...this.state.fieldImages, source] 
      }); 

      if(this.state.fieldImages.length == 1){
         this.watchPosition();
      }
      else if(this.state.fieldImages.length == 4){
         this.calcArea();
      }
      //alert(JSON.stringify(this.state.locationPoints)) 
      }
    });      
  
}    

 calcArea() {
   var locations = this.state.locationPoints
    if (!locations.length) {    
        return 0;
    }
    if (locations.length < 3) { 
        return 0;
    }
    let radius = 6371000;

    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const listY = [];
    const listX = [];
    const listArea = [];
    // calculate segment x and y in degrees for each point

    const latitudeRef = locations[0].latitude;
    const longitudeRef = locations[0].longitude;
    for (let i = 1; i < locations.length; i++) {
      let latitude = locations[i].latitude;
      let longitude = locations[i].longitude;
      listY.push(this.calculateYSegment(latitudeRef, latitude, circumference));

      listX.push(this.calculateXSegment(longitudeRef, longitude, latitude, circumference));

    }

    // calculate areas for each triangle segment
    for (let i = 1; i < listX.length; i++) {
      let x1 = listX[i - 1];
      let y1 = listY[i - 1];
      let x2 = listX[i];
      let y2 = listY[i];
      listArea.push(this.calculateAreaInSquareMeters(x1, x2, y1, y2));

    }

    // sum areas of all triangle segments
    let areasSum = 0;
    listArea.forEach(area => areasSum = areasSum + area)


    // get abolute value of area, it can't be negative
    let areaCalc = Math.abs(areasSum);// Math.sqrt(areasSum * areasSum);  
    alert(areaCalc);

    //global.SurveyForm.setState({mapModalVisible:false}, ()=>{global.SurveyForm.setState({fieldArea:areaCalc.toFixed(2) })})
} 
    
 calculateAreaInSquareMeters(x1, x2, y1, y2) {
    return (y1 * x2 - x1 * y2) / 2;
}

 calculateYSegment(latitudeRef, latitude, circumference) {
    return (latitude - latitudeRef) * circumference / 360.0;
}

 calculateXSegment(longitudeRef, longitude, latitude, circumference)     {
    return (longitude - longitudeRef) * circumference * Math.cos((latitude * (Math.PI / 180))) / 360.0;
} 
  
deleteMedia(index){
    var array= this.state.plotImages
    array.splice(index, 1);
    this.setState({
    	plotImages:array,
      avatarSource:'' 
    });  
  }    

  deleteMedia1(index){
    var array= this.state.fieldImages
    array.splice(index, 1);
    this.setState({
      fieldImages:array,
      avatarSource:'' 
    });  
  }      

      
 componentDidMount  = () => {
   this.getModeList()
 }                   
  
                   
 getModeList(){

   APIManager.getModeList((response)=>{   
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Mode List :" + JSON.stringify(response.data));
         
          this.setState({vehicleList: response.data.data })
   

        } else {
          console.log('Mode list error', JSON.stringify(response));

        }
    }, ()=>{
      console.log('Mode list error', JSON.stringify(response));
    })
  };    
  	   
  
locationEnabler(){

  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  .then(data => {
    //alert(JSON.stringify(data))
    this.setState({mapModalVisible:true})

  }).catch(err => {
    
  });
}
           
onVarietyChange(itemValue, itemIndex){
   if(this.state.variety.length > 0){
     this.setState({prajati_code: itemValue, prajati_name:this.state.variety[(itemValue>0)?itemIndex-1:itemIndex].Variety_Name})

   } 
   
  
  }  

onVehicleChange(itemValue, itemIndex){

   if(this.state.vehicleList.length > 0){
        const result = this.state.vehicleList.filter(item => item.M_Code == itemValue);
        this.setState({mode_code: itemValue,mode_name:result[0].M_Name})
   } 
   

  }  
 
  onSave(){

     const {caneValue, fieldArea, prajati_code, prajati_name, fieldImages} = this.state
     const data = {"caneValue":caneValue, "fieldArea":fieldArea, "prajati_name":prajati_name, "prajati_code":prajati_code, fieldImages:[...this.state.fieldImages]}
     this.setState({fieldData:[...this.state.fieldData, data], caneValue:0, fieldArea:null,  prajati_code:0, prajati_name:null,fieldImages:[], locationPoints:[]})
     console.log(JSON.stringify(this.state.fieldData)) 
     this.stopLocationTracking();
    
  }  

  removeFieldData(index){
 
       var array= this.state.fieldData
        array.splice(index, 1);
        this.setState({
          fieldData:array
        }); 
  }   
	 
  onNextPress(){
   if(this.state.isSurveyDone == true){
     return Alert.alert(I18n.t("WAIT"), I18n.t("Survey has been done for farmer"))
   }

    if(this.state.codeNumber !== null && this.state.mode_code != 0) {  
      if(this.state.validFarmerCode == true){   
          this.setState({isLoading:true})
           APIManager.getLocation((location)=>{
               this.sendSurveyerLocation(location)
           }, (error)=>{
              Alert.alert(I18n.t("Unable to fetch location"), I18n.t("Please try again or turn on you mobile gps"))
              this.setState({isLoading:false})
           })
          }
          else{
               Alert.alert(I18n.t("Error"), I18n.t("Please enter a valid farmer code"))
          }   
         } 
      else{              
          Alert.alert(I18n.t("WAIT"), I18n.t("Please fill all the details"))
       } 
 
  }


sendSurveyerLocation(location){
    
  APIManager.getValueForKey("userData", (userData) =>{   
    const data = {  
      "pSurAcId": 0,
      "pSurUserLogin":userData.userId,
      "pSurLocationStart":location,
      "pSurLocationEnd":null,
      "pSurUpdateBy":userData.userId
  }

 console.log(JSON.stringify(data));   
 
 APIManager.sendSurveyerLocation(data, (response)=>{
      console.log(JSON.stringify(response));   
     if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Send Surveyer Location: " + JSON.stringify(response.data));
        
   APIManager.setValueForKey('locationResponseId', response.data.data) 
        this.setState({isLoading:false})
        const data = {
                    codeNumber: this.state.codeNumber,
                    mobNumber: this.state.mobNumber,
                    name: this.state.name,
                    village:this.state.village,
                    harvesting:this.state.harvesting,
                    transport:this.state.transport,
                    mode_code:this.state.mode_code,
                    mode_name:this.state.mode_name,
                    crusher:this.state.crusher,
                    farmerImages:this.state.plotImages 
                  }
           APIManager.setValueForKey('farmerData', data)  
       
          const screenType = {
                    "screenType": "FieldMeasurementScreen",
                  }
 
         APIManager.setValueForKey('screenType', screenType)     
  
         global.SurveyForm.props.navigate("FieldMeasurementScreen")
      
  
        } else {        
          this.setState({isLoading:false})
          Alert.alert("Error", response.data.message)         
          console.log('error', response);
        }
        
   })
  }, (error)=>{
         console.log("User Data " + JSON.stringify(error));
    })
 }

  onLanguageChange(language){
    
     //I18n.locale = (language=="हिंदी")?"hi":"en";
    this.setState({language:(language=="हिंदी")?"English":"हिंदी"})
  
  } 

 componentWillMount() {
    I18n.locale = 'hi';
  } 
    

  render(){
		
	   const vehicleList = this.state.vehicleList.map((item, key) => {  
	   return (<Picker.Item label={item.M_Name } value={item.M_Code} key={key}/>)    
            })               
         vehicleList.unshift(<Picker.Item  key="" label="---Select---" value='0' />)	
                     
	 return( 
	                   
	 <View style={Styles.container}>  
		<ScrollView keyboardShouldPersistTaps='handled'>
        
     <View>        
	             
		<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection:'row', elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}> 
		<View> 
       <TouchableOpacity style={{width:120, height:150, justifyContent:'center', alignItems:'center', borderRadius:5, margin:10, backgroundColor:"#dcdcdc60"}} onPress={()=> this._handleCameraButtonPress()} >
		    <Icon type="MaterialIcons" name="camera-alt" size={30} color="#900" />
		   </TouchableOpacity>               
	 
		  <Text style={{textAlign:'center'}}>{I18n.t("Farmer Photo")}</Text>
		 </View>   

       {   
        this.state.plotImages.map((item, index) =>
        <View>  
			    <Image source={{uri: item.uri}} style={{width:120, height:150,borderRadius:5, borderWidth:1, margin:10}} />
		      <TouchableOpacity style={Styles.deleteImageBackground} onPress={() => this.deleteMedia(index)}>
	           <Icon name="close" type="AntDesign" style={{fontSize: 15}} />
	         </TouchableOpacity> 
			  </View>)
        } 
  	            
		</ScrollView>                
		
		     
	<View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>	 
    <View style={{backgroundColor:buttonColor1}}>
     <Text style={Styles.headline}>1. {I18n.t("Farmer Information")}</Text>
	  </View>
	 	      
		<View style={{marginTop:10, paddingHorizontal:15}}>
		 <View style={{flexDirection:'row', borderWidth:1, borderRadius:5, borderColor:buttonColor1}}>
      <TextInput
             style={{width:"82%", fontSize:18, paddingLeft:10}}
             onChangeText={(codeNumber) => this.setState({codeNumber})}
             value={this.state.codeNumber}
             keyboardType='numeric'
             returnKeyType="next"    
             placeholder={I18n.t("Farmer Code")}   
             //underlineColorAndroid='#000000' 
			          
          
         />           
	      <TouchableOpacity onPress={this.getFarmerDetails.bind(this)} style={{margin:10, alignItems:"center"}}>
		     
        {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" />:
        <Icon name="search" size={25}  />} 
		  </TouchableOpacity>
     </View>  
		</View>
 
    {(this.state.isSurveyDone == true)? 
     <View style={{flexDirection:"row", paddingHorizontal:15}}>
      <Icon type="MaterialIcons" name="error"   style={{color:"#FF0000", fontSize:15, paddingTop:3}}/> 
      <Text style={{fontSize:15, color:"#FF0000", paddingLeft:2}}> {I18n.t("Survey has been done for farmer")}</Text>    
     </View>:null}

    <View style={{marginTop:10, paddingHorizontal:15}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
       
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>{I18n.t("Mobile Number")}</Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.mobNumber}</Text>
      </View>      
    </View>  

     <View style={{marginTop:10, paddingHorizontal:15}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>{I18n.t("Name")} </Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.name}</Text>
      </View>      
    </View> 

     <View style={{marginTop:10, paddingHorizontal:15}}>
      <View style={{borderBottomWidth:1, borderBottomColor:"#000000", flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:18, color:"#B0B0B0", paddingVertical:5}}>{I18n.t("Village")} </Text>
        <Text style={{fontSize:18, color:"#000000", paddingVertical:5}}>{this.state.village}</Text>
      </View>      
    </View>  

   </View>            
		     
	  
    <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>      		  
		  <View style={{backgroundColor:buttonColor1}}>
       <Text style={Styles.headline}>2. {I18n.t("Harvesting")} (कटाई) </Text>
      </View>

    <View style={{paddingLeft:10, paddingTop:10}}>

    <RadioGroup 
        size={24} 
        thickness={2}
        color='#232f3e'
        selectedIndex={this.state.harvesting}
        style={{flexDirection:"row"}}
        onSelect = {(index, value) => this.setState({harvesting:value})}
       >
        <RadioButton value={'0'} >
          <Text>{I18n.t("Self")}</Text> 
        </RadioButton>
 
        <RadioButton value={'1'}>
          <Text>{I18n.t("Factory")}</Text>
        </RadioButton>
 
      </RadioGroup>     
       </View> 
     </View>  

    <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>   
     <View style={{backgroundColor:buttonColor1}}>
      <Text style={Styles.headline}>3. {I18n.t("Transport")}</Text>
     </View>

     <View style={{paddingLeft:10, paddingTop:10}}>

      <RadioGroup 
        size={24}
        thickness={2}
        color='#232f3e'
        selectedIndex={this.state.transport}
        style={{flexDirection:"row"}}
        onSelect = {(index, value) => this.setState({transport:value})}
       >
        <RadioButton value={'0'} >
          <Text>{I18n.t("Self")}</Text> 
        </RadioButton>
 
        <RadioButton value={'1'}>
          <Text>{I18n.t("Factory")}</Text>
        </RadioButton>
 
      </RadioGroup> 
	  </View>				
	 
   </View>

    <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>    
   <View style={{backgroundColor:buttonColor1}}>         
	  <Text style={Styles.headline}>4. {I18n.t("Mode of Carriage")}</Text>
   </View>   

   <View style={Styles.textInputView}>
		<View style={{ borderWidth:1, borderRadius:5, borderColor:buttonColor1,}}> 		 
			 <Picker
			  selectedValue={this.state.mode_code}      
			  style={{ height: 40, width: '95%'}}
			  mode = 'dropdown'  
        onValueChange={(itemValue, itemIndex) => this.onVehicleChange(itemValue, itemIndex)}			  
			  >  
		      {vehicleList}               
         </Picker>                                
		 </View>   
    </View>
  </View>  

  <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>   
     <View style={{backgroundColor:buttonColor1}}>
      <Text style={Styles.headline}>5. {I18n.t("Crusher")} </Text>
     </View>

     <View style={{paddingLeft:10, paddingTop:10}}>    

      <RadioGroup
        size={24}
        thickness={2}
        color='#232f3e'
        selectedIndex={this.state.crusher}
        style={{flexDirection:"row"}}
        onSelect = {(index, value) => this.setState({crusher:value})}
       >
        <RadioButton value={'0'} >
          <Text>{I18n.t("No")}</Text> 
        </RadioButton>
 
        <RadioButton value={'1'}>
          <Text>{I18n.t("Yes")}</Text>
        </RadioButton>
 
      </RadioGroup> 
    </View>   
   </View>  


    <View style={{alignItems:"center", marginVertical:15}}>
    {(this.state.isLoading==true)?
    <ActivityIndicator size="small" color="#000000" style={{textAlign:"center"}}/>: 
    <TouchableOpacity onPress={this.onNextPress.bind(this)} style={{elevation:10, paddingVertical:15, width:180, backgroundColor:buttonColor, borderRadius:50}}>
      <Text style={{color:'#ffffff', fontSize:15, textAlign:"center",  fontFamily: "Lato-Semibold"}}>{I18n.t("START SURVEY")}</Text>
     </TouchableOpacity>}
   </View>  
</View>	           

      

       <Modal                  
          animationType="slide"
          transparent={true} 
          visible={this.state.mapModalVisible}
          onRequestClose={() => {
            this.setState({mapModalVisible:false}); 
          }}>
        
            <View style={{ width:"100%", height:"100%",backgroundColor:'#ffffff',borderRadius:10,}}>
              <TouchableOpacity  onPress={() => { this.setState({mapModalVisible:false}); }} style={[Styles.btnStyle]}>
               <Icon name="close" size={30} color="#fff"  />
              </TouchableOpacity>  
             {
             // <MapScreen /> 
             }        
            </View>     
               
          </Modal>             
             
 	    
      </ScrollView>
    </View>  
	)}            

}     
       
const Styles = StyleSheet.create({  
	container:{    
		flex:1, backgroundColor:"#f3f3f3f3"
	},
	headline:{ 
		color:'#232f3e', padding:10,  fontFamily: "Lato-Semibold", fontSize:20
	},
	text:{
		color:'#232f3e', fontSize:15
	},       
	textInput:{
		width:"100%", fontSize:18 
	},
	checkBoxView:{
		flexDirection: 'row', paddingLeft:20
	},  
  textInputView:{
     marginTop:10, 
     padding:15
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
  signature: {
      flex: 1,
      borderColor: '#000033',
      borderWidth: 1,
    },
  btnStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex:999
  },	
})	  