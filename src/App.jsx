import { Routes, Route } from 'react-router-dom'
import UserView from './pages/UserView'
import AmbulanceView from './pages/AmbulanceView'
import HospitalView from './pages/HospitalView'

function App() {
  return (
    <Routes>
      <Route path="/user" element={<UserView />} />
      <Route path="/ambulance" element={<AmbulanceView />} />
      <Route path="/hospital" element={<HospitalView />} />
    </Routes>
  )
}

export default App