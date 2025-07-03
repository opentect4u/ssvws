import React, { useEffect, useState } from "react";
import IMG from "../../Assets/Images/Logo.png";
import Divider from '@mui/material/Divider';
import { Spin } from "antd";
import {
    LoadingOutlined,
  } from "@ant-design/icons";
import { PrinterOutlined } from '@ant-design/icons';
import Fab from '@mui/material/Fab';
import axios from "axios";
import { url } from "../../Address/BaseUrl";
function PoPreview({ data }) {
 var tot=0
 const [loading,setLoading]=useState(false)
 const [v_name,setVName]=useState('')
 const [v_address,setVAddress]=useState('')
 const [v_email,setVEmail]=useState('')
 const [v_phone,setVPhone]=useState('')
 const [v_gst,setVGST]=useState('')
 const [v_pan,setVPAN]=useState('')
 const [prodInfo,setProdInfo]=useState()
 const [grandTot,setGrandTot]=useState(0)
 const [po_no,setPoNo]=useState('')
 const [totVal,setTotVal]=useState(0)
  useEffect(()=>{
    
    axios.post(url+'/api/getvendor',{id:+localStorage.getItem('vendor_name')}).then(res=>{
        setLoading(true)
        console.log(res)
        setVName(res?.data?.msg?.vendor_name)
        setVAddress(res?.data?.msg?.vendor_address)
        setVEmail(res?.data?.msg?.vendor_email)
        setVPhone(res?.data?.msg?.vendor_phone)
        setVGST(res?.data?.msg?.vendor_gst)
        setVPAN(res?.data?.msg?.vendor_pan)
        axios.post(url+'/api/getpreviewitems',{id:+localStorage.getItem('id')}).then(resItems=>{
            console.log(resItems)
            tot=0
            setProdInfo(resItems?.data?.msg)
            console.log(prodInfo)
            for(let item of resItems?.data?.msg){
                if(item.sgst_id){
                  tot+=((item.item_rt-item.discount)*item.quantity*item.cgst_id/100)+(item.item_rt-item.discount)*item.quantity*(item.sgst_id/100)+((item.item_rt-item.discount)*item.quantity)
                }
                else{
                   tot+=((item.item_rt-item.discount)*item.quantity*item.igst_id/100)+((item.item_rt-item.discount)*item.quantity)
                }
            }
            console.log(tot)

            setGrandTot(tot.toFixed(2))
            tot=0
            // "prod_name": "Prod_2",
            // "prod_make": "Make_2",
            // "catg_name": "Misc",
            // "part_no": "Part_2",
            // "model_no": "Model_2",
            // "article_no": "Ar_2",
            // "hsn_code": "444445",
            // "prod_desc": "Desc",
            // "quantity": 10,
            // "item_rt": 7.0,
            // "discount": 4.0,
            // "unit_name": "Gm"
            
            // setLoading(true)
            // console.log(res)
            // setVName(res?.data?.msg?.vendor_name)
            // setVAddress(res?.data?.msg?.vendor_address)
            // setVEmail(res?.data?.msg?.vendor_email)
            // setVPhone(res?.data?.msg?.vendor_phone)
            // setVGST(res?.data?.msg?.vendor_gst)
            // setVPAN(res?.data?.msg?.vendor_pan)
            // setLoading(false)
            axios.post(url+'/api/getpo',{id:localStorage.getItem('id')}).then(res=>{
                console.log(res)
                setPoNo(res?.data?.msg?.po_no)
            setLoading(false)

            })
        
        })
    })
    
  
  },[])
  function print() {

    var divToPrint = document.getElementById('divtoprint');
  
    var WindowObject = window.open('', 'Print-Window');
    WindowObject.document.open();
    WindowObject.document.writeln('<!DOCTYPE html>');
    WindowObject.document.writeln('<html><head><title></title>');
    WindowObject.document.writeln('<style type="text/css">');
    WindowObject.document.writeln('<link rel="preconnect" href="https://fonts.googleapis.com">')
    WindowObject.document.writeln('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    WindowObject.document.writeln('<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">')
    WindowObject.document.writeln('@media print {body {-webkit-print-color-adjust: exact; overflow: hidden;}  {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}} </style>');
        // WindowObject.document.writeln('@media print { .center { text-align: center;}' +
        //     '                                         .inline { display: inline; }' +
        //     '                                         .underline { text-decoration: underline; }' +
        //     '                                         .left { margin-left: 315px;} ' +
        //     '                                         .right { margin-right: 375px; display: inline; }' +
        //     '                                          table { border-collapse: collapse; font-size: 10px;}' +
        //     '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
        //     '                                           th, td { }' +
        //     '                                         .border { border: 1px solid black; } ' +
        //     '                                         .bottom { bottom: 5px; width: 100%; position: fixed ' +
        //     '                                       ' +
        //     '                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>');
        // WindowObject.document.writeln('@media print{body {font-family: "Lora", serif;font-optical-sizing: auto font-weight: <weight>;font-style: normal;}}')
    WindowObject.document.writeln('<script src="https://cdn.tailwindcss.com"></scr'+'ipt>')
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln(divToPrint.innerHTML);
    WindowObject.document.writeln('</body></html>');
    WindowObject.document.close();
    // setTimeout(function () {
    //     WindowObject.close();
    // }, 10);
  
  }
  return (
    <div className="h-full border-2 p-3 border-blue-300">
     <div className="flex gap-5 justify-end sticky top-4 z-10">
     {localStorage.getItem('po_status')=='A' &&
     <Fab color="primary" size="small" aria-label="add" onClick={()=>print()}>
        <PrinterOutlined />
      </Fab>}
     </div>
      
         <Spin
    indicator={<LoadingOutlined spin />}
    size="large"
    className="text-green-900 dark:text-gray-400"
    spinning={loading}
  >
      <div id='divtoprint'> 

      <div className="flex justify-center items-center">
        <span className="text-xl text-blue-500 font-extrabold  my-3 uppercase">
          Purchase Order
        </span>
      </div>
      <p className="grid grid-cols-6 gap-32 items-center mb-2 px-4">
      <div className="col-span-3 flex text-xs gap-2 text-black ">
          <span className="uppercase font-extrabold">PO No.:  {po_no?po_no:''}</span>
          <span className="uppercase font-extrabold">PO Date:  {localStorage.getItem('po_issue_date')}</span>
         {po_no?.indexOf('-')!=-1 && <span className="uppercase font-extrabold">Amendement No:{po_no?.split('-')[1]}</span>}
          {/* <span className="uppercase font-extrabold">Amendment Date:</span> */}
          <span className="uppercase font-extrabold">Value:  {grandTot}</span>
          {/* <span className="uppercase font-extrabold">Status No:  {localStorage.getItem('po_status')=='P'?'In Progress':localStorage.getItem('po_status')=='U'?'Unapproved':localStorage.getItem('po_status')=='A'?'Approved':localStorage.getItem('po_status')=='D'?'Delivered':'Partial Delivery'}</span> */}
        </div>
        <div className="col-span-3 ">
          <img src={IMG} className="sm:h-16 h-12" alt="Flowbite Logo" />
          <span className="my-5 mx-3 mb-5 text-xs">
           <p>Unit - 102, 1st Floor, PS PACE 1/1A,</p> <p> Mahendra Roy Lane Kolkata
           700046 </p>
          <p> Ph-033 4068 6032/6450 0535</p> 
          <p> Email: info@ngapl.com</p> 
          </span>
        </div>
       
      </p>
      <Divider/>
  
  <div className="grid grid-cols-2 gap-2">
 
  <div className="col-span-2">
  <div className="my-5 w-full p-2 text-black font-semibold border-2 border-blue-400 bg-blue-400 rounded-lg">
          Vendor Details
      </div>
      <div className="flex flex-col text-xs gap-1 text-black px-2 py-1">
          <span className="uppercase font-extrabold gap-4">Name:  {v_name}</span>
          <span className="uppercase font-extrabold">Address:  {v_address}</span>
          <span className="uppercase font-extrabold">Email:  {v_email}</span>
          <span className="uppercase font-extrabold">Phone:  {v_phone}</span>
          <span className="uppercase font-extrabold">GST:  {v_gst}</span>
          <span className="uppercase font-extrabold">PAN:  {v_pan}</span>
        </div>

  </div>

  </div>
  <Divider/>

  <div className="grid grid-cols-2 gap-2 my-6">
  <div className="col-span-1 border-2 border-blue-300 rounded-lg p-2">
  <div className="w-full p-2  text-black font-semibold bg-blue-400  border-2 border-blue-400 rounded-lg">
          Bill To
      </div>
     <p className="text-sm p-2"> Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata
      700046</p> <p className="text-sm p-2"> Ph-033 4068 6032/6450 0535</p> <p className="text-sm p-2"> Email: info@ngapl.com
 </p> 
  </div>
  <div className="col-span-1 border-2 border-blue-300 rounded-lg p-2">
  <div className="w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Ship To
      </div>
      <p className="text-sm p-2">   {localStorage.getItem('ship_to')} </p>

  </div>

  </div>
  <Divider/>

      <p className="mb-5">
      <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Item Description

          </div>

<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
        <thead  className="text-xs text-nowrap font-bold text-blue-500 captalize bg-white dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-1 py-3">
                    Item-Description
                </th>
                <th scope="col" className="px-1 py-3">
                    Quantity
                </th>
                <th scope="col" className="px-1 py-3">
                    Rate
                </th>
                <th scope="col" className="px-1 py-3">
                    Discount
                </th>
                <th scope="col" className="px-1 py-3">
                   CGST
                </th>
                <th scope="col" className="px-1 py-3">
                   SGST
                </th>
                <th scope="col" className="px-1 py-3">
                   IGST
                </th>
                <th scope="col" className="px-1 py-3">
                   Total GST
                </th>
                <th scope="col" className="px-1 py-3">
                    Unit Price
                </th>
                <th scope="col" className="px-1 py-3">
                    Total
                </th>
            </tr>
        </thead>
        <tbody>
         {prodInfo?.length>0 && prodInfo?.map(item=>
         <>
         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-1 py-1 flex flex-col gap-1 text-nowrap text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.prod_name}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.quantity}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                {item.item_rt}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.discount}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.cgst_id}% {item.cgst_id>0?':'+((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.cgst_id/100)).toFixed(2):''}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.sgst_id}%  {item.sgst_id>0?':'+(((+item.item_rt)-(+item.discount))*(+item.quantity)*(+item.sgst_id/100)).toFixed(2):''}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.igst_id}%  {+item.igst_id>0?':'+((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.igst_id/100)+((item.item_rt-item.discount)*item.quantity)).toFixed(2):''}
                </td>

                <td className="px-1 py-1 text-xs " rowSpan={2}>
                
                {item.sgst_id>0?(((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.cgst_id/100))+((+item.item_rt)-(+item.discount))*(+item.quantity)*(+item.sgst_id/100)).toFixed(2):((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.igst_id/100)+((item.item_rt-item.discount)*item.quantity)).toFixed(2)}
                </td>
               
                 <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {+item.item_rt-(+item.discount)}
                </td>
                <td className="px-1 py-1 text-xs" rowSpan={2}>
                    {item.sgst_id>0?(((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.cgst_id/100))+((+item.item_rt)-(+item.discount))*(+item.quantity)*(+item.sgst_id/100)+((item.item_rt-item.discount)*item.quantity)).toFixed(2):((+item.item_rt-(+item.discount))*(+item.quantity)*(+item.igst_id/100)+((item.item_rt-item.discount)*item.quantity)).toFixed(2)}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-1 py-1 text-xs gap-3">
                <p>Make: {item.prod_make} </p> 
                <p>Category: {item.catg_name} </p> 
                <p> UOM: {item.unit_name}</p> 
                <p> Part No.: {item.part_no} </p>
                <p>Model No.: {item.model_no} </p> 
                <p> Article No.: {item.article_no}</p> 
                <p>HSN: {item.hsn_code} </p>
            </td>
        </tr> 
         </>
                
        )}
          
        </tbody>
        <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-1 py-3 text-base font-bold" colSpan={9}>Total</th>
                <th className="px-1 py-3 text-base font-bold">{grandTot}</th>
            </tr>
        </tfoot>
    </table>
