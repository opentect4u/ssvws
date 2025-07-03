import React, { useState } from "react"
import { routePaths } from "../Assets/Data/Routes"
import { Link } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import { Paginator } from "primereact/paginator"
import { motion } from "framer-motion"

import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	SyncOutlined,
} from "@ant-design/icons"
import { Tag } from "antd"

function POTableView({ po_data, setSearch, title }) {
	const [first, setFirst] = useState(0)
	const [rows, setRows] = useState(10)
	const onPageChange = (event) => {
		setFirst(event.first)
		setRows(event.rows)
	}
	return (
		<>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<div className="flex flex-col p-1 bg-red-800 rounded-full my-3 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 ">
					<div className="w-full">
						<div className="flex items-center justify-between">
							<motion.h2
								initial={{ opacity: 0, y: -50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, type: "just" }}
								className="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-5"
							>
								{title}
							</motion.h2>

							<label for="simple-search" className="sr-only">
								Search
							</label>
							<div className="relative w-full -right-6 2xl:-right-12">
								<div className="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
									<svg
										aria-hidden="true"
										className="w-5 h-5 text-gray-500 dark:text-gray-400"
										fill="currentColor"
										viewbox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<motion.input
									type="text"
									id="simple-search"
									initial={{ opacity: 0, width: 0 }}
									animate={{ opacity: 1, width: "95%" }}
									transition={{ delay: 1.1, type: "just" }}
									className="bg-white border rounded-full border-emerald-500 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="Search"
									required=""
									onChange={(text) => setSearch(text.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>
			</motion.section>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<table className="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
					<thead className=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" className="p-4">
								#
							</th>
							<th scope="col" className="p-4">
								PO No.
							</th>
							<th scope="col" className="p-4">
								Date
							</th>
							<th scope="col" className="p-4">
								Vendor
							</th>
							<th scope="col" className="p-4">
								Project
							</th>
							<th scope="col" className="p-4">
								Status
							</th>
							<th scope="col" className="p-4">
								Created By
							</th>
							<th scope="col" className="p-4">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{po_data &&
							po_data?.slice(first, rows + first).map((item) => (
								<tr
									className={
										item.modified_at == null
											? +Math.floor(
													(new Date().getTime() -
														new Date(item.created_at).getTime()) /
														1000
											  ) < 1800
												? "bg-[#ffe4c4] duration-500 delay-700 border-b dark:bg-gray-800 dark:border-gray-700"
												: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
											: +Math.floor(
													(new Date().getTime() -
														new Date(item.modified_at).getTime()) /
														1000
											  ) < 1800
											? "bg-[#ffe4c4] border-b dark:bg-gray-800 duration-500 dark:border-gray-700"
											: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
									}
								>
									<th
										scope="row"
										className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{item.serial_number}
									</th>
									<td className="px-6 py-4">
										{item.po_no || "-----"}
										<p className="text-[10.5px] text-gray-500 italic">
											{item.modified_at == null ? (
												<span>
													{" "}
													Created{" "}
													{+Math.floor(
														(new Date().getTime() -
															new Date(item.created_at).getTime()) /
															1000
													) < 60
														? +Math.floor(
																(new Date().getTime() -
																	new Date(item.created_at).getTime()) /
																	1000
														  ).toFixed(0) + " seconds ago"
														: +Math.floor(
																(new Date().getTime() -
																	new Date(item.created_at).getTime()) /
																	1000
														  ) /
																60 <
														  60
														? (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.created_at).getTime()) /
																		1000
																) / 60
														  ).toFixed(0) + " minute(s) ago"
														: +Math.floor(
																(new Date().getTime() -
																	new Date(item.created_at).getTime()) /
																	1000
														  ) /
																3600 <
														  24
														? (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.created_at).getTime()) /
																		1000
																) / 3600
														  ).toFixed(0) + " hour(s) ago"
														: (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.created_at).getTime()) /
																		1000
																) /
																(3600 * 24)
														  ).toFixed(0) + " day(s) ago"}
												</span>
											) : (
												<span>
													{" "}
													Modified{" "}
													{+Math.floor(
														(new Date().getTime() -
															new Date(item.modified_at).getTime()) /
															1000
													) < 60
														? +Math.floor(
																(new Date().getTime() -
																	new Date(item.modified_at).getTime()) /
																	1000
														  ).toFixed(0) + " seconds ago"
														: +Math.floor(
																(new Date().getTime() -
																	new Date(item.modified_at).getTime()) /
																	1000
														  ) /
																60 <
														  60
														? (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.modified_at).getTime()) /
																		1000
																) / 60
														  ).toFixed(0) + " minute(s) ago"
														: +Math.floor(
																(new Date().getTime() -
																	new Date(item.modified_at).getTime()) /
																	1000
														  ) /
																3600 <
														  24
														? (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.modified_at).getTime()) /
																		1000
																) / 3600
														  ).toFixed(0) + " hour(s) ago"
														: (
																+Math.floor(
																	(new Date().getTime() -
																		new Date(item.modified_at).getTime()) /
																		1000
																) /
																(3600 * 24)
														  ).toFixed(0) + " day(s) ago"}
												</span>
											)}
										</p>
									</td>
									<td className="px-6 py-4">{item.po_issue_date}</td>
									<td className="px-6 py-4">{item.vendor_name}</td>
									<td className="px-6 py-4">
										{item.proj_name}
										{/* {item.fresh_flag} */}
									</td>
									<td className="px-6 py-4">
										{item.po_status == "P" ? (
											<Tag
												className="text-[12px] p-1 rounded-full w-36"
												icon={<SyncOutlined spin />}
												color="processing"
											>
												In Progress
												<Tooltip title="Draft saved">
													{" "}
													<FileTextOutlined className="text-red-500 ml-7" />
												</Tooltip>{" "}
											</Tag>
										) : item.po_status == "A" ? (
											<Tag
												className="text-[12px] p-1 rounded-full w-36"
												icon={<CheckCircleOutlined />}
												color="success"
											>
												Approved
											</Tag>
										) : item.po_status == "U" ? (
											<Tag
												className="text-[12px] p-1 rounded-full w-36"
												icon={<ClockCircleOutlined className="animate-pulse" />}
												color="error"
											>
												Pending Approval
											</Tag>
										) : item.po_status == "D" ? (
											<Tag
												className="text-[12px] p-1 rounded-full w-36"
												icon={<CheckCircleOutlined />}
												color="success"
											>
												Delivered
											</Tag>
										) : (
											<Tag
												className="text-[12px] p-1 rounded-full w-36"
												icon={<CheckCircleOutlined />}
												color="success"
											>
												{" "}
												Partially Delivered{" "}
											</Tag>
										)}
									</td>
									<td className="px-6 py-4">{item.created_by}</td>
									<td className="px-6 py-4">
										<Link
											to={
												item.fresh_flag == "Y"
													? routePaths.PURCHASEORDERFORM + "F/" + item.sl_no
													: routePaths.PURCHASEORDERFORM + "E/" + item.sl_no
											}
										>
											<EditOutlined className="text-md text-green-900" />
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<Paginator
					first={first}
					rows={rows}
					totalRecords={po_data?.length}
					rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
					onPageChange={onPageChange}
				/>
			</motion.section>
		</>
	)
}

export default POTableView
