import React from "react"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded"

function Card({
	icon = <AccessTimeRoundedIcon />,
	title = "",
	description = "",
	buttonText = "",
	buttonIcon = <TrendingUpRoundedIcon className="w-4 h-4 me-2" />,
	buttonColor = "bg-slate-600 hover:bg-slate-600/90",
}) {
	return (
		<div
			className="max-w-sm p-6 bg-white border border-gray-200 rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700
        bg-clip-padding backdrop-filter  backdrop-blur-md bg-opacity-60 backdrop-saturate-100 backdrop-contrast-100"
		>
			{icon}
			<a href="#">
				<h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{title}
				</h5>
			</a>
			<p className="mb-3 font-normal text-slate-700 dark:text-gray-400">
				{description}
			</p>

			<button
				type="button"
				className={`text-white ${buttonColor} focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2`}
			>
				{buttonIcon}
				{buttonText}
			</button>
			{/* <a
				href=`#"
				className="inline-flex font-medium items-center text-blue-600 hover:underline"
			>
				{buttonText}
				<svg
					className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 18 18"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
					/>
				</svg>
			</a> */}
		</div>
	)
}

export default Card
