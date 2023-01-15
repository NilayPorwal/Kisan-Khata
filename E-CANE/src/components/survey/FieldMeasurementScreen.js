import React, {Component} from 'react';
import {StyleSheet,SafeAreaView, Text, View, TouchableOpacity, TextInput, ScrollView,ActivityIndicator,
        CheckBox, Dimensions, BackHandler, Button, ImageBackground, AsyncStorage, Alert, Keyboard} from 'react-native';
//import Icon from 'react-native-vector-icons/Feather';
import { Icon } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Storage from 'react-native-storage';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import APIManager from './../APIManager';
import axios from 'axios';
var base64 = require('base-64'); 
import { encrypt, decrypt } from "./../AESEncryption"
import { Picker} from 'native-base';


var radio_props = [
  {label: 'मड़ी', value: 0 }, 
  {label: 'जड़ी', value: 1 },
  {label: 'नोरपा', value: 2 }
];

export default class FieldMeasurementScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = { 
      variety:[],
      caneValue:0,
      prajati_code:"0",
      prajati_name:null,
      fieldArea:null,
      calcYield:null,
      fieldData:[],
      farmerData:{},
      allData:[],
      caneType:null,
      farmerImages:[],
      userData:{}
    };
     global.FieldMeasurementScreen = this;
  }           

   static navigationOptions =  ({ navigation }) => { 
    return {
 
    header:null  
   }        
  };   

   componentDidMount(){
     this.getVarietyList();
     this.retriveData();
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);    
   }
   

  handleAndroidBackButton() {
     BackHandler.exitApp();    
    }      
        
    
  componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
    
     }

   
 getVarietyList(){

   APIManager.getVarietyList((response)=>{   
      if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("Mode List :" + JSON.stringify(response.data));
         
          this.setState({variety: response.data.data })
   

        } else {
          console.log('Login error', response);

        }
    })
  };    
     

 onVarietyChange(itemValue, itemIndex){
   if(this.state.variety.length > 0 && itemValue != 0){
     const result = this.state.variety.filter(item => item.Id == itemValue);
     this.setState({prajati_code: itemValue, prajati_name:result[0].Variety_Name})

   } 
 } 


onSelect(data){

    const fieldData = global.FieldMeasurementScreen.state.fieldData;
    fieldData[data.index].geoCaptured = data.geoCaptured
    fieldData[data.index].geoData = data.geoData

   
      global.FieldMeasurementScreen.setState({fieldData:[...fieldData]}, ()=>{
        APIManager.setValueForKey('fieldData', global.FieldMeasurementScreen.state.fieldData)
      })

 } 

 onDeletePress(index){
    Alert.alert(
      "Delete Confirmation",
      'You want to Delete this data ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.removeFieldData(index)},
      ],
      {cancelable: false},
    );
 }

  removeFieldData(index){
 
       var array= this.state.fieldData
        array.splice(index, 1);
        this.setState({
          fieldData:array
        }, ()=>{  APIManager.setValueForKey('fieldData', global.FieldMeasurementScreen.state.fieldData) }); 
  }

 onAdd(){
   Keyboard.dismiss();
   const {caneValue, fieldArea, prajati_code, prajati_name, calcYield} = this.state
   if(fieldArea != null && calcYield != null){
    if(calcYield > 100){
       return  Alert.alert(`"गणना प्राप्ति" 100 से कम होना चाहिए `)
    }
      var caneType = null
      if(caneValue == 0){    
          caneType = "madi"
      }
      else if(caneValue == 1){
          caneType = "jadi"
      }
      else{ 
          caneType = "norpa"
      } 
     const data = {"caneType":caneType, "caneValue":caneValue, "fieldArea":fieldArea, "prajati_name":prajati_name, "prajati_code":prajati_code, 
                    "calcYield":calcYield, "plotNumber":(this.state.fieldData.length+1), "geoCaptured":0}
     
     this.setState({fieldData:[data, ...this.state.fieldData], caneValue:0, 
                     fieldArea:null,  prajati_code:0, calcYield:null}, ()=>{
                       APIManager.setValueForKey('fieldData', global.FieldMeasurementScreen.state.fieldData) 
                     })
     console.log(JSON.stringify(this.state.fieldData))

    }
    else{
      Alert.alert(`"गन्ने का क्षेत्रफल" और "गणना प्राप्ति" भरना जरुरी है`)
    } 
  }

