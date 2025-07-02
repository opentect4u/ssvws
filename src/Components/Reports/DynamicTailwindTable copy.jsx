import React, { useState } from "react"
import { Pagination } from "antd"

const DynamicTailwindTable = ({
	data = [],
	headerBgColor = "bg-slate-800",
	pageSize = 50,
	columnTotal = [],
	colRemove = [],
	headersMap = null,
	dateTimeExceptionCols = [],
}) => {
	const [currentPage, setCurrentPage] = useState(1)

	if (!data || data.length === 0) {
		return <div>No data available</div>
	}

	const originalHeaders = Object.keys(data[0])

	const filteredHeadersWithIndex = originalHeaders
		.map((header, index) => ({ header, index }))
		.filter((item) => !colRemove.includes(item.index))

	const totals = {}
	columnTotal.forEach((origIndex) => {
		if (origIndex >= 0 && origIndex < originalHeaders.length) {
			const headerKey = originalHeaders[origIndex]
			totals[origIndex] = data.reduce((acc, row) => {
				const value = parseFloat(row[headerKey])
				return !isNaN(value) ? acc + value : acc
			}, 0)
		}
	})

	const currentData = data.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	)

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	const formatCellValue = (value, colIndex) => {
		const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
		if (typeof value === "string" && isoRegex.test(value)) {
			if (dateTimeExceptionCols.includes(colIndex)) {
				return new Date(value).toLocaleDateString("en-GB")
			}
			return new Date(value).toLocaleString("en-GB")
		}
		return value
	}

	return (
		<>
			<div
				className="relative overflow-auto shadow-md sm:rounded-lg mt-5 max-h-[500px]
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-transparent
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
			>
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						className={`text-xs uppercase text-slate-50 sticky top-0 ${headerBgColor}`}
					>
						<tr>
							{filteredHeadersWithIndex.map((item, i) => (
								<th key={i} className="px-6 py-3 font-semibold">
									{headersMap
										? headersMap[item.header] || item.header
										: item.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{currentData.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className={
									rowIndex % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
								}
							>
								{filteredHeadersWithIndex.map((item, colIndex) => (
									<td key={colIndex} className="px-6 py-3">
										{row[item.header] !== undefined
											? formatCellValue(row[item.header], item.index)
											: "---"}
									</td>
								))}
							</tr>
						))}
					</tbody>
					<tfoot className="sticky bottom-0">
						<tr className="text-slate-50 bg-slate-700">
							{filteredHeadersWithIndex.map((item, i) => (
								<td key={i} className="px-6 py-3">
									{i === 0
										? "Total"
										: columnTotal.includes(item.index) &&
										  totals[item.index] !== undefined
										? totals[item.index].toFixed(2)
										: ""}
								</td>
							))}
						</tr>
					</tfoot>
				</table>
			</div>
			<div className="flex justify-end my-4">
				<Pagination
					current={currentPage}
					pageSize={pageSize}
					total={data.length}
					onChange={handlePageChange}
					showSizeChanger={false}
				/>
			</div>
		</>
	)
}

export default DynamicTailwindTable
