/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/
'use strict'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  BackAndroid
} from 'react-native';

import ListScreen from './ListScreen'
import DetailScreen from './DetailScreen'

var _navigator;

class ListExample extends Component {
  render() {
    return (
      <Navigator
      initialRoute={{id: 'first'}}
      renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'first':
      return (<ListScreen navigator={navigator} title="first"/>);
      case 'second':
      return (<DetailScreen navigator={navigator} title= {route.title} />);
    }
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

AppRegistry.registerComponent('ListExample', () => ListExample);
