'use strict';

import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    name: 'Sudoku Master',
    continue: 'Continue ',
    restart: 'Restart  ',
    newgame: 'New Game ',
    challenge: 'Challenge',
    weekrank: 'Week Rank',
    norecord: 'No records yet',
    onlinerank: 'Online Rank',
    rank: 'You are in place %{rank}',

    ok: 'Got it',
    congrats: 'Congrats',
    sorry: 'Sorry',
    success: 'You solve this puzzle in\n',
    fail: 'You lose this puzzle for more then 3 no solution moves',
    newrecord: 'New record! You solve this puzzle in\n',

    loading: 'loading……',
    error: 'Error',
    uploaderror: 'Upload failed',
    queryerror: 'Query failed',

    share: 'Share',
    sharemessage: 'Sudoku Master - for pure sudoku pleasure',
    sharefailed: 'Share faild',

    rate: 'Rate this app',
    ratemessage: 'I developed this app for fun, your rate is my great hornor',
    cancel: 'Cancel',
    confirm: 'Confrim',

    thanks: 'Thanks for your support',
    noalipay: 'You hasn\'t installed AliPay, can\'t donate',
    donate: 'Donate via AliPay',
    donatemessage: 'Buy a cup of coffee',
  },
  zh: {
    name: '数 独 大 师',
    continue: '继续游戏',
    restart: '重新开始',
    newgame: '新的游戏',
    challenge: '在线挑战',
    weekrank: '本周排行',
    norecord: '还没有任何记录',
    onlinerank: '在线排行',
    rank: '您位于第 %{rank} 名',

    ok: '知道了',
    congrats: '恭喜您',
    sorry: '解题失败',
    success: '成功解决本题\n用时 ',
    fail: '填字后无解超过 3 次，本次成绩无效',
    newrecord: '新的解题记录\n 用时 ',

    loading: '正在加载中……',
    error: '出错了',
    uploaderror: '成绩上传失败',
    queryerror: '数据查询失败',

    share: '分享',
    sharemessage: '数独大师 - 重拾纯粹数独的乐趣',
    sharefailed: '分享失败',

    rate: '应用评价',
    ratemessage: '该应用为业余时间开发，您的好评是对我的最大支持',
    cancel: '取消',
    confirm: '确定',

    thanks: '感谢支持',
    noalipay: '您还没有安装支付宝应用，无法打赏',
    donate: '支付宝打赏',
    donatemessage: '送一杯咖啡以示支持',
  },
};

export default I18n;