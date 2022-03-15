# 安装
请使用 `pnpm` 安装

# 文档
[参考项目](https://github.com/hsl947/react-antd-multi-tabs-admin)


# Redux 的使用说明
```Typescript
# 在/src/store/actionTypes/index.tsx 定义新字段，格式如下
export default {
  ...,
  SET_ACTION: {
    name: 'SET_ACTION',
    field: 'action'
  }
}

# 在/src/store/state/index.tsx 也定义新字段，格式如下
interface StoreState {
  ...;
  action: string;
}
const initState: StoreState = {
  ...,
  action: ''
}

# 在要使用的组件中
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
export default connect(
  (state) => state,
  actions
)(ComponentName)

# 然后在 props 就有 setStoreData 属性，可用来 dispatch
setStoreData('SET_ACTION', '')

# 只需要定义 type 和 state，不需要写每个action，效率提高了木有有！！！
```
