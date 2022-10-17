import { useState } from 'react'
import './App.css'

function App() {
  const [history, setHistory] = useState([])

  return (
    <div className="App">
      <h1>Non-Persistent Chat</h1>
      {history.map((msg) => {
        return (<p>msg</p>)
      })}
    </div>
  )
}

export default App
