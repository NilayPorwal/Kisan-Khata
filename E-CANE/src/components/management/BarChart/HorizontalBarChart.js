import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,TouchableOpacity,
  View, processColor
} from 'react-native';

import {HorizontalBarChart} from 'react-native-charts-wrapper';


class HorizontalChart extends React.Component {

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
          }
        },
        {
          values: this.props.value3,
          label: this.props.label3,
          config: {
            drawValues: true,
            valueTextSize: 15,
            valueTextColor: "#000000",
            color: processColor(this.props.color3),
            highlightAlpha: 50,
            highlightColor: processColor('black'),
          },
        },
        {
          values: this.props.value4,
          label: this.props.label4,
          config: {
            drawValues: true,
            valueTextSize: 15,
            valueTextColor: "#000000",
            color: processColor(this.props.color4),
            highlightAlpha: 50,
            highlightColor: processColor('black'),
          },
        }],
         config: {
          barWidth: 0.4,
          group: {
            fromX: 0,
            groupSpace: 0.1,
            barSpace: 0.1,
          },
        }
      }
    };
  }

  render() {
    return (
      <HorizontalBarChart
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
    height:"80%"
  },
  iconView:{
    marginHorizontal:15, marginTop:-25
  }
});


export default HorizontalChart;
