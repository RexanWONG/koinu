import KoinuBaseGoerli from "./providers/KoinuBaseGoerli"

const App = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black'>
      <KoinuBaseGoerli />
    </div>
  )
}

export default App