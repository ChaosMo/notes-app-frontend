//在较小的应用中，组件通常被放在一个叫做components的目录中，而这个目录又被放在src目录中。惯例是用组件的名字来命名文件。
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note