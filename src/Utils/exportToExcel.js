import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

export async function exportToExcel(
	data,
	headerMap,
	fileName = "report.xlsx",
	dateTimeColsException = [],
	hasElementId = false
) {
	console.log(hasElementId);
	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet("Report")
	// console.log(tot_disb_amt);
	const keys = Object.keys(headerMap)
	worksheet.columns = keys.map((key) => ({
		header: headerMap[key],
		key,
		width: 20,
	}))

	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

	data.forEach((rawRow) => {
		const row = { ...rawRow }
		keys.forEach((key, idx) => {
			const val = rawRow[key]
			if (typeof val === "string" && isoRegex.test(val)) {
				if (dateTimeColsException.includes(idx)) {
					row[key] = new Date(val).toLocaleDateString("en-GB")
				} else {
					row[key] = new Date(val).toLocaleString("en-GB")
				}
			}
		})

		worksheet.addRow(row)
	})

	worksheet.getRow(1).eachCell((cell) => {
		cell.font = { bold: true }
		cell.fill = {
			type: "pattern",
			pattern: "darkGrid",
			fgColor: { argb: "FFFFFF00" },
		}
	})

	const buffer = await workbook.xlsx.writeBuffer()
	saveAs(new Blob([buffer]), fileName)
}
