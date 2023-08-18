import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'urql';
import Footer from './Components/common/Footer';
import Header from './Components/common/Header';
import Home from './Page/Home';
import { ContractProvider } from './context/ContractProvider';
import { CurrentAccountProvider } from "./context/CurrentAccountProvider";
import './css/App.css';
import { createGraphQLObject } from "./utils/graphQL";

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
  // create graphQl object
  const client = createGraphQLObject();

  return (
    <CurrentAccountProvider>
      <ContractProvider>
        <Provider value={client}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </Provider>
      </ContractProvider>
    </CurrentAccountProvider>
  );
}

export default Root;
