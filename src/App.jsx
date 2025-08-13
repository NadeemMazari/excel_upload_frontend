import './App.css'
import ExcelTable from './components/ExcelTable'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
     <ToastContainer
        position="top-right" // where it will appear
        autoClose={3000} // closes after 3s
        hideProgressBar={false} // progress bar visible
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // 'light' | 'dark' | 'colored'
      />
     <ExcelTable />
    </>
  )
}

export default App
