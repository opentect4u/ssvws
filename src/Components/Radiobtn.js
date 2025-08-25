import React, { useEffect, useState } from "react"
import { Radio } from "antd"
import { motion } from "framer-motion"

function Radiobtn({ data, onChangeVal, val ,className=''}) {
	console.log(val)
	const [value, setValue] = useState(val)
	useEffect(() => {
		setValue(val)
	}, [val])
	const onChange = (e) => {
		console.log("radio checked", e.target.value)
		setValue(e.target.value)
		onChangeVal(e.target.value)
	}
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1, type: "spring" }}
		>
			<Radio.Group
				onChange={onChange}
				className={` mt-7 mb-4 bg-white rounded-lg p-2 shadow-lg gap-4 ${className}`}
				value={value}
			>
				{data?.map((item) => (
					<Radio
						value={item.value}
						className="text-slate-900 hover:bg-slate-100 border-2 border-white hover:border-2 hover:border-white hover:duration-300 hover:rounded-full font-bold
      
       checked:bg-[#C4F1BE] checked:border-2 checked:border-white checked:duration-300 checked:rounded-full
      
      "
					>
						{item.label}
					</Radio>
				))}
				{/* //  <Radio value={2} className="text-green-900 font-bold">In Progress</Radio> */}
			</Radio.Group>
		</motion.div>
	)
}

export default Radiobtn
