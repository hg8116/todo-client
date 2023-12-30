import { FC, FormEvent, useState } from "react"
import axios from "axios"
import { Todo } from "../interfaces"

const Create: FC<{ onTodoAdded: (newTodo: Todo) => void }> = ({
  onTodoAdded,
}) => {
  const [todo, setTodo] = useState({
    name: "",
    description: "",
    completed: false,
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3001/todos", todo)
      console.log("Todo added:", res.data)

      // Call the onTodoAdded prop to update the state in the Home component
      onTodoAdded(res.data)

      // Reset the form
      setTodo({
        name: "",
        description: "",
        completed: false,
      })
    } catch (err) {
      console.log("Error", err)
    }
  }

  return (
    <div className="create-container">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="input-container">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={todo.name}
            onChange={(e) => setTodo({ ...todo, name: e.target.value })}
          />
        </div>
        <div className="input-container">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={todo.description}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
        </div>
        <button type="submit" className="submit-btn">
          Add
        </button>
      </form>
    </div>
  )
}

export default Create
