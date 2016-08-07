'use strict';

import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  AppState,
  Platform,
  Alert,
  Modal,
  Image,
  View,
  Text,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import AV from 'leancloud-storage';

import {
  Size,
  CellSize,
  Board,
  Timer,
  Touchable,
} from '../components';
import {
  Store,
  sudoku,
} from '../utils';

const formatTime = Timer.formatTime;
const Record = AV.Object.extend('Record');

class Main extends Component {
  state = {
    puzzle: null,
    playing: false,
    initing: false,
    editing: false,
    fetching: false,
    showModal: false,
    showRecord: false,
    showOnline: false,
  }
  puzzle = null
  solve = null
  error = 0
  elapsed = null
  fromStore = false
  records = []
  granted = false
  nextPuzzle = null

  handeleAppStateChange = (currentAppState) => {
    if (currentAppState != 'active') this.onShowModal();
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handeleAppStateChange);
    this.records = await Store.get('records') || [];
    const puzzle = await Store.get('puzzle');
    if (puzzle) {
      this.puzzle = puzzle.slice();
      this.fromStore = true;
      this.solve = await Store.get('solve');
      this.error = await Store.get('error') || 0;
      this.elapsed = await Store.get('elapsed');
    }
    this.setState({
      showModal: true,
    }, () => {
      this.nextPuzzle = sudoku.makepuzzle();
    });
    this.granted = await Store.get('granted');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handeleAppStateChange);
  }

  render() {
    const { puzzle, playing, initing, editing, showModal, showRecord, showOnline, fetching } = this.state;
    const disabled = !playing && !this.fromStore;
    if (puzzle && !this.solve) this.solve = puzzle.slice();
    let height = 0;
    if (showRecord) {
      height = CellSize / 3 + CellSize * (this.records.length + 1);
    }
    let onlineHeight = 0;
    if (showOnline) {
      onlineHeight = CellSize / 3 + CellSize * (this.scores.length + 1);
    }
    return (
      <View style={styles.container} >
        <View style={styles.header} >
          <Touchable disabled={initing} onPress={this.onShowModal} >
            <Image style={[styles.icon, initing && styles.disabled]} source={require('../images/menu.png')} />
          </Touchable>
          <Timer ref={ref => this.timer = ref} style={styles.timer} disabledStyle={styles.disabled} />
          <Touchable disabled={!playing} onPress={this.onToggleEditing} >
            <Image style={[styles.icon, editing&&{tintColor: 'khaki'}, !playing && styles.disabled]} source={require('../images/edit.png')} />
          </Touchable>
        </View>
        <Board puzzle={puzzle} solve={this.solve} editing={editing} 
          onInit={this.onInit} onErrorMove={this.onErrorMove} onFinish={this.onFinish} />
        <Modal animationType='slide' visible={showModal} transparent={true} onRequestClose={this.onCloseModal} >
          <View style={styles.modal} >
            <View style={[styles.modalContainer, {marginTop: showOnline? -onlineHeight:0}]} >
              {!showRecord&&<Text style={styles.title} >数      独</Text>}
              {!showRecord&&<Text style={styles.about} >by Neo(nihgwu@live.com)</Text>}
              <Touchable disabled={disabled} style={styles.button} onPress={this.onResume} >
                <Image style={[styles.buttonIcon, disabled && styles.disabled]} source={require('../images/play.png')} />
                <Text style={[styles.buttonText, disabled && styles.disabled]} >继续游戏</Text>
              </Touchable>
              <Touchable disabled={disabled} style={styles.button} onPress={this.onClear} >
                <Image style={[styles.buttonIcon, disabled && styles.disabled]} source={require('../images/reload.png')} />
                <Text style={[styles.buttonText, disabled && styles.disabled]} >重新开始</Text>
              </Touchable>
              <Touchable style={styles.button} onPress={this.onCreate} >
                <Image style={styles.buttonIcon} source={require('../images/shuffle.png')} />
                <Text style={styles.buttonText} >新的游戏</Text>
              </Touchable>
              <Touchable style={styles.button} onPress={this.onToggleRecord} >
                <Image style={styles.buttonIcon} source={require('../images/rank.png')} />
                <Text style={styles.buttonText} >排行榜　</Text>
              </Touchable>
              <View style={{overflow: 'hidden', height}} >
                <Touchable style={styles.record} onPress={this.onToggleRecord} >
                  <View style={styles.triangle} />
                  {this.records.length > 0?
                    (this.records.map((item, idx) => <Text key={idx} style={styles.recordText} >{formatTime(item)}</Text>)):
                    <Text style={styles.recordText} >还没有任何记录</Text>
                  }
                </Touchable>
                {showRecord&&<Text style={styles.recordText} onPress={this.onToggleOnline} >在线排行</Text>}
              </View>
              <View style={{overflow: 'hidden', height: onlineHeight}} >
                {!!this.scores && this.scores.length > 0 &&
                  <Touchable style={styles.record} onPress={this.onToggleOnline} >
                    <View style={styles.triangle} />
                    {this.scores.map((item, idx) => 
                      <Text key={idx} style={[styles.recordText, (idx + 1 == this.rank)&&styles.highlightText]} >{formatTime(item.get('elapsed'))}</Text>)
                    }
                  </Touchable>
                }
                {!!this.rank&&
                  <Text style={styles.recordText} onPress={this.onToggleOnline} >您位于第 {this.rank} 名</Text>
                }
              </View>
              {fetching&&
                <Text style={[styles.recordText, styles.highlightText]} >正在加载中……</Text>
              }
            </View>
            <Touchable style={styles.button} onPress={this.onCloseModal} >
              <Image style={[styles.buttonIcon, styles.disabled]} source={require('../images/close.png')} />
            </Touchable>
          </View>
        </Modal>
      </View>
    );
  }

  onInit = () => {
    this.setState({
      initing: false,
      playing: true,
      showModal: false,
      showRecord: false,
      showOnline: false,
    }, () => {
      this.timer.start();
    });
  }

  onErrorMove = () => {
    this.error++;
    const message = this.error > 3 ? '您已失误超过 3 次了，本次成绩无效' : `您已失误 ${this.error} 次, 超过 3 次成绩将无效`;
    Alert.alert('这一步之后本题将无解', message, [
      { text: '知道了' },
      { text: '新游戏', onPress: this.onCreate },
    ]);
  }

  onFinish = async() => {
    this.setState({
      playing: false,
    });
    await Store.multiRemove('puzzle', 'solve', 'error', 'elapsed');
    this.elapsed = null;
    //this.error = 0;
    this.solve = null;
    this.fromStore = false;
    const elapsed = this.timer.stop();
    if (this.error > 3) {
      setTimeout(() => {
        Alert.alert('恭喜您', `成功解决本题\n用时 ${formatTime(elapsed)} \n但您已失误超过 3 次，本次成绩无效`, [
          { text: '知道了' },
          { text: '新游戏', onPress: this.onCreate },
        ]);
      }, 1000);
      return;
    }
    if (!this.records.includes(elapsed)) {
      this.records.push(elapsed);
      this.records.sort();
      this.records = this.records.slice(0, 5);
      Store.set('records', this.records);
    }
    const length = this.records.length;
    const newRecord = elapsed == this.records[0] && this.records.length > 1;
    setTimeout(() => {
      Alert.alert('恭喜您', (newRecord ? '新的解题记录' : '成功解决本题') + '\n用时 ' + formatTime(elapsed), [
        { text: '知道了' },
        { text: '新游戏', onPress: this.onCreate },
      ]);
    }, 1000);
  }

  onToggleEditing = () => {
    this.setState({
      editing: !this.state.editing,
    });
  }

  onResume = () => {
    if (this.fromStore) {
      this.timer.setElapsed(this.elapsed);
      this.setState({
        puzzle: this.puzzle,
        initing: true,
        showModal: false,
        showRecord: false,
      });
      this.fromStore = false;
      return;
    }
    this.timer.resume();
    this.setState({
      showModal: false,
      showRecord: false,
    });
  }

  onClear = () => {
    this.elapsed = null;
    this.error = 0;
    this.solve = null;
    this.fromStore = false;
    this.timer.reset();
    Store.multiRemove('solve', 'error', 'elapsed');

    this.setState({
      puzzle: this.puzzle.slice(),
      initing: true,
      editing: false,
      playing: false,
      showModal: false,
      showRecord: false,
      showOnline: false,
    });
  }

  onCreate = () => {
    this.elapsed = null;
    this.error = 0;
    this.solve = null;
    this.fromStore = false;
    this.timer.reset();
    let puzzle;
    if (this.nextPuzzle) {
      puzzle = this.nextPuzzle.slice();
      this.nextPuzzle = null;
    } else {
      puzzle = sudoku.makepuzzle();
    }
    this.setState({
      puzzle,
      initing: true,
      editing: false,
      playing: false,
      showModal: false,
      showRecord: false,
      showOnline: false,
    }, async() => {
      await Store.multiRemove('puzzle', 'solve', 'error', 'elapsed');
      this.puzzle = puzzle.slice();
      Store.set('puzzle', this.puzzle);
    });
  }

  onToggleRecord = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      showOnline: this.state.showRecord ? false : this.state.showOnline,
      showRecord: !this.state.showRecord,
    });
  }

  onToggleOnline = async() => {
    if (!this.granted) {
      const upload = await new Promise((resolve, reject) => {
        Alert.alert('是否提交成绩？', '您必须先提交自己的最好成绩才能查看在线排行', [{
          text: '不提交',
          onPress: () => {
            resolve(false);
          },
        }, {
          text: '提交',
          onPress: () => {
            resolve(true);
          },
        }]);
      });
      if (!upload) return;
      this.granted = true;
      Store.set('granted', true);
    }
    if (!this.state.showOnline) {
      try {
        this.scores = null;
        this.rank = null;
        LayoutAnimation.easeInEaseOut();
        this.setState({
          fetching: true,
        });
        let query = new AV.Query('Record');
        query.equalTo('uid', DeviceInfo.getUniqueID());
        let score = await query.first();
        if (!score || score.get('elapsed') > this.records[0]) {
          if (!score) score = new Record();
          else score = AV.Object.createWithoutData('Record', score.id);
          score.set('elapsed', this.records[0]);
          score.set('uid', DeviceInfo.getUniqueID());
          score.set('model', DeviceInfo.getModel());
          const result = await score.save();
          if (!result || !result.id) {
            this.setState({
              fetching: false,
            });
            Alert.alert('出错了', '成绩上传失败', [
              { text: '知道了' },
            ]);
            return;
          }
        }
        query = new AV.Query('Record');
        query.ascending('elapsed');
        query.limit(10);
        this.scores = await query.find();
        query = new AV.Query('Record');
        query.lessThan('elapsed', this.records[0]);
        this.rank = await query.count();
        this.rank = this.rank + 1;
        this.setState({
          fetching: false,
        });
      } catch (e) {
        this.setState({
          fetching: false,
        });
        Alert.alert('出错了', e.message || '数据查询失败', [
          { text: '知道了' },
        ]);
        return;
      }
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({
      showOnline: !this.state.showOnline,
    });
  }

  onShowModal = () => {
    if (!this.state.initing) {
      if (this.solve) Store.set('solve', this.solve);
      if (this.error) Store.set('error', this.error);
      this.elapsed = this.timer.pause();
      if (this.elapsed) Store.set('elapsed', this.elapsed);
    }
    this.setState({
      showModal: true,
      showRecord: false,
    }, () => {
      if (!this.nextPuzzle) this.nextPuzzle = sudoku.makepuzzle();
    });
  }

  onCloseModal = () => {
    this.timer.resume();
    this.setState({
      showRecord: false,
      showOnline: false,
    }, () => {
      requestAnimationFrame(() => {
        this.setState({
          showModal: false,
        });
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'cadetblue',
    paddingBottom: CellSize,
  },
  header: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: CellSize,
    height: CellSize,
  },
  timer: {
    fontSize: CellSize * 3 / 4,
    alignSelf: 'center',
    color: '#fff',
    opacity: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'teal',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  editing: {
    tintColor: 'khaki',
    opacity: 1,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: CellSize,
    color: '#fff',
  },
  about: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: CellSize / 2,
    color: '#fff',
    opacity: 0.5,
  },
  button: {
    padding: Size.height > 500 ? 20 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: CellSize,
    height: CellSize,
  },
  buttonText: {
    marginLeft: CellSize / 2,
    textAlign: 'center',
    color: '#fff',
    fontSize: CellSize * 3 / 4,
  },
  record: {
    backgroundColor: 'cadetblue',
    paddingVertical: CellSize / 6,
    borderColor: 'darkcyan',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recordText: {
    marginVertical: CellSize / 6,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Menlo',
    fontSize: CellSize * 2 / 4,
    lineHeight: Platform.OS == 'android' ? Math.floor(CellSize * 4 / 6) : CellSize * 4 / 6,
  },
  highlightText: {
    color: 'khaki',
  },
  triangle: {
    position: 'absolute',
    left: Size.width / 2 - CellSize / 3 / 2,
    top: -CellSize / 3 / 2,
    width: CellSize / 3,
    height: CellSize / 3,
    backgroundColor: 'teal',
    borderColor: 'darkcyan',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    transform: [{
      rotate: '45deg',
    }],
  },
});


export default Main;
