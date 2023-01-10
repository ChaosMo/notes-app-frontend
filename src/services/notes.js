//将通信提取到各自的模块
import axios from 'axios'
//由于我们的前端和后端都在同一个地址，我们可以将baseUrl声明为相对URL。这意味着我们可以省略声明服务器的部分。
const baseUrl = '/api/notes'

//一个私有变量token。它的值可以通过模块导出的函数setToken来改变。const的区别在于const完全不能更新，let可以更新。
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  //将token设置为Authorization头。这个头被作为post方法的第三个参数交给axios。
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  //可以用HTTP PUT请求来替换整个笔记，或者用HTTP PATCH请求只改变笔记的某些属性。
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// 当键的名字和分配的变量是一样的，在ES6我们可以用更紧凑的语法来写对象定义。
// {
//   getAll: getAll,
//   create: create,
//   update: update
// }

//返回一个对象，该对象有三个函数（getAll、create和update）作为其属性，函数直接返回axios方法所返回的承诺
const r = { getAll, create, update, setToken }

export default r