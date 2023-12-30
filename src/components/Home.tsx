import { FC, useEffect, useState } from "react"
import Create from "./Create"
import { Todo } from "../interfaces"
import axios from "axios"
import { MdDelete, MdEdit } from "react-icons/md"
import { FaCheckCircle, FaSave, FaRegCircle } from "react-icons/fa"

const Home: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editMode, setEditMode] = useState<number | null>(null)
  const [editedValues, setEditedValues] = useState<Partial<Todo>>({})
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/todos")
        setTodos(res.data)
      } catch (err) {
        console.log("Error fetching todos:", err)
      }
    }

    fetchData()
  }, [])

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  const handleCompletedTodo = async (id: number) => {
    try {
      const todoToComplete = todos.find((todo) => todo.id === id)
      if (todoToComplete) {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
        setTodos(updatedTodos)
        await axios.put(`http://localhost:3001/todos/${id}`, {
          ...todoToComplete,
          completed: !todoToComplete.completed, // Toggle the completion status
        })
      }
    } catch (err) {
      console.log("Error completing todo:", err)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id)
      setTodos(updatedTodos)

      await axios.delete(`http://localhost:3001/todos/${id}`)
    } catch (err) {
      console.log("Error deleting todo:", err)
    }
  }

  const handleEditTodo = (id: number) => {
    setEditMode(id)
    const todoToComplete = todos.find((todo) => todo.id === id)
    setEditedValues({
      name: todoToComplete?.name,
      description: todoToComplete?.description,
    })
  }

  const handleSaveTodo = async (id: number) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, ...editedValues } : todo
      )
      setTodos(updatedTodos)
      await axios.put(`http://localhost:3001/todos/${id}`, editedValues)
      setEditMode(null)
      setEditedValues({})
    } catch (err) {
      console.log("Error saving todo:", err)
    }
  }

  const handleInputChange = (field: keyof Todo, value: string) => {
    setEditedValues((prevValues) => ({ ...prevValues, [field]: value }))
  }

  const filterTodos = todos.filter((todo) => {
    return (
      todo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="home">
      <div className="header">
        <h2>T O - D O</h2>
      </div>
      <div className="body">
        <div className="search-container">
          <div className="input-container">
            <label htmlFor="search">Search TODO</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Create onTodoAdded={handleTodoAdded} />
        <div className="todos-outbox">
          {filterTodos.length === 0 ? (
            <div>Yay! Nothing TODO.</div>
          ) : (
            <div className="todos-container">
              {filterTodos.map((todo, ind) => (
                <div className="todo-container" key={todo.id}>
                  <div className="left">
                    <div className="index">{ind + 1}</div>
                    <div className="center">
                      <p>
                        {editMode === todo.id ? (
                          <input
                            type="text"
                            value={editedValues.name ?? todo.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        ) : (
                          todo.name
                        )}
                      </p>
                      <p>
                        {editMode === todo.id ? (
                          <input
                            type="text"
                            value={editedValues.description ?? todo.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                          />
                        ) : (
                          todo.description
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="right">
                    {editMode === todo.id ? (
                      <FaSave onClick={() => handleSaveTodo(todo.id)} />
                    ) : (
                      <>
                        {todo.completed ? (
                          <FaCheckCircle
                            onClick={() => handleCompletedTodo(todo.id)}
                          />
                        ) : (
                          <FaRegCircle
                            onClick={() => handleCompletedTodo(todo.id)}
                          />
                        )}
                        <MdDelete onClick={() => handleDeleteTodo(todo.id)} />
                        <MdEdit onClick={() => handleEditTodo(todo.id)} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footer">
        Made with &lt;3 by <a href="https://github.com/hg8116/">HG8116</a>
      </div>
    </div>
  )
}

export default Home
