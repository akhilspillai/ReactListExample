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
  ToolbarAndroid
} from 'react-native';

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
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    }

    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID + ':' + rowID];
    }

    return {
      loaded : false,
      dataSource : new ListView.DataSource({
        getSectionData          : getSectionData,
        getRowData              : getRowData,
        rowHasChanged           : (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged : (s1, s2) => s1 !== s2
      })
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {

    var dataBlob = {},
    sectionIDs = [],
    rowIDs = [],
    i,
    j;

    for (i = 0; i < 4; i++) {
      sectionIDs.push(i);
      dataBlob[i] = 'Header'+i;

      rowIDs[i] = [];

      for(j = 0; j < 3; j++) {
        rowIDs[i].push(j);
        dataBlob[i + ':' + j] = 'Item'+j;
      }
    }

    this.setState({
      dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      loaded     : true
    });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
      <ToolbarAndroid style={styles.toolbar}
      title='User List'
      titleColor={'#FFFFFF'}/>
      <View style={styles.container}>
      <ProgressBarAndroid
      animating={!this.state.loaded}
      style={[styles.activityIndicator, {height: 30}]}
      size="small"
      />
      </View>
      </View>
    );
  }

  renderListView() {
    return (
      <View style={styles.container}>
      <ToolbarAndroid style={styles.toolbar}
      title='User List'
      titleColor={'#FFFFFF'}/>
      <ListView
      dataSource = {this.state.dataSource}
      style      = {styles.listview}
      renderRow  = {this.renderRow}
      renderSectionHeader = {this.renderSectionHeader}
      />
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
      <Text style={styles.text}>{sectionData}</Text>
      </View>
    );
  }

};

Object.assign(ListScreen.prototype, {
    bindableMethods : {
        renderRow(rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowText}>{rowData}</Text>
                    </View>
                </TouchableOpacity>
            );
        },
        onPressRow(rowData, sectionID) {
          this.props.navigator.push({
            id: 'second',
            title : rowData
          })
        }

    }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  text: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 16
  },
  rowStyle: {
    paddingVertical: 20,
    paddingLeft: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1
  },
  rowText: {
    color: '#212121',
    fontSize: 16
  },
  subText: {
    fontSize: 14,
    color: '#757575'
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#2196F3'
  },
  toolbar: {
    backgroundColor: '#3F51B5',
    height: 56,
    paddingLeft: 20,
  },
});

export default ListScreen;
