import React from "react"
import { Descriptions } from "antd"

function VendorInfo({ data }) {
	const items = [
		{
			key: "1",
			label: "Name",
			children: <p>{data?.info?.vendor_name}</p>,
		},
		{
			key: "2",
			label: "Phone",
			children: <p>{data?.info?.vendor_phone}</p>,
		},
		{
			key: "email",
			label: "Email",
			children: <p>{data?.info?.vendor_email}</p>,
		},
		{
			key: "address",
			label: "Address",
			children: <p>{data?.info?.vendor_address}</p>,
		},
		{
			key: "3",
			label: "PAN",
			children: <p>{data?.info?.vendor_pan}</p>,
		},
		{
			key: "4",
			label: "GST",
			children: <p>{data?.info?.vendor_gst}</p>,
		},
		{
			key: "5",
			label: "TAN",
			children: <p>{data?.info?.tan_no}</p>,
		},
		{
			key: "6",
			label: "MSME",
			children: <p>{data?.info?.msme_no}</p>,
		},
		{
			key: "7",
			label: "LD Clause",
			children: <p>{data?.info?.ld_clause_flag == "Y" ? "Yes" : "No"}</p>,
		},
		{
			key: "8",
			label: "LD Clause Description",
			children: <p>{data?.info?.ld_clause}</p>,
		},
		{
			key: "9",
			label: "Warranty",
			children: <p>{data?.info?.warranty}</p>,
		},
		{
			key: "10",
			label: "Erection Responsibility",
			children: (
				<p>{data?.info?.erection_responsibility == "Y" ? "Yes" : "No"}</p>
			),
		},
		// {
		//   key: "11",
		//   label: "Client Name",
		//   children: <p>{data?.info?.client_id}</p>,
		// }
		// ,
		// {
		//   key: "12",
		//   label: "Client Location",
		//   children: <p>{data?.info?.client_location}</p>,
		// }
		// ,
		// {
		//   key: "13",
		//   label: "Client GST",
		//   children: <p>{data?.info?.client_gst}</p>,
		// },
		// {
		//   key: "14",
		//   label: "Client PAN",
		//   children: <p>{data?.info?.client_gst}</p>,
		// }
		// ,
		{
			key: "15",
			label: "TDS",
			children: <p>{data?.info?.tds_flag == "Y" ? "Yes" : "No"}</p>,
		},
		{
			key: "16",
			label: "TDS(%)",
			children: <p>{data?.info?.tds_prtg}</p>,
		},
		{
			key: "17",
			label: "TCS",
			children: <p>{data?.info?.tcs_flag == "Y" ? "Yes" : "No"}</p>,
		},
		{
			key: "18",
			label: "TCS(%)",
			children: <p>{data?.info?.tcs_prtg}</p>,
		},
	]
	return (
		<div>
			<Descriptions
				title="Vendor Details"
				className="mx-auto my-6"
				labelStyle={{ color: "#014737", fontWeight: "bold" }}
				items={items}
			/>
			{data.deals.length > 0 && (
				<>
					{" "}
					<p className="font-semibold text-green-900 my-2"> Deals in </p>
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Category
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.deals?.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.name}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>{" "}
				</>
			)}
			{data.bank.length > 0 && (
				<>
					{" "}
					<p className="font-semibold text-green-900 my-2"> Bank Details </p>
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Bank
									</th>
									<th scope="col" className="px-6 py-3">
										Branch
									</th>
									<th scope="col" className="px-6 py-3">
										A/C No.
									</th>
									<th scope="col" className="px-6 py-3">
										IFSC
									</th>
									<th scope="col" className="px-6 py-3">
										MICR
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.bank?.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.bank_name}
										</th>
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.branch_name}
										</th>
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.ac_no}
										</th>
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.ifsc}
										</th>
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.micr_code}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>{" "}
				</>
			)}
			{data?.poc?.length > 0 && (
				<>
					<p className="font-semibold text-green-900 my-2">
						{" "}
						Contact Person Information{" "}
					</p>
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Name
									</th>

									<th scope="col" className="px-6 py-3">
										Primary Phone
									</th>
									<th scope="col" className="px-6 py-3">
										Secondary Phone
									</th>

									<th scope="col" className="px-6 py-3">
										Email
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.poc?.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item?.poc_name}
										</th>

										<td className="px-6 py-4">{item?.poc_ph_1}</td>
										<td className="px-6 py-4">{item?.poc_ph_2}</td>

										<td className="px-6 py-4">{item?.poc_email}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	)
}

export default VendorInfo
