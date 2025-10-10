import React, { useState, useMemo } from "react"
import { Pagination } from "antd"

const DynamicTailwindTable = ({
	data = [],
	headerBgColor = "bg-slate-800",
	pageSize = 50,
	columnTotal = [],
	colRemove = [],
	headersMap = null,
	dateTimeExceptionCols = [],
	showCheckbox = false,
	selectedRowIndices = [],
	disableAllCheckbox = false,
	onRowSelectionChange = () => {},
	indexing = false,
	bordered = true,
	isFooterAvailable=true
}) => {
	const [currentPage, setCurrentPage] = useState(1)

	const isDataEmpty = !data || data.length === 0

	const originalHeaders = useMemo(
		() => (isDataEmpty ? [] : Object.keys(data[0])),
		[data, isDataEmpty]
	)

	console.log(originalHeaders)

	const filteredHeadersWithIndex = useMemo(
		() =>
			originalHeaders
				.map((header, index) => ({ header, index }))
				.filter((item) => {
					
					return !colRemove.includes(item.index);
				}),
		[originalHeaders, colRemove]
	)

	console.log(originalHeaders, ' originalHeaders');

	const totals = useMemo(() => {
		const result = {}
		columnTotal.forEach((origIndex) => {
			if (origIndex >= 0 && origIndex < originalHeaders.length) {
				const headerKey = originalHeaders[origIndex]
				result[origIndex] = data.reduce((acc, row, rowIndex) => {
					const globalIndex = rowIndex
					if (showCheckbox && !selectedRowIndices.includes(globalIndex)) {
						return acc
					}
					const value = parseFloat(row[headerKey])
					return !isNaN(value) ? acc + value : acc
				}, 0)
			}
		})
		return result
	}, [data, columnTotal, originalHeaders, showCheckbox, selectedRowIndices])

	const currentData = useMemo(
		() => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		[data, currentPage, pageSize]
	)

	const visibleIndices = useMemo(
		() => currentData?.map((_, i) => (currentPage - 1) * pageSize + i),
		[currentData, currentPage, pageSize]
	)

	const allVisibleSelected = useMemo(
		() => visibleIndices.every((idx) => selectedRowIndices.includes(idx)),
		[visibleIndices, selectedRowIndices]
	)

	if (isDataEmpty) {
		return <div>No data available</div>
	}

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	const handleSelectAllChange = () => {
		let newSelection
		if (allVisibleSelected) {
			newSelection = selectedRowIndices.filter(
				(idx) => !visibleIndices.includes(idx)
			)
			console.log(allVisibleSelected, newSelection, visibleIndices, 'kkkkkkkkkkkk');
			
		} else {
			newSelection = Array.from(
				new Set([...selectedRowIndices, ...visibleIndices])
			)
		}
		onRowSelectionChange(newSelection)
	}

	const handleCheckboxChange = (globalIndex, handleAllSelect = false) => {
		const isAlready = selectedRowIndices.includes(globalIndex)
		console.log(selectedRowIndices, globalIndex, '-------------------------------')
		const newSelection = isAlready
			? selectedRowIndices.filter((idx) => idx !== globalIndex)
			: [...selectedRowIndices, globalIndex]
		onRowSelectionChange(newSelection)
		if(!handleAllSelect) handleSelectAllChange()
	}




	const formatCellValue = (value, colIndex) => {
		const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
		if (typeof value === "string" && isoRegex.test(value)) {
			if (dateTimeExceptionCols.includes(colIndex)) {
				return new Date(value).toLocaleDateString("en-GB", {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric'
					})
			}
			return new Date(value).toLocaleString("en-GB")
		}
		return value
	}

	return (
		<>
			<div
				className="relative overflow-auto shadow-md sm:rounded-xl mt-5 max-h-[500px]
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
							{indexing && <th className="px-6 py-3 font-semibold">Sl. No.</th>}
							{showCheckbox && (
								<th className="px-6 py-3">
									<input
										disabled={disableAllCheckbox}
										className="rounded-sm checked:bg-pink-600"
										type="checkbox"
										checked={allVisibleSelected}
										onChange={handleSelectAllChange}
									/>
								</th>
							)}
							{filteredHeadersWithIndex.map((item, i) => (
								console.log(item),
								<th key={i} className="px-6 py-3 font-semibold">
									{headersMap
										? headersMap[item.header] || item.header
										: item.header}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{currentData?.map((row, rowIndex) => {
							const globalIndex = (currentPage - 1) * pageSize + rowIndex
							const isChecked = selectedRowIndices.includes(globalIndex)

							// console.log(row, '===========');
							

							return (
								<tr
									key={rowIndex}
									className={"even:bg-slate-100 even:text-slate-900"}
								>
									{indexing && <td className="px-6 py-3">{globalIndex + 1}</td>}
									{showCheckbox && (
										<td className="px-6 py-3">
											<input
												disabled={disableAllCheckbox}
												className="rounded-sm checked:bg-pink-600"
												type="checkbox"
												checked={isChecked}
												onChange={() => handleCheckboxChange(globalIndex, row['checkOnce'] ? row['checkOnce'] : false)}
											/>
										</td>
									)}
									{filteredHeadersWithIndex.map((item, colIdx) => (
										<td
											key={colIdx}
											className={`px-6 py-3 ${
												bordered ? "border-r-slate-200 border text-justify" : ""
											}`}
										>
											{row[item.header] !== undefined
												? formatCellValue(row[item.header], item.index)
												: "---"}
										</td>
									))}
								</tr>
							)
						})}
					</tbody>

					{isFooterAvailable && <tfoot className="sticky bottom-0">
						<tr className="text-slate-50 bg-slate-700">
							{indexing && <td className="px-6 py-3" />}
							{showCheckbox && <td className="px-6 py-3" />}
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
					</tfoot>}
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
