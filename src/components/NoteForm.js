//在新笔记创建之前，App组件不需要表单的状态来做任何事情。因此我们可以将表单状态移动到相应的组件。

import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  //为了实现对input元素的编辑，必须注册一个事件处理程序，使input元素的变化与组件的状态同步。
  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    //调用event.preventDefault()方法，防止提交表单的默认动作。默认动作会忽略其他操作，导致页面重新加载。
    event.preventDefault()
    //在创建新笔记时调用createNote函数
    createNote({
      content: newNote,
      important: Math.random() > 0.5,
      //省略了id和date属性，让服务器为我们的资源生成
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm