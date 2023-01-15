import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,TouchableOpacity,
  View, processColor
} from 'react-native';

import {HorizontalBarChart} from 'react-native-charts-wrapper';


export default class SimpleHorizontalChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    legend: {
        enabled:false
           },
    data: {
        dataSets: [{
          values: this.props.value1,
          label: "Indentng",
          config: {
            drawValues: true,
            valueTextSize: 15,
            valueTextColor: "#000000",
            color: processColor(this.props.color1),
            highlightAlpha: 50,
            highlightColor: processColor('black'),
          }
        }],
        config: {
            barWidth: 0.8,
        }
      }
    };
  }

  render() {
    return (
       <View style={styles.container}>
            <HorizontalBarChart
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
