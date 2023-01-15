import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,TouchableOpacity,
  View, processColor
} from 'react-native';

import {BarChart} from 'react-native-charts-wrapper';


class GroupBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        dataSets: [{
          values: this.props.value1,
          label: this.props.label1,
          config: {
            drawValues: true,
            valueTextSize: 15,
            valueTextColor: "#000000",
            color: processColor(this.props.color1),
            highlightAlpha: 50,
            highlightColor: processColor('black'),
          }
        }, 
        {
          values: this.props.value2,
          label: this.props.label2,
          config: {
            drawValues: true,
            valueTextSize: 15,
            valueTextColor: "#000000",
            color: processColor(this.props.color2),
            highlightAlpha: 50,
            highlightColor: processColor('black'),
          },
        }],
         config: {
          barWidth: 0.4,
          group: {
            fromX: 0,
            groupSpace: 0.2,
            barSpace: 0.3,
          },
        }
      }
    };
  }

  render() {
    return (
    
            <BarChart
              style={styles.chart}
              chartDescription={{text: ''}}
              xAxis={this.props.xAxis}
              yAxis={this.props.yAxis}
              data={this.state.data}
              legend={this.props.legend}
              marker={this.props.marker}
              drawValueAboveBar={true}
              pinchZoom={false}
              doubleTapToZoomEnabled = {false}
            />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  chart: {
    height:"78%"
  },
  iconView:{
    height:55, width:55, marginLeft:15, marginTop:-25, justifyContent:"center", alignItems:"center"
  }
});


export default GroupBarChart;