</div>

     
      </p>
      <Divider/>

      <p className="mb-5">
      <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Payment Terms
       
          </div>
          <ul className="max-w-md space-y-1 text-gray-700 p-2 list-disc list-inside dark:text-gray-400">
       { JSON.parse(localStorage.getItem('termList'))?.length>0 && JSON.parse(localStorage.getItem('termList'))?.map(item=> <li>
        {item.term}
    </li>)}
   
    </ul>
      </p>
      <Divider/>

      <p className="mb-5">
      <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Terms & Conditions

          </div>


          <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
       
        <tbody>
            <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Price Basis
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).price_basis_flag=='F'?'FOR':'EX-WORKS'}, {JSON.parse(localStorage.getItem('terms')).price_basis_desc}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Packing & Forwarding
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).packing_forwarding_val=='I'?'Inclusive':`Extra  ${JSON.parse(localStorage.getItem('terms')).packing_forwarding_extra}% - ${(grandTot * JSON.parse(localStorage.getItem('terms')).packing_forwarding_extra/100).toFixed(2)}`}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Freight
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).freight_insurance=='I'?'Inclusive':'Extra'} - {JSON.parse(localStorage.getItem('terms')).freight_insurance_val}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Test Certificate
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).test_certificate=='Y'?'Yes, '+JSON.parse(localStorage.getItem('terms')).test_certificate_desc:'No'}
                </td>
            </tr>

            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Warranty/Guarantee
                </th>
                <td className="px-1 py-1 text-wrap">
                {JSON.parse(localStorage.getItem('terms')).warranty_guarantee_flag=='W'?'Warranty':'Guarantee'} {JSON.parse(localStorage.getItem('terms')).duration_val} {JSON.parse(localStorage.getItem('terms')).duration=='M'?'month(s)':JSON.parse(localStorage.getItem('terms')).duration=='D'?'day(s)':'year(s)'} 
                {JSON.parse(localStorage.getItem('terms')).comm_dt && ' from the date of commission'}
                {JSON.parse(localStorage.getItem('terms')).comm_dt && JSON.parse(localStorage.getItem('terms')).dispatch_dt ? ' or from the date of dispatch':!JSON.parse(localStorage.getItem('terms')).comm_dt && !JSON.parse(localStorage.getItem('terms')).dispatch_dt?'':JSON.parse(localStorage.getItem('terms')).dispatch_dt?' from the date of dispatch.':''}
                {JSON.parse(localStorage.getItem('terms')).comm_dt && JSON.parse(localStorage.getItem('terms')).dispatch_dt && ' ,whichever is earlier.'}
                </td>
            </tr>
            
         
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                O & M Manual
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).om_manual_flag=='A'?'Applicable. '+ JSON.parse(localStorage.getItem('terms')).om_manual_desc:'Not Applicable.'}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Operation/Installation
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).oi_flag=='A'?'Applicable. ' +JSON.parse(localStorage.getItem('terms')).oi_desc:'Not Applicable.'}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Packing Type
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).packing_type}
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Manufacture Clearance
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).manufacture_clearance=='A'?'Applicable. '+JSON.parse(localStorage.getItem('terms')).manufacture_clearance_desc:'Not Applicable.'}
                </td>
            </tr>
        </tbody>
    </table>
