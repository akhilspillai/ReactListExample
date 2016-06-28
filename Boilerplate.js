// @flow
'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToolbarAndroid
} from 'react-native';

class DetailScreen extends React.Component{

  render() {
    return (
      <View style={styles.container}>
      <ToolbarAndroid style={styles.toolbar}
      title={this.props.title}
      navIcon={require('image!ic_back')}
      onIconClicked={this.props.navigator.pop}
      titleColor={'#FFFFFF'}/>
      <View style={styles.innerContainer}>
      <Text>
      Second screen
      </Text>
      </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#3F51B5',
    height: 56,
  },
});

export default DetailScreen;
