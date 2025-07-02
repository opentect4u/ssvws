import React, { useEffect, useState } from "react"
import "./LoanForm.css"
import { useParams, useLocation } from "react-router"
import { useNavigate } from "react-router-dom"
import { Spin } from "antd"
import { LoadingOutlined, DownloadOutlined } from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import html2pdf from "html2pdf.js"
import IMG from "../../Assets/Images/puri_flyer.jpg"
import logo from "../../Assets/Images/purdcs.png"

function LoanView() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const location = useLocation()
	const { loanFormValues, loanType, loanBranch, gender, applicationId } =
		location.state || {}

	const [count, setCount] = useState(0)

	console.log(params, "params")
	console.log(location.state, "location.state")

	useEffect(() => {
		console.log("Calls when onSubmit api axios success changes...")
	}, [count])

	// const data = {
	// 	appNo: 1,
	// 	date: "04/09/2024",
	// 	memId: 28,
	// 	memName: "Soumya",
	// 	loanType: "CarLoan",
	// }

	const data = [
		{ name: "Date", value: new Date().toLocaleDateString("en-GB") },
		{ name: "Application Number", value: applicationId },
		{ name: "Member ID", value: loanFormValues?.l_member_id },
		{ name: "Member Name", value: loanFormValues?.l_name },
		{
			name: "Father's/Husband's Name",
			value: loanFormValues?.l_father_husband_name,
		},
		{ name: "Gender", value: gender },
		{ name: "Date of Birth", value: loanFormValues?.l_dob },
		{ name: "Email", value: loanFormValues?.l_email || "Nil." },
		{ name: "Mobile Number", value: loanFormValues?.l_mobile_no },
		{ name: "Address", value: loanFormValues?.l_address },

		{
			name: "Loan Through Branch",
			value: loanBranch,
		},
		{ name: "Loan Type", value: loanType },
		{ name: "Loan Amount", value: loanFormValues?.l_loan_amount },
	]

	const generatePDF = () => {
		const input = document.getElementById("tableDiv")

		html2canvas(input).then((canvas) => {
			const imgData = canvas.toDataURL("image/png")
			const pdf = new jsPDF("p", "mm", "a4")
			const imgWidth = 210
			const imgHeight = (canvas.height * imgWidth) / canvas.width

			pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
			pdf.save("loan_application_form.pdf")
		})
	}

	// const generatePDF = () => {
	// 	const element = document.getElementById("tableDiv")

	// 	// Configuration options for html2pdf
	// 	const opt = {
	// 		margin: 0.5,
	// 		filename: "loan_application_form.pdf",
	// 		image: { type: "png", quality: 1 },
	// 		html2canvas: { scale: 1 },
	// 		jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
	// 	}

	// 	html2pdf().from(element).set(opt).save()
	// }

	return (
		<section
			className="bg-red-50 dark:bg-[#001529] flex justify-center align-middle p-5"
			style={{
				backgroundImage: `url(${IMG})`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
			}}
		>
			{/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
			{/* <HeadingTemplate
				text={params.id > 0 ? "Update vendor" : "Add vendor"}
				mode={params.id > 0 ? 1 : 0}
				title={"Vendor"}
				data={params.id && data ? data : ""}
			/> */}
			<div
				className=" bg-white p-5 w-4/5 min-h-screen rounded-3xl"
				style={{
					backgroundColor: "rgba(255, 250, 250, 0.35)",
					backdropFilter: "blur(9px)",
				}}
			>
				<div className="w-auto mx-14 my-4">
					<FormHeader text="Loan Application Download" />
				</div>
				<div className="mx-auto bg-yellow-300 w-4/5 mb-5 rounded-xl flex justify-center align-middle p-3">
					<marquee className="text-blue-800 animate-pulse text-lg text-center">
						Remember to DOWNLOAD the Application Form or else you will lose it!
					</marquee>
				</div>
				<Spin
					indicator={<LoadingOutlined spin />}
					size="large"
					className="text-red-800 dark:text-gray-400"
					spinning={loading}
				>
					{/* <div>Application ID: {JSON.stringify(loanFormValues)}</div>
					<div>-------------------------------------</div>
					<div>Loan Form Values: {JSON.stringify(loanFormValues)}</div> */}
					<div
						className="bg-white flex flex-col justify-center align-middle w-5/6 mx-auto p-5 rounded-3xl"
						id="tableDiv"
					>
						<img src={logo} className="w-40 h-40 mx-auto" />
						<div className="mx-auto text-[#6457A6] text-center text-3xl mt-5 font-semibold">
							PURDCS Loan Application Form
						</div>
						<div className="mx-auto text-[#6457A6] text-center text-xl mt-5 font-semibold">
							Member Details
						</div>
						<div className="border-2 border-b-0 w-2/4 mx-auto mt-5 border-yellow-300"></div>
						<div className="relative overflow-x-auto shadow-md sm:rounded-2xl w-5/6 mx-auto mt-8">
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								{/* <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3 bg-slate-50 dark:bg-gray-800">
										ID
									</th>
									<th scope="col" className="px-6 py-3">
										Name
									</th>
									<th scope="col" className="px-6 py-3 bg-slate-50 dark:bg-gray-800">
										Age
									</th>
									<th scope="col" className="px-6 py-3">
										Job
									</th>
								</tr>
							</thead> */}
								<tbody>
									{data?.slice(0, 10)?.map((item, i) => (
										<tr
											className="border-b border-gray-200 dark:border-gray-700"
											key={i}
										>
											<th
												scope="row"
												className="px-6 py-4 w-1/4 font-bold text-wrap text-red-950 whitespace-nowrap bg-red-50 dark:text-white dark:bg-gray-800"
											>
												{item?.name}
											</th>
											<th
												scope="row"
												className="px-6 py-4 font-medium w-3/4 text-gray-900 text-wrap whitespace-nowrap bg-white dark:text-white dark:bg-gray-800"
											>
												{item?.value}
											</th>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mx-auto text-[#6457A6] text-center text-xl mt-5 font-semibold">
							Loan Details
						</div>
						<div className="border-b-0 border-2 w-2/4 mx-auto mt-5 border-yellow-300"></div>
						<div className="relative overflow-x-auto shadow-md sm:rounded-2xl w-5/6 mx-auto mt-8">
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<tbody>
									{data?.slice(10)?.map((item, i) => (
										<tr
											className="border-b border-gray-200 dark:border-gray-700"
											key={i}
										>
											<th
												scope="row"
												className="px-6 py-4 w-1/4 font-bold text-wrap text-red-950 whitespace-nowrap bg-red-50 dark:text-white dark:bg-gray-800"
											>
												{item?.name}
											</th>
											<th
												scope="row"
												className="px-6 py-4 font-medium w-3/4 text-gray-900 text-wrap whitespace-nowrap bg-white dark:text-white dark:bg-gray-800"
											>
												{item?.value}
											</th>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Footer */}
						<div className="grid grid-cols-2 place-items-start gap-5 mt-10 px-20">
							<div>
								<div className="text-xl mb-2 text-[#6457A6]">About Us</div>
								<hr className="mb-4" />
								<div>
									The Puri Urban and Rural Development Cooperative Society Ltd.
									was initially registered under OSHC Act, 2001 in the year 2007
									bearing registration No. 193/PU dated 23.03.2007 as Puri Urban
									and Rural Development Cooperative Ltd.
								</div>
							</div>
							<div>
								<div className="text-xl mb-2 text-[#6457A6]">Find Us</div>
								<hr className="mb-4" />
								<div>
									Puri Urban And Rural Development Cooperative Society Ltd. Near
									Jyoti Hotel, Grand Road Puri- 752001, Odisha, India
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-end mr-12 mt-8">
						<button
							type="button"
							className="text-gray-900 bg-yellow-300 hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex gap-2 items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2"
							onClick={generatePDF}
						>
							<DownloadOutlined />
							Download PDF
						</button>
					</div>
				</Spin>
			</div>
		</section>
	)
}

export default LoanView
