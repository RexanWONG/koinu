import KoinuBaseGoerliProvider from '@/providers/KoinuBaseGoerliProvider'
import React from 'react'

const Koinu = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black'>
      <KoinuBaseGoerliProvider />
    </div>
  )
}

export default Koinu