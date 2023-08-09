import { Polybase } from "@polybase/client";
import { ethPersonalSign } from '@polybase/eth';
import { PolybaseProvider } from "@polybase/react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/common/Footer';
import Header from './Components/common/Header';
import Home from './Page/Home';
import './css/App.css';
import { DB_NAME_SPACE } from "./utils/Contents";

const {
  REACT_APP_CONNECT_ADDRESS_PRIVATE_KEY
} = process.env;

// Config of polybase
const polybase = new Polybase({
  defaultNamespace: DB_NAME_SPACE,
});

polybase.signer((data: any) => {
  return {
    h: 'eth-personal-sign',
    sig: ethPersonalSign(`0x${REACT_APP_CONNECT_ADDRESS_PRIVATE_KEY!}`, data)
  }
});

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
  return (
    <PolybaseProvider polybase={polybase}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </PolybaseProvider>
  );
}

export default Root;
