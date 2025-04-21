import DataFetcher from './components/DataFetcher'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
      </header>
      <main>
        <DataFetcher />
      </main>
    </div>
  )
}

export default App
