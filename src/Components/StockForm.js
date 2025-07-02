import React from "react"
import { useParams } from "react-router"
import { DatePickerProps } from "antd"
import { DatePicker, Space } from "antd"
import { Select } from "antd"
import BtnComp from "./BtnComp"
import HeadingTemplate from "./HeadingTemplate"
const StockForm = ({ flag }) => {
	console.log(flag, "flag")
	const params = useParams()
	console.log(params, "params")
	const onChange = (value) => {
		console.log(`selected ${value}`)
	}
	const onSearch = (value) => {
		console.log("search:", value)
	}
	return (
		<section className="bg-white dark:bg-[#001529]">
			<div className="py-8 mx-auto w-5/6 lg:py-16">
				<HeadingTemplate text={params.id > 0 ? "Update stock" : "Add stock"} />

				<form action="#">
					<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
						<div>
							<label
								for="proj_id"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Project
							</label>
							<Select
								showSearch
								style={{ width: "100%" }}
								placeholder="Select a project"
								optionFilterProp="label"
								onChange={onChange}
								onSearch={onSearch}
								size={"large"}
								options={[
									{
										value: "jack",
										label: "Jack",
									},
									{
										value: "lucy",
										label: "Lucy",
									},
									{
										value: "tom",
										label: "Tom",
									},
								]}
							/>
						</div>
						<div>
							<label
								for="prod_id"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Product
							</label>
							<Select
								showSearch
								style={{ width: 520 }}
								placeholder="Select a product"
								optionFilterProp="label"
								onChange={onChange}
								onSearch={onSearch}
								size={"large"}
								options={[
									{
										value: "jack",
										label: "Jack",
									},
									{
										value: "lucy",
										label: "Lucy",
									},
									{
										value: "tom",
										label: "Tom",
									},
								]}
							/>
						</div>
						<div>
							<label
								for="pur_order_id"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Purchase order No.
							</label>
							<Select
								showSearch
								style={{ width: 520 }}
								placeholder="Select purchase order no."
								optionFilterProp="label"
								onChange={onChange}
								onSearch={onSearch}
								size={"large"}
								options={[
									{
										value: "jack",
										label: "001",
									},
									{
										value: "lucy",
										label: "002",
									},
									{
										value: "tom",
										label: "003",
									},
								]}
							/>
						</div>
						<div>
							<label
								for="inv_no"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								{flag == 1 ? "Vendor" : "Client"} Invoice
							</label>
							<input
								type="number"
								name="inv_no"
								id="inv_no"
								className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Type vendor invoice no."
								required=""
							/>
						</div>
						{flag == 1 && (
							<div>
								<label
									for="freight"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Freight
								</label>
								<input
									type="number"
									name="freight"
									id="freight"
									className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="Freight"
									required=""
								/>
							</div>
						)}
						{flag == 1 && (
							<div>
								<label
									for="stck_cnt"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Insurance
								</label>
								<input
									type="number"
									name="insurance"
									id="insurance"
									className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder="Insurance"
									required=""
								/>
							</div>
						)}
						{flag == 2 && (
							<div className="sm:col-span-2">
								<label
									for="status"
									className="block my-3 text-sm font-medium text-gray-900 dark:text-white"
								>
									Status
								</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Select status"
									optionFilterProp="label"
									onChange={onChange}
									onSearch={onSearch}
									size={"large"}
									options={[
										{
											value: "onhold",
											label: "On Hold",
										},
										{
											value: "recvd",
											label: "Received",
										},
									]}
								/>
							</div>
						)}
						<div className="sm:col-span-2">
							<label
								for="packing_list"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Packing List
							</label>
							<textarea
								id="packing_list"
								rows="8"
								className="block p-2.5 w-full text-sm text-gray-900 bg-slate-50 rounded-lg border border-gray-300 focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Packing List Details"
							></textarea>
						</div>
					</div>
					<BtnComp />
				</form>
			</div>
		</section>
	)
}

export default StockForm
