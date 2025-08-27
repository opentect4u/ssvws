import { FileExcelOutlined, LoadingOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import Sidebar from '../../../Components/Sidebar'
import { Spin, Tooltip } from 'antd'
import Radiobtn from '../../../Components/Radiobtn'
import TDInputTemplateBr from '../../../Components/TDInputTemplateBr'
import axios from 'axios'
import { url } from '../../../Address/BaseUrl';
import Select from "react-select"
import {
groupReportGroupWiseHeader,
memberwiseDemandReportHeader,
memberwiseReportHeader
} from "../../../Utils/Reports/headerMap"
import DynamicTailwindTable from '../../../Components/Reports/DynamicTailwindTable'
import { Message } from '../../../Components/Message'
import moment from 'moment'
import { exportToExcel } from '../../../Utils/exportToExcel'
import { printTableReport } from '../../../Utils/printTableReport'
import DynamicTailwindTableGroup from '../../../Components/Reports/DynamicTailwindTableForGroup'
const options = [
    {
        label: "Groupwise",
        value: "G",
    },
    // {
    // 	label: "Fundwise",
    // 	value: "F",
    // },
    {
        label: "CO-wise",
        value: "C",
    },
    {
        label: "Memberwise",
        value: "M",
    }
]

const options_1 = [
	{
		label: "Active",
		value: "A",
	},
	{
		label: "In-Active",
		value: "I",
	},
]
const GroupReport = () => {
    const [searchType, setSearchType] = useState(() => "G");
    const [isActiveOrInActive, setIsActiveOrInActive] = useState(() => "A");
    const [fromDate, setFromDate] = useState();
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || "";
    const [reportData, setReportData] = useState(() => [])
    const [isLoading,setLoading] = useState(false);
    const [cos, setCOs] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [branches, setBranches] = useState([])
    const [selectedCO, setSelectedCO] = useState("")
    const [selectedCOs, setSelectedCOs] = useState([])
    
    const dataToExport = reportData
    const onPressOnSearchButton = async () =>{

                try{
                    if(fromDate){
                        setLoading(true);
                        const branchCodes = selectedOptions?.map((item, i) => item?.value);
                        const coCodes = selectedCOs?.map((item, i) => item?.value)
                        const allCos = cos?.map((item, i) => item?.co_id)
                        const apiName = searchType == 'G' ? 'active_inactive_group_report' : searchType == 'M' ? 'active_inactive_member_report' : 'active_inactive_co_report'
                        let payLoad = null;
                        if(searchType == 'C'){
                            payLoad = {
                                from_date:fromDate,
                                co_flag:isActiveOrInActive,
                                branch_code:branchCodes?.length === 0 ? [userDetails?.brn_code] : (dropdownOptions.length === branchCodes.length ? 100 : branchCodes),
                                co_id:coCodes?.length === 0
                                    ? selectedCO === "AC"
                                        ? allCos
                                        : [selectedCO]
                                    : coCodes,
                            };
                        }
                        else{
                            payLoad = {
                                from_date:fromDate,
                                [searchType == 'G' ? 'group_flag' : "member_flag"]:isActiveOrInActive,
                                branch_code:branchCodes?.length === 0 ? [userDetails?.brn_code] : (dropdownOptions.length === branchCodes.length ? 100 : branchCodes),
                            };
                        }
                        axios.post(`${url}/${apiName}`,payLoad).then(res =>{
                                setLoading(false);
                                if(res?.data?.suc == 1){
                                    if(res?.data?.msg.length > 0){
                                        const dt = res?.data?.msg.map(el => {
                                            el.group_open_date = el.group_open_date ? moment(el.group_open_date).format('DD/MM/YYYY') : '';
                                            el.bank_name = el.bank_name ? el.bank_name : '';
                                            el.other_loan_flag = el.other_loan_flag ? (el.other_loan_flag == 'N' ? "No" : 'Yes') : '';
                                            return el;
                                        })
                                        setReportData(dt)
                                    }
                                    else{
                                        Message('warning',"No data found");
                                    }
                                
                                }
                                else{
                                    Message('error',res?.data?.msg);
                                }
                        }).catch(err =>{
                            setLoading(false);
                            Message('error',err.message);
                        })
                    }
                    else{
                        Message('error','Please select a date')
                    }
                }
                catch(err){
                    setLoading(false);
                    Message('error',err.message);
                }
    }

    const getBranches = () => {
		setLoading(true)
		const creds = {
			emp_id: userDetails?.emp_id,
			user_type: userDetails?.id,
		}
		axios
			.post(`${url}/fetch_brnname_based_usertype`, creds)
			.then((res) => {
				console.log("Branches ======>", res?.data)
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	useEffect(() => {
        console.log(groupReportGroupWiseHeader);
		getBranches()
	}, [])

    useEffect(() => {
        setReportData([])
        if (searchType === "C") {
            getCOs()
        }
    }, [searchType])

        useEffect(() => {
            setSelectedCOs([])
            if (searchType === "C") {
                getCOs()
            }
        }, [selectedOptions])

    const dropdownOptions = branches?.map((branch) => ({
		value: branch.branch_assign_id,
		label: `${branch.branch_name} - ${branch.branch_assign_id}`,
	}))

    const displayedOptions =
		selectedOptions.length === dropdownOptions.length
			? [{ value: "all", label: "All" }]
			: selectedOptions

    const getCOs = () => {
            setLoading(true)
    
            const branchCodes = selectedOptions?.map((item, i) => item?.value)
            console.log(branchCodes);
            const creds = {
                branch_code:
                    branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
            }
            axios
                .post(`${url}/fetch_brn_co`, creds)
                .then((res) => {
                    console.log("COs ======>", res?.data)
                    setCOs(res?.data?.msg)
                })
                .catch((err) => {
                    console.log("ERRRR>>>", err)
                    setLoading(false)
                })
            setLoading(false)
        }
    
	const handleCOChange = (e) => {
		const selectedId = e.target.value
		setSelectedCO(selectedId)
	}

    
	const dropdownCOs = cos?.map((branch) => ({
		value: branch.co_id,
		label: `${branch.emp_name} - ${branch.co_id}`,
	}))

    const displayedCOs =
		selectedCOs.length === dropdownCOs.length
			? [{ value: "all", label: "All" }]
			: selectedCOs

    const handleMultiSelectChangeCOs = (selected) => {
		if (selected.some((option) => option.value === "all")) {
			setSelectedCOs(dropdownCOs)
		} else {
			setSelectedCOs(selected)
		}
	}
    const fetchSearchTypeName = (searchType) => {
		if (searchType === "M") {
			return "Memberwise"
		} else if (searchType === "G") {
			return "Groupwise"
		} else if (searchType === "C") {
			return "CO-wise"
		}
	}
    const fileName = `Loan_Txn_${fetchSearchTypeName(
		searchType
	)}_${new Date().toLocaleString("en-GB")}.xlsx`
    	
    const handleMultiSelectChange = (selected) => {
		if (selected.some((option) => option.value === "all")) {
			setSelectedOptions(dropdownOptions)
		} else {
			setSelectedOptions(selected)
		}
	}
    return (
        <div>
            <Sidebar mode={2} />
            <Spin
                indicator={<LoadingOutlined spin />}
                size="large"
                className="text-slate-800 dark:text-gray-400"
                spinning={isLoading}>
                <main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
                    <div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
                        <div className="text-3xl text-slate-700 font-bold">
                            Group Report
                        </div>
                    </div>
                        <div className="mb-2 grid grid-cols-12 gap-6">
                            <div className='col-span-12 md:col-span-5'>
                                <Radiobtn className='w-full'
                                    data={options}
                                    val={searchType}
                                    onChangeVal={(value) => {
                                        setSearchType(value);
                                    }}
                                />
                            </div>
                             <div className='col-span-12 md:col-span-6'>
                                <Radiobtn
                                    data={options_1}
                                    val={isActiveOrInActive}
                                    onChangeVal={(value) => {
                                        setIsActiveOrInActive(value);
                                    }}
                                />
                            </div>
                        </div>
                      
                        <div className='grid grid-cols-12 gap-3 my-3'>
                              {(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
						userDetails?.brn_code == 100 && (
							<div className="col-span-12">
								<Select
									options={[{ value: "all", label: "All" }, ...dropdownOptions]}
									isMulti
									value={displayedOptions}
									onChange={handleMultiSelectChange}
									placeholder="Select branches..."
									className="basic-multi-select"
									classNamePrefix="select"
									styles={{
										control: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										valueContainer: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										singleValue: (provided) => ({
											...provided,
											color: "black",
										}),
										multiValue: (provided) => ({
											...provided,
											padding: "0.1rem",
											backgroundColor: "#da4167",
											color: "white",
											borderRadius: "8px",
										}),
										multiValueLabel: (provided) => ({
											...provided,
											color: "white",
										}),
										multiValueRemove: (provided) => ({
											...provided,
											color: "white",
											"&:hover": {
												backgroundColor: "red",
												color: "white",
												borderRadius: "8px",
											},
										}),
										placeholder: (provided) => ({
											...provided,
											fontSize: "0.9rem",
										}),
									}}
								/>
							</div>
						)}
                        {/* <div className='col-span-12'>
                                <TDInputTemplateBr
                                placeholder="Select CO..."
                                type="text"
                                label="CO-wise"
                                name="co_id"
                                handleChange={handleCOChange}
                                data={[
                                    { code: "AC", name: "All COs" },
                                    ...cos.map((dat) => ({
                                        code: dat.co_id,
                                        name: `${dat.emp_name}`,
                                    })),
                                ]}
                                mode={2}
                                disabled={false}
                            />      
                        </div> */}

                                            {searchType === "C" &&
                                            (userDetails?.id === 3 ||
                                                userDetails?.id === 4 ||
                                                userDetails?.id === 11) &&
                                            userDetails?.brn_code == 100 ? (
                                                <div className="col-span-12 mx-auto w-[100%]">
                                                    <Select
                                                        options={[{ value: "all", label: "All" }, ...dropdownCOs]}
                                                        isMulti
                                                        value={displayedCOs}
                                                        onChange={handleMultiSelectChangeCOs}
                                                        placeholder="Select COs'..."
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                borderRadius: "8px",
                                                            }),
                                                            valueContainer: (provided) => ({
                                                                ...provided,
                                                                borderRadius: "8px",
                                                            }),
                                                            singleValue: (provided) => ({
                                                                ...provided,
                                                                color: "black",
                                                            }),
                                                            multiValue: (provided) => ({
                                                                ...provided,
                                                                padding: "0.1rem",
                                                                backgroundColor: "#da4167",
                                                                color: "white",
                                                                borderRadius: "8px",
                                                            }),
                                                            multiValueLabel: (provided) => ({
                                                                ...provided,
                                                                color: "white",
                                                            }),
                                                            multiValueRemove: (provided) => ({
                                                                ...provided,
                                                                color: "white",
                                                                "&:hover": {
                                                                    backgroundColor: "red",
                                                                    color: "white",
                                                                    borderRadius: "8px",
                                                                },
                                                            }),
                                                            placeholder: (provided) => ({
                                                                ...provided,
                                                                fontSize: "0.9rem",
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                searchType === "C" && (
                                                    <div>
                                                        <TDInputTemplateBr
                                                            placeholder="Select CO..."
                                                            type="text"
                                                            label="CO-wise"
                                                            name="co_id"
                                                            handleChange={handleCOChange}
                                                            data={[
                                                                { code: "AC", name: "All COs" },
                                                                ...cos.map((dat) => ({
                                                                    code: dat.co_id,
                                                                    name: `${dat.emp_name}`,
                                                                })),
                                                            ]}
                                                            mode={2}
                                                            disabled={false}
                                                        />
                                                    </div>
                                                )
                                            )}
                        
                         </div>   
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-5'>
                                <TDInputTemplateBr
                                    placeholder="From Date"
                                    type="date"
                                    label="From Date"
                                    name="fromDate"
                                    formControlName={fromDate}
                                    handleChange={(e) => setFromDate(e.target.value)}
                                    min={"1900-12-31"}
                                    mode={1}
                                />
                            </div>
                            <div className='col-span-12 md:col-span-6 place-content-end'>
                            <button
                                    className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
                                    onClick={() => {
                                        console.log('asdasdasdsadasd');
                                        onPressOnSearchButton();
                                    }}
                                >
                                    <SearchOutlined /> <span className={`ml-2`}>Search</span>
                                </button>
                            </div>
                        </div>    

                        <>
                            {reportData.length > 0 && <DynamicTailwindTableGroup
                                data={reportData}
                                pageSize={50}
                                columnTotal={[]}
                                // dateTimeExceptionCols={[0, 1, 20, 22, 27]}
                                headersMap={searchType == 'M' ? memberwiseReportHeader : groupReportGroupWiseHeader}
                                colRemove={[]}
                                isFooterAvailable={false}
                            />}
                        </>

                        {reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>{
										exportToExcel(
											dataToExport,
                                            groupReportGroupWiseHeader,
											fileName,
											[0, 2]
										)
										}}
									className="mt-5 justify-center items-center rounded-full text-green-900"
								>
									<FileExcelOutlined
										style={{
											fontSize: 30,
										}}
									/>
								</button>
							</Tooltip>
							<Tooltip title="Print">
								<button
									onClick={() =>{
									
										printTableReport(
											dataToExport,
                                            groupReportGroupWiseHeader,
											fileName?.split(",")[0],
											[0, 2]
										)
									}}
									className="mt-5 justify-center items-center rounded-full text-pink-600"
								>
									<PrinterOutlined
										style={{
											fontSize: 30,
										}}
									/>
								</button>
							</Tooltip>
						</div>
					)}
                </main>
            </Spin>
        </div>
    )
}

export default GroupReport
