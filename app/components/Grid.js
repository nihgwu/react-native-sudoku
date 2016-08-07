'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  CellSize,
  BorderWidth,
} from './GlobalStyle';

import Cell from './Cell';

const stack = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Grid extends Component {
  cells = []

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
          return (
            <View key={'grid' + i} style={styles.grid} >
            {
              stack.map((item, j) => {
                const x = i % 3 * 3 + j % 3;
                const y = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                const index = x + y * 9;
                return <Cell ref={ref => this.cells[index] = ref} key={'cell' + index} 
                  index={index} number={null} onPress={this.props.onPress} />
              })
            }
            </View>
          )
        })
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: CellSize * 9 + BorderWidth * 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'orange',
  },
  grid: {
    margin: BorderWidth,
    width: CellSize * 3,
    height: CellSize * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});


export default Grid;
