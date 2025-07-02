import React from "react"
import { useNavigate } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { FloatButton } from "antd"
import { motion } from "framer-motion"

function Backbtn() {
	const navigation = useNavigate()
	return (
		<div className="-ml-5">
			<FloatButton
				icon={<ArrowBackIcon />}
				className="sm:hidden"
				onClick={() => navigation(-1)}
				type="primary"
				style={{ right: 22, bottom: 170, height: 50, width: 50 }}
			/>
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, type: "just" }}
				className="hidden sm:flex sm:justify-end items-center"
			>
				<Tooltip title="Back">
					<button
						className=" inline-flex items-center justify-center text-sm font-medium text-center text-slate-50 bg-primary-700 h-10 w-10  bg-[#DA4167] hover:duration-500 ease-in-out rounded-full hover:rounded-xl dark:focus:ring-primary-900 dark:bg-[#d14141] dark:hover:bg-gray-600 dark:focus:ring-primary-900 hover:bg-primary-800 "
						onClick={() => navigation(-1)}
					>
						<ArrowBackIcon />
					</button>
				</Tooltip>
			</motion.div>
		</div>
	)
}

export default Backbtn
