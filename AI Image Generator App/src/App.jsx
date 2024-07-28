import { useState } from 'react'
import './App.css'
import ImageGenerator from './components/imageGenerator/ImageGenerator'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
      <ImageGenerator/>
   </div>
  )
}

export default App
