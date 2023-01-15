import React, {Component} from 'react';
import {Platform, StyleSheet,  View, Dimensions, processColor, Modal, ActivityIndicator, TouchableOpacity, TextInput, AsyncStorage, FlatList} from 'react-native';
import base64 from 'react-native-base64'
import { Container, Header, Left, Body, Right, Button, Icon, Title,Segment,Badge,  
        Content, Card, CardItem, Text, Accordion, DatePicker, Footer, FooterTab} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {LineChart, PieChart, BarChart, HorizontalBarChart} from 'react-native-charts-wrapper';
import APIManager from './Managers/APIManager';
var dateFormat = require('dateformat');

  
    
  let legend={
        enabled: false,
        textSize: 15,
        form: 'CIRCLE',

        horizontalAlignment: "RIGHT",
        verticalAlignment: "CENTER",
        orientation: "VERTICAL",
        wordWrapEnabled: true
      }  

 
    let c0 =   '#056664'   
    let c1 =   '#FECA06'
    let c2 =   '#FFD08C' 
    let c3 =   '#69330D'   
    let c4 =   '#63358F'
    let c5 =   '#CC0103'
    let c6 =   '#007ed6'
    let c7 =   '#ff7201'
    let c8 =   '#63105F'
    let c9 =   '#4F5150'
    let c10 =  '#966EFB'
    let c11 =  '#C8857E'
 
    let cr0 =   processColor(c0)   
    let cr1 =   processColor(c1)
    let cr2 =   processColor(c2) 
    let cr3 =   processColor(c3)
    let cr4 =   processColor(c4)
    let cr5 =   processColor(c5)
    let cr6 =   processColor(c6)
    let cr7 =   processColor(c7)
    let cr8 =   processColor(c8)
    let cr9 =   processColor(c9)
    let cr10 =   processColor(c10)
    let cr11 =   processColor(c11)


 let width= Dimensions.get('window').width
 let height= Dimensions.get('window').height    


