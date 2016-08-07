'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import StackCell from './StackCell';

const stack = [0, 1, 2, 3, 4, 5, 6, 7, 8];

class Stack extends Component {
  stacks = stack.map(x => new Array(9))

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View style={styles.container} >
      {
        stack.map((item, i) => {
          return stack.map((item, j) => {
            return (
              <StackCell ref={ref => this.stacks[j][i] = ref} key={i+'-'+j} 
                index={i} number={item} onPress={this.props.onPress} />
            )
          })
        })
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});


export default Stack;
