import { useState, useContext, useEffect } from "react";
import { DataContext, BoardContext, ModalContext, IsOpenContext, ThemeContext } from "../App";

export default function Header() {
  const { data, setData } = useContext(DataContext);
  const { isOpen, setIsOpen } = useContext(IsOpenContext);
  const { modalContent, setModalContent, isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { currentBoardId, setCurrentBoardId } = useContext(BoardContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { checked, setChecked } = useContext(ThemeContext);


  const [modal, setModal] = useState(false);
  const [currentBoardName, setCurrentBoardName] = useState('');
  const [secreenSize, setScreenSize] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    if (data.boards && data.boards.length > 0) {
      const currentBoard = data.boards.find((board) => board.id === currentBoardId);
      if (currentBoard) {
        setCurrentBoardName(currentBoard.name);
      }
    }
    window.addEventListener("resize", () => setScreenSize(window.innerWidth));
    if (secreenSize < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [currentBoardId, data.boards, secreenSize, setIsMobile]);

  function toggleMenu() {
    setIsOpen(!isOpen);
    setModal(false);
  }

  function toggleModal() {
    setModal(!modal);
    if(isMobile){
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if(window.matchMedia(('(prefers-color-scheme : dark)')).matches) {
      setTheme("dark-mode"); 
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark-mode") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  function toggleTheme() {
    if (theme === "dark-mode") {
      setTheme("");
    } else{
      setTheme("dark-mode");
    }
    setChecked(!checked);
  }

  function openDeleteModal() {
    setModalContent("delete");
    setIsModalOpen(true);
    setModal(!modal)
  }

  return (
    <>
      <header>
        {isMobile ?
          <img className="header-logo" src="\images\logo.svg" alt="logo" />
          :
          <>
            <div className="header-logo">
              <svg width="153" height="26" viewBox="0 0 153 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M44.56 24.224V18.88L46.48 16.768L50.928 24.224H56.368L50.064 13.792L56.4 6.752H50.48L44.56 13.056V0H39.76V24.224H44.56ZM63.92 24.608C66.096 24.608 67.8453 23.936 69.168 22.592V24.224H73.648V12.704C73.648 11.4453 73.3333 10.3413 72.704 9.392C72.0747 8.44267 71.1947 7.70133 70.064 7.168C68.9333 6.63467 67.632 6.368 66.16 6.368C64.304 6.368 62.6773 6.79467 61.28 7.648C59.8827 8.50133 58.928 9.65333 58.416 11.104L62.256 12.928C62.5547 12.16 63.0293 11.5413 63.68 11.072C64.3307 10.6027 65.0827 10.368 65.936 10.368C66.832 10.368 67.5413 10.592 68.064 11.04C68.5867 11.488 68.848 12.0427 68.848 12.704V13.184L64.016 13.952C61.9253 14.2933 60.368 14.944 59.344 15.904C58.32 16.864 57.808 18.08 57.808 19.552C57.808 21.1307 58.3573 22.368 59.456 23.264C60.5547 24.16 62.0427 24.608 63.92 24.608ZM63.376 20.64C63.7813 20.9387 64.2827 21.088 64.88 21.088C66.0747 21.088 67.0347 20.7147 67.76 19.968C68.4853 19.2213 68.848 18.3147 68.848 17.248V16.704L64.88 17.408C64.1973 17.536 63.6747 17.7547 63.312 18.064C62.9493 18.3733 62.768 18.816 62.768 19.392C62.768 19.9253 62.9707 20.3413 63.376 20.64ZM81.968 24.224V14.016C81.968 13.0133 82.2667 12.208 82.864 11.6C83.4613 10.992 84.2293 10.688 85.168 10.688C86.1067 10.688 86.8747 10.992 87.472 11.6C88.0693 12.208 88.368 13.0133 88.368 14.016V24.224H93.168V12.992C93.168 11.6693 92.8907 10.512 92.336 9.52C91.7813 8.528 91.008 7.75467 90.016 7.2C89.024 6.64533 87.8667 6.368 86.544 6.368C85.4347 6.368 84.4533 6.576 83.6 6.992C82.7467 7.408 82.096 8.04267 81.648 8.896V6.752H77.168V24.224H81.968ZM110.704 23.392C109.36 24.2027 107.835 24.608 106.128 24.608C105.061 24.608 104.064 24.432 103.136 24.08C102.208 23.728 101.435 23.2213 100.816 22.56V24.224H96.336V0H101.136V8.224C102.373 6.98667 104.048 6.368 106.16 6.368C107.824 6.368 109.328 6.77333 110.672 7.584C112.016 8.39467 113.083 9.488 113.872 10.864C114.661 12.24 115.056 13.7813 115.056 15.488C115.056 17.1733 114.667 18.7093 113.888 20.096C113.109 21.4827 112.048 22.5813 110.704 23.392ZM105.552 20.288C104.251 20.288 103.189 19.8453 102.368 18.96C101.547 18.0747 101.136 16.9173 101.136 15.488C101.136 14.08 101.547 12.928 102.368 12.032C103.189 11.136 104.251 10.688 105.552 10.688C106.875 10.688 107.963 11.1413 108.816 12.048C109.669 12.9547 110.096 14.1013 110.096 15.488C110.096 16.896 109.669 18.048 108.816 18.944C107.963 19.84 106.875 20.288 105.552 20.288ZM128.528 22.592C127.205 23.936 125.456 24.608 123.28 24.608C121.403 24.608 119.915 24.16 118.816 23.264C117.717 22.368 117.168 21.1307 117.168 19.552C117.168 18.08 117.68 16.864 118.704 15.904C119.728 14.944 121.285 14.2933 123.376 13.952L128.208 13.184V12.704C128.208 12.0427 127.947 11.488 127.424 11.04C126.901 10.592 126.192 10.368 125.296 10.368C124.443 10.368 123.691 10.6027 123.04 11.072C122.389 11.5413 121.915 12.16 121.616 12.928L117.776 11.104C118.288 9.65333 119.243 8.50133 120.64 7.648C122.037 6.79467 123.664 6.368 125.52 6.368C126.992 6.368 128.293 6.63467 129.424 7.168C130.555 7.70133 131.435 8.44267 132.064 9.392C132.693 10.3413 133.008 11.4453 133.008 12.704V24.224H128.528V22.592ZM124.24 21.088C123.643 21.088 123.141 20.9387 122.736 20.64C122.331 20.3413 122.128 19.9253 122.128 19.392C122.128 18.816 122.309 18.3733 122.672 18.064C123.035 17.7547 123.557 17.536 124.24 17.408L128.208 16.704V17.248C128.208 18.3147 127.845 19.2213 127.12 19.968C126.395 20.7147 125.435 21.088 124.24 21.088ZM141.328 14.016V24.224H136.528V6.752H141.008V8.896C141.456 8.04267 142.107 7.408 142.96 6.992C143.813 6.576 144.795 6.368 145.904 6.368C147.227 6.368 148.384 6.64533 149.376 7.2C150.368 7.75467 151.141 8.528 151.696 9.52C152.251 10.512 152.528 11.6693 152.528 12.992V24.224H147.728V14.016C147.728 13.0133 147.429 12.208 146.832 11.6C146.235 10.992 145.467 10.688 144.528 10.688C143.589 10.688 142.821 10.992 142.224 11.6C141.627 12.208 141.328 13.0133 141.328 14.016Z" fill="#000112" />
                <rect y="0.224121" width="6" height="25" rx="2" fill="#635FC7" />
                <rect opacity="0.75" x="9" y="0.224121" width="6" height="25" rx="2" fill="#635FC7" />
                <rect opacity="0.5" x="18" y="0.224121" width="6" height="25" rx="2" fill="#635FC7" />
              </svg>
              <hr />
            </div>
          </>
        }

        <button className="toggle-menu-btn" onClick={isMobile ? toggleMenu : null}>
          <span>{currentBoardName}</span>
          {
            isMobile &&
            <img className= {`menu-arrow-up ${isOpen ? 'active' : ''}`} src="\images\arrow-down.svg" alt="" />
          }

        </button>
        <div className="header-btn-right">
          {
            isMobile ? <button onClick={() => { setModalContent("add"); setIsModalOpen(true); setModal(false) }} className="plus-btn"><img src="\images\+.svg" alt="" /></button>
              :
              <button className="plus-btn" onClick={() => { setModalContent("add"); setIsModalOpen(true); setModal(false) }}> + Add New Task</button>
          }
          <div className="modal-container">
            <button className="dot-btn" onClick={toggleModal}>
              <img src="\images\three-dot.svg" alt="" />
            </button>
            {modal ? (
              <div className="three-dot-modal">
                <button onClick={() => {setIsModalOpen(true); setModalContent('editBoard')}}>Edit Board</button>
                <button onClick={openDeleteModal}>Delete Board</button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isOpen ? (
        <div className={isMobile ? "boards-menu-container" : "boards-menu-container-tablet"}>
          <div className={`boards-menu ${isOpen ? 'open-side' : ''}`}>
            <h2>All Boards ({data.boards.length})</h2>
            <div className="boards">
              {data.boards.map(board => (
                <button key={board.id} className={currentBoardId === board.id ? 'active' : ''} onClick={() => {
                  setCurrentBoardId(board.id);
                  if (isMobile) {
                    setIsOpen(false);
                  }
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z" fill="white" />
                  </svg>
                  {board.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setModalContent("addBoard");
                setIsModalOpen(true);
                if (isMobile) {
                  setIsOpen(false);
                }
              }}
            >

              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z" fill="white" />
              </svg> + Create New Board
            </button>
            <div className="theme-container">
              <label className="theme-switch">
                <img src="\images\light-theme.svg" alt="" />
                <input id="modeSwitchBtn" className="switch" type="checkbox" checked={checked} onChange={toggleTheme} />
                <img src="\images\dark-theme.svg" alt="" />
              </label>
            </div>
            {
              !isMobile &&
              <button className="sidebar-off-btn" onClick={() => setIsOpen(!isOpen)} >
                <svg width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.7923 8.76153C16.7538 10.5238 15.1854 11.941 13.3062 12.8081L14.8099 14.9563C14.9286 15.1259 14.8874 15.3598 14.7177 15.4785L14.0697 15.9322C13.9 16.051 13.6662 16.0097 13.5474 15.84L3.19013 1.04373C3.07135 0.874074 3.11263 0.64023 3.28229 0.521481L3.93032 0.067825C4.09998 -0.050956 4.33382 -0.00967486 4.45257 0.159981L6.18775 2.63888C7.08163 2.38573 8.02525 2.25001 9 2.25001C12.7456 2.25001 16.0311 4.24982 17.7923 7.23847C18.0692 7.7084 18.0692 8.2916 17.7923 8.76153ZM1.50001 8C2.99714 10.5406 5.79513 12.25 9 12.25C9.07946 12.2499 9.15892 12.2487 9.23834 12.2465L10.239 13.676C9.82784 13.7253 9.4141 13.75 9 13.75C5.25438 13.75 1.96889 11.7502 0.207702 8.76156C-0.069234 8.29163 -0.069234 7.7084 0.207702 7.23847C0.997544 5.89816 2.09379 4.75732 3.4001 3.90623L4.26076 5.13569C3.12813 5.86432 2.17986 6.84635 1.50001 8ZM8.52194 11.2231C6.00685 10.9415 4.26532 8.50791 4.86788 6.00303L8.52194 11.2231ZM9.74494 3.78104C12.6351 4.02282 15.1201 5.65835 16.5 8C15.5721 9.57456 14.1446 10.8297 12.4302 11.5566L11.596 10.3649C13.2731 9.06931 13.7072 6.7886 12.75 4.99869L12.75 5C12.75 5.9665 11.9665 6.75 11 6.75C10.0335 6.75 9.25 5.9665 9.25 5C9.25 4.52594 9.43881 4.09619 9.74494 3.78104Z" fill="#828FA3" />
                </svg>
                Hide sidebar
              </button>

            }
          </div>
        </div>
      ) : null}

      {
        !isMobile &&
        <button className="sidebar-btn" onClick={toggleMenu}><img src="\images\eye.svg" alt="" /></button>
      }
    </>
  );
}
