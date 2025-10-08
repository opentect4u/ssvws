import { Spin } from "antd"
import "../../Screens/BMHome/Dashboard/Dashboard.css"

export default function DashboardCard({
	titleLeft,
	titleRight = "",
	left1Data,
	left2Data,
	right1Data,
	right2Data,
	leftColor = "#000000",
	rightColor = "#000000",
	loading = false,
}) {
	return (
		<div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-md p-6">
			<div className="flex justify-between">
				{titleLeft && (
					<h2 className="text-xl font-medium text-slate-700">{titleLeft}</h2>
				)}
				{titleRight && (
					<h2 className="text-xl font-medium text-slate-700">{titleRight}</h2>
				)}
			</div>
			<div className="grid grid-cols-[1fr_auto_1fr] gap-4 mt-4 items-center text-slate-700">
				<div className="w-full text-left">
					<Spin spinning={loading}>
						<p className="text-sm">{left1Data.label}</p>
						<p className="text-2xl font-bold" style={{ color: leftColor }}>
							{left1Data.value}
						</p>
					</Spin>
				</div>
				<div className="h-full w-[2px] rounded bg-slate-200" />
				<div className="w-full text-right">
					<Spin spinning={loading}>
						<p className="text-sm">{right1Data.label}</p>
						<p className="text-2xl font-semibold" style={{ color: rightColor }}>
							{right1Data.value}
						</p>
					</Spin>
				</div>
				<div className="col-span-3 h-[2px] w-full rounded bg-slate-200" />
				<div className="w-full text-left">
					<Spin spinning={loading}>
						<p className="text-sm">{left2Data.label}</p>
						<p className="text-2xl font-bold" style={{ color: leftColor }}>
							{left2Data.value}
						</p>
					</Spin>
				</div>
				<div className="h-full w-[2px] rounded bg-slate-200" />
				<div className="w-full text-right">
					<Spin spinning={loading}>
						<p className="text-sm">{right2Data.label}</p>
						<p className="text-2xl font-semibold" style={{ color: rightColor }}>
							{right2Data.value}
						</p>
					</Spin>
				</div>
			</div>
		</div>
	)
}
