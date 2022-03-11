import actionTypes from '@/store/actionTypes'

export const setStoreData = (type, payload) => {
  if (!actionTypes[type]) throw new Error('请传入修改的数据类型和值')
  return { type, payload }
}