reDirect(index, info){
    this.props.navigation.navigate("GeoCapturingScreen", {
       index:index,
       plotNumber:(this.state.fieldData.length - index),
       fieldInfo:info,
       onSelect: this.onSelect
    }) 
   
  }

  retriveData(){
    APIManager.getValueForKey('userData', (data)=>{
     if(data != null ){ 
      console.log("User Data " + JSON.stringify(data));
      this.setState({userData:data})
    }
    },(error)=>{
         console.log("User Data " + JSON.stringify(error));
    })

    APIManager.getValueForKey('farmerData', (data)=>{
         if(data != null ){ 
         console.log("Farmer Data " + JSON.stringify(data));
         this.setState({farmerData:data})
         //this.getFarmerDetails();
        }
    },(error)=>{
         console.log("Farmer Data " + JSON.stringify(error));
    })

    APIManager.getValueForKey('fieldData', (data)=>{
     if(data != null ){ 
      console.log("Field Data " + JSON.stringify(data));

      this.setState({fieldData:data})
     //this.getFarmerDetails();
    }
    },(error)=>{
         console.log("Field Data " + JSON.stringify(error));
    })
  } 


async uploadFile(fieldImages, resolve, reject){    
   if(fieldImages.length != 0){ 
     const formData = new FormData();

     fieldImages.forEach((file, i) => {
         formData.append('files', file); 
      })
   
    console.log(JSON.stringify(fieldImages))

 await APIManager.uploadImages(formData, (response)=>{
      console.log(JSON.stringify(response));   
       resolve(response) 
        
    })

   } else {
      resolve([]) 
   } 
  }

  onSubmitPress(){
     var isComplete = new Promise((resolve, reject) => {
     this.state.fieldData.forEach((value) => {
        if (value.geoCaptured === 0){
          resolve(false);
        } 
     });
     resolve(true);  
   });  

isComplete.then((value) => {
  
   if(value == true){
    Alert.alert(
      "Upload Confirmation",
      'Do you want to Submit data ?',
      [
        { 
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.onSubmit()},
      ],
      {cancelable: false},
    );
  }else{
     Alert.alert("Wait !!", "Please complete the survey");
  }
})
 }   
  
onSubmit(){ 
   this.setState({isLoading:true})
  APIManager.getLocation((location)=>{
  APIManager.getValueForKey("locationResponseId", (locationResponseId) =>{  
   this.uploadFile(this.state.farmerData.farmerImages, (responseJson)=>{
           console.log("farmer images " + JSON.stringify(responseJson))      
           this.setState({farmerImages:[...responseJson]})
  
           const value = this.state.fieldData;
           const allData = [];
           
           for(let i=0; i < value.length; i++) {
             
              this.uploadFile(value[i].geoData.fieldImages, (response)=>{
                console.log("field images " + JSON.stringify(response))        
                  let data =  {
                    "pFarmerCode": this.state.farmerData.codeNumber,
                    "pPlotNumber" : 0, 
                    "pPlotVillage" : this.state.farmerData.village, 
                    "pPlotDimension1": 0,
                    "pPlotDimension2": 0,
                    "pPlotDimension3": 0,
                    "pPlotDimension4": 0,
                    "pPlotDimension5": 0,
                    "pCaneType": value[i].caneType,
                    "pVarietyCode":parseFloat(value[i].prajati_code), 
                    "pCalculatedArea": (value[i].fieldArea==null)?0:parseFloat(value[i].fieldArea),
                    "pCalculatedYield":(value[i].calcYield==null)?0:parseFloat(value[i].calcYield),
                    "pSurveyDate":new Date(), 
                    "pIrrigationType": null,
                    "pLandType": null,
                    "pSeedType": null,
                    "pImageOfPlot":response,
                    "pRemarkOrPlotLocation": "0",
                    "pmodecode" : parseFloat(this.state.farmerData.mode_code),    
                    "ptransport" : (this.state.farmerData.transport==0)?"0":"1",
                    "pharvasting" : (this.state.farmerData.harvesting==0)?"0":"1",
                    "pcreatedby": parseFloat(this.state.userData.userId),
                    "pmbcreatedby": parseFloat(this.state.userData.mobile),
                    "pcrusherflag": this.state.farmerData.crusher,
                    "psurveygeolocation":value[i].geoData.locationPoints,
                    "psurveyfarmerimage":this.state.farmerImages,
                    "pSurUserId":locationResponseId[0].serverResponseId,
                    "pSurLocationEnd":JSON.stringify(location)
                  }
                   //allData.push(data)
                  this.setState({allData:[...this.state.allData, data]}) 

                  if(this.state.allData.length == this.state.fieldData.length){
                       console.log("All Data " +  JSON.stringify(this.state.allData))
                       this.uploadDetails(this.state.allData);
                    }
                 })
               
             }
        })
      })
    }, (error)=>{
         this.setState({isLoading:false})
          console.log(JSON.stringify(error));
         Alert.alert("स्थान प्राप्त करने में असमर्थ !!", "कृपया पुनः प्रयास करें या आप मोबाइल जी पि एस  चालू करें")

                //Alert.alert("Location Error", "Please turn on your mobile GPS location")
     })
 }


