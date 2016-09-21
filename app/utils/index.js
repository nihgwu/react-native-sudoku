'use strict';

import Store from './store';
import sudoku from './sudoku';
import I18n from './i18n';

export {
  Store,
  sudoku,
  I18n,
};

export function isNumber(number) {
  return typeof(number) == 'number';
}
