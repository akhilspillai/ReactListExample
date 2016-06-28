// @flow
'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  ProgressBarAndroid,
  ToolbarAndroid,
  BackAndroid,
  Alert,
  AsyncStorage,
  Image,
} from 'react-native';

const GLOBAL = require('./Global');
const API_URL = GLOBAL.BASE_URL+GLOBAL.ALBUMS_URL;

const crypto = require('crypto-js');
const DeviceInfo = require('react-native-device-info');
var authToken;

class ListScreen extends React.Component{

  constructor(props) {
    super(props);
    this.bindMethods();
    this.state = this.getState();
  }

  bindMethods() {
    if (! this.bindableMethods) {
      return;
    }

    for (var methodName in this.bindableMethods) {
      this[methodName] = this.bindableMethods[methodName].bind(this);
    }
  }

  getState() {
    return {
      loaded : false,
      error  : false,
      dataSource : new ListView.DataSource({
        rowHasChanged : (row1, row2) => row1 !== row2,
      })
    }
  }

  componentDidMount() {
    AsyncStorage.getItem(GLOBAL.AUTH_TOKEN_KEY, (err, result) => {
      if (err == null && result != null) {
        this.authToken = result;
        this.fetchData();
      }
    })
  }

  fetchData() {
    var formBody = [];
    var albumPerPage = 30;
    var page = 1;
    var sortDirection = 'DESC';

    formBody.push('album_per_page' + "=" + encodeURIComponent(albumPerPage));
    formBody.push('page' + "=" + encodeURIComponent(page));
    formBody.push('sort_dirction' + "=" + encodeURIComponent(sortDirection));
    formBody = formBody.join("&");

    console.log("auth token "+this.authToken);

    var ad = this.authToken;
    ad = 'Basic '+this.getBase64String(ad+':'+ad);

    var url = API_URL+'?'+formBody;

    console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ad,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then((response) => response.json()).then((responseData) => {
      console.log(responseData);
      if (responseData.errors != null) {
        var errorKey = Object.keys(responseData.errors)[0]
        var error = responseData.errors[errorKey][0].message;
        console.log('error '+error);
        this.showError(error);
      } else {
        var accessToken = responseData.new_access_token,
        rows = [],
        i;

        AsyncStorage.setItem(GLOBAL.AUTH_TOKEN_KEY, accessToken);

        var albums = responseData.albums;

        this.setState({
          dataSource : this.state.dataSource.cloneWithRows(albums),
          loaded     : true
        });
      }

    }).done();
  }

  getBase64String(string) {
    var base64 = require('base64-js')
    var bytes = [];

    for (var i = 0; i < string.length; ++i) {
      bytes.push(string.charCodeAt(i));
    }
    return base64.fromByteArray(bytes);

  }

  getCouponCode(email) {
    var couponCode = '!4surft/';
    var md5 = crypto.MD5(couponCode+email).toString();
    return crypto.MD5(couponCode+md5).toString();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return this.renderListView();
  }

  showError(error) {
    Alert.alert(
      'Error',
      error,
      [
        {text: 'Exit', onPress: () => {BackAndroid.exitApp()}},
        {text: 'Retry', onPress: () => this.fetchData()},
      ]
    )
  }

  renderLoadingView() {
    return (
    <Image style ={styles.bgImage}
    resizeMode ={Image.resizeMode.stretch}
    source = {require('image!bg_blue')}>
      <ToolbarAndroid
      style ={styles.toolbar}
      title ='Albums'
      titleColor ={'#FFFFFF'}/>
      <View style ={styles.bgImage}>
      <ProgressBarAndroid
      animating={!this.state.loaded}
      style={{height: 30}}
      size="small"
      />
      </View>
      </Image>
    );
  }

  renderListView() {
    return (
    <Image style ={styles.bgImage}
    resizeMode ={Image.resizeMode.stretch}
    source = {require('image!bg_blue')}>
      <ToolbarAndroid style={styles.toolbar}
      title ='Albums'
      titleColor ={'#FFFFFF'}/>
      <ListView
      contentContainerStyle = {styles.list}
      dataSource = {this.state.dataSource}
      renderRow  = {this.renderRow}
      pageSize = {12}
      />
      </Image>
    );
  }

};

Object.assign(ListScreen.prototype, {
  bindableMethods : {
    renderRow(rowData) {
      return (
        <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <Image style={styles.albumArtStyle}
        source = {{uri: rowData.thumnail_loc}}/>
        </TouchableOpacity>
      );
    },
    onPressRow(rowData) {
      this.props.navigator.push({
        id: 'second',
        title : rowData.album_name
      })
    }

  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  albumArtStyle: {
    resizeMode: Image.resizeMode.contain,
    justifyContent: 'center',
    padding: 5,
    margin: 10,
    width: 160,
    height: 160,
  },
  toolbar: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: 56,
    paddingLeft: 20,
  },
  bgImage: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

export default ListScreen;
