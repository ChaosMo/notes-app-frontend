import { useState, useEffect, useRef  } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'


import noteService from './services/notes'
import loginService from './services/login'

const App = () => {

  const name = 'Peter'
  const age = 10

  //counter变量被分配了state的初始值，即0。变量setCounter被分配了一个函数，该函数将被用来修改状态。
  const [ counter, setCounter ] = useState(0)
  //当其中一个按钮被点击时，事件处理程序被执行。该事件处理程序通过setCounter函数改变App组件的状态。调用一个改变状态的函数会导致组件重新渲染。
  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  const [value, setValue] = useState(10)
  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  const [errorMessage, setErrorMessage] = useState(null)

  //笔记相关状态
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)

  //用户相关状态
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //Effect-hooks可以让你对函数组件执行副作用。获取数据、设置订阅、以及手动改变React组件中的DOM都是副作用的例子。
  //Effect-hooks实际上需要两个参数。第一个是一个函数，默认情况下会在每次完成渲染后运行，第二个用于指定效果的运行频率。
  useEffect(() => {
    //const promise = axios.get('http://localhost:3001/notes')
    //将promise对象存储在一个变量中通常是不必要的。
    //如果我们想访问promise所代表的操作结果，我们必须为promise注册一个事件处理程序。这可以通过then方法实现。
    noteService
      .getAll()
      .then(initialNotes  => {
        //response对象包含与HTTP GET请求的响应相关的所有基本数据，其中包括返回的数据、状态代码和头信息。
        setNotes(initialNotes)
      })
  }, [])//如果第二个参数是一个空的数组[]，那么效果就只在组件的第一次渲染时运行。

  //当我们进入页面时，应用检查是否已经在本地存储中找到了登录用户的详细资料。
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  //noteFormRef变量充当对组件的引用。此挂钩确保在组件的整个重新渲染过程中保持相同的引用 (ref)。
  const noteFormRef = useRef()

  //

  //用于创建新笔记的addNote函数，接收一个新笔记作为参数
  const addNote = (noteObject) => {
    //创建新笔记后调用noteFormRef.current.toggleVisibility()来隐藏表单
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  //const result = condition ? val1 : val2
  //如果condition为真，result变量将被设置为val1的值。如果condition是假的，result变量将被设置为val2的值。
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
    //JavaScript 中的相等性判断：双等号将执行类型转换; 三等号不进行类型转换

  const toggleImportanceOf = (id) => {
    //ES6中添加的模板字符串语法以更漂亮的方式编写字符串。注意引号不同
    console.log(`importance of ${id} needs to be toggled`)

    const note = notes.find(n => n.id === id)
    //对象传播,创建了一个新的对象，并复制了note对象的所有属性。在传播对象后面添加属性时,会修改到新对象。
    //不推荐直接修改变量note，因为它是对组件状态中notes数组中的一个项目的引用，而我们决不能在React中直接改变状态。
    //还值得注意的是，新对象changedNote只是一个所谓的浅层拷贝，如果旧对象的值本身是对象，那么新对象中的复制值将引用旧对象中的相同对象。
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote  => {
      //仅更新该id的note内容，设置到Notes。
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      //catch方法用来在promise链的末端定义一个处理函数，一旦链中的任何一个promise抛出错误，catch就会被调用，成为拒绝。
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))//该id的笔记会被过滤掉
      })
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      //调用浏览器的localStorage，这个api可以以键值对形式存取数据到本地，保存到存储空间的值是DOMstrings
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      //如果登录成功，服务器响应（包括一个token和用户详细信息）被保存到user字段，并转存token，表单字段被清空
      setUser(user)
      noteService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // 我们也许应该添加一个logout功能，从本地存储中删除登录的细节。然而，我们将把它作为一个练习。
  // 我们可以使用控制台注销用户，目前这已经足够了。
  // window.localStorage.removeItem('loggedNoteappUser')

  //

  //{user === null && loginForm()} 这个技巧被称为 条件渲染
  //在 JavaScript 中，true && expression始终计算为expression，并且false && expression始终计算为false。
  return (
    <div>
      <Notification message={errorMessage} />

      <h1>User</h1>
      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          <p>welcome! {user.name} logged in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm
              createNote = {addNote}
            />
          </Togglable>
        </div>
      }

      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />

      <Display value={counter}/>
      <Button handleClick={increaseByOne} text='plus' />
      <Button handleClick={setToZero} text='zero' />
      <Button handleClick={decreaseByOne} text='minus' />

      <p>{left} {right}</p>
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      <History allClicks={allClicks} />

      <Display value={value}/>
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />

      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            //函数带参数时，如不使用箭头函数传递，相当于传递该函数执行结果，而不是传递函数本身。
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )

}

//不要在其他组件中定义组件。这种方法没有任何好处
//由于React在每次渲染时都将定义在另一个组件内的组件视为一个新的组件。这使得React无法优化该组件

const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age
  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const Display = (props) => {
  return (
    <div><p>{props.value}</p></div>
  )
}
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

export default App