import React from "react"
import { Link } from "react-router-dom"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded"
import loanPhoto from "../../Assets/Images/loan.webp"

function Card({
	// icon = <AccessTimeRoundedIcon />,
	photo = loanPhoto,
	title = "",
	description = "",
	buttonText = "",
	buttonIcon = <TrendingUpRoundedIcon className="w-4 h-4 me-2" />,
	buttonColor = "bg-slate-600 hover:bg-slate-600/90",
	path,
}) {
	const isExternal = typeof path === "string" && /^(https?:)?\/\//.test(path)

	const linkProps = isExternal
		? { href: path, target: "_blank", rel: "noopener noreferrer" }
		: { to: path }

	const Wrapper = isExternal ? "a" : Link

	return (
		<Wrapper
			{...linkProps}
			className={
				"group max-w-sm p-6 bg-white border border-gray-200 rounded-3xl shadow-sm " +
				"dark:bg-gray-800 dark:border-gray-700 bg-clip-padding backdrop-filter " +
				"backdrop-blur-md bg-opacity-60 backdrop-saturate-100 backdrop-contrast-100 " +
				"hover:scale-105 transition-transform duration-300 ease-in-out active:scale-95"
			}
		>
			{/* {icon} */}
			<img
				className="object-cover w-full h-96 md:h-auto md:w-48 rounded-2xl border-2 border-yellow-200 transition-transform duration-300 ease-in-out group-hover:scale-105 shadow-sm"
				src={photo}
				alt={title}
			/>
			<div className="flex flex-col justify-between p-4 leading-normal">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{title}
				</h5>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					{description}
				</p>
				{buttonText && (
					<div className="mt-4">
						<button
							className={
								`inline-flex items-center px-4 py-2 text-white rounded-md ` +
								buttonColor
							}
						>
							{buttonIcon}
							{buttonText}
						</button>
					</div>
				)}
			</div>
		</Wrapper>
	)
}

export default Card
