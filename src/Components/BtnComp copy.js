import React from "react"
import {
	SaveOutlined,
	DeleteOutlined,
	ReloadOutlined,
	CloseOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons"

function BtnComp({
	onReset,
	mode,
	onDelete,
	rejectBtn,
	onReject,
	sendToText,
	onSendTo,
	condition,
	showSave,
}) {
	return (
		<div className="flex justify-center">
			{mode == "A" && (
				<>
					<button
						type="reset"
						className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-gray-800 border border-yellow-300 bg-yellow-300 transition ease-in-out hover:bg-yellow-200 duration-300 rounded-full  dark:focus:ring-primary-900"
						onClick={onReset}
					>
						<ReloadOutlined className="mr-2" />
						Reset
					</button>
					<button
						type="submit"
						className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#6457A6] transition ease-in-out hover:bg-[#4e4480] duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
					>
						<SaveOutlined className="mr-2" />
						Submit
					</button>
				</>
			)}
			{mode == "E" && (
				<button
					type="button"
					className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:bg-[#a73b34] duration-300 rounded-full  dark:focus:ring-primary-900"
					onClick={onDelete}
				>
					<DeleteOutlined className="mr-2" />
					Delete
				</button>
			)}
			{!showSave && condition && rejectBtn && (
				<button
					type="button"
					className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#92140C] bg-[#92140C] transition ease-in-out hover:bg-[#a73b34] duration-300 rounded-full  dark:focus:ring-primary-900"
					onClick={onReject}
				>
					<CloseOutlined className="mr-2" />
					Reject
				</button>
			)}
			{showSave && (
				<button
					type="submit"
					className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#6457A6] transition ease-in-out hover:bg-[#4e4480] duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
				>
					<SaveOutlined className="mr-2" />
					Save Application
				</button>
			)}
			{!showSave && condition && mode === "S" && (
				<button
					type="button"
					className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 ml-2 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-600 transition ease-in-out hover:bg-green-800 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
					onClick={onSendTo}
				>
					<ArrowRightOutlined className="mr-2" />
					Send to {sendToText}
				</button>
			)}
		</div>
	)
}

export default BtnComp
