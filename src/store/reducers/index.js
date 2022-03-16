import initState from '@/store/state'
import actionTypes from '@/store/actionTypes'

const storeData = (state = initState, {type,payload}) => {
  if(!actionTypes[type]) return state
  const {field} = actionTypes[type]
  return {
    ...state,
    [field]: payload
  }
}
export default storeData