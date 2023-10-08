import Box from '../components/Box'
import Title from '../components/Title'

const KoinuBaseGoerli = () => {
  return (
    <Box>
      <div className="absolute left-0 top-0 bottom-0 w-1/3 flex flex-col items-start justify-start p-6">
        <Title />
      </div>
      
      <div className="absolute top-0 bottom-0 w-px border border-gray-700 left-1/3"></div>
    </Box>
  )
}

export default KoinuBaseGoerli