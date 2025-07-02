import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
function Noresult() {
    const params=useParams()
    const navigate = useNavigate();

  return (
    <div>
    <Result
    status="500"
    title={params.code}
    subTitle={'Sorry, '+params.msg}
    extra={<Button className='bg-blue-900 text-white' onClick={()=> navigate(-1)} >Back</Button>}
  />
    </div>
  )
}

export default Noresult
