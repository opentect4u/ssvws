import React from "react"
import { Select } from "antd"
import { DatePicker } from "antd"
import { useParams } from "react-router"

import BtnComp from "../Components/BtnComp"
import { Divider, Flex, Tag } from "antd"

function StockTransTemplate({ mode }) {
	return (
		<form action="#">
			<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<div className="sm:col-span-2">
					<div className="flex flex-col">
						<label
							for="name"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
						>
							Date
						</label>
						<DatePicker
							name="order_dt"
							id="order_dt"
							size={"large"}
							className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 w-full dark:focus:border-primary-500"
							placeholder="Order date"
							required=""
						/>
					</div>
				</div>

				<div className="w-full flex flex-col">
					<label
						for="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
					>
						Client Name
					</label>

					<Select
						showSearch
						className="w-full"
						placeholder="Select client"
						optionFilterProp="label"
						// onChange={onChange}
						// onSearch={onSearch}
						size={"large"}
						options={[
							{
								value: "",
								label: "Select client",
							},
							{
								value: "P",
								label: "L&T",
							},
							{
								value: "G",
								label: "A/C BEUMER_JPPL-",
							},
						]}
					/>
				</div>
				<div className="w-full flex flex-col">
					<label
						for="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
					>
						Project Name
					</label>

					<Select
						showSearch
						className="w-full"
						placeholder="Select project"
						optionFilterProp="label"
						// onChange={onChange}
						// onSearch={onSearch}
						size={"large"}
						options={[
							{
								value: "",
								label: "Select client",
							},
							{
								value: "P",
								label: "L&T",
							},
							{
								value: "G",
								label: "A/C BEUMER_JPPL-",
							},
						]}
					/>
				</div>
				{(mode == 2 || mode == 3) && (
					<>
						<div className="w-full flex flex-col">
							<label
								for="name"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
							>
								{mode == 2 ? "Send to" : "Received from"}
							</label>

							<Select
								showSearch
								className="w-full"
								placeholder="Select project manager"
								optionFilterProp="label"
								// onChange={onChange}
								// onSearch={onSearch}
								size={"large"}
								options={[
									{
										value: "",
										label: "Select project manager",
									},
									{
										value: "P",
										label: "L&T",
									},
									{
										value: "G",
										label: "A/C BEUMER_JPPL-",
									},
								]}
							/>
						</div>
						<div className="w-full flex flex-col">
							<label
								for="name"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
							>
								Duration
							</label>
							<input
								type="number"
								name="name"
								id="name"
								className="bg-slate-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white   active:border-green-900 focus:border-1 duration-300 dark:focus:ring-green-900 dark:focus:border-green-900"
								placeholder="Type duration(days)"
								required=""
							/>
						</div>
					</>
				)}
				<div className="w-full flex flex-col">
					<label
						for="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
					>
						Product category
					</label>

					<Select
						showSearch
						className="w-full"
						placeholder="Select category"
						optionFilterProp="label"
						// onChange={onChange}
						// onSearch={onSearch}
						size={"large"}
						options={[
							{
								value: "",
								label: "Select client",
							},
							{
								value: "P",
								label: "L&T",
							},
							{
								value: "G",
								label: "A/C BEUMER_JPPL-",
							},
						]}
					/>
				</div>
				<div className="w-full flex flex-col">
					<label
						for="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
					>
						Product
					</label>

					<Select
						showSearch
						className="w-full"
						placeholder="Select product"
						optionFilterProp="label"
						// onChange={onChange}
						// onSearch={onSearch}
						size={"large"}
						options={[
							{
								value: "",
								label: "Select product",
							},
							{
								value: "P",
								label: "L&T",
							},
							{
								value: "G",
								label: "A/C BEUMER_JPPL-",
							},
						]}
					/>
				</div>

				<div className="sm:col-span-2 flex flex-col">
					<label
						for="name"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
					>
						Quantity
					</label>

					<input
						type="number"
						name="qty"
						id="qty"
						className="bg-slate-50 border relative border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						placeholder="99"
						required=""
					/>
					<Tag
						className="absolute sm:-bottom-13 sm:right-40 -bottom-16 right-24"
						color="#f50"
					>
						88
					</Tag>
				</div>
				{(mode == 2 || mode == 3) && (
					<>
						<div className="sm:col-span-2 flex flex-col">
							<label
								for="name"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
							>
								Status
							</label>

							<Select
								showSearch
								className="w-full"
								placeholder="Select status"
								optionFilterProp="label"
								// onChange={onChange}
								// onSearch={onSearch}
								size={"large"}
								options={[
									{
										value: "",
										label: "Select status",
									},
									{
										value: "P",
										label: "Initiated",
									},
									{
										value: "G",
										label: "Accepted",
									},
									{
										value: "G",
										label: "Rejected",
									},
									{
										value: "G",
										label: "In Process",
									},
								]}
							/>
						</div>
						<div className="sm:col-span-2 flex flex-col">
							<label
								for="name"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300"
							>
								Comments
							</label>
							<textarea
								rows="8"
								className="block p-2.5 w-full text-sm text-gray-900 bg-slate-50 rounded-lg border border-gray-300 focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								// name={props.name}
								// value={props.formControlName}
								// placeholder={props.placeholder}
								// onChange={props.handleChange}
								// onBlur={props.handleBlur}
							/>
						</div>
					</>
				)}
			</div>

			<BtnComp />
		</form>
	)
}

export default StockTransTemplate
