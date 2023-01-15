import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,TouchableOpacity,
  View, processColor
} from 'react-native';

import {BarChart} from 'react-native-charts-wrapper';


class SimpleBarChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      legend: {
        textSize: 12,
        fontFamily: "Lato-Semibold", 
       },
       data: {
        dataSets: [{
          values: this.props.values,
          label: this.props.label,
          config: {
            color: processColor(this.props.color),
            valueTextSize: 12        
          }
        }],

        config: {
          barWidth: 0.8,

        }
      },
    };
  }

  render() {
    return (
       <View style={styles.container}>
            <BarChart
              style={styles.chart}
              chartDescription={{text: ''}}
              xAxis={this.props.xAxis}
              yAxis={this.props.yAxis}
              data={this.state.data}
              legend={this.state.legend}
              marker={this.props.marker}
              drawValueAboveBar={true}
              pinchZoom={false}
              doubleTapToZoomEnabled = {false}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  chart: {
    height:"90%",
  },
});


export default SimpleBarChart;
