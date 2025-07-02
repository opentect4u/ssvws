import React from "react"
import logo from "../../Assets/Images/ssvws_crop-round.png"
import logo2 from "../../Assets/Images/ssvws_logo.jpg"
import payrollImg from "../../Assets/Images/payroll.jpg"
import financeImg from "../../Assets/Images/finance.jpg"
import { motion } from "framer-motion"
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded"
import Card from "../../Components/Landing/Card"
import AssuredWorkloadRoundedIcon from "@mui/icons-material/AssuredWorkloadRounded"
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded"

function Landing() {
	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen p-10 bg-slate-900 bg-hero_pattern bg-no-repeat bg-blend-normal bg-center">
				<img src={logo} className="absolute" width={400} />
				<div
					className="w-full h-full rounded-3xl p-10 shadow-lg
							bg-white
							bg-clip-padding
							backdrop-filter
							backdrop-blur-md
							bg-opacity-20
							backdrop-saturate-100
							backdrop-contrast-100
							border-2 border-blue-100 border-opacity-90"
				>
					<div className="flex flex-row gap-10 items-center justify-center h-full">
						<Card
							icon={<AssuredWorkloadRoundedIcon />}
							title="LOAN"
							// description="To access your loan site, please click the button below."
							path={"/loan"}
						/>
						<Card
							icon={<CurrencyRupeeRoundedIcon />}
							title="PAYROLL"
							// description="To access your payroll management, please click the button below."
							path={"https://ssvws.opentech4u.co.in/payroll"}
							photo={payrollImg}
						/>
						<Card
							icon={<AccountBalanceRoundedIcon />}
							title="FINANCE"
							// description="To access your finance management, please click the button below."
							path={"https://ssvws.opentech4u.co.in/ssvws_fin"}
							photo={financeImg}
						/>
					</div>
				</div>

				<motion.img
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, type: "spring", stiffness: 50 }}
					src={logo2}
					className="absolute top-16 left-16 rounded-xl shadow-sm"
					alt="SSVWS"
					width={200}
				/>
			</div>
		</>
	)
}

export default Landing
