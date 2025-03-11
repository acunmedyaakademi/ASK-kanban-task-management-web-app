import { createContext, useEffect, useState } from 'react'
import './App.css'
import Container from './components/Container'
import Header from './components/Header'
import AddNewTask from './components/AddNewTask';
import Login from './components/login';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://bhfctmyzzbrdigrrmmtp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmN0bXl6emJyZGlncnJtbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTk1MjIsImV4cCI6MjA1NjM5NTUyMn0.VH1E91hLCrrBL0F1K7ONIVfpS6RBkZp8TlZg5Bq79kk')

export const DataContext = createContext(null);
export const BoardContext = createContext(null);
export const ModalContext = createContext(null);
export const IsOpenContext = createContext(null);
export const ThemeContext = createContext(null);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(0);
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [checked, setChecked] = useState(false);

  // Uygulama açıldığında mevcut oturumu kontrol et
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, []);

  function handleLogin(session) {
    setIsLoggedIn(true);
  }
  

  // Verileri çek
  useEffect(() => {
    async function getData() {
      const data = await fetch('/data/data.json').then((r) => r.json());
      setData(data);
    }
    getData();
  }, []);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <BoardContext.Provider value={{ currentBoardId, setCurrentBoardId }}>
        <ModalContext.Provider value={{ modalContent, setModalContent, isModalOpen, setIsModalOpen }}>
          <IsOpenContext.Provider value={{ isOpen, setIsOpen }}>
            <ThemeContext.Provider value={{ theme, setTheme, checked, setChecked }}>
              {isLoggedIn ? (
                <>
                  <Header setIsLoggedIn={setIsLoggedIn} />
                  <Container />
                </>
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </ThemeContext.Provider>
          </IsOpenContext.Provider>
        </ModalContext.Provider>
      </BoardContext.Provider>
    </DataContext.Provider>
  );
}