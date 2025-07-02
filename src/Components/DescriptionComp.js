import React from 'react'
import { Descriptions } from 'antd';
function DescriptionComp({printData,title}) {
    console.log(printData)
   

  return (
    <div className='mt-5'>
      <Descriptions title={title} items={printData} />
    </div>
  )
}

export default DescriptionComp
