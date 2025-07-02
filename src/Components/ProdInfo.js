import React from 'react'
import { Descriptions } from "antd";
function ProdInfo({data}) {
    console.log(data)

    const items= [
        {
          key: '1',
          label: 'Name',
          children: <p>{data.info.prod_name}</p>,
        },
        {
          key: '2',
          label: 'Make',
          children: <p>{data.info.prod_make}</p>,
        },
        {
            key: '3',
            label: 'Description',
            children: <p>{data.info.prod_desc}</p>,
          },
          {
            key: '4',
            label: 'Category',
            children: <p>{data.info.catg_name}</p>,
          }
          ,
          {
            key: '5',
            label: 'HSN',
            children: <p>{data.info.hsn_code}</p>,
          },
          
          {
            key: '6',
            label: 'Article No.',
            children: <p>{data.info.article_no}</p>,
          }
          ,
          
          {
            key: '7',
            label: 'Part No.',
            children: <p>{data.info.part_no}</p>,
          }
          ,
          
          {
            key: '7',
            label: 'Model No.',
            children: <p>{data.info.model_no}</p>,
          }
      ];
  return (
    <div>
      <Descriptions title="Item Details" className='mx-auto my-6' labelStyle={{color:'#014737',fontWeight:'bold'}} items={items} />
    </div>
  )

}

export default ProdInfo
