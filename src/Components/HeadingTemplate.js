import React from "react"
import Backbtn from "./Backbtn"
import { motion } from "framer-motion"
import PrintComp from "./PrintComp"
function HeadingTemplate({ text, mode, data, title }) {
	return (
		<div className="bg-transparent dark:bg-gray-800 relative shadow-md rounded-full overflow-hidden mb-5">
			<div className="flex flex-col bg-red-800 dark:bg-red-800 w-full md:flex-row items-center justify-start gap-1 space-y-3 md:space-y-1 space-x-2 px-4 py-1">
				<Backbtn />

				<motion.h2
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, type: "just" }}
					className="text-xl font-semibold text-white capitalize dark:text-gray-400 "
				>
					{text}
				</motion.h2>
				<div className="absolute right-4">
					{mode == 1 && data && <PrintComp toPrint={data} title={title} />}
				</div>
			</div>
		</div>
	)
}

export default HeadingTemplate
