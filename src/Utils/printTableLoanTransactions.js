export const printTableLoanTransactions = (
	dataArray,
	title,
	searchType,
	searchType2,
	metadata,
	fromDate,
	toDate
) => {
	const tableHTML = `
    <html>
      <head>
        <title>${title}</title>
        <style>
            table, td, th {
            border: 1px solid;
            }

            table {
            width: 100%;
            border-collapse: collapse;
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
        </style>
      </head>
      <body>
      <h2 style="text-align: center">SSVWS</h2>
      <h3 style="text-align: center">${title}</h3>
      
        <div className="italic center-div">
          ${
						searchType2 === "M"
							? "Memberwise Transaction Report"
							: searchType2 === "G"
							? "Groupwise Transaction Report"
							: searchType2 === "F"
							? "Fundwise Transaction Report"
							: searchType2 === "C"
							? "CO-wise Transaction Report"
							: searchType2 === "B"
							? "Branch-wise Transaction Report"
							: "Err"
					}
        </div>
        <div className="italic center-div">
          ${
						searchType === "D"
							? "Disbursement Report"
							: searchType === "R"
							? "Collection Report"
							: "Err"
					}
        </div>
        <div className="italic center-div">Branch: ${metadata}</div>
        <div className="italic center-div">
          Showing results from ${new Date(fromDate)?.toLocaleDateString(
						"en-GB"
					)} to ${new Date(toDate)?.toLocaleDateString("en-GB")}
        </div>
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

		printWindow.print()
		printWindow.onafterprint = () => {
			printWindow.close()
		}
	} else {
		alert("Popup blocked. Please allow popups for this website.")
	}
}
