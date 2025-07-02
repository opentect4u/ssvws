import React from "react"
import { Tag, Timeline } from "antd"

function TimelineComp({ data }) {
	return (
		<Timeline
			mode="alternate"
			items={data?.map((item, i) => ({
				key: i,
				color: i % 2 !== 0 ? "red" : "green",
				children: (
					<div className="bg-gray-200 p-5 rounded-xl shadow-lg">
						<p className="pb-4 text-gray-600 italic">
							{new Date(item?.forwarded_dt).toLocaleString("en-GB")}
						</p>
						<p className="mb-1">
							<Tag color="green" className="rounded-md">
								From: {item?.fwd_name}
							</Tag>
						</p>
						<p>
							<Tag color="red" className="rounded-md">
								To: {item?.fwd_to_name}
							</Tag>
						</p>
						<p className="text-base pt-4 text-gray-700 border-t-2 border-dashed border-gray-300 my-4">
							{item?.remarks}
						</p>
					</div>
				),
			}))}
		/>
	)
}

export default TimelineComp
