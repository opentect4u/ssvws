export const printTableLoanStatement = (
	dataArray,
	title,
	searchType,
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
              margin-bottom: 20px;
            }
            .italic {
              font-style: italic;
            }
        </style>
      </head>
      <body>
      <h2 style="text-align: center">SSVWS</h2>
      ${
				searchType === "G"
					? `<div className="center-div">
        <div className="italic">
          Group: ${metadata?.group_name}, ${metadata?.group_code}
        </div>
        <div className="italic">
          Showing results from ${new Date(fromDate)?.toLocaleDateString(
						"en-GB"
					)} to ${new Date(toDate)?.toLocaleDateString("en-GB")}
        </div>
        <div className="italic">
          Branch: ${metadata?.branch_name}, ${metadata?.branch_code}
        </div>
      </div>`
					: `<div className="center-div">
        <div className="italic">
									Member: ${metadata?.client_name}, ${metadata?.member_code}
								</div>
								<div className="italic">
									Branch: ${metadata?.branch_name}, ${metadata?.branch_code}
								</div>
								<div className="italic">
									Group: ${metadata?.group_name}, ${metadata?.group_code}
								</div>
								<div className="italic">
									Showing results from ${new Date(fromDate)?.toLocaleDateString(
										"en-GB"
									)} to ${new Date(toDate)?.toLocaleDateString("en-GB")}
								</div>
								<div className="italic">Loan ID: ${metadata?.loan_id}</div>
      </div>`
			}

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
