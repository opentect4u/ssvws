import React from "react"
import {
	SaveOutlined,
	DeleteOutlined,
	ReloadOutlined,
	CloseOutlined,
	ArrowRightOutlined,
	CheckOutlined,
	ArrowLeftOutlined,
} from "@ant-design/icons"

function BtnComp({
	onReset,
	onPressSubmit,
	mode,
	onDelete,
	rejectBtn,
	onReject,
	sendToText,
	onSendTo,
	condition,
	showSave,
	onRejectApplication,
	showReject = false,
	showForward = false,
	onForwardApplication,
	param = 0,
	showUpdateAndReset = true,
	showSendToBM = false,
	onSendBackToBM,
}) {
	console.log('MODE - ', mode);
	return (
		<div className="flex justify-center">
			{mode == "A" && (
				<>
					<button
						type="reset"
						className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac3246] hover:border-[#ac3246] duration-300 rounded-full  dark:focus:ring-primary-900"
						onClick={onReset}
					>
						<ReloadOutlined className="mr-2" />
						Reset
					</button>
					<button
						type="submit"
						className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
					>
						<SaveOutlined className="mr-2" />
						{param?.id > 0 ? "Update" : "Submit"}
					</button>
				</>
			)}
			{mode == "B" && (
				<>
					{showSendToBM && (
						<button
							type="button"
							className="inline-flex items-center px-5 py-2.5 mt-4 mr-4 sm:mt-6 text-sm font-medium text-center text-white border border-teal-800 bg-teal-800 transition ease-in-out hover:bg-teal-700 duration-300 rounded-full  dark:focus:ring-primary-900"
							onClick={onSendBackToBM}
						>
							<ArrowLeftOutlined className="mr-2" />
							Send to BM
						</button>
					)}

					{showReject && (
						<button
							type="button"
							className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-red-800 bg-red-800 transition ease-in-out hover:bg-red-700 duration-300 rounded-full  dark:focus:ring-primary-900"
							onClick={onRejectApplication}
						>
							<CloseOutlined className="mr-2" />
							Reject Application
						</button>
					)}

					{showUpdateAndReset && (
						<>
							<button
								type="button"
								className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac4326] hover:border-[#ac4326] duration-300 rounded-full  dark:focus:ring-primary-900"
								onClick={onReset}
							>
								<ReloadOutlined className="mr-2" />
								Reset
							</button>
							<button
								type="button"
								className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
								onClick={onPressSubmit}
							>
								<SaveOutlined className="mr-2" />
								Update
							</button>
						</>
					)}

					{showForward && (
						<button
							type="button"
							className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
							onClick={onForwardApplication}
						>
							<CheckOutlined className="mr-2" />
							Approve Application
						</button>
					)}
				</>
			)}
			{mode == "N" && (
				<>
					{showReject && (
						<button
							type="button"
							className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac324b] hover:border-[#ac324b] duration-300 rounded-full  dark:focus:ring-primary-900"
							onClick={onRejectApplication}
						>
							<CloseOutlined className="mr-2" />
							Delete
						</button>
					)}

					{showUpdateAndReset && (
						<>
							<button
								type="button"
								className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-yellow-500 hover:border-yellow-500 duration-300 rounded-full  dark:focus:ring-primary-900"
								onClick={onReset}
							>
								<ReloadOutlined className="mr-2" />
								Reset
							</button>
							<button
								type="button"
								className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
								onClick={onPressSubmit}
							>
								<SaveOutlined className="mr-2" />
								Update - {param?.id > 0 ? "Update" : "Submit"}
							</button>
						</>
					)}

					{showForward && (
						<button
							type="button"
							className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
							onClick={onForwardApplication}
						>
							<CheckOutlined className="mr-2" />
							Approve
						</button>
					)}
				</>
			)}
			{mode == "E" && (
				<button
					type="button"
					className="inline-flex items-center px-5 py-2.5 mt-4 mr-2 sm:mt-6 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac324b] hover:border-[#ac324b] duration-300 rounded-full  dark:focus:ring-primary-900"
					onClick={onDelete}
				>
					<DeleteOutlined className="mr-2" />
					Delete
				</button>
			)}
			{condition && rejectBtn && (
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
					className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-teal-500 transition ease-in-out hover:bg-teal-600 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
				>
					<SaveOutlined className="mr-2" />
					Save Application
				</button>
			)}
			{condition && mode === "S" && (
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
