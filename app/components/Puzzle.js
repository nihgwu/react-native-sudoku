'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import {
  BlockSize,
} from './GlobalStyle';
import Touchable from './Touchable';

function formatTime(elapsed) {
  const hour = Math.floor(elapsed / 60 / 60);
  const minute = Math.floor(elapsed / 60 - hour * 60);
  const second = elapsed % 60;
  return [hour, minute, second].map(x => x < 10 ? '0' + x : x).join(':');
}

class Puzzle extends Component {
  onPress = () => {
    this.props.onPress && this.props.onPress(this.props.puzzle);
  }
  render() {
    const { puzzle, elapsed } = this.props;
    return (
      <View style={styles.container} >
        <View style={styles.board} >
          {!!puzzle && puzzle.map((item, idx) => (
            <View key={idx} style={[styles.cell, item != null && {backgroundColor: 'khaki'}]} />
          ))}
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
        <Touchable style={styles.button} onPress={this.onPress}>
          <Image style={styles.image} source={require('../images/play.png')} />
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: BlockSize * 9,
    height: BlockSize * 9,
    marginHorizontal: BlockSize / 2,
  },
  board: {
    width: BlockSize * 9,
    height: BlockSize * 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'lightyellow',
  },
  cell: {
    width: BlockSize,
    height: BlockSize,
    backgroundColor: 'lightyellow',
  },
  timer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BlockSize,
  },
  timerText: {
    color: 'peru',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '100',
    fontFamily: 'Menlo',
    backgroundColor: 'transparent',
  },
  button: {
    position: 'absolute',
    top: BlockSize * 9 / 2 - 24,
    left: BlockSize * 9 / 2 - 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    left: 2,
    width: 30,
    height: 30,
    tintColor: 'peru',
    opacity: 0.5,
  },
});


export default Puzzle;
