import { PolybaseProvider } from "@polybase/react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/common/Footer';
import Header from './Components/common/Header';
import Home from './Page/Home';
import './css/App.css';
import { createPolybaseObject } from "./utils/polybase";

/**
 * App Component
 * @returns 
 */
function App() {
  return(
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

function Root() {
  // create polybase object
  const polybase = createPolybaseObject();

  return (
    <PolybaseProvider polybase={polybase}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </PolybaseProvider>
  );
}

export default Root;
