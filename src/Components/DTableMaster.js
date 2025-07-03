import React, { useRef, useState, useEffect } from "react"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AddIcon from "@mui/icons-material/Add"
import { Link, useNavigate } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import nodata from "../../src/Assets/Images/nodata.png"
import { Tag } from "primereact/tag"
import { PrinterOutlined, EditOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"
import PrintHeader from "./PrintHeader"

function DTableMaster({
	headers,
	data,
	flag,
	onPress,
	title,
	btnText,
	onclick,
	setSearch,
	to,
}) {
	const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />
	const paginatorRight = <Button type="button" icon="pi pi-download" text />
	const [selectedItem, setSelectedItem] = useState(null)
	const [theme, setTheme] = useState(localStorage.getItem("col"))
	const navigate = useNavigate()
	var id
	const iconTemplate = () => {
		return flag == 1 ? (
			<VisibilityIcon className="text-blue-900" />
		) : (
			<EditOutlined className="text-green-900" />
		)
	}
	const getSeverity = (status) => {
		switch (status) {
			case "In Progress":
				return "warning"

			case "Approved":
				return "success"

			case "Unapproved":
				return "error"

			case "Delivered":
				return "success"

			case "Partial Delivery":
				return "warning"

			case "renewal":
				return null
		}
	}
	const statusBodyTemplate = (rowData) => {
		console.log(rowData)
		return (
			<Tag
				value={rowData.po_status_val}
				severity={getSeverity(rowData.po_status_val)}
			/>
		)
	}
	const onViewSelect = (event) => {
		id = event
		navigate(to + id.sl_no)
		console.log(id)
	}

	const onRowSelect = (event) => {
		console.log(event, "event")
		id = event.data
		navigate(to + id.sl_no)
	}

	const onRowUnselect = (event) => {}
	function print() {
		var divToPrint = document.getElementById("tablePrint")

		var WindowObject = window.open("", "Print-Window")
		WindowObject.document.open()
		WindowObject.document.writeln("<!DOCTYPE html>")
		WindowObject.document.writeln(
			'<html><head><title></title><style type="text/css">'
		)

		WindowObject.document.writeln(
			"@media print { .center { text-align: center;}" +
				"                                         .inline { display: inline; }" +
				"                                         .underline { text-decoration: underline; }" +
				"                                         .left { margin-left: 315px;} " +
				"                                         .right { margin-right: 375px; display: inline; }" +
				"                                          table { border-collapse: collapse; font-size: 10px;}" +
				"                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}" +
				"                                           th, td { }" +
				"                                         .border { border: 1px solid black; } " +
				"                                         .bottom { bottom: 5px; width: 100%; position: fixed " +
				"                                       " +
				"                                   } .p-paginator-bottom.p-paginator.p-component { display: none; } .heading{display: flex; flex-direction: column; justify-content: center; align-items: center;font-weight:800;margin-bottom:15px} } </style>"
		)
		WindowObject.document.writeln('</head><body onload="window.print()">')
		WindowObject.document.writeln(divToPrint.innerHTML)
		WindowObject.document.writeln("</body></html>")
		WindowObject.document.close()
		setTimeout(function () {
			WindowObject.close()
		}, 10)
	}
	const renderTooltip = (rowData, field) => {
		return (
			<Tooltip title="Click to view details" arrow>
				<span>{rowData[field]}</span>
			</Tooltip>
		)
	}
	useEffect(() => {
		console.log(flag, "flag")
	}, [])
	return (
		<>
			<div className="hidden justify-end sm:flex">
				<motion.section
					initial={{ opacity: 0, y: 1000 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, type: "tween", stiffness: 100 }}
					className="bg-transparent dark:bg-[#001529] py-3 sm:py-3 -mt-5"
				>
					<div className="flex items-center h-14 -mt-4 w-auto md:flex-row space-y-3 md:space-y-0 rounded-lg">
						{btnText && (
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.3, type: "just" }}
								className="w-full hidden md:block  md:w-auto sm:flex sm:flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
							>
								<Tooltip title={btnText}>
									{/* <Link to={to + 0}
              type="submit"
              className="flex items-center justify-center text-white bg-[#eb8d00] hover:bg-primary-800  font-semibold rounded-l-md transition ease-in-out hover:-translate-x-1 hover:scale-110 text-xs p-2 dark:bg-gray-800 dark:text-white dark:hover:bg-primary-700 focus:outline-none  hover:duration-500 hover:shadow-lg dark:focus:ring-primary-800 ml-2"
            > */}
									<Link
										to={to + 0}
										type="submit"
										className="flex items-center justify-center border-2 border-white border-r-0 text-white bg-red-800 hover:bg-primary-800 text-nowrap rounded-l-md transition ease-in-out  active:scale-90 text-sm p-1 px-2 dark:bg-gray-800 dark:text-white dark:hover:bg-primary-700 focus:outline-none shadow-lg  hover:duration-500 hover:shadow-lg dark:focus:ring-primary-800 ml-2 capitalize"
									>
										<AddIcon className="text-sm" /> {btnText}
									</Link>
								</Tooltip>
							</motion.div>
						)}
						<motion.button
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								delay: 1.3,
								type: "just",
							}}
							onClick={() => print()}
							className={
								btnText
									? "bg-white border-2 border-l-0 text-red-800 font-semibold text-lg rounded-r-full p-0.5 shadow-lg"
									: "bg-white border-2 border-l-0 text-red-800 font-semibold text-lg rounded-full h-10 w-10 p-0.5 shadow-lg"
							}
						>
							<Tooltip title="Print this table" arrow>
								<PrinterOutlined />
							</Tooltip>
						</motion.button>
					</div>
				</motion.section>
			</div>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
				className="bg-transparent dark:bg-[#001529] py-3 sm:py-5 w-full -mt-5"
			>
				{title && data && (
					<div className="bg-transparent dark:bg-gray-800 relative shadow-md rounded-full overflow-hidden">
						<div className="flex flex-col p-1 bg-red-800 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 ">
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
											className="bg-white border rounded-full border-red-800 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
											placeholder="Search"
											required=""
											onChange={(text) => setSearch(text.target.value)}
										/>
									</div>
									{/* {btnText &&  <motion.div  initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:1.3, type:'just'}} className="w-full hidden md:block  md:w-auto sm:flex sm:flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <Tooltip title={btnText}>
                  <Link to={to+0}
                    type="submit"
                   className="flex items-center justify-center text-green-900 bg-white hover:bg-primary-800  font-medium rounded-full transition ease-in-out hover:-translate-x-1 hover:scale-110 text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:hover:bg-primary-700 focus:outline-none  hover:duration-500 hover:shadow-lg dark:focus:ring-primary-800 "
                  
    
                  >
                    <AddIcon /> {btnText}
                  </Link>
                </Tooltip>
              </motion.div>} */}
									{/* <div className='p-1'>
                    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                      <MoreOutlined className='flex items-center justify-center  text-white   rounded-full  text-3xl font-bold px-2 h-10 w-10 py-2 dark:text-white focus:outline-none  transition duration-0 hover:duration-500 dark:focus:ring-primary-800' />
                    </Dropdown>

                  </div> */}
								</div>
							</div>
						</div>
					</div>
				)}
				{data && (
					<div>
						<div className="card w-full mt-5 ">
							<DataTable
								value={data}
								showGridlines={true}
								stripedRows
								stickyHeader="true"
								scrollable
								paginator
								rows={10}
								body={statusBodyTemplate}
								rowsPerPageOptions={[5, 10, 25, 50, 100, data?.length]}
								// rowClassName='bg-white text-gray-800 border border-b-gray-300 border-r-white border-l-white active:border-0 hover:bg-green-700 hover:text-white  duration-500 space-y-2 dark:hover:bg-[#1e4834]'
								// rowClassName='bg-white text-gray-800 border border-b-gray-300 border-r-white border-l-white active:border-0 hover:bg-[#C4F1BE] hover:text-green-700 hover:font-extrabold  duration-500 space-y-2 dark:hover:text-[#1e4834]'
								rowClassName="bg-white text-gray-800 border border-b-gray-300 border-r-white border-l-white active:border-0 hover:bg-gray-200 hover:text-green-700 duration-500 space-y-2 dark:hover:text-[#1e4834] 
              text-ellipsis overflow-hidden truncate w-2"
								tableStyle={{ minWidth: "100%", fontSize: "14px" }}
								paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
								paginatorClassName="bg-white text-emerald-500"
								currentPageReportTemplate="{first} to {last} of {totalRecords}"
								paginatorLeft={paginatorLeft}
								paginatorRight={paginatorRight}
								styleclassName="p-datatable-gridlines dark:bg-gray-800 dark:text-gray-300 shadow-lg"
								className="shadow-lg rounded-lg"
								selectionMode="single"
								selection={selectedItem}
								onSelectionChange={(e) => setSelectedItem(e.value)}
								dataKey="id"
								onRowSelect={onRowSelect}
								onRowUnselect={onRowUnselect}
								metaKeySelection={false}
							>
								{headers.map((item, index) => (
									<Column
										key={index}
										field={item.name}
										header={item.value}
										headerClassName={
											"text-green-900 bg-[#F7DAD9] border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold"
										}
										// headerClassName={'text-green-900 bg-green-300 border-b-green-900 dark:bg-gray-700 dark:text-white dark:font-bold'}

										style={{ width: "10%" }}
										body={(rowData) => renderTooltip(rowData, item.name)}
									></Column>
								))}
								{/* {flag == 1 && ( */}
								<Column
									body={iconTemplate}
									header={"Edit/View"}
									headerClassName={
										"text-red-900 bg-[#F7DAD9] border-b-red-900  dark:bg-gray-700 dark:text-white dark:font-bold"
									}
									style={{ width: "10%" }}
									frozen
								></Column>

								{/* )} */}
								{/* {flag == 2 && (
                <Column
                  body={iconTemplate}
                  header={"Action"}
                  headerClassName="text-blue-900 bg-blue-300"
                  style={{ width: "10%" }}
                  frozen
                ></Column>
              )} */}
							</DataTable>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ type: "spring", stiffness: 400 }}
							></motion.div>
						</div>
						<div className="hidden w-full" id="tablePrint">
							<PrintHeader />

							<DataTable
								value={data}
								showGridlines={true}
								stripedRows
								stickyHeader="true"
								scrollable
								paginator
								rows={data?.length}
								rowsPerPageOptions={[5, 10, 25, 50, 100, data?.length]}
								// rowClassName=' border border-b-gray-300 dark:border-green-900 hover:bg-emerald-500 hover:font-semibold dark:hover:bg-[#1e4834]'
								rowClassName=" border border-b-gray-300 dark:border-green-900 hover:bg-emerald-500 hover:font-semibold dark:hover:text-green-900"
								tableStyle={{ minWidth: "100%", fontSize: "14px" }}
								paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
								paginatorClassName="dark:bg-white dark:text-gray-700"
								currentPageReportTemplate="{first} to {last} of {totalRecords}"
								paginatorLeft={paginatorLeft}
								paginatorRight={paginatorRight}
								styleclassName="p-datatable-gridlines dark:bg-gray-800 dark:text-gray-300"
								selectionMode="single"
								selection={selectedItem}
								onSelectionChange={(e) => setSelectedItem(e.value)}
								dataKey="id"
								onRowSelect={onRowSelect}
								onRowUnselect={onRowUnselect}
								metaKeySelection={false}
							>
								{headers?.map((item, index) => (
									// <>
									<Column
										key={index}
										field={item.name}
										header={item.value}
										headerClassName={
											"text-green-800 bg-gray-300 dark:bg-gray-700 dark:text-white dark:font-bold"
										}
										style={{ width: "10%" }}
									></Column>
								))}
								{flag == 1 && (
									<Column
										body={iconTemplate}
										header={"Edit/View"}
										headerClassName="text-blue-900 bg-blue-300"
										style={{ width: "10%" }}
										frozen
									></Column>
								)}
								{flag == 2 && (
									<Column
										body={iconTemplate}
										header={"Edit/View"}
										headerClassName="text-blue-900 bg-blue-300"
										style={{ width: "10%" }}
										frozen
									></Column>
								)}
							</DataTable>
						</div>
					</div>
				)}
				{!data && (
					<div className="flex-col ml-72 mx-auto justify-center items-center">
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, type: "spring" }}
							src={nodata}
							className="h-96 w-96 2xl:ml-48 2xl:h-full"
							alt="Flowbite Logo"
						/>
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1, type: "spring" }}
							className="h-12 text-green-900 -mt-16 ml-9 2xl:ml-48 2xl:h-24 font-bold"
						>
							Please create something to view data here!!
						</motion.h2>
					</div>
				)}
			</motion.section>
		</>
	)
}

export default DTableMaster
