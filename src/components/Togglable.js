import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

//创建组件的函数包装在forwardRef函数中，这样组件就可以访问分配给它的 ref。
const Togglable = forwardRef((props, refs) => {
  //布尔值loginVisible，它定义是否应向用户显示登录表单
  const [visible, setVisible] = useState(false)
  //loginVisible的值通过两个按钮切换
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  //使用useImperativeHandle挂钩，使其toggleVisibility函数在组件外部可用。
  useImperativeHandle(refs, () => {
    return {
      //返回在组件中定义的函数，可以从组件外部调用这些函数。
      toggleVisibility
    }
  })

  //props.children，它用于引用组件的子组件。它是由 React 自动添加的，并且始终存在。如果没有导入，props.children就是一个空数组
  //子组件是我们在组件的开始和结束标签之间定义的 React 元素

  //组件的可见性是通过给组件一个内联样式规则来定义的。如果我们不希望组件被显示，display属性的值是none
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

//可以将buttonLabel属性定义为mandatory或required的字符串类型属性。如果忘记定义，应用仍然可以工作，但控制台会提示错误。
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'
export default Togglable