export default class Shift1Screen extends Component {
   constructor(props) {  
       super(props);     
      this.state = {       
        data:{},
        Date:new Date(), 
        status : 'first',  
      xAxis1: {
        valueFormatter:  ['8AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '5PM','06 PM', '07 PM'],
        granularityEnabled: true,
        granularity : 1,
        position: 'BOTTOM',
        textSize: 10,
        avoidFirstLastClipping: true,
          
      },   

      legend: {
        enabled: true,
        textColor: processColor('#000000'),
        textSize: 12,
        position: 'BELOW_CHART_RIGHT',
        form: 'CIRCLE', 
        formSize: 25,
        xEntrySpace: 5, 
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.2 
      },

      xAxisBar: {
          valueFormatter: ['08-09 AM', '09-10 AM', '10-11 AM', '11-12 PM', '12-01 PM','01-02 PM', '02-03 PM', '03-04 PM', '04-05 PM', '05-06 PM', '06-07 PM', '07-08 PM'],
          position: 'BOTTOM',
          granularityEnabled: true,
          granularity: 1,
          labelCount: 10,
            },
    
      legendBar: {
          enabled: true,
          textSize: 10,
          form: 'SQUARE',
          formSize: 14,
          xEntrySpace: 10,
          yEntrySpace: 5,
          formToTextSpace: 5,
          wordWrapEnabled: true,
          maxSizePercent: 0.5,
        },

         yAxis: {left:{axisMinimum: 0}, right:{axisMinimum: 0}}
     }
    // alert(JSON.stringify(this.props.dataBar1))                      
   }      
    

    static navigationOptions = {
       header: null,
            
   };

   

  
 
  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }  


      
  render() {
    return (
     <View>

      <Card> 
      <HorizontalBarChart
          style={{margin:10, height:400  }}
          chartDescription={{text:'Weight',  textSize: 10}}
          data={this.props.dataBar1}
          xAxis={this.state.xAxisBar}
          yAxis={this.state.yAxis}
          animation={{durationX: 2000}}
          legend={this.state.legendBar}
          gridBackgroundColor={processColor('#ffffff')}
          drawBarShadow={false}
          drawValueAboveBar={true}
          drawHighlightArrow={true}
          onSelect={this.handleSelect.bind(this)}
          onChange={(event) => console.log(event.nativeEvent)}
        />
        </Card>
    
    {
        // <Card>   
        //   <LineChart 
        //     style={{margin:10, height:300}}
        //     chartDescription={{text: ''}}
        //     data={this.props.dataLine1}
        //     xAxis={this.state.xAxis1}

        //     animation={{durationX: 2000}}
        //     legend={this.state.legend}

        //     gridBackgroundColor={processColor('#ffffff')}
        //     visibleRange={{x: { min: 0, max: 12 }}}
        //     drawBarShadow={false}
        //     drawValueAboveBar={true}  
        //     drawHighlightArrow={true}
        //     //onSelect={this.handleSelect.bind(this)}
        //     highlights={this.state.highlights}
        //     onChange={(event) => console.log(event.nativeEvent)}
        //   />
        //  </Card> 
    }
 

       <Card>  
 
        <PieChart  
            style={{marginHorizontal:(Platform.OS=='android')?60:0, height:350}}
            logEnabled={true}
            chartBackgroundColor={processColor('#ffffff')}
            chartDescription={{text:'Hours',  textSize: 15}}
            data={this.props.dataPie1}
            legend={legend}   
            //highlights={this.state.highlights}

            entryLabelColor={processColor('black')}
            entryLabelTextSize={15} 
            drawEntryLabels={true}
   
            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={false}  
            styledCenterText={{text:'Hourely Tare Summary', color: processColor('#E01F84'), size: 10}}
            centerTextRadiusPercent={100}
            holeRadius={25}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={40}
            transparentCircleColor={processColor('#f0f0f088')}  
            maxAngle={420}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
          />
 
            
          
           <View style={{flexDirection: 'row', justifyContent:'center'}}>
              <Badge style={{margin:5, backgroundColor:c0}}>
                <Text>08-09 am</Text>  
              </Badge>
              <Badge primary style={{margin:5, backgroundColor:c1}}>
                <Text>09-10 am</Text>
              </Badge>
              <Badge success style={{margin:5, backgroundColor:c2}}>
                <Text>10-11 am</Text>
              </Badge>
              <Badge info style={{margin:5, backgroundColor:c3}}> 
                <Text>11-12 pm</Text>
              </Badge>
              
             </View> 
              <View style={{flexDirection: 'row', marginTop:5, justifyContent:'center'}}>
              <Badge warning style={{margin:5, backgroundColor:c4}}>
                <Text>12-01 pm</Text>
              </Badge>
              <Badge danger style={{margin:5, backgroundColor:c5}}>
                <Text>01-02 pm</Text>
              </Badge>
              <Badge danger style={{margin:5, backgroundColor:c6}}>
                <Text>02-03 pm</Text>
              </Badge> 
              <Badge danger style={{margin:5, backgroundColor:c7}}>
                <Text>03-04 pm</Text>
              </Badge>
              
             </View>   
               <View style={{flexDirection: 'row', marginTop:5, justifyContent:'center'}}>
               <Badge warning style={{margin:5, backgroundColor:c8}}>
                <Text>04-05 pm</Text>
              </Badge>
              <Badge danger style={{margin:5, backgroundColor:c9}}>
                <Text>05-06 pm</Text>
              </Badge>
              <Badge danger style={{margin:5, backgroundColor:c10}}>
                <Text>06-07 pm</Text>
              </Badge> 
              <Badge danger style={{margin:5, backgroundColor:c11}}>
                <Text>07-08 pm</Text>
              </Badge>
             </View> 
                   
         </Card>
  

  </View>  
    );     
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
