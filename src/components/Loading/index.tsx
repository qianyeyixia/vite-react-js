import { Button, Spin } from 'antd'
import { Suspense } from 'react'
import $style from './index.module.css'
/**
 * 加载资源时候 显示的等待界面
 * @github: https://github.com/liuye1296/react-keepAlive/blob/main/src/components/Loading/index.tsx
 */
export function Loading() {
	return (
		<div className={$style.rantion_loading} style={{ paddingTop: '20vh', minHeight: '80vh' }}>
			<Spin tip="Loading..." size="large" />
		</div>
	)
}
interface Props {
	children: JSX.Element
}
export function SuspenseLoading({ children }: Props) {
	return <Suspense fallback={<Loading />}>{children}</Suspense>
}
/**
 * 加载失败
 * @param props
 * @constructor
 */
export function LoadingError() {
	function reload() {
		localStorage.clear()
		location.reload()
	}

	return (
		<div className={$style.rantion_loading}>
			<div className={$style.page404}>500</div>
			<div className={$style.subtitle}>很抱歉，程序出现异常了。</div>
			<br />
			<Button type="link" onClick={reload}>
				注销登录，重新加载
			</Button>
		</div>
	)
}
