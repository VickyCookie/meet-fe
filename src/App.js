import './App.css';
import { SocketProvider } from './context/socketContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home';
import Room from './components/Room';


function App() {



  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/room/:id" element={<Room/>}/>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
