import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { motion } from "framer-motion";
import TDInputTemplate from "./TDInputTemplate";

import { Tag } from 'antd'
function CompositeSearch({ data,onSubmit,onReset }) {
  const [visible, setVisible] = useState(false);
  const [set_one_val,setOne]=useState('')
  const [set_two_val,setTwo]=useState('')
  const handleClickInside = (event) => {
    event.stopPropagation();
  };
  
  
  const op = useRef(null);
  return (
    <motion.button
      onClick={(e) => op.current.toggle(e)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
      className="text-green-900 hover:bg-[#C4F1BE] border-2 border-white hover:border-2 hover:border-white hover:duration-300 rounded-full w-auto min-w-52 mt-7 mb-4 flex justify-start items-center bg-white py-2 px-4 shadow-lg gap-4"
    >
      <FilterOutlined /> Advanced Search 
    {set_one_val && set_two_val && 
    <motion.div  initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    transition={{ delay: 0.5, type: "spring", stiffness: 170 }}>
<Tag className="rounded-full -mr-2" color="#eb8d00" closeIcon={<CloseCircleOutlined className="text-white text-lg"/>}  onClose={()=>{setOne('');setTwo('');onReset()}}>
      <span className='mr-2'> {data?.set_one.filter(e=>e.code==set_one_val)[0]?.name}  </span>     
    <span>{data?.set_two.filter(e=>e.code==set_two_val)[0]?.name} </span>
    </Tag>
    </motion.div>
    }
      <OverlayPanel
        ref={op}
        className="flex justify-between gap-4 w-80 shadow-lg"
        onHide={() => setVisible(false)}
      >
        <p className="font-bold text-lg text-green-900">Search by </p>

        <div onClick={handleClickInside} className="flex gap-4 mt-5">
                <div className="flex justify-between gap-4">
                <div>
            <TDInputTemplate
              placeholder={`Select ${data?.set_one_lbl}`}
              type="text"
              label={data?.set_one_lbl}
              name={'set_one_val'}
              formControlName={set_one_val}
              handleChange={val=>{setOne(val.target.value);console.log(val.target.value)}}
              mode={2}
              data={data?.set_one}
            />
            
          </div>
          <div>
            <TDInputTemplate
              placeholder={`Select ${data?.set_two_lbl}`}
              type="text"
              label={data?.set_two_lbl}
              name='set_two_val'
              formControlName={set_two_val}
              handleChange={val=>{setTwo(val.target.value);console.log(val.target.value)}}
              mode={2}
              data={data?.set_two}

            />
           
          </div>
                </div>
                </div>
        
        <div className="flex gap-4 justify-between">
          <button
            type="submit"
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm border-2 border-green-900 font-medium text-center text-green-900 bg-white transition ease-in-out   rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() =>{setOne('');setTwo('');setVisible(false);onReset()}}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!set_one_val || !set_two_val || set_one_val==`Select ${data?.set_one_lbl}` ||set_two_val==`Select ${data?.set_two_lbl}` }
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out   rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={()=>{console.log(set_one_val,set_two_val);setVisible(true);onSubmit(
                {val_one:data?.set_one.filter(e=>e.code==set_one_val)[0]?.name,code_one:set_one_val,val_two:data?.set_two.filter(e=>e.code==set_two_val)[0]?.name,code_two:set_two_val}
            )}}
          >
            Submit
          </button>
        </div>
        
      </OverlayPanel>
    </motion.button>
  );
}

export default CompositeSearch;
