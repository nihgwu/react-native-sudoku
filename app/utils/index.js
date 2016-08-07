'use strict';

import Store from './store';
import sudoku from './sudoku';

export {
  Store,
  sudoku,
};

export function isNumber(number) {
  return typeof(number) == 'number';
}
