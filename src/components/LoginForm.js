//把登录表单提取到它自己的组件中。状态和所有与之相关的功能都是在组件之外定义的，并作为prop传递给组件。
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
//表单字段有事件处理程序，它将字段的变化与App组件的状态同步。
//事件处理程序很简单。一个对象被作为参数给他们，他们从对象中解构字段target并将其值保存到状态中。
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

//如果传递的 prop 类型错误，同样会产生警报
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm