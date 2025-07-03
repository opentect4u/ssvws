import React, { useEffect, useState } from "react"
import { Chart } from "primereact/chart"

import { motion } from "framer-motion"
import { Segmented } from "antd"
import {
	InfoCircleOutlined,
	SettingOutlined,
	CloseOutlined,
	SolutionOutlined,
	ProjectOutlined,
	BellOutlined,
	UserAddOutlined,
	SwapOutlined,
	InboxOutlined,
	UserSwitchOutlined,
	FileSearchOutlined,
	BarChartOutlined,
	ExceptionOutlined,
} from "@ant-design/icons"
import { Flex, Progress } from "antd"
import { WidthFull } from "@mui/icons-material"
import DialogBox from "../../Components/DialogBox"
import { routePaths } from "../../Assets/Data/Routes"
import { Link } from "react-router-dom"
function HomeScreen() {
	const [chartData, setChartData] = useState({})
	const [chartOptions, setChartOptions] = useState({})
	const [visible, setVisible] = useState(false)
	const [flag, setFlag] = useState(2)
	useEffect(() => {
		const documentStyle = getComputedStyle(document.documentElement)
		const textColor = documentStyle.getPropertyValue("#08453c")
		const textColorSecondary = documentStyle.getPropertyValue("#08453c")
		const surfaceBorder = documentStyle.getPropertyValue("--surface-border")
		const data = {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "First Dataset",
					data: [65, 59, 80, 81, 56, 55, 40],
					fill: false,
					borderColor: "#15803D",
					tension: 0.4,
				},
				{
					label: "Second Dataset",
					data: [28, 48, 40, 19, 86, 27, 90],
					fill: false,
					borderColor: "#EAB308",
					tension: 0.4,
				},
			],
		}
		const options = {
			maintainAspectRatio: false,
			aspectRatio: 0.6,
			plugins: {
				legend: {
					labels: {
						color: textColor,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						color: textColorSecondary,
					},
					grid: {
						color: surfaceBorder,
					},
				},
				y: {
					ticks: {
						color: textColorSecondary,
					},
					grid: {
						color: surfaceBorder,
					},
				},
			},
		}

		setChartData(data)
		setChartOptions(options)
	}, [])

	return (
		<main className="px-4 h-auto my-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<Link
					to={routePaths.PROJECTS}
					className="relative cursor-pointer  border-dashed transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 2xl:h-32 flex  items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#92140C]">
						<ProjectOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl  absolute right-3 top-3 font-bold">
						Projects Opened
					</div>
					<div className="text-[#92140C] text-4xl ml-14 mt-9 font-bold">89</div>
				</Link>
				<Link
					to={routePaths.USERS}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-green-700">
						<UserAddOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Users
					</div>
					<div className="text-green-700 text-4xl ml-14 mt-9 font-bold">
						153
					</div>
				</Link>
				<Link
					to={routePaths.VENDORS}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-yellow-500">
						<InboxOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Vendors
					</div>
					<div className="text-yellow-500 text-4xl ml-14 mt-9 font-bold">
						25
					</div>
				</Link>
				<Link
					to={routePaths.CLIENTS}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#6564DB]">
						<UserSwitchOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Clients
					</div>
					<div className="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">52</div>
				</Link>
				{/* <Link
					to={routePaths.PURCHASEORDER}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-green-700">
						<FileSearchOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Inspections
					</div>
					<div className="text-green-700 text-4xl ml-14 mt-9 font-bold">12</div>
				</Link>
				<Link
					to={routePaths.STOCKASSIGNVIEW}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#6564DB]">
						<BarChartOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Stock Levels
					</div>
					<div className="text-[#6564DB] text-4xl ml-14 mt-9 font-bold">
						2352
					</div>
				</Link>
				<Link
					to={routePaths.PROJECTS}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-[#92140C]">
						<ProjectOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Projects Running
					</div>
					<div className="text-[#92140C] text-4xl ml-14 mt-9 font-bold">63</div>
				</Link>
				<Link
					to={routePaths.PURCHASEORDER}
					className="relative cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border-dashed bg-white rounded-lg shadow-lg border-gray-800 text-white text-5xl dark:border-gray-600 h-24 md:h-24 flex 2xl:h-32 items-center"
				>
					<div className="h-full rounded-l-lg w-1/3 flex justify-center items-center bg-yellow-500">
						<ExceptionOutlined className="text-white text-5xl" />
					</div>
					<div className="text-gray-800 text-sm 2xl:text-2xl absolute right-3 top-3 font-bold">
						Pending POs
					</div>
					<div className="text-yellow-500 text-4xl ml-14 mt-9 font-bold">
						15
					</div>
				</Link> */}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				{/* <div
          initial={{ x: -500 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 20 }}
          className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-lg flex justify-center py-5 dark:border-gray-600 h-32 md:h-64 shadow-2xl cursor-pointer"
          onClick={() => setVisible(true)}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, type: "tween", duration: 1.5 }}
            className="text-emerald-100 font-sans text-lg font-thin"
          >
            Welcome {localStorage.getItem("user_name")}
          </motion.h2>

          <img
            className="absolute bottom-0 p-2 h-52 w-full"
            src={`${HELLO}`}
            alt=""
          />
        </div>  */}

				{/* <div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 20,
          }}
          className=" rounded-lg bg-transparent col-span-1 dark:border-gray-600 p-4 h-44 md:h-64"
        >
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 10 }}
            className="card flex-col text-xs flex-wrap items-center justify-evenly space-y-2 gap-4  max-h-full -mt-3"
          >
            <div className="px-5 bg-white text-emerald-800 font-thin text-sm h-14 w-full rounded-lg flex justify-start items-center shadow-xl">
              <SettingOutlined className="mr-4 bg-emerald-700 text-white rounded-full text-normal p-2" />{" "}
              Materials delivered
            </div>
            <div className="px-5 bg-white text-emerald-800 h-14 w-full rounded-lg text-sm flex justify-start items-center shadow-xl">
              <CloseOutlined className="mr-4 bg-purple-950 text-white rounded-full text-normal p-2" />{" "}
              Date nearing
            </div>
            <div className="px-5 bg-white text-emerald-800 h-14 w-full rounded-lg flex justify-start items-center shadow-xl ">
              <InfoCircleOutlined className="mr-4 bg-emerald-300 text-white rounded-full text-normal p-2" />{" "}
              New project opened
            </div>
            <div className="px-5 bg-white text-emerald-800 font-thin h-14 w-full rounded-lg flex justify-start items-center shadow-xl text-sm">
              <SettingOutlined className="mr-4 bg-[#F4EF88] text-emerald-700 rounded-full text-normal p-2" />{" "}
              Nut bolts delivered
            </div>
          </div>
        </div>
        {/* <div className=" flex rounded-lg col-span-2 bg-transparent dark:border-gray-600  h-32 md:h-64">
          <div className="flex flex-col">
            <div
              whileHover={{ scale: 1.1, backgroundColor: "#C05746" }}
              initial={{ y: -600 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 20 }}
              className="hover:-translate-y-1 hover:scale-110 bg-gradient-to-tr from-white to-gray-100 h-40 sm:w-32 2xl:w-56 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-5xl mb-2 text-emerald-700">32</span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                className="text-emerald-700 font-sans "
              >
                Clients
              </motion.h2>
            </div>
            <div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 h-20 mt-3 w-32 2xl:w-56 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2 text-white">78</span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                className="text-gray-300 text-sm "
              >
                Vendors
              </motion.h2>
            </div>
          </div>
          <div className="ml-3 flex flex-col">
            <div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              className="bg-[#F3DE8A] h-20 w-32 2xl:w-56 shadow-lg rounded-lg flex flex-col items-center justify-center"
            >
              <span className="text-3xl mb-1 text-emerald-700">12</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                className="text-emerald-700 text-sm "
              >
                Running projects
              </motion.h2>
            </div>

            <div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              className="bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800  h-40 mt-3 w-32 2xl:w-56 shadow-lg rounded-lg flex flex-col justify-center items-center"
            >
              <span className="text-5xl  text-gray-300">8</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                className="text-gray-300 text-sm "
              >
                Pending POs
              </motion.h2>
            </div>
          </div>
          <div className="ml-3 flex flex-col">
            <div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 20 }}
              className="bg-gradient-to-t from-emerald-600 via-emerald-700 to-emerald-800 h-32 w-56 2xl:w-60 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <span className="text-5xl  text-gray-300">2393</span>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, type: "tween" }}
                className="text-gray-300 text-sm "
              >
                Stock Levels
              </motion.h2>
            </div>
            <div className="flex mt-3">
              <div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 20 }}
                className="bg-gradient-to-tr from-white to-gray-100 mr-3 h-28 w-1/2 2xl:w-3/4 shadow-lg rounded-lg flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2 text-emerald-700">5</span>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, type: "tween" }}
                  className="text-emerald-700 text-xs "
                >
                  Pending Deliveries
                </motion.h2>
              </div>
              <div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 20 }}
                className="bg-[#F3DE8A] h-28 w-1/2 2xl:w-3/4 shadow-lg rounded-lg flex flex-col justify-center items-center"
              >
                <span className="text-2xl mb-2 text-emerald-700">5</span>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, type: "tween" }}
                  className="text-emerald-700 text-xs "
                >
                  Inspections
                </motion.h2>
              </div>
            </div>
          </div>
        </div> */}

				<div className="col-span-4 space-y-2">
					<Segmented
						itemActiveBg="#08453c"
						options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
						onChange={(value) => {
							console.log(value) // string
						}}
					/>
				</div>
				<div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 1, type: "spring", stiffness: 20 }}
					className="bg-white rounded-lg shadow-lg dark:border-gray-600 h-32 md:h-64"
				>
					<Chart
						type="line"
						className="h-64"
						data={chartData}
						options={chartOptions}
					/>
				</div>
				<div
					initial={{ opacity: 0, x: 600 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 1, type: "spring", stiffness: 20 }}
					className="bg-green-700 flex justify-center col-span-1 items-center shadow-lg rounded-lg border-white dark:border-gray-600 h-32 md:h-64"
				>
					<Progress
						strokeLinecap="butt"
						type="circle"
						strokeColor={"white"}
						percent={75}
					/>
				</div>
				<div className="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-white bg-green-700 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Product name
								</th>
								<th scope="col" className="px-6 py-3">
									Color
								</th>
								<th scope="col" className="px-6 py-3">
									Category
								</th>
								<th scope="col" className="px-6 py-3">
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Apple MacBook Pro 17"
								</th>
								<td className="px-6 py-4">Silver</td>
								<td className="px-6 py-4">Laptop</td>
								<td className="px-6 py-4">$2999</td>
							</tr>
							<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Microsoft Surface Pro
								</th>
								<td className="px-6 py-4">White</td>
								<td className="px-6 py-4">Laptop PC</td>
								<td className="px-6 py-4">$1999</td>
							</tr>
							<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Magic Mouse 2
								</th>
								<td className="px-6 py-4">Black</td>
								<td className="px-6 py-4">Accessories</td>
								<td className="px-6 py-4">$99</td>
							</tr>
							<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-slate-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Google Pixel Phone
								</th>
								<td className="px-6 py-4">Gray</td>
								<td className="px-6 py-4">Phone</td>
								<td className="px-6 py-4">$799</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
					<Chart
						type="line"
						className="h-64"
						data={chartData}
						options={chartOptions}
					/>
				</div>
				<div className="col-span-2 overflow-x-auto bg-white shadow-md sm:rounded-lg">
					<Chart
						type="bar"
						className="h-64"
						data={chartData}
						options={chartOptions}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
			</div>
			<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-96 mb-4"></div>
			<div className="grid grid-cols-2 gap-4">
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
				<div className="border-2 border-dashed rounded-lg border-white dark:border-gray-600 h-48 md:h-72"></div>
			</div>
			<DialogBox
				visible={visible}
				flag={flag}
				onPress={() => setVisible(false)}
			/>
		</main>
	)
}

export default HomeScreen
