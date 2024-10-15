

'use client'
import { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"

export default function Home() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState({
    todo_title: "",
    todo_description: "",
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://node-js-server-two.vercel.app/api/todo"
      )
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error("Error fetching todos:", error)
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (todo.todo_title.trim() === "" || todo.todo_description.trim() === "") {
      return
    }

    try {
      const response = await fetch(
        "https://node-js-server-two.vercel.app/api/todo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      )

      if (response.ok) {
        const newTodo = await response.json()
        setTodos([...todos, newTodo])
        setTodo({ todo_title: "", todo_description: "" })
      }
    } catch (error) {
      console.error("Error adding todo:", error)
    }
  }

  const handleUpdateTodo = async (e) => {
    e.preventDefault()
    if (!editId) return

    try {
      const response = await fetch(
        `https://node-js-server-two.vercel.app/api/todo/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      )

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((t) => (t.id === editId ? updatedTodo : t)))
        setTodo({ todo_title: "", todo_description: "" })
        setEditId(null)
      }
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(
        `https://node-js-server-two.vercel.app/api/todo/${id}`,
        {
          method: "DELETE",
        }
      )

      if (response.ok) {
        setTodos(todos.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const handleChange = (e) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value,
    })
  }

  const handleEdit = (todo) => {
    setEditId(todo.id)
    setTodo({
      todo_title: todo.todo_title,
      todo_description: todo.todo_description,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">To-Do List</h1>

        <form onSubmit={editId ? handleUpdateTodo : handleAddTodo} className="flex flex-col space-y-4">
          <input
            type="text"
            name="todo_title"
            value={todo.todo_title}
            onChange={handleChange}
            placeholder="Enter To-Do Title"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="todo_description"
            value={todo.todo_description}
            onChange={handleChange}
            placeholder="Enter To-Do Description"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`${
              editId ? "bg-yellow-400" : "bg-blue-500"
            } text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition`}
          >
            {editId !== null ? "Update To-Do" : "Add To-Do"}
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {todos.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <div>
                <span className="text-lg font-semibold text-gray-800">
                  {item.todo_title}
                </span>
                <p className="text-sm text-gray-600">
                  {item.todo_description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTodo(item.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
