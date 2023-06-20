import './App.css'
import AuthLogin from './components/AuthLogin';
import Editor from './components/Editor';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`} />} />
        {/* <Route path='/' element={<AuthLogin />} /> */}
        <Route path='/docs/:id' element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App;
