/**
 * 深拷贝操作，简单类型的对象的可以直接用 JSON.parse(JSON.stringify())或 [...]/{...}
 * @param {object} obj 需要拷贝的对象
 */
export const deepClone = (obj) => {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    obj instanceof Date ||
    obj instanceof Function
  ) {
    return obj
  }
  const cloneObj = Array.isArray(obj) ? [] : {}
  Object.keys(obj).map((key) => {
    cloneObj[key] = deepClone(obj[key])
    return cloneObj
  })
  return cloneObj
}


/**
 * 获取图片地址
 * @param {*} html 富文本字符串
 */
export const getImgsUrl = (html) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i
  const arr = html.match(imgReg)
  if (!arr) return null
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg)
    return src[1] ? [...prev, src[1]] : prev
  }, [])
  return urlArr
}

/**
 * 获取视频地址
 * @param {*} html 富文本字符串
 */
export const getVideoUrl = (html) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<(video|iframe).*?(?:>|\/>)/gi
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i
  const arr = html.match(imgReg)
  if (!arr) return null
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg)
    return src[1] ? [...prev, src[1]] : prev
  }, [])
  return urlArr
}

/**
 * 获取本地存储中的权限
 */
export const getPermission = () => localStorage.getItem('permissions') || []

/**
 * 根据权限判断是否有权限
 * @param {string} permission 权限
 * @returns {boolean} 是否有权限
 */
export const isAuthorized = (val) => {
  const permissions = getPermission()
  return permissions.includes(val)
}


/**
 * 用requestAnimationFrame替代setTimeout、setInterval，解决内存溢出
 * @export
 * @param {*} cb 定时回调
 * @param {*} interval 定时时间
 */
export const customizeTimer = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout(cb, interval) {
    // 实现setTimeout功能
    const { now } = Date
    const stime = now()
    let etime = stime
    const loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout() {
    cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval(cb, interval) {
    // 实现setInterval功能
    const { now } = Date
    let stime = now()
    let etime = stime
    const loop = () => {
      this.intervalTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval() {
    cancelAnimationFrame(this.intervalTimer)
  }
}


/**
 * 限制两位小数，可 ±
 * @param {string} val 要格式化的数字
 */
export const limitDecimal = (val) =>
  val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
