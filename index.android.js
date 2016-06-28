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

import SplashScreen from './SplashScreen'
import ListScreen from './ListScreen'
import DetailScreen from './DetailScreen'

var _navigator;

class ListExample extends Component {
  render() {
    return (
      <Navigator
      initialRoute={{id: 'splash'}}
      renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'splash':
      return (<SplashScreen navigator={navigator}/>);
      case 'albums':
      return (<ListScreen navigator={navigator}/>);
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
