import React from "react"

function AuditTrail({ data }) {
	return (
		<>
			<div className="w-full">
				<label className="block mb-2 text-sm font-semibold text-emerald-700 dark:text-gray-100">
					Created By
				</label>
				<input
					className="bg-white border-2 border-gray-300 text-gray-800 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					disabled={true}
					value={data?.created_by}
				/>
			</div>
			<div className="w-full">
				<label className="block mb-2 text-sm font-semibold text-emerald-700 dark:text-gray-100">
					Created At
				</label>
				<input
					className="bg-white border-2 border-gray-300 text-gray-800 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					disabled={true}
					value={data?.created_at?.split("T").join(" ")}
				/>
			</div>
			<div className="w-full">
				<label className="block mb-2 text-sm font-semibold text-emerald-700 dark:text-gray-100">
					Modified By
				</label>
				<input
					className="bg-white border-2 border-gray-300 text-gray-800 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					disabled={true}
					value={data?.modified_by}
				/>
			</div>
			<div className="w-full">
				<label className="block mb-2 text-sm font-semibold text-emerald-700 dark:text-gray-100">
					Modified At
				</label>
				<input
					className="bg-white border-2 border-gray-300 text-gray-800 text-sm rounded-lg focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					disabled={true}
					value={data?.modified_at?.split("T").join(" ")}
				/>
			</div>
		</>
	)
}

export default AuditTrail
