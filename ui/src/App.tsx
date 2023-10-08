import KoinuBaseGoerli from "./providers/KoinuBaseGoerli"

const App = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'>
      <KoinuBaseGoerli />
    </div>
  )
}

export default App