import React, {Component} from 'react';
import {Platform, StyleSheet, View, Image, Dimensions, TextInput, AsyncStorage} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button,Text , Spinner, Icon} from 'native-base';
import APIManager from './../APIManager';
import PaymentScreen from './PaymentScreen'



export default class LoginScreen extends Component {

    constructor(props) {
    super(props);
    this.state ={
      username:null,
      password:null,
      stage:null,
      isRefreshing:true
     }

    }

       static navigationOptions = {
           header: null,

       };

  componentDidMount(){
    AsyncStorage.getItem('login')
    .then((value)=>{

      if(value != null){
        this.setState({stage:'1', isRefreshing:false})
      }
      else{

         this.setState({stage:'0', isRefreshing:false})
      }
    })
 
  }

    onLogin(){
      APIManager.onLoginForPayment(this.state.username, this.state.password,
           (responseJson)=> {
            console.log(JSON.stringify(responseJson));
         if(responseJson.valid == true){

              AsyncStorage.setItem('login', '1');
              AsyncStorage.getItem('login')
                  .then((value)=>{

                  if(value != null){
                    this.setState({stage:'1'})
                  }
                })

             }else{
               alert(responseJson.data.message)
             }
          }, (error)=>{
              console.log(JSON.stringify(error))
          })
       }  
   
 
   render() {
     const {height: screenHeight} = Dimensions.get('window');
    return(

  (this.state.isRefreshing == false)?
  <View style={{flex:1, justifyContent:'center'}}>  
     {(this.state.stage == '0')?
           <View style={{ paddingHorizontal:15}}>

           <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input 
                 onChangeText={(text) => this.setState({username:text})}
                 value={this.state.username}
              /> 
            </Item> 
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input 
                onChangeText={(text) => this.setState({password:text})}
                value={this.state.password}
                secureTextEntry={true}
              />
            </Item>
          </Form> 
                
       
              <Button block info onPress={()=>this.onLogin()} rounded style={{margin:15}} >
                 <Text>Login</Text>
              </Button>
           </View>:
          <PaymentScreen villageList={this.props.villageList} />}
  </View>: 
      <Spinner color='blue' />

     );
  }
}