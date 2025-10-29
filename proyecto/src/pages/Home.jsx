import React from 'react'
import ImagenFondo from '../components/layout/ImageFondo'
import Header from '../components/layout/header'
import CategoryCarousel from '../components/domain/CategoryCarousel'

function Home() {
  return (
    <div>
        <Header/>
        <ImagenFondo/>
        <CategoryCarousel/>
    </div>
  )
}

export default Home