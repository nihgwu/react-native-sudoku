'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  StatusBar,
  UIManager,
  View,
} from 'react-native';

import AV from 'leancloud-storage';
import RNLeanCloud from 'react-native-leancloud';

import Main from './containers/Main';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AV.init({
  appId: RNLeanCloud.appId,
  appKey: RNLeanCloud.appKey,
});

class App extends Component {
  render() {
    return (
      <View style={styles.container} >
        <StatusBar backgroundColor='transparent' animated={true} translucent={true} barStyle="light-content"/>
        <Main />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default App;
