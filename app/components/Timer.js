'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

function formatTime(elapsed) {
  const hour = Math.floor(elapsed / 60 / 60);
  const minute = Math.floor(elapsed / 60 - hour * 60);
  const second = elapsed % 60;
  return [hour, minute, second].map(x => x < 10 ? '0' + x : x).join(':');
}

class Timer extends Component {
  static formatTime = formatTime
  state = {
    paused: false,
    elapsed: this.props.elapsed || 0,
    disabled: this.props.disabled || true,
  }
  startTime = null
  lastElapsed = 0

  start() {
    this.setState({
      disabled: false,
    });
    this.startTime = new Date();
    this.interval = setInterval(() => {
      if (this.state.paused) return;
      const elapsed = Math.floor((new Date() - this.startTime) / 1000) + this.lastElapsed;
      if (elapsed == this.state.elapsed) return;
      this.setState({
        elapsed,
      });
    }, 100)
  }

  pause() {
    this.setState({
      paused: true
    });
    this.lastElapsed = this.state.elapsed;
    return this.state.elapsed;
  }

  resume() {
    this.setState({
      paused: false
    });
    this.startTime = new Date();
  }

  stop() {
    this.interval && clearInterval(this.interval);
    if (this.state.paused) {
      this.setState({
        paused: false,
      })
    };
    return this.state.elapsed;
  }

  reset() {
    this.interval && clearInterval(this.interval);
    this.startTime = null;
    this.lastElapsed = 0;
    this.setState({
      paused: false,
      elapsed: this.props.elapsed || 0,
      disabled: this.props.disabled || true,
    });
  }

  setElapsed(elapsed) {
    this.startTime = null;
    this.lastElapsed = elapsed;
    this.setState({
      elapsed: elapsed,
    });
  }

  getElapsed() {
    return this.state.elapsed;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) {
      return true;
    }
    return false;
  }

  render() {
    const { elapsed, disabled } = this.state;
    const { style, disabledStyle } = this.props;
    return (
      <Text style={[styles.text, style, disabled && disabledStyle]}>{formatTime(elapsed)}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '100',
    fontFamily: 'Menlo',
  },
});


export default Timer;
