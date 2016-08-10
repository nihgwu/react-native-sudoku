'use strict';

import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  Size,
  CellSize,
  BoardWidth,
  BorderWidth,
} from './GlobalStyle';
import Touchable from './Touchable';

const spring = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.6,
  },
  delete: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
};

const Offset = (BoardWidth - CellSize * 9 - BorderWidth * 8) / 2;

class StackCell extends Component {
  left = BoardWidth / 9 * this.props.number + (BoardWidth / 9 - CellSize) / 2;
  top = this.props.index
  state = {
    hide: false,
    left: this.left,
    top: this.top,
  }

  moveTo(index, onMoveFinish) {
    const x = index % 9;
    const y = (index - x) / 9;
    const gap = BorderWidth * 2;
    const left = CellSize * x + gap * (Math.floor(x / 3) + 1) + Offset;
    const top = -20 - CellSize * (9 - y) - gap * (Math.floor((8 - y) / 3) + 1);
    LayoutAnimation.configureNext(spring);
    this.setState({ left, top });
    setTimeout(() => {
      onMoveFinish && onMoveFinish();
    }, 300);
  }

  setHide(hide, onFinish) {
    this.setState({ hide }, onFinish);
  }

  moveBack(onMoveFinish) {
    LayoutAnimation.configureNext(spring);
    this.setState({
      left: this.left,
      top: this.top,
    });
    setTimeout(() => {
      onMoveFinish && onMoveFinish();
    }, 300);
  }

  reset() {
    this.setState({
      hide: false,
      left: this.left,
      top: this.top,
    });
  }

  onPress = (e) => {
    this.props.onPress && this.props.onPress(this.props.number);
  }

  render() {
    if (this.state.hide) return null;
    const { number } = this.props;
    const { left, top } = this.state;
    return (
      <Touchable onPress={this.onPress} style={[styles.container, {top, left}]} >
        <View style={styles.cell} >
          <Text style={styles.text}>{number + 1}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: CellSize,
    height: CellSize,
  },
  cell: {
    width: CellSize,
    height: CellSize,
    backgroundColor: 'moccasin',
    borderColor: 'orange',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#666',
    fontSize: CellSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  }
});


export default StackCell;
