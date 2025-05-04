import DataFetcher from './components/DataFetcher'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tasko</h1>
        <p className="app-subtitle">Simple Task Management</p>
      </header>
      <main>
        <DataFetcher />
      </main>
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Tasko App</p>
      </footer>
    </div>
  )
}

export default App