</div>
     
      </p>

      <p className="mb-5">
      <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Liquidity Damages

          </div>

<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
        <thead className="text-xs text-nowrap font-bold text-blue-500 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-1 py-3">
                    LD Applicable date
                </th>
                <th scope="col" className="px-1 py-3">
                    LD applied on
                </th>
                <th scope="col" className="px-1 py-3">
                    Ld value(%)
                </th>
                <th scope="col" className="px-1 py-3">
                    Maximum (%) on PO value
                </th>
                
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {JSON.parse(localStorage.getItem('terms')).ld_applicable_date=='O'?`Others - ${JSON.parse(localStorage.getItem('terms')).others_ld}`:JSON.parse(localStorage.getItem('terms')).ld_applicable_date=='M'?'MRN Date':JSON.parse(localStorage.getItem('terms')).ld_applicable_date=='NA'?'Not applicable':'Dispatch Date'}
                </th>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).ld_applied_on=='O'?`Others - ${JSON.parse(localStorage.getItem('terms')).others_applied}`:JSON.parse(localStorage.getItem('terms')).ld_applied_on=='P'?'Pending Material Value':JSON.parse(localStorage.getItem('terms')).ld_applicable_date=='NA'?'':'PO Total Value(%)'}
                </td>
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).ld_value}
                </td>
                
                <td className="px-1 py-1">
                {JSON.parse(localStorage.getItem('terms')).po_min_value}
                </td>
            </tr>
           
        </tbody>
    </table>
</div>
<Divider/>
<table className="w-full my-10 text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
       
       <tbody>
           <tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   MDCC
               </th>
               <td className="px-1 py-1">
               {localStorage.getItem('mdcc_flag')=='Y'?'Yes. '+localStorage.getItem('mdcc'):'No'}
               </td>
           </tr>
           <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   Inspection
               </th>
               <td className="px-1 py-1">
               {localStorage.getItem('insp_flag')=='Y'?'Yes. ' +localStorage.getItem('insp'):'No'}
               </td>
           </tr>
           <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   Drawing/Datasheet
               </th>
               <td className="px-1 py-1">
               {localStorage.getItem('drawing_flag')=='Y'?'Yes . '+localStorage.getItem('drawing')+', '+localStorage.getItem('dt') :'No'}
               </td>
           </tr>
          
       </tbody>
   </table>
     
      </p>
      <Divider/>
      <p className="mb-5">
      <div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
          Notes

          </div>
          <span className="p-2">
          {localStorage.getItem('notes')}
          </span>
        </p>
    
    
      </div>
      </Spin>

    </div>
  );
}

export default PoPreview;
