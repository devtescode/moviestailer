
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Userdb from './components/UserDb/Userdb'
import Moviedetails from './components/Moviedetails/Moviedetails'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Userdb/>}/>
      <Route path="/movie/:id" element={<Moviedetails/>}/>
    </Routes>
    </>
  )
}

export default App
