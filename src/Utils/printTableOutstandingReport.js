export const printTableOutstandingReport = (
	dataArray,
	title,
	searchType,
	metadata = "",
	fromDate,
	toDate
) => {
	if (!dataArray || dataArray.length === 0) {
		alert("No data available to print.")
		return
	}

	const formattedFromDate = fromDate
		? new Date(fromDate).toLocaleDateString("en-GB")
		: "N/A"

	const tableHTML = `
    <html>
      <head>
        <title>${title}</title>
        <style>
            table, td, th {
            border: 1px solid;
            padding: 8px;
            text-align: left;
            }
            table {
            width: 100%;
            border-collapse: collapse;
            overflow: auto;
            }
            .center-div {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              margin-bottom: 5px;
            }
            .italic {
              font-style: italic;
            }
            @media print {
              body {
                visibility: visible;
              }
            }
        </style>
      </head>
      <body>
      <h2 style="text-align: center">SSVWS</h2>
      <h3 style="text-align: center">${title}</h3>
      
        <div className="italic center-div">
          ${
						searchType === "M"
							? "Memberwise Outstanding Report"
							: searchType === "G"
							? "Groupwise Outstanding Report"
							: searchType === "F"
							? "Fundwise Outstanding Report"
							: searchType === "C"
							? "CO-wise Outstanding Report"
							: searchType === "B"
							? "Branch-wise Outstanding Report"
							: "Err"
					}
        </div>
        <div className="italic center-div">${metadata || ""}</div>
        <div className="italic center-div">
          Showing results from ${formattedFromDate}
        </div>

        <table>
          <thead>
            <tr>
              ${Object.keys(dataArray[0])
								.map((key) => `<th>${key}</th>`)
								.join("")}
            </tr>
          </thead>
          <tbody>
            ${dataArray
							.map(
								(item) => `
              <tr>
                ${Object.values(item)
									.map((value) => `<td>${value}</td>`)
									.join("")}
              </tr>
            `
							)
							.join("")}
          </tbody>
        </table>
      </body>
    </html>
  `

	const printWindow = window.open("", "_blank")
	if (printWindow) {
		printWindow.document.write(tableHTML)
		printWindow.document.close()

		// Let the page load before printing
		setTimeout(() => {
			printWindow.print()
			printWindow.onafterprint = () => {
				printWindow.close()
			}
		}, 500)
	} else {
		alert("Popup blocked. Please allow popups for this website.")
	}
}
