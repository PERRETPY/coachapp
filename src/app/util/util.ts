export default class Util {

  static hexEncode(str) {
    let result = '';
    for (let i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  static hexDecode(str1) {
    let hex  = str1.toString();
    let str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
}
