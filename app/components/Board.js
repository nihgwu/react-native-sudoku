'use strict';

import React, { Component } from 'react';

import {
  InteractionManager,
  LayoutAnimation,
  StyleSheet,
  Platform,
  View,
} from 'react-native';

import {
  CellSize,
  BoardWidth,
  BorderWidth,
} from './GlobalStyle';

import Grid from './Grid';
import Stack from './Stack';
import {
  sudoku,
  isNumber,
} from '../utils';

const stack = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function toXY(index) {
  const x = index % 9;
  const y = (index - x) / 9;
  return { x, y };
}

function toZ(index) {
  const { x, y } = toXY(index);
  return (x - x % 3) / 3 + (y - y % 3);
}

class Board extends Component {
  state = {
    index: -1,
  }
  puzzle = this.props.solve || this.props.puzzle
  original = this.props.puzzle
  cells = []
  stacks = stack.map(x => new Array(9))
  movedStacks = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  hightlightNumber = null
  hightlightIndex = null
  editing = this.props.editing
  inited = false
  solved = false

  onCellPress = (index, number, fixed) => {
    if (!this.inited || this.solved) return;
    if (isNumber(number)) {
      if (isNumber(this.hightlightIndex))
        this.cells[this.hightlightIndex].setHighlight(false);
      if (isNumber(this.hightlightNumber))
        this.setHighlight(this.hightlightNumber, false);
      this.setHighlight(number, true);
      this.hightlightNumber = number;
      this.setState({
        index: -1,
      });
      return;
    }
    if (index != this.state.index) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ index });
    }

    if (isNumber(this.hightlightIndex))
      this.cells[this.hightlightIndex].setHighlight(false);
    this.cells[index].setHighlight(true);
    this.hightlightIndex = index;

    if (isNumber(this.hightlightNumber)) {
      this.setHighlight(this.hightlightNumber, false);
      this.hightlightNumber = null;
    }
  }

  onStackPress = (number) => {
    if (!this.inited) return;
    const { index } = this.state;
    if (index == -1) {
      if (isNumber(this.hightlightNumber)) {
        this.setHighlight(this.hightlightNumber, false);
        if (this.hightlightNumber == number) {
          this.hightlightNumber = null;
          return;
        }
      }
      this.setHighlight(number, true);
      this.hightlightNumber = number;
      return;
    }
    if (this.editing) {
      this.cells[index].setHintNumber(number);
      return;
    }
    const stack = this.stacks[number][8 - this.movedStacks[number]];
    stack.moveTo(index, () => {
      const { x, y } = toXY(index);
      const z = toZ(index);
      let collision = [];
      this.puzzle.forEach((item, idx) => {
        if (item != number) return;
        const pos = toXY(idx);
        if (pos.x == x || pos.y == y || toZ(idx) == z)
          collision.push(idx);
      });
      if (collision.length) {
        collision.forEach(i => this.cells[i].setHighlight(true));
        stack.moveBack(() => {
          collision.forEach(i => this.cells[i].setHighlight(false));
        });
        return;
      }
      let nextPuzzle = this.puzzle.slice();
      nextPuzzle[index] = number;
      if (!sudoku.solvepuzzle(nextPuzzle)) {
        stack.moveBack(() => {
          this.props.onErrorMove && this.props.onErrorMove(index, number);
        });
        return;
      }
      this.props.onMove && this.props.onMove(index, number);
      this.movedStacks[number]++;
      this.cells[index].setNumber(number);
      stack.setHide(true);
      this.puzzle[index] = number;
      if (this.puzzle.filter((item, idx) => item != null && toZ(idx) == z).length == 9) {
        this.animateGrid(z);
      }
      if (this.puzzle.filter((item, idx) => item != null && toXY(idx).y == y).length == 9) {
        this.animateRow(y);
      }
      if (this.puzzle.filter((item, idx) => item != null && toXY(idx).x == x).length == 9) {
        this.animateColumn(x);
      }
      if (this.puzzle.filter(x => x == number).length == 9) {
        this.animateNumber(number);
      }
      if (this.puzzle.filter(x => x != null).length == 81) {
        this.solved = true;
        this.cells[index].setHighlight(false);
        this.setState({
          index: -1,
        });
        this.props.onFinish && this.props.onFinish();
        InteractionManager.runAfterInteractions(() => {
          this.animateAll();
        });
        return;
      }
      if (isNumber(this.hightlightNumber))
        this.setHighlight(this.hightlightNumber, false);
      this.setHighlight(number, true);
      this.hightlightNumber = number;

      if (index != this.state.index) return;
      this.setState({
        index: -1,
      });
    });
  }

  initBoard() {
    this.inited = false;
    this.solved = false;
    this.movedStacks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.hightlightNumber = null;
    this.hightlightIndex = null;
    let count = 0;
    let fixedStack = [];
    const numberCount = this.puzzle.filter(x => x != null).length;
    const gap = 150;
    for (let i = 0; i < 81; i++) {
      const number = this.puzzle[i];
      if (isNumber(number)) {
        count++;
        setTimeout((count) => {
          const stack = this.stacks[number][8 - this.movedStacks[number]];
          fixedStack.push(stack);
          this.movedStacks[number]++;
          stack.moveTo(i, () => {
            this.cells[i].setNumber(number, this.original[i] == this.puzzle[i]);
            if (count == numberCount) {
              requestAnimationFrame(() => {
                fixedStack.map((item, idx) => item.setHide(true));
              });
              setTimeout(() => {
                this.inited = true;
                this.props.onInit && this.props.onInit();
              }, gap);
            }
          });
        }, gap * count, count);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.editing = nextProps.editing;
    if (!nextProps.puzzle | this.original == nextProps.puzzle) return;
    this.setState({ index: -1 });
    this.cells.forEach(x => x.reset());
    this.movedStacks.forEach((x, number) => {
      for (let i = 0; i < x; i++) this.stacks[number][8 - i].reset();
    });
    this.puzzle = nextProps.solve || nextProps.puzzle;
    this.original = nextProps.puzzle;
    this.initBoard();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState != this.state) {
      return true;
    }
    return false;
  }

  render() {
    const { index } = this.state;
    const { x, y } = toXY(this.state.index);
    const top = y * CellSize + Math.floor(y / 3) * BorderWidth * 2;
    const left = x * CellSize + Math.floor(x / 3) * BorderWidth * 2;
    return (
      <View style={styles.container} >
        <View style={styles.boardContainer} >
          <View style={styles.board} >
            <Grid ref={ref => ref && (this.cells = ref.cells)} onPress={this.onCellPress} />
            {index!=-1&&<View pointerEvents='none' style={[styles.row, {top}]} />}
            {index!=-1&&<View pointerEvents='none' style={[styles.column, {left}]} />}
          </View>
        </View>
        <Stack ref={ref => ref && (this.stacks = ref.stacks)} onPress={this.onStackPress} />
      </View>
    );
  }

  animateRow(x) {
    stack.forEach(i => this.cells[i + x * 9].animate());
  }

  animateColumn(y) {
    stack.forEach(i => this.cells[i * 9 + y].animate());
  }

  animateGrid(z) {
    const x = z % 3;
    const y = (z - x) / 3;
    stack.forEach(i => {
      const xx = i % 3;
      const yy = (i - xx) / 3;
      const index = xx + yy * 3 * 3 + y * 27 + x * 3;
      this.cells[index].animate()
    });
  }

  animateNumber(number) {
    this.puzzle.forEach((item, i) => {
      if (item == number) this.cells[i].animate();
    });
  }

  animateAll() {
    this.puzzle.forEach((item, i) => {
      this.cells[i].animate();
    });
  }

  setHighlight(number, highlight) {
    this.puzzle.forEach((item, i) => {
      if (item == number) this.cells[i].setHighlight(highlight);
    })
  }
}

const styles = StyleSheet.create({
  boardContainer: {
    //marginTop: 20,
    alignItems: 'center',
    width: BoardWidth,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'orange',
    padding: BorderWidth,
  },
  row: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: BorderWidth * 2,
    top: 0,
    left: 0,
    width: CellSize * 9 + BorderWidth * 4,
    height: CellSize,
    borderColor: 'peru',
    borderWidth: 2,
    borderRadius: BorderWidth,
  },
  column: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: BorderWidth * 2,
    top: 0,
    left: 0,
    width: CellSize,
    height: CellSize * 9 + BorderWidth * 4,
    borderColor: 'peru',
    borderWidth: 2,
    borderRadius: BorderWidth,
  },
});


export default Board;
