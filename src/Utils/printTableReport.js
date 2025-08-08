/**
 * Generator that yields batches of <tr>…</tr> strings.
 *
 * @param {Object[]}         data
 * @param {string[]}         keys
 * @param {RegExp}           isoRegex
 * @param {number[]}         dateTimeColsException
 * @param {number}           batchSize
 */
function* rowBatchGenerator(
	data,
	keys,
	isoRegex,
	dateTimeColsException,
	batchSize = 500
) {
	let buffer = []
	for (let i = 0; i < data.length; i++) {
		const rawRow = data[i]
		const cells = keys.map((key, idx) => {
			let val = rawRow[key]
			if (typeof val === "string" && isoRegex.test(val)) {
				val = dateTimeColsException.includes(idx)
					? new Date(val).toLocaleDateString("en-GB")
					: new Date(val).toLocaleString("en-GB")
			}
			return `<td>${val != null ? String(val) : ""}</td>`
		})
		buffer.push(`<tr>${cells.join("")}</tr>`)

		if (buffer.length >= batchSize) {
			yield buffer.join("")
			buffer = []
		}
	}

	if (buffer.length) {
		yield buffer.join("")
	}
}

/**
 * Opens the browser print dialog for a tabular view of your data.
 * Streams rows in batches via a generator to keep memory usage low.
 *
 * @param {Object[]}         data
 * @param {Object}           headerMap            e.g. { firstName: 'First Name', lastName: 'Last Name' }
 * @param {string}           [title="Report"]     Shown in the window title and header
 * @param {number[]}         [dateTimeColsException=[]]  Zero‑based column indices to format as date only
 */
export function printTableReport(
	data,
	headerMap,
	title = "Report",
	dateTimeColsException = [],
	hasHtmlElement=false
) {
	if (data.length > 10000) {
		alert(
			`You are trying to print ${data.length} rows.\n\nPrinting this much data may crash or freeze your browser.\n\nInstead export to excel.`
		)
		return
	}
	let headerHtml= ''
	if(hasHtmlElement){
		const headerContentEl = document.getElementById("loanupperText");
		headerHtml = headerContentEl ? headerContentEl.innerHTML : "";
	}

	const keys = Object.keys(headerMap)
	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

	const printWindow = window.open("", "_blank")
	if (!printWindow) {
		alert("Popup blocked. Please allow popups for this website.")
		return
	}

	printWindow.document.writeln(`
    <html><head><title>${title}</title><style>
      body { font-family: sans-serif; margin: 20px; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #333; padding: 4px; font-size: 12px; }
      thead th { background: #ff0; font-weight: bold; }
    </style></head><body>
      <h1>${title}</h1>
	   <div class="print-header">
		${headerHtml}
		</div>
      <table><thead><tr>
        ${keys.map((k) => `<th>${headerMap[k]}</th>`).join("")}
      </tr></thead><tbody>
  `)

	const batchGen = rowBatchGenerator(
		data,
		keys,
		isoRegex,
		dateTimeColsException,
		500
	)
	for (const batchStr of batchGen) {
		printWindow.document.writeln(batchStr)
	}

	printWindow.document.writeln(`</tbody></table></body></html>`)
	printWindow.document.close()
	printWindow.focus()
	printWindow.print()
	printWindow.onafterprint = () => printWindow.close()
}
