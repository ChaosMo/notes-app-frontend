//创建一个Footer组件并为其定义以下内联样式，为我们的应用添加一个 "底层块"。
//由于将CSS、HTML和JavaScript分离到不同的文件中，在大型应用中似乎不能很好地扩展，React将应用的划分建立在其逻辑功能实体的基础上。
//一个React组件定义了构造内容的HTML，决定功能的JavaScript函数，以及组件的CSS样式；所有这些都在一个地方。这是为了创建尽可能独立和可重复使用的单个组件。
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

export default Footer