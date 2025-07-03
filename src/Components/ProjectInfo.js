import React from "react"
import { Descriptions } from "antd"

function ProjectInfo({ data }) {
	const items = [
		{
			key: "ppp",
			label: "ID",
			children: <p>{data?.info?.proj_id}</p>,
		},
		{
			key: "1",
			label: "Name",
			children: <p>{data?.info?.proj_name}</p>,
		},
		{
			key: "2",
			label: "Order ID",
			children: <p>{data?.info?.order_id}</p>,
		},
		{
			key: "3",
			label: "Order Date",
			children: <p>{data?.info?.order_date}</p>,
		},
		{
			key: "4",
			label: "Delivery Date",
			children: <p>{data?.info?.proj_delivery_date}</p>,
		},
		{
			key: "5",
			label: "Project Order Value",
			children: <p>{data?.info?.proj_order_val}</p>,
		},
		{
			key: "6",
			label: "Price Basis",
			children: <p>{data?.info?.price_basis == "F" ? "For" : "Ex-Works"}</p>,
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
		{
			key: "11",
			label: "Client Name",
			children: <p>{data?.info?.client_name}</p>,
		},
		{
			key: "12",
			label: "Client Location",
			children: <p>{data?.info?.client_location}</p>,
		},
		{
			key: "13",
			label: "Client GST",
			children: <p>{data?.info?.client_gst}</p>,
		},
		{
			key: "14",
			label: "Client PAN",
			children: <p>{data?.info?.client_pan}</p>,
		},
		{
			key: "15",
			label: "Project Description",
			children: <p>{data?.info?.proj_desc}</p>,
		},
		{
			key: "16",
			label: "End User",
			children: <p>{data?.info?.proj_end_user}</p>,
		},
		{
			key: "17",
			label: "Consultant",
			children: <p>{data?.info?.proj_consultant}</p>,
		},
		{
			key: "18",
			label: "EPC Contractor",
			children: <p>{data?.info?.epc_contractor}</p>,
		},
		{
			key: "19",
			label: "Project Manager",
			children: <p>{data?.info?.proj_manager_name}</p>,
		},
	]
	return (
		<div>
			<Descriptions
				title="Project Details"
				className="mx-auto my-6"
				labelStyle={{ color: "#014737", fontWeight: "bold" }}
				items={items}
			/>
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
										Designation
									</th>
									<th scope="col" className="px-6 py-3">
										Primary Phone
									</th>
									<th scope="col" className="px-6 py-3">
										Email
									</th>
								</tr>
							</thead>
							<tbody>
								{data.poc?.map((item) => (
									<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{item.name}
										</th>

										<td className="px-6 py-4">{item.poc_designation}</td>
										<td className="px-6 py-4">{item.poc_phone_1}</td>

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

export default ProjectInfo
