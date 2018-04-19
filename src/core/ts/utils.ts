class Utils {
  /**
   * 判断是否是微信应用中的浏览器
   */
  isWeChatBrowser(): boolean {
    let result = false
    let ua = window.navigator.userAgent.toLowerCase()
    let match = ua.match(/MicroMessenger/i)
    if (match && match.length > -1) {
      result = 'micromessenger' === match[0]
    }
    return result
  }

  /**
   * 打印日志
   * @param message 字符串信息
   */
  log(message: string = '', color: string = 'green'): void {
    console.log('%c' + message, 'color:' + color + ';font-size:14px;')
  }

  /**
  * 时间格式字符串转换为时间戳，为了兼容ios的浏览器
  * @param dateStr 时间格式字符串 '2015-12-11 17:07'
  * @return {Number}
  */
  parseTimestamp(dateStr: string = ''): number {
    let timeArr, timeArrLength, dateStrArr, y, M, d, h, m, s
    y = M = d = h = m = s = 0

    dateStrArr = dateStr.split(' ')
    timeArr = dateStrArr[0].split('-')

    if (dateStrArr.length === 2) {
      timeArr = timeArr.concat(dateStrArr[1].split(':'))
    }
    timeArrLength = timeArr.length
    if (timeArrLength > 0) {
      y = parseFloat(timeArr[0]) || 0
    }
    if (timeArrLength > 1) {
      M = parseFloat(timeArr[1]) || 0
    }
    if (timeArrLength > 2) {
      d = parseFloat(timeArr[2]) || 0
    }
    if (timeArrLength > 3) {
      h = parseFloat(timeArr[3]) || 0
    }
    if (timeArrLength > 4) {
      m = parseFloat(timeArr[4]) || 0
    }
    if (timeArrLength > 5) {
      s = parseFloat(timeArr[5]) || 0
    }
    return Math.round(new Date(y, M - 1, d, h, m, s).getTime())
  }

  /**
   * 格式化时间毫秒数
   * @param {Number} milliscond 时间毫秒数
   */
  formatTimeMills(milliscond: number) {
    let d = Math.floor(milliscond / (1000 * 60 * 60 * 24)),
      h = Math.floor(milliscond / (1000 * 60 * 60)) % 24,
      m = Math.floor(milliscond / (1000 * 60)) % 60,
      s = Math.floor(milliscond / 1000) % 60;
    return {
      'd': d, // 天数
      'h': h, // 小时
      'm': m, // 分钟
      's': s // 秒杀
    };
  }

  /**
   * 格式化时间，不足十位的前补零
   * @param {Number} n    待操作的时间值
   * @return {String}
   */
  formatTime(n) {
    if (n === null || typeof n === 'undefined') {
      return '00';
    } else if (typeof n.toString() !== 'undefined' && n.toString().length === 1) {
      return '0' + n;
    } else {
      return n + '';
    }
  }

  /**
   *
   * @param beginTime 开始时间
   * @param endTime 结束时间
   * @param serverTime 服务器时间
   * @param templateType 模版类型
   * @param status
   */
  countDownTemplate(beginTime, endTime, serverTime, templateType, status?) {
    templateType = 0 || templateType;

    // 倒计时拼接
    let countdown = (milliscond) => {
      let timeObj = this.formatTimeMills(milliscond);
      let result = '';

      // 根据模板类型进行修改
      switch (templateType) {
        case 0:
          if (timeObj.d > 0) {
            result += this.formatTime(timeObj.d) + '天 ';
          }
          result += this.formatTime(timeObj.h) + '时 ' +
            this.formatTime(timeObj.m) + '分 ' +
            this.formatTime(timeObj.s) + '秒';
          break;
        case 1:
          result = '<span class="part part2">';
          if (timeObj.d > 0) {
            result += '<b>' + this.formatTime(timeObj.d) + '</b>天 ';
            result += '<b>' + this.formatTime(timeObj.h) + '</b>时 ';
          } else if (timeObj.h > 0) {
            result += '<b>' + this.formatTime(timeObj.h) + '</b>时 ';
            result += '<b>' + this.formatTime(timeObj.m) + '</b>分 ';
          } else {
            result += '<b>' + this.formatTime(timeObj.m) + '</b>分 ';
            result += '<b>' + this.formatTime(timeObj.s) + '</b>秒 ';
          }
          result += '</span>';
          break;
        case 2:
          if (timeObj.d > 0) {
            result += '<b>' + this.formatTime(timeObj.d) + '</b>天 ';
            result += '<b>' + this.formatTime(timeObj.h) + '</b>时 ';
            result += '<b>' + this.formatTime(timeObj.m) + '</b>分 ';
          } else if (timeObj.h > 0) {
            result += '<b>' + this.formatTime(timeObj.h) + '</b>时 ';
            result += '<b>' + this.formatTime(timeObj.m) + '</b>分 ';
            result += '<b>' + this.formatTime(timeObj.s) + '</b>秒 ';
          } else {
            result += '<b>' + this.formatTime(timeObj.m) + '</b>分 ';
            result += '<b>' + this.formatTime(timeObj.s) + '</b>秒 ';
          }
          break;
      }

      return result;
    };

    // 根据开始时间、结束时间、服务器当前时间计算倒计时
    let html, milliscond;
    if (beginTime > serverTime) {
      switch (templateType) {
        case 1:
          html = '<span class="part part1">距开始</span>';
          break;
        case 2:
          html = '距开始：';
          break;
        default:
          html = '距开始：';
      }
      milliscond = beginTime - serverTime;
      html += countdown(milliscond);
    } else if (beginTime < serverTime && serverTime < endTime) {
      switch (templateType) {
        case 1:
          html = '<span class="part part1">距结束</span>';
          break;
        case 2:
          if (status === 5) {
            html = '<span class="p-time">延时中：</span>';
          } else {
            html = '<span class="p-time">距结束：</span>';
          }
          break;
        default:
          html = '距结束：';
      }
      milliscond = endTime - serverTime;
      html += countdown(milliscond);
    } else {
      switch (templateType) {
        case 1:
          html = '<span class="part end">已结拍</span>';
          break;
        case 2:
          html = '已结拍';
          break;
        default:
          html = '已结拍';
      }
    }

    return html;
  }
}

let utils: Utils = new Utils()

export default utils
