// @flow
'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  AsyncStorage,
  BackAndroid,
} from 'react-native';

const GLOBAL = require('./Global');
const API_URL = GLOBAL.BASE_URL+GLOBAL.COUPON_CODE_URL;

class SplashScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      splashTime: new Animated.Value(0),
      error: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(GLOBAL.AUTH_TOKEN_KEY, (err, result) => {
      if (err == null && result == null) {
        console.log('result is '+result);
        Animated.timing(
          this.state.splashTime,
          {
            duration: 2000,
          },
        ).start(() => this.dismissSplash());
      } else {
        this.sendAuthTokenRequest();
      }
    })
  }

  render() {
    return (
      <Image style={styles.bgImage}
      source = {require('image!splash_bg')}/>
    );
  }

  showError(error) {
    Alert.alert(
      'Error',
      error,
      [
        {text: 'Exit', onPress: () => {BackAndroid.exitApp()}},
        {text: 'Retry', onPress: () => this.sendAuthTokenRequest()},
      ]
    )
  }

  dismissSplash() {
    this.props.navigator.push({
      id: 'albums'
    })
  }

  sendAuthTokenRequest() {
    var deviceInfo = require('react-native-device-info');
    var email = 'Charsur+freetrial-'+deviceInfo.getUniqueID()+'@charsur.com';
    var couponCode = this.getCouponCode(email);
    var formBody = [];
    formBody.push('email' + "=" + encodeURIComponent(email));
    formBody.push('coupon_code' + "=" + encodeURIComponent(couponCode));
    formBody = formBody.join("&");

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((response) => response.json()).then((responseData) => {

      if (responseData.errors != null) {
        var errorKey = Object.keys(responseData.errors)[0]
        var error = responseData.errors[errorKey][0].message;
        console.log('error '+error);
        this.showError(error);
      } else {
        var accessToken = responseData.new_access_token;
        console.log('accessToken '+accessToken);
        AsyncStorage.setItem(GLOBAL.AUTH_TOKEN_KEY, accessToken, (err) => {
          if (err == null) {
            this.dismissSplash();
          } else {
            this.showError('Unable to save the auth token.')
          }
        })
      }

    }).done();
  }

  getCouponCode(email) {
    const crypto = require('crypto-js');
    var md5 = crypto.MD5(GLOBAL.COUPON_CODE+email).toString();
    return crypto.MD5(GLOBAL.COUPON_CODE+md5).toString();
  }
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: Image.resizeMode.stretch,
    width: null,
    height: null,
  },
});

export default SplashScreen;
