import React, { useState, useMemo } from "react"
import { Pagination } from "antd"
import PropTypes from "prop-types"

const DynamicTailwindAccordion = ({
	data,
	headerMap = {},
	deleteCols = [],
	pageSize = 20,
	renderRowDetails,
	renderCell,
	dateTimeExceptionCols = [],
	indexing = false,
	filter = null,
}) => {
	const [activeRowIndex, setActiveRowIndex] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	// Extract headers
	const originalHeaders = useMemo(
		() => (data.length ? Object.keys(data[0]) : []),
		[data]
	)

	// Determine which columns to include
	const columns = useMemo(
		() => originalHeaders.filter((_, idx) => !deleteCols.includes(idx)),
		[originalHeaders, deleteCols]
	)

	// Apply filter if provided
	const filteredData = useMemo(() => {
		if (
			filter &&
			typeof filter.header_name === "string" &&
			filter.header_name.length > 0 &&
			filter.value !== undefined &&
			filter.value !== null
		) {
			return data.filter((row) => {
				const cell = row[filter.header_name]
				if (cell === undefined || cell === null) return false
				return String(cell)
					.toLowerCase()
					.includes(String(filter.value).toLowerCase())
			})
		}
		return data
	}, [data, filter])

	// Determine data for current page
	const pageData = useMemo(() => {
		const start = (currentPage - 1) * pageSize
		return filteredData.slice(start, start + pageSize)
	}, [filteredData, currentPage, pageSize])

	const toggleRow = (index) => {
		setActiveRowIndex((prev) => (prev === index ? null : index))
	}

	const formatCellValue = (value, key) => {
		if (!value) return ""
		const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.+Z$/
		if (typeof value === "string" && isoRegex.test(value)) {
			const colIndex = originalHeaders.indexOf(key)
			if (dateTimeExceptionCols.includes(colIndex)) {
				return new Date(value).toLocaleDateString("en-GB")
			}
			return new Date(value)
				.toLocaleTimeString("en-GB", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				})
				.toUpperCase()
		}
		return value
	}

	const startIndex = (currentPage - 1) * pageSize

	return (
		<div className="relative overflow-auto shadow-md sm:rounded-lg mt-5 max-h-[500px]">
			<table className="w-full table-auto text-sm">
				<thead className="sticky top-0 bg-slate-800 z-20 text-xs uppercase text-slate-50">
					<tr>
						{indexing && <th className="px-4 py-2 text-left">Sl. No.</th>}
						{columns.map((key) => (
							<th key={key} className="px-4 py-2 text-left">
								{headerMap[key] || key}
							</th>
						))}
						<th className="px-4 py-2" />
					</tr>
				</thead>
				<tbody>
					{pageData.map((row, i) => {
						const globalIdx = startIndex + i
						const isActive = activeRowIndex === globalIdx
						return (
							<React.Fragment key={globalIdx}>
								<tr
									className={`cursor-pointer border-b hover:bg-gray-100 ${
										i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
									}`}
									onClick={() => toggleRow(globalIdx)}
								>
									{indexing && <td className="px-4 py-2">{globalIdx + 1}</td>}
									{columns.map((key) => (
										<td key={key} className="px-4 py-2">
											{renderCell
												? renderCell(key, row[key], row)
												: formatCellValue(row[key], key)}
										</td>
									))}
									<td className="px-4 py-2">
										<div
											className={`bg-gray-100 border rounded-lg p-2 inline-flex items-center transition-transform ${
												isActive ? "rotate-180" : ""
											}`}
										>
											<svg
												className="w-4 h-4 text-gray-700"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
											>
												<path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z" />
											</svg>
										</div>
									</td>
								</tr>
								{isActive && (
									<tr>
										<td
											colSpan={columns.length + 1 + (indexing ? 1 : 0)}
											className="p-4 bg-white"
										>
											{renderRowDetails ? (
												renderRowDetails(row)
											) : (
												<pre className="text-xs text-gray-700">
													{JSON.stringify(row, null, 2)}
												</pre>
											)}
										</td>
									</tr>
								)}
							</React.Fragment>
						)
					})}
				</tbody>
			</table>
			<div className="sticky bottom-0 bg-white z-20 p-2 flex justify-end">
				<Pagination
					current={currentPage}
					pageSize={pageSize}
					total={filteredData.length}
					onChange={(page) => setCurrentPage(page)}
					showSizeChanger={false}
				/>
			</div>
		</div>
	)
}

DynamicTailwindAccordion.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	headerMap: PropTypes.object,
	deleteCols: PropTypes.arrayOf(PropTypes.number),
	pageSize: PropTypes.number,
	renderRowDetails: PropTypes.func,
	renderCell: PropTypes.func,
	dateTimeExceptionCols: PropTypes.arrayOf(PropTypes.number),
	indexing: PropTypes.bool,
	filter: PropTypes.shape({
		header_name: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	}),
}

export default DynamicTailwindAccordion
