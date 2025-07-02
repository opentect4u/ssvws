import React from 'react'
import { Descriptions } from "antd";

function PocInfo({data}) {
    console.log(data)

    const items= [
        {
          key: '1',
          label: 'Name',
          children: <p>{data.info.poc_name}</p>,
        },
        {
          key: '2',
          label: 'Department',
          children: <p>{data.info.poc_department}</p>,
        },
        {
            key: '3',
            label: 'Designation',
            children: <p>{data.info.poc_designation}</p>,
          },
          {
            key: '4',
            label: 'Primary Phone',
            children: <p>{data.info.poc_ph_1}</p>,
          }
          ,
          {
            key: '5',
            label: 'Secondary Phone',
            children: <p>{data.info.poc_ph_2}</p>,
          },
          
          {
            key: '6',
            label: 'Direct No.',
            children: <p>{data.info.poc_direct_no}</p>,
          }
          ,
          
          {
            key: '7',
            label: 'Extention No.',
            children: <p>{data.info.poc_ext_no}</p>,
          }
          ,
          
          {
            key: '7',
            label: 'Email',
            children: <p>{data.info.poc_email}</p>,
          }
      ];
  return (
    <div>
      <Descriptions title="Client Details" className='mx-auto my-6' labelStyle={{color:'#014737'}} items={items} />
    </div>
  )
}

export default PocInfo
