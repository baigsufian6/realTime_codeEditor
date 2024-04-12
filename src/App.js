
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.js';
import EditorPages from './Pages/EditorPages.js';
import {Toaster} from 'react-hot-toast'



function App() {
  return (
    <>

    <div>
      <Toaster position='top-right' toastOptions={{
        success:{
          theme:{
            primary: 'rgb(242 200 25)'
          }
        }
      }}></Toaster>
    </div>
    
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/editor/:roomID' element={<EditorPages/>}/>
    </Routes>
    
    </BrowserRouter>
    
    </>
  );
}

export default App;
