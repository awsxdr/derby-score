import { HotkeysProvider } from '@blueprintjs/core';
import './App.css';
import { DarkThemeContextProvider } from './contexts/DarkThemeContext';
import { Routes } from './Routes';

function App() {


  return (
    <div className="App">
      <DarkThemeContextProvider>
        <HotkeysProvider>
          <Routes />
        </HotkeysProvider>
      </DarkThemeContextProvider>
    </div>
  );
}

export default App;
