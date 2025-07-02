import React from 'react'
import { Carousel } from 'antd';

const Slider=({imgFlag}) =>{
  // const flag = imgFlag
  console.log(imgFlag)
  return (

  <Carousel autoplay>
    <div>
        <img className='h-60 w-full' src="https://slidebazaar.com/wp-content/uploads/2021/09/product-banner-jpg.webp"/>
    </div>
    <div >
      {/* <h3 style={contentStyle}> */}
        <img className='h-60 w-full' src="https://img.freepik.com/free-psd/summer-special-fashion-sale-web-banner-template_120329-1506.jpg"/>
      {/* // </h3> */}
    </div>
    <div>
      {/* <h3 style={contentStyle}> */}
        <img className='h-60 w-full' src='https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-E-commerce-Product-Banner-Design-with-Green-Colors-scaled.jpg'/>
      {/* </h3> */}
    </div>
    <div>
      {/* <h3 style={contentStyle}> */}
        <img className='h-60 w-full' src='https://t4.ftcdn.net/jpg/04/89/28/05/360_F_489280525_nISHfaWCctYBFlyYkTQUkzQwVOPWmyvp.jpg'/>
      {/* </h3> */}
    </div>
  </Carousel>

  
  )
}

export default Slider
