import React from "react"
import { Descriptions } from "antd"

function ClientInfo({ data }) {
	const items = [
		{
			key: "1",
			label: "Name",
			children: <p>{data.info.client_name}</p>,
		},
		{
			key: "2",
			label: "Vendor Code",
			children: <p>{data.info.vendor_code}</p>,
		},
	]
	return (
		<div className="mx-auto">
			<Descriptions
				title="Client Details"
				className="mx-auto my-6"
				labelStyle={{ color: "#014737" }}
				items={items}
			/>

			{data.loc.length > 0 && (
				<>
					{" "}
					<p className="font-semibold text-green-900 my-2">
						{" "}
						Location Information{" "}
					</p>
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-white uppercase bg-green-900 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										Location
									</th>
									<th scope="col" className="px-6 py-3">
										GST
									</th>
									<th scope="col" className="px-6 py-3">
										PAN
									</th>
								</tr>
							</thead>
							<tbody>
								{data.loc.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item.c_loc}
										</th>
										<td className="px-6 py-4">{item.c_gst}</td>
										<td className="px-6 py-4">{item.c_pan}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>{" "}
				</>
			)}
			{data.poc.length > 0 && (
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
										Department
									</th>
									<th scope="col" className="px-6 py-3">
										Designation
									</th>
									<th scope="col" className="px-6 py-3">
										Primary Phone
									</th>
									<th scope="col" className="px-6 py-3">
										Secondary Phone
									</th>
									<th scope="col" className="px-6 py-3">
										Direct No.
									</th>
									<th scope="col" className="px-6 py-3">
										Extension No.
									</th>
									<th scope="col" className="px-6 py-3">
										Email
									</th>
								</tr>
							</thead>
							<tbody>
								{data.poc.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item.poc_name}
										</th>
										<td className="px-6 py-4">{item.poc_department}</td>
										<td className="px-6 py-4">{item.poc_designation}</td>
										<td className="px-6 py-4">{item.poc_ph_1}</td>
										<td className="px-6 py-4">{item.poc_ph_2}</td>
										<td className="px-6 py-4">{item.poc_direct_no}</td>
										<td className="px-6 py-4">{item.poc_ext_no}</td>
										<td className="px-6 py-4">{item.poc_email}</td>
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

export default ClientInfo
