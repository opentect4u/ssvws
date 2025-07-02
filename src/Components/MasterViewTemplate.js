import React, { useEffect, useState } from 'react'
import DTableMaster from './DTableMaster'
import { url } from '../Address/BaseUrl'
import axios from 'axios'
import { Search } from '../Functions/Search'
import { Message } from './Message'
import SkeletonLoading from './SkeletonLoading'
import { useNavigate } from 'react-router-dom'
function MasterViewTemplate({templateData,template,_url,to}) {
 const [dataSet,setDataSet] = useState()
 const [dataSet1,setDataSet1] = useState()
 const [searchParam,setParam] = useState()
 const [loading,setLoading] = useState(false)
 const navigate=useNavigate()
 useEffect(()=>{
    setLoading(true)
    axios.post(url+_url,{id:0})
    .then(res=>{
      console.log(res);
        setLoading(false)

      if(res.data.msg.length<=0 || !Array.isArray(res.data.msg)){
        Message('error','No data')
      }
      else{
      setDataSet(res.data.msg);
      setDataSet1(res.data.msg)
      }
    }).catch(err=>{console.log(err); navigate('/error'+'/'+err.code+'/'+err.message)});
 
},[templateData])

useEffect(()=>{
    setDataSet(Search(template,searchParam,dataSet1))
},[searchParam])
  return (
    <div>
    {!loading ? <DTableMaster headers={templateData.headers} title={templateData.title} btnText={templateData.btnText} data={dataSet} to={to} setSearch={(w)=>setParam(w)} />: <SkeletonLoading className="mt-10" flag={1}/> }
    </div>
  )
}

export default MasterViewTemplate
