// 深拷贝
export function deepClone (original) {
  return JSON.parse(JSON.stringify(original))
}
export function msg (_this, msg, width = '100px', time = 2000) {
  console.log('sfdsf')
  _this.$vux.toast.show({
    width: width,
    time: time,
    text: msg
  })
}
export function errorMsg (_this, msg, width = '200px', time = 2000) {
  _this.$vux.toast.show({
    type: 'cancel',
    width: width,
    time: time,
    text: msg
  })
}
