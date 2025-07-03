import React, { useEffect, useState } from "react"
import IMG from "../Assets/Images/Logo.png"

import { Skeleton } from "primereact/skeleton"
import axios from "axios"
import { url } from "../Address/BaseUrl"
import { useNavigate } from "react-router-dom"
import { Divider } from "antd"

function AmendPreview({ id }) {
	const navigate = useNavigate()
	const [vendors, setVendors] = useState([])
	const [floatShow, setFloatShow] = useState(false)
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [delivery, setDeliveryAdd] = useState("")
	const [order_type, setOrderType] = useState("")
	const [b_order_dt, setBOrderDt] = useState("")
	const [proj_name, setProjectName] = useState("")
	const [vendor_name, setVendorName] = useState("")
	const [po_issue_date, setPoIssueDate] = useState("")
	const [order_id, setOrderId] = useState("")
	const [itemList, setItemList] = useState([])
	const [termList, setTermList] = useState([])
	const [notes, setNotes] = useState("")

	const [insp_flag, setInspFlag] = useState("N")
	const [insp, setInsp] = useState("")
	const [drawing_flag, setDrawingFlag] = useState("N")
	const [drawing, setDrawing] = useState("")
	const [mdcc_flag, setMdccFlag] = useState("N")

	const [mdcc, setMdcc] = useState("")
	const [drawingDate, setDrawingDate] = useState("")
	const [timeline, setTimeline] = useState([])
	const [price_basis_flag, setPriceBasisFlag] = useState("")
	const [price_basis_desc, setPriceBasisDesc] = useState("")
	const [packing_forwarding, setPackingForwarding] = useState("")
	const [packing_forwardingExtra, setPackingForwardingExtra] = useState("")
	const [packing_forwardingExtraVal, setPackingForwardingExtraVal] =
		useState("")
	const [freight_insurance, setFreightInsurance] = useState("")
	const [freight_insurance_val, setFreightInsuranceVal] = useState("")
	const [test_certificate, setTestCertificate] = useState("")
	const [test_certificate_desc, setTestCertificateDesc] = useState("")
	const [ld_applicable_date, setLDApplicableDate] = useState("")
	const [others_ld, setOthersLd] = useState("")
	const [ld_applied_on, setLDAppliedOn] = useState("")
	const [others_applied, setOthersApplied] = useState("")
	const [ld_value, setLDValue] = useState("")
	const [po_min_value, setPOMinValue] = useState("")
	const [warranty_guarantee_flag, setWarrantyFlag] = useState("")
	const [duration, setDuration] = useState("")
	const [duration_val, setDurationVal] = useState("")
	const [om_manual_flag, setOMFlag] = useState("")
	const [om_manual_desc, setOMDesc] = useState("")
	const [oi_flag, setOIFlag] = useState("")
	const [oi_desc, setOIDesc] = useState("")
	const [ware_house_flag, setWareHouse] = useState("")
	const [packing_type, setPackingType] = useState("")
	const [manufacture_clearance, setManufactureClearance] = useState("")
	const [manufacture_clearance_desc, setManufactureDesc] = useState("")
	const [comment, setComment] = useState("")
	const [clickFlag, setClickFlag] = useState("P")
	const [po_no, setPoNo] = useState("")
	const [count, setCount] = useState(0)

	const [v_name, setVName] = useState("")
	const [v_address, setVAddress] = useState("")
	const [v_email, setVEmail] = useState("")
	const [v_phone, setVPhone] = useState("")
	const [v_gst, setVGST] = useState("")
	const [v_pan, setVPAN] = useState("")
	const [prodInfo, setProdInfo] = useState()
	const [grandTot, setGrandTot] = useState(0)
	const [dispatch_dt, setdispatchdt] = useState(false)
	const [comm_dt, setcommdt] = useState(false)
	//  const [po_no,setPoNo]=useState('')
	const [totVal, setTotVal] = useState(0)
	var tot = 0
	useEffect(() => {
		setLoading(true)
		axios
			.post(url + "/api/getvendor", { id: 0 })
			.then((resvendor) => {
				setLoading(true)
				console.log(resvendor)
				setVendors(resvendor?.data?.msg)
				// setVName(res?.data?.msg?.vendor_name)
				// setVAddress(res?.data?.msg?.vendor_address)
				// setVEmail(res?.data?.msg?.vendor_email)
				// setVPhone(res?.data?.msg?.vendor_phone)
				// setVGST(res?.data?.msg?.vendor_gst)
				// setVPAN(res?.data?.msg?.vendor_pan)
				axios
					.post(url + "/api/getpreviewitems", { id: id })
					.then((resItems) => {
						console.log(resItems)
						tot = 0
						setProdInfo(resItems?.data?.msg)
						console.log(prodInfo)
						for (let item of resItems?.data?.msg) {
							if (item.sgst_id) {
								tot +=
									((item.item_rt - item.discount) *
										item.quantity *
										item.cgst_id) /
										100 +
									(item.item_rt - item.discount) *
										item.quantity *
										(item.sgst_id / 100) +
									(item.item_rt - item.discount) * item.quantity
							} else {
								tot +=
									((item.item_rt - item.discount) *
										item.quantity *
										item.igst_id) /
										100 +
									(item.item_rt - item.discount) * item.quantity
							}
						}
						console.log(tot)

						setGrandTot(tot.toFixed(2))
						tot = 0
						// "prod_name": "Prod_2",
						// "prod_make": "Make_2",
						// "catg_name": "Misc",
						// "part_no": "Part_2",
						// "model_no": "Model_2",
						// "article_no": "Ar_2",
						// "hsn_code": "444445",
						// "prod_desc": "Desc",
						// "quantity": 10,
						// "item_rt": 7.0,
						// "discount": 4.0,
						// "unit_name": "Gm"

						// setLoading(true)
						// console.log(res)
						// setVName(res?.data?.msg?.vendor_name)
						// setVAddress(res?.data?.msg?.vendor_address)
						// setVEmail(res?.data?.msg?.vendor_email)
						// setVPhone(res?.data?.msg?.vendor_phone)
						// setVGST(res?.data?.msg?.vendor_gst)
						// setVPAN(res?.data?.msg?.vendor_pan)
						// setLoading(false)
						// axios.post(url+'/api/getpo',{id:localStorage.getItem('id')}).then(res=>{
						//     console.log(res)
						//     setPoNo(res?.data?.msg?.po_no)
						// setLoading(false)
					})
					.catch((err) =>
						navigate("/error" + "/" + err.code + "/" + err.message)
					)

				// })
				axios
					.post(url + "/api/getpo", { id: id })
					.then((res) => {
						console.log(res)
						//   localStorage.setItem('id',params.id)
						//   localStorage.setItem("order_id",res?.data?.msg?.po_id)
						//   localStorage.setItem("order_date",res?.data?.msg?.po_date)
						//   localStorage.setItem("order_type",res?.data?.msg?.type)
						//   localStorage.setItem("proj_name",res?.data?.msg?.project_id)
						//   localStorage.setItem("vendor_name",res?.data?.msg?.vendor_id)
						//   localStorage.setItem("po_status",res?.data?.msg?.po_status)
						//   localStorage.setItem("po_issue_date",res?.data?.msg?.po_issue_date)
						//   localStorage.setItem('po_no',res?.data?.msg?.po_no)
						//   console.log('type   ',typeof(localStorage.getItem('po_no')))
						setClickFlag(res?.data?.msg?.po_status)
						setBOrderDt(res?.data?.msg?.po_date)
						setOrderType(res?.data?.msg?.type)
						setOrderId(res?.data?.msg?.po_id)
						setProjectName(res?.data?.msg?.project_id)
						setVendorName(res?.data?.msg?.vendor_id)
						setPoIssueDate(res?.data?.msg?.po_issue_date)
						setPoNo(res?.data?.msg?.po_no)
						console.log(resvendor?.data?.msg)

						setVName(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_name
						)
						setVAddress(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_address
						)
						setVEmail(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_email
						)
						setVPhone(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_phone
						)
						setVGST(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_gst
						)
						setVPAN(
							resvendor?.data?.msg?.filter(
								(e) => e.sl_no == res?.data?.msg?.vendor_id
							)[0].vendor_pan
						)
						axios
							.post(url + "/api/getpoitem", { id: id })
							.then((resItem) => {
								console.log(resItem)
								for (let i = 0; i < resItem?.data?.msg?.length; i++) {
									itemList.push({
										sl_no: resItem?.data?.msg[i].sl_no,
										item_name: resItem?.data?.msg[i].item_id,
										qty: resItem?.data?.msg[i].quantity,
										rate: resItem?.data?.msg[i].item_rt,
										unit: resItem?.data?.msg[i].unit_id,
										disc: resItem?.data?.msg[i].discount,
										SGST: resItem?.data?.msg[i].sgst_id,
										CGST: resItem?.data?.msg[i].cgst_id,
										IGST: resItem?.data?.msg[i].igst_id,
										unit_price:
											resItem?.data?.msg[i].item_rt -
											resItem?.data?.msg[i].discount,
										delivery_date: resItem?.data?.msg[i].delivery_dt,
										total: resItem?.data?.msg[i].cgst_id
											? ((resItem?.data?.msg[i].item_rt -
													resItem?.data?.msg[i].discount) *
													resItem?.data?.msg[i].quantity *
													resItem?.data?.msg[i].cgst_id) /
													100 +
											  ((resItem?.data?.msg[i].item_rt -
													resItem?.data?.msg[i].discount) *
													resItem?.data?.msg[i].quantity *
													resItem?.data?.msg[i].sgst_id) /
													100 +
											  (resItem?.data?.msg[i].item_rt -
													resItem?.data?.msg[i].discount) *
													resItem?.data?.msg[i].quantity
											: ((resItem?.data?.msg[i].item_rt -
													resItem?.data?.msg[i].discount) *
													resItem?.data?.msg[i].quantity *
													resItem?.data?.msg[i].igst_id) /
													100 +
											  (resItem?.data?.msg[i].item_rt -
													resItem?.data?.msg[i].discount) *
													resItem?.data?.msg[i].quantity,
									})
								}
								setItemList(itemList)
								localStorage.setItem("itemList", JSON.stringify(itemList))
								axios
									.post(url + "/api/getpoterms", { id: id })
									.then((resTerm) => {
										console.log(resTerm)
										setPriceBasisFlag(resTerm?.data?.msg[0]?.price_basis)
										setPriceBasisDesc(resTerm?.data?.msg[0]?.price_basis_desc)
										setPackingForwarding(resTerm?.data?.msg[0]?.packing_fwd_val)
										setPackingForwardingExtra(
											resTerm?.data?.msg[0]?.packing_fwd_extra
										)
										setPackingForwardingExtraVal(
											resTerm?.data?.msg[0]?.packing_fwd_extra_val
										)
										setFreightInsurance(resTerm?.data?.msg[0]?.freight_ins)
										setFreightInsuranceVal(
											resTerm?.data?.msg[0]?.freight_ins_val
										)
										setTestCertificate(resTerm?.data?.msg[0]?.test_certificate)
										setTestCertificateDesc(
											resTerm?.data?.msg[0]?.test_certificate_desc
										)
										setLDApplicableDate(resTerm?.data?.msg[0]?.ld_date)
										setOthersLd(resTerm?.data?.msg[0]?.ld_date_desc)
										setLDAppliedOn(resTerm?.data?.msg[0]?.ld_val)
										setOthersApplied(resTerm?.data?.msg[0]?.ld_val_desc)
										setLDValue(resTerm?.data?.msg[0]?.ld_val_per)
										setPOMinValue(resTerm?.data?.msg[0]?.min_per)
										setWarrantyFlag(resTerm?.data?.msg[0]?.warranty_guarantee)
										setDuration(resTerm?.data?.msg[0]?.duration)
										setDurationVal(resTerm?.data?.msg[0]?.duration_value)
										setOMFlag(resTerm?.data?.msg[0]?.o_m_manual)
										setOMDesc(resTerm?.data?.msg[0]?.o_m_desc)
										setOIFlag(resTerm?.data?.msg[0]?.operation_installation)
										setOIDesc(
											resTerm?.data?.msg[0]?.operation_installation_desc
										)
										setPackingType(resTerm?.data?.msg[0]?.packing_type)
										setManufactureClearance(
											resTerm?.data?.msg[0]?.manufacture_clearance
										)
										setManufactureDesc(
											resTerm?.data?.msg[0]?.manufacture_clearance_desc
										)
										setdispatchdt(
											resTerm?.data?.msg[0]?.dispatch_dt == "Y" ? true : false
										)
										setcommdt(
											resTerm?.data?.msg[0]?.comm_dt == "Y" ? true : false
										)
										const terms_conditions = {
											price_basis_flag: resTerm?.data?.msg[0]?.price_basis,
											price_basis_desc: resTerm?.data?.msg[0]?.price_basis_desc,
											packing_forwarding_val:
												resTerm?.data?.msg[0]?.packing_fwd_val,
											packing_forwarding_extra:
												resTerm?.data?.msg[0]?.packing_fwd_extra,
											packing_forwarding_extra_val:
												resTerm?.data?.msg[0]?.packing_fwd_extra_val,
											freight_insurance: resTerm?.data?.msg[0]?.freight_ins,
											freight_insurance_val:
												resTerm?.data?.msg[0]?.freight_ins_val,
											test_certificate: resTerm?.data?.msg[0]?.test_certificate,
											test_certificate_desc:
												resTerm?.data?.msg[0]?.test_certificate_desc,
											ld_applicable_date: resTerm?.data?.msg[0]?.ld_date,
											ld_applied_on: resTerm?.data?.msg[0]?.ld_val,
											ld_value: resTerm?.data?.msg[0]?.ld_val_per,
											po_min_value: resTerm?.data?.msg[0]?.min_per,
											others_ld: resTerm?.data?.msg[0]?.ld_date_desc,
											others_applied: resTerm?.data?.msg[0]?.ld_val_desc,
											warranty_guarantee_flag:
												resTerm?.data?.msg[0]?.warranty_guarantee,
											duration: resTerm?.data?.msg[0]?.duration,
											duration_val: resTerm?.data?.msg[0]?.duration_value,
											om_manual_flag: resTerm?.data?.msg[0]?.o_m_manual,
											om_manual_desc: resTerm?.data?.msg[0]?.o_m_desc,
											oi_flag: resTerm?.data?.msg[0]?.operation_installation,
											oi_desc:
												resTerm?.data?.msg[0]?.operation_installation_desc,
											packing_type: resTerm?.data?.msg[0]?.packing_type,
											manufacture_clearance:
												resTerm?.data?.msg[0]?.manufacture_clearance,
											manufacture_clearance_desc:
												resTerm?.data?.msg[0]?.manufacture_clearance_desc,
										}
										console.log(terms_conditions)
										//   localStorage.setItem('terms',JSON.stringify(terms_conditions))
									})
									.catch((err) =>
										navigate("/error" + "/" + err.code + "/" + err.message)
									)
								axios
									.post(url + "/api/getpopayterms", { id: id })
									.then((resPay) => {
										console.log(resPay)
										for (let i = 0; i < resPay?.data?.msg?.length; i++) {
											termList.push({
												sl_no: resPay?.data?.msg[i]?.sl_no,
												stage: resPay?.data?.msg[i]?.stage_no,
												term: resPay?.data?.msg[i]?.terms_dtls,
											})
										}
										setTermList(termList)
										// localStorage.setItem('termList',JSON.stringify(termList))
										axios
											.post(url + "/api/getpodelivery", { id: id })
											.then((resDel) => {
												console.log(resDel)
												setDeliveryAdd(resDel?.data?.msg[0]?.ship_to)
												//   localStorage.setItem('ship_to',resDel?.data?.msg[0]?.ship_to)
												setWareHouse(resDel?.data?.msg[0]?.ware_house_flag)
												//   localStorage.setItem('ware_house_flag',resDel?.data?.msg[0]?.ware_house_flag)
												setNotes(resDel?.data?.msg[0]?.po_notes)
												//   localStorage.setItem('notes',resDel?.data?.msg[0]?.po_notes)
												axios
													.post(url + "/api/getpomore", { id: id })
													.then((resMore) => {
														console.log(resMore)
														setInspFlag(resMore?.data?.msg[0]?.inspection)
														setInsp(resMore?.data?.msg[0]?.inspection_scope)
														setMdccFlag(resMore?.data?.msg[0]?.mdcc)
														setMdcc(resMore?.data?.msg[0]?.mdcc_scope)
														setDrawingFlag(resMore?.data?.msg[0]?.draw)
														setDrawing(resMore?.data?.msg[0]?.draw_scope)
														setDrawingDate(resMore?.data?.msg[0]?.draw_period)
														// localStorage.setItem("mdcc_flag",resMore?.data?.msg[0]?.mdcc)
														// localStorage.setItem("mdcc",resMore?.data?.msg[0]?.mdcc_scope)
														// localStorage.setItem("insp_flag",resMore?.data?.msg[0]?.inspection)
														// localStorage.setItem("insp",resMore?.data?.msg[0]?.inspection_scope)
														// localStorage.setItem("drawing_flag",resMore?.data?.msg[0]?.draw)
														// localStorage.setItem("drawing",resMore?.data?.msg[0]?.draw_scope)
														// localStorage.setItem("dt",resMore?.data?.msg[0]?.draw_period)
														axios
															.post(url + "/api/getpocomments", { id: id })
															.then((resCom) => {
																// setTimeline([])
																console.log(resCom)
																for (
																	let i = 0;
																	i < resCom?.data?.msg?.length;
																	i++
																) {
																	timeline.push({
																		label: resCom?.data?.msg[i].created_at
																			.toString()
																			.split("T")
																			.join(" "),
																		children:
																			resCom?.data?.msg[i].proj_remarks +
																			" by " +
																			resCom?.data?.msg[
																				i
																			].created_by.toString(),
																	})
																}
																setTimeline(timeline)
																console.log(timeline)
																setLoading(false)
															})
													})
											})
									})
									.catch((err) =>
										navigate("/error" + "/" + err.code + "/" + err.message)
									)
							})
							.catch((err) =>
								navigate("/error" + "/" + err.code + "/" + err.message)
							)
					})
					.catch((err) =>
						navigate("/error" + "/" + err.code + "/" + err.message)
					)
			})
			.catch((err) => navigate("/error" + "/" + err.code + "/" + err.message))
	}, [id])

	return (
		<div>
			{/* {id} */}

			{loading && (
				<div className="w-full">
					<Skeleton
						width="40rem"
						className="mb-2 w-full bg-gray-300"
					></Skeleton>
					<Skeleton
						width="40rem"
						className="mb-2 w-full bg-gray-300"
					></Skeleton>
					<Skeleton
						width="40rem"
						className="mb-2 w-full bg-gray-300"
					></Skeleton>
					<Skeleton
						width="40rem"
						className="mb-2 w-full bg-gray-300"
					></Skeleton>
					<Skeleton
						width="40rem"
						className="mb-2 w-full bg-gray-300"
						height="4rem"
					></Skeleton>
				</div>
			)}

			{!loading && (
				<div className="h-full  border-2  mx-auto w-8/12 px-5 border-blue-300">
					<div className="flex justify-center items-center">
						<span className="text-xl text-blue-500 font-extrabold  my-3 uppercase">
							Purchase Order
						</span>
					</div>
					<p className="grid grid-cols-6 gap-32 items-center mb-2 px-4">
						<div className="col-span-3 flex text-xs gap-2 text-black ">
							<span className="uppercase font-extrabold">
								PO No.: {po_no ? po_no : ""}
							</span>
							<span className="uppercase font-extrabold">
								PO Date: {po_issue_date}
							</span>
							{po_no?.indexOf("-") != -1 && (
								<span className="uppercase font-extrabold">
									Amendement No:{po_no?.split("-")[1]}
								</span>
							)}
							{/* <span className="uppercase font-extrabold">Latest Amendement No:</span> */}
							{/* <span className="uppercase font-extrabold">Amendment Date:</span> */}
							<span className="uppercase font-extrabold">
								Value: {grandTot}
							</span>
							{/* <span className="uppercase font-extrabold">Status No:  {localStorage.getItem('po_status')=='P'?'In Progress':localStorage.getItem('po_status')=='U'?'Unapproved':localStorage.getItem('po_status')=='A'?'Approved':localStorage.getItem('po_status')=='D'?'Delivered':'Partial Delivery'}</span> */}
						</div>
						<div className="col-span-3 ">
							<img src={IMG} className="sm:h-16 h-12" alt="Flowbite Logo" />
							<span className="my-5 mx-3 mb-5 text-xs">
								<p>Unit - 102, 1st Floor, PS PACE 1/1A,</p>{" "}
								<p> Mahendra Roy Lane Kolkata 700046 </p>
								<p> Ph-033 4068 6032/6450 0535</p>
								<p> Email: info@ngapl.com</p>
							</span>
						</div>
					</p>
					<Divider />

					<div className="grid grid-cols-2 gap-2">
						<div className="col-span-2">
							<div className="my-5 w-full p-2 text-black font-semibold border-2 border-blue-400 bg-blue-400 rounded-lg">
								Vendor Details
							</div>
							<div className="flex flex-col text-xs gap-1 text-black px-2 py-1">
								<span className="uppercase font-extrabold gap-4">
									Name: {v_name}
								</span>
								<span className="uppercase font-extrabold">
									Address: {v_address}
								</span>
								<span className="uppercase font-extrabold">
									Email: {v_email}
								</span>
								<span className="uppercase font-extrabold">
									Phone: {v_phone}
								</span>
								<span className="uppercase font-extrabold">GST: {v_gst}</span>
								<span className="uppercase font-extrabold">PAN: {v_pan}</span>
							</div>
						</div>
					</div>
					<Divider />

					<div className="grid grid-cols-2 gap-2 my-6">
						<div className="col-span-1 border-2 border-blue-300 rounded-lg p-2">
							<div className="w-full p-2  text-black font-semibold bg-blue-400  border-2 border-blue-400 rounded-lg">
								Bill To
							</div>
							<p className="text-sm p-2">
								{" "}
								Unit - 102, 1st Floor, PS PACE 1/1A, Mahendra Roy Lane Kolkata
								700046
							</p>{" "}
							<p className="text-sm p-2"> Ph-033 4068 6032/6450 0535</p>{" "}
							<p className="text-sm p-2"> Email: info@ngapl.com</p>
						</div>
						<div className="col-span-1 border-2 border-blue-300 rounded-lg p-2">
							<div className="w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
								Ship To
							</div>
							<p className="text-sm p-2"> {delivery} </p>
						</div>
					</div>
					<Divider />

					<p className="mb-5">
						<div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
							Item Description
						</div>

						<div className="relative overflow-x-auto">
							<table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
								<thead className="text-xs text-nowrap font-bold text-blue-500 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3">
											Item-Description
										</th>
										<th scope="col" className="px-6 py-3">
											Quantity
										</th>
										<th scope="col" className="px-6 py-3">
											Rate
										</th>
										<th scope="col" className="px-6 py-3">
											Discount
										</th>
										<th scope="col" className="px-1 py-3">
											CGST
										</th>
										<th scope="col" className="px-1 py-3">
											SGST
										</th>
										<th scope="col" className="px-1 py-3">
											IGST
										</th>
										<th scope="col" className="px-6 py-3">
											Total GST
										</th>
										<th scope="col" className="px-6 py-3">
											Unit Price
										</th>
										<th scope="col" className="px-6 py-3">
											Total
										</th>
									</tr>
								</thead>
								<tbody>
									{prodInfo?.length > 0 &&
										prodInfo?.map((item) => (
											<>
												<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
													<td className="px-6 py-4 flex flex-col gap-1 text-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white">
														{item.prod_name}
													</td>
													<td className="px-6 py-4" rowSpan={2}>
														{item.quantity}
													</td>
													<td className="px-6 py-4" rowSpan={2}>
														{item.item_rt}
													</td>
													<td className="px-6 py-4" rowSpan={2}>
														{item.discount}
													</td>
													<td className="px-1 py-1 text-xs" rowSpan={2}>
														{item.cgst_id}%{" "}
														{item.cgst_id > 0
															? ":" +
															  (
																	(+item.item_rt - +item.discount) *
																	+item.quantity *
																	(+item.cgst_id / 100)
															  ).toFixed(2)
															: ""}
													</td>
													<td className="px-1 py-1 text-xs" rowSpan={2}>
														{item.sgst_id}%{" "}
														{item.sgst_id > 0
															? ":" +
															  (
																	(+item.item_rt - +item.discount) *
																	+item.quantity *
																	(+item.sgst_id / 100)
															  ).toFixed(2)
															: ""}
													</td>
													<td className="px-1 py-1 text-xs" rowSpan={2}>
														{item.igst_id}%{" "}
														{+item.igst_id > 0
															? ":" +
															  (
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.igst_id / 100) +
																	(item.item_rt - item.discount) * item.quantity
															  ).toFixed(2)
															: ""}
													</td>

													<td className="px-1 py-1 text-xs " rowSpan={2}>
														{item.sgst_id > 0
															? (
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.cgst_id / 100) +
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.sgst_id / 100)
															  ).toFixed(2)
															: (
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.igst_id / 100) +
																	(item.item_rt - item.discount) * item.quantity
															  ).toFixed(2)}
													</td>
													<td className="px-6 py-4" rowSpan={2}>
														{+item.item_rt - +item.discount}
													</td>
													<td className="px-6 py-4" rowSpan={2}>
														{item.sgst_id > 0
															? (
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.cgst_id / 100) +
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.sgst_id / 100) +
																	(item.item_rt - item.discount) * item.quantity
															  ).toFixed(2)
															: (
																	(+item.item_rt - +item.discount) *
																		+item.quantity *
																		(+item.igst_id / 100) +
																	(item.item_rt - item.discount) * item.quantity
															  ).toFixed(2)}
													</td>
												</tr>
												<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
													<td className="px-6 py-4 text-xs gap-3">
														<p>Make: {item.prod_make} </p>
														<p>Category: {item.catg_name} </p>
														<p> UOM: {item.unit_name}</p>
														<p> Part No.: {item.part_no} </p>
														<p>Model No.: {item.model_no} </p>
														<p> Article No.: {item.article_no}</p>
														<p>HSN: {item.hsn_code} </p>
													</td>
												</tr>
											</>
										))}
								</tbody>
								<tfoot>
									<tr className="font-semibold text-gray-900 dark:text-white">
										<th
											scope="row"
											className="px-6 py-3 text-base font-bold"
											colSpan={9}
										>
											Total
										</th>
										<th className="px-6 py-3 text-base font-bold">{grandTot}</th>
									</tr>
								</tfoot>
							</table>
						</div>
					</p>
					<Divider />

					<p className="mb-5">
						<div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
							Payment Terms
						</div>
						<ul className="max-w-md space-y-1 text-gray-700 p-2 list-disc list-inside dark:text-gray-400">
							{termList.length > 0 &&
								termList.map((item) => (
									<li>
										{item.stage} - {item.term}
									</li>
								))}
						</ul>
					</p>
					<Divider />

					<p className="mb-5">
						<div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
							Terms & Conditions
						</div>

						<div className="relative overflow-x-auto">
							<table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
								<tbody>
									<tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Price Basis
										</th>
										<td className="px-6 py-4">
											{price_basis_flag == "F" ? "FOR" : "EX-WORKS"},{" "}
											{price_basis_desc}
										</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Packing & Forwarding
										</th>
										<td className="px-6 py-4">
											{packing_forwarding == "I"
												? "Inclusive"
												: `Extra  ${packing_forwardingExtra}% - ${(
														(grandTot * packing_forwardingExtra) /
														100
												  ).toFixed(2)}`}
										</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Freight
										</th>
										<td className="px-6 py-4">
											{freight_insurance == "I" ? "Inclusive" : "Extra"} -{" "}
											{freight_insurance_val}
										</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Test Certificate
										</th>
										<td className="px-6 py-4">
											{test_certificate == "Y"
												? "Yes, " + test_certificate_desc
												: "No"}
										</td>
									</tr>

									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Warranty/Guarantee
										</th>
										<td className="px-6 py-4">
											{warranty_guarantee_flag == "W"
												? "Warranty"
												: "Guarantee"}{" "}
											{duration_val}{" "}
											{duration == "M"
												? "month(s)"
												: duration == "D"
												? "day(s)"
												: "year(s)"}
											{comm_dt && " from the date of commission"}
											{comm_dt && dispatch_dt
												? " or from the date of dispatch"
												: !comm_dt && !dispatch_dt
												? ""
												: dispatch_dt
												? "from the date of dispatch."
												: ""}
											{comm_dt && dispatch_dt && " ,whichever is earlier."}
										</td>
									</tr>

									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											O & M Manual
										</th>
										<td className="px-6 py-4">
											{om_manual_flag == "A"
												? "Applicable. " + om_manual_desc
												: "Not Applicable."}
										</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Operation/Installation
										</th>
										<td className="px-6 py-4">
											{oi_flag == "A"
												? "Applicable. " + oi_desc
												: "Not Applicable."}
										</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Packing Type
										</th>
										<td className="px-6 py-4">{packing_type}</td>
									</tr>
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											Manufacture Clearance
										</th>
										<td className="px-6 py-4">
											{manufacture_clearance == "A"
												? "Applicable. " + manufacture_clearance_desc
												: "Not Applicable."}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</p>

					<p className="mb-5">
						<div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
							Liquidity Damages
						</div>

						<div className="relative overflow-x-auto">
							<table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
								<thead className="text-xs text-nowrap font-bold text-blue-500 uppercase bg-white dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3">
											LD Applicable date
										</th>
										<th scope="col" className="px-6 py-3">
											LD applied on
										</th>
										<th scope="col" className="px-6 py-3">
											Ld value(%)
										</th>
										<th scope="col" className="px-6 py-3">
											Maximum (%) on PO value
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{ld_applicable_date == "O"
												? `Others - ${others_ld}`
												: ld_applicable_date == "M"
												? "MRN Date"
												: ld_applicable_date == "NA"
												? "Not Applicable"
												: "Dispatch Date"}
										</th>
										<td className="px-6 py-4">
											{ld_applied_on == "O"
												? `Others - ${others_applied}`
												: ld_applicable_date == "P"
												? "Pending Material Value"
												: ld_applicable_date == "NA"
												? ""
												: "PO Total Value(%)"}
										</td>
										<td className="px-6 py-4">{ld_value}</td>

										<td className="px-6 py-4">{po_min_value}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<Divider />
						<table className="w-full my-10 text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
							<tbody>
								<tr className="bg-white border-b text-nowrap dark:bg-gray-800 dark:border-gray-700">
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										MDCC
									</th>
									<td className="px-6 py-4">
										{localStorage.getItem("mdcc_flag") == "Y"
											? "Yes. " + localStorage.getItem("mdcc")
											: "No"}
									</td>
								</tr>
								<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										Inspection
									</th>
									<td className="px-6 py-4">
										{localStorage.getItem("insp_flag") == "Y"
											? "Yes. " + localStorage.getItem("insp")
											: "No"}
									</td>
								</tr>
								<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										Drawing/Datasheet
									</th>
									<td className="px-6 py-4">
										{localStorage.getItem("drawing_flag") == "Y"
											? "Yes . " +
											  localStorage.getItem("drawing") +
											  ", " +
											  localStorage.getItem("dt")
											: "No"}
									</td>
								</tr>
							</tbody>
						</table>
					</p>
					<Divider />
					<p className="mb-5">
						<div className="my-2 w-full p-2 text-black font-semibold  border-2 border-blue-400 bg-blue-400 rounded-lg">
							Notes
						</div>
						<span className="p-2">{localStorage.getItem("notes")}</span>
					</p>
				</div>
			)}
		</div>
	)
}

export default AmendPreview