uploadDetails(data) { 
  console.log("Insert Survey Data", JSON.stringify(data));   

  APIManager.onSubmitSurvey(data, (response)=>{
      console.log(JSON.stringify(response));   
       if (response.data.status === "SUCCESS") {
          response.data.data = JSON.parse(decrypt(response.data.data.content));
          console.log("On Submit Survey: " + JSON.stringify(response.data));
          Alert.alert('Data sinked successfuly');
                
                APIManager.removeValuesForSurvey();
                this.setState({fieldData:[], allData:[], isLoading:false})

                 const screenType = {
                    "screenType": "LandingSurveyScreen",
                  }
                APIManager.setValueForKey('screenType', screenType) 
                global.FieldMeasurementScreen.props.navigation.navigate("LandingSurveyScreen")
        }                     
            
       else {          
           this.setState({allData:[], isLoading:false})     
           Alert.alert('Upload Failed !!', response.data.message); 
           //this.setState({fieldData:[], allData:[]})  
        }
   })

 }  

    
  render() {
       const varietyItems = this.state.variety.map((item, key) => {
                 return (<Picker.Item label={item.Variety_Name} value={item.Id} key={key}/>)
            })
        varietyItems.unshift(<Picker.Item  key="" label="---Select---" value='0' />)          

    return (
    <SafeAreaView style={styles.container}>   
     <View style={{backgroundColor:"#8db301", height:"8%", elevation:10, justifyContent:"center", alignItems:"center"}}>
      <Text style={{fontSize:18, fontFamily: "Lato-Semibold", color:"#ffffff"}}>गन्ना क्षेत्र की जानकारी</Text>
     </View>
     <View style={{backgroundColor:"#8db301", height:"7%",  justifyContent:"center"}}>
      <Text style={{color:"#ffffff", fontSize:15,  fontFamily: "Lato-Semibold", textAlign:"center"}}>किसान कोड : {this.state.farmerData.codeNumber}</Text>
     </View> 

    <ScrollView keyboardShouldPersistTaps='handled'> 
     <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:15, margin:10}}>
  
      
     <View style={{flexDirection:"row", marginTop:10}}>
        <View style={{width:"35%", paddingTop:10}}> 
         <Text style={{color:"#000000", fontSize:15}}>गन्ने का प्रकार</Text> 
        </View>   
         
       
        <RadioGroup   
            size={20} 
            thickness={1.5}
            color='#232f3e'
            selectedIndex={this.state.caneValue}
            style={{flexDirection:"row"}}
            onSelect = {(index, value) => this.setState({caneValue:value})}
           >
            <RadioButton value={'0'} > 
              <Text>मड़ी</Text> 
            </RadioButton>
      
            <RadioButton value={'1'}>
              <Text>जड़ी</Text>
            </RadioButton>
     
            <RadioButton value={'2'}>
              <Text>नोरपा</Text>
            </RadioButton>
          </RadioGroup> 
      
     </View>          
 
   <View style={{flexDirection:"row"}}>
      <View style={{width:"35%", paddingTop:10}}> 
        <Text style={{color:"#000000", fontSize:15}}>प्रजाति</Text> 
      </View>   
         
      <View style={{width: '65%'}}>
          <View style={{ borderBottomWidth:1}}>      
           <Picker  
            selectedValue={this.state.prajati_code}      
            style={{ height: 40 }}
            mode = 'dropdown'  
            onValueChange={(itemValue, itemIndex) =>this.onVarietyChange(itemValue, itemIndex) }        
            >  
           {varietyItems}             
          </Picker>        
         </View>               
      </View>  
  </View>
 
  <View style={{flexDirection:"row", marginTop:10}}>
      <View style={{width:"35%"}}> 
        <Text style={{color:"#000000", fontSize:15}}>गन्ने का क्षेत्रफल (एकड़)</Text> 
      </View> 

    <View style={{ width: '65%'}}>
     <View style={{borderBottomWidth:1, borderBottomColor:"#000000", padding:5}}>
      <TextInput
             style={{fontSize:18}}
             onChangeText={(fieldArea) => this.setState({fieldArea})}
             value={this.state.fieldArea}
             keyboardType='numeric'
             returnKeyType="next"    
             placeholder="फील्ड एरिया" 
             //underlineColorAndroid='#000000'       
         />           
     </View>  
    </View> 
  </View>

   <View style={{flexDirection:"row", marginTop:10}}>
      <View style={{width:"32%", paddingTop:10}}> 
        <Text style={{color:"#000000", fontSize:15}}>गणना प्राप्ति</Text> 
      </View> 
       <View style={{width:"3%", paddingTop:5}}> 
       
      </View> 

    <View style={{ width: '65%'}}>
     <View style={{borderBottomWidth:1, borderBottomColor:"#000000", padding:5}}>
      <TextInput
             style={{fontSize:18}}
             onChangeText={(calcYield) => this.setState({calcYield})}
             value={this.state.calcYield}
             keyboardType='numeric'
             returnKeyType="next"    
             placeholder="%"
             maxLength={5}
             //underlineColorAndroid='#000000'      
         />           
     </View>   
    </View> 
  </View>
 
     <View style={{alignItems:"center", marginTop:15}}>
      <TouchableOpacity onPress={()=>this.onAdd()} style={styles.btnStyle}>
       <Text style={styles.btnTitle}>ADD</Text>
      </TouchableOpacity>  
      </View>   
    </View>  
   
    {this.state.fieldData.map((item, index)=>
    <View style={{elevation:8, backgroundColor:'#ffffff', borderRadius:5, padding:10, margin:10}}>

      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
         <Text style={{fontSize:18, color:"#000000", fontFamily: "Lato-Black"}}>{"प्लाट " + (this.state.fieldData.length - index)}</Text>
        
        {(item.geoCaptured === 0)? 
        <View style={{alignItems:"center"}}>
          <TouchableOpacity  onPress={()=>this.reDirect(index, item)} style={[styles.btnStyle]}>
           <Text style={{color:"#ffffff",paddingVertical:10, fontFamily: "Lato-Black", fontSize:15}}>
            Start <Icon name="add-location" type="MaterialIcons" style={{color:"#ffffff", fontSize:18}} />
           </Text>  
          </TouchableOpacity>   
        </View>   
        :  
         <View style={{alignItems:"center"}}>
          <View  style={styles.btnStyle}>
           <Text style={{color:"#ffffff",paddingVertical:10, fontFamily: "Lato-Black", fontSize:15}}>Completed</Text>
          </View>  
        </View>
       }
      </View> 

  
    <View style={{flexDirection:"row", marginTop:10}}>
        <Text style={{fontSize:18, color:"#000000"}}>गन्ने का प्रकार:</Text>

         <View style={{width:"5%"}}>   
        
         </View> 
        
         {(item.caneValue == 0)?<Text style={{fontSize:18, color:"#000000"}}>मड़ी</Text>:null} 
         {(item.caneValue == 1)?<Text style={{fontSize:18, color:"#000000"}}>जड़ी</Text>:null} 
         {(item.caneValue == 2)?<Text style={{fontSize:18, color:"#000000"}}>नोरपा</Text>:null} 

    </View>

    <View style={{flexDirection:"row", marginTop:10}}>
        <Text style={{fontSize:18, color:"#000000"}}>प्रजाति:</Text>

         <View style={{width:"5%"}}>   
        
         </View>    
        
        <Text style={{fontSize:18, color:"#000000"}}>{item.prajati_name}</Text>
     
    </View>

    <View style={{flexDirection:"row", marginTop:10}}>
          <Text style={{fontSize:18, color:"#000000",}}>गन्ने का क्षेत्रफल (एकड़) :</Text>

         <View style={{width:"5%"}}>   
        
         </View>  
        
        <Text style={{fontSize:18, color:"#000000"}}>{item.fieldArea}</Text>
     
    </View>

      <View style={{flexDirection:"row", marginTop:10}}>
        <Text style={{fontSize:18, color:"#000000"}}>गणना प्राप्ति (%):</Text>

         <View style={{width:"5%"}}>   
        
         </View> 
        
       <Text style={{fontSize:18, color:"#000000"}}>{item.calcYield}</Text>
     
    </View>
   
      

 
      <TouchableOpacity style={{position:"absolute", bottom:10, right:10}} onPress={()=>this.onDeletePress(index)}>
        <Icon name="trash-o" type="FontAwesome" style={{fontSize: 20}} />
      </TouchableOpacity>
      </View>

)}   
    {(this.state.fieldData.length > 0)?
     
      <View style={{alignItems:"center", marginVertical:15}}>
       {(this.state.isLoading==true)?<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>:
        <TouchableOpacity onPress={()=>this.onSubmitPress()} style={styles.btnStyle}>
         <Text  style={styles.btnTitle}>SUBMIT</Text>
        </TouchableOpacity>}  
      </View>   
    :null
  } 

    </ScrollView> 
    </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#dcdcdc80"
  },
  btnStyle:{
    elevation:8, width:120, borderRadius:25, backgroundColor:"#8db301", alignItems:"center"
  },
  btnTitle:{
    color:"#ffffff",paddingVertical:12, fontFamily: "Lato-Semibold", fontSize:15
  }

});  
  