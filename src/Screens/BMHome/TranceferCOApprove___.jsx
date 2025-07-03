import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { Message } from "../../Components/Message";
import {
  Spin,
  Button,
  Modal,
  Tooltip,
  DatePicker,
  Popconfirm,
  Tag,
} from "antd";
import {
  LoadingOutlined,
  SearchOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import TDInputTemplateBr from "../../Components/TDInputTemplateBr";
import { formatDateToYYYYMMDD } from "../../Utils/formateDate";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { printTableRegular } from "../../Utils/printTableRegular";

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

function TranceferCO() {
  const userDetails = JSON.parse(localStorage.getItem("user_details")) || "";
  const [loading, setLoading] = useState(false);

  // const [openModal, setOpenModal] = useState(false)
  // const [approvalStatus, setApprovalStatus] = useState("S")
  const [searchType, setSearchType] = useState(() => "D");
  const [searchType2, setSearchType2] = useState(() => "M");

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [reportData, setReportData] = useState(() => []);
  const [branch, setBranch] = useState(() => "");
  const [branches, setBranches] = useState(() => []);
  const [employees, setEmployees] = useState(() => []);
  const [employee, setEmployee] = useState(() => "");
  const [tot_present, setTotPresent] = useState(() => 0);
  const [tot_early_out, setTotEarlyOut] = useState(() => 0);
  const [tot_late_in, setTotLateIn] = useState(() => 0);
  const [tot_hours, setTothours] = useState(() => 0);
  // const [reportTxnData, setReportTxnData] = useState(() => [])
  // const [tot_sum, setTotSum] = useState(0)
  // const [search, setSearch] = useState("")

  const [metadataDtls, setMetadataDtls] = useState(() => "");

  const handleFetchBranches = async () => {
    setLoading(true);
    await axios
      .get(`${url}/fetch_all_branch_dt`)
      .then((res) => {
        console.log("QQQQQQQQQQQQQQQQ", res?.data);
        setBranches(res?.data?.msg);
      })
      .catch((err) => {
        console.log("?????????????????????", err);
      });

    setLoading(false);
  };
  const handleFetchEmployees = async () => {
    setLoading(true);
    await axios
      .post(`${url}/fetch_employee_fr_branch`, {
        branch_id: userDetails?.brn_code,
      })
      .then((res) => {
        console.log("QQQQQQQQQQQQQQQQ", res?.data);
        setEmployees(res?.data?.msg);
      })
      .catch((err) => {
        console.log("?????????????????????", err);
      });

    setLoading(false);
  };

  useEffect(() => {
    handleFetchBranches();
  }, []);

  useEffect(() => {
    handleFetchEmployees();
  }, []);
  const timeDifference = (startDateStr, endDateStr) => {
    // Convert date strings to Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate the difference in milliseconds
    const diff = endDate - startDate;

    // Convert milliseconds to minutes
    const diffMinutes = Math.floor(diff / (1000 * 60));

    // Convert minutes to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return {
      hours: hours,
      minutes: minutes,
    };
  };
  const handleFetchReport = async () => {
    setLoading(true);
    const creds = {
      from_date: formatDateToYYYYMMDD(fromDate),
      to_date: formatDateToYYYYMMDD(toDate),
      branch_id: userDetails?.brn_code,
      emp_id: employee,
    };
    console.log("KKKKKKKKKKKKKKKKKKK======", branch);
    await axios
      .post(`${url}/attendance_report_brnwise`, creds)
      .then((res) => {
        console.log("RESSSSS======>>>>", res?.data);
        setReportData(res?.data?.msg);
        setMetadataDtls(
          userDetails?.brn_code +
            "," +
            branches.filter((e) => +e.branch_code == +userDetails?.brn_code)[0]
              ?.branch_name
        );
        console.log(
          userDetails?.brn_code +
            "," +
            branches.filter((e) => +e.branch_code == +userDetails?.brn_code)[0]
              ?.branch_name
        );
        if (res?.data?.msg?.length == 0) Message("error", "No Data!");
        console.log("KKKKKKKKKKKKKKKKKKK", branch);
        // setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
      })
      .catch((err) => {
        console.log("ERRRR>>>", err);
      });

    setLoading(false);
  };

  const handleSubmit = () => {
    if (fromDate && toDate && employee) {
      // handleFetchReport();
      if (employee != "A" && employee) handleEmpDetails();
    }
  };

  const handleEmpDetails = () => {
    setLoading(true);
    const creds = {
      from_date: formatDateToYYYYMMDD(fromDate),
      to_date: formatDateToYYYYMMDD(toDate),
      branch_id: branch.split(",")[0],
      emp_id: employee,
    };
    axios.post(`${url}/show_per_emp_detls_per_brn`, creds).then((res) => {
      console.log("RESSSSS======>>>>", res?.data);
      setTotPresent(res?.data?.msg[0]?.tot_present);
      setTotEarlyOut(res?.data?.msg[0]?.early_out[0]?.tot_early_out);
      setTotLateIn(res?.data?.msg[0]?.late_in[0]?.tot_late_in);
      setTothours(res?.data?.msg[0]?.tot_work[0]?.total_work_hours);
    });
  };

  const exportToExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    saveAs(blob, `attendance_report_${metadataDtls}.xlsx`);
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const [activeDescriptionId, setActiveDescriptionId] = useState(null);

  const toggleDescription = (userId) => {
    setActiveDescriptionId((prevId) => (prevId === userId ? null : userId));
  };

  const [remarksForDelete, setRemarksForDelete] = useState(() => "");

  const handleRejectAttendance = async (empId, inDateTime) => {
    setLoading(true);
    const creds = {
      emp_id: empId,
      in_date_time: inDateTime,
      attn_reject_remarks: remarksForDelete,
      rejected_by: userDetails?.emp_id,
    };

    await axios
      .post(`${url}/reject_atten_emp`, creds)
      .then((res) => {
        console.log("RESSSSS======>>>>", res?.data);
        Message("success", "Attendance Rejected Successfully");
      })
      .catch((err) => {
        console.log("ERRRR>>>", err);
      });

    setLoading(false);
  };

  const confirm = async (empId, inDateTime) => {
    if (!remarksForDelete) {
      Message("error", "Please provide remarks for rejection");
      return;
    }

    await handleRejectAttendance(empId, inDateTime)
      .then(() => {
        // fetchLoanApplications("R")
        setRemarksForDelete("");
      })
      .catch((err) => {
        console.log("Err in RecoveryMemberApproveTable.jsx", err);
      });
  };

  const cancel = (e) => {
    console.log(e);
    setRemarksForDelete("");
    // message.error('Click on No');
  };

  return (
    <div>
      <Sidebar mode={2} />
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-slate-800 dark:text-gray-400"
        spinning={loading}
      >
        <main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
          <div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
            <div className="text-3xl text-slate-700 font-bold">
              Trancefer CO
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 mt-5">
            <div>
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
            <div>
              <TDInputTemplateBr
                placeholder="To Date"
                type="date"
                label="To Date"
                name="toDate"
                formControlName={toDate}
                handleChange={(e) => setToDate(e.target.value)}
                min={"1900-12-31"}
                mode={1}
              />
            </div>

            <div>
              <TDInputTemplateBr
                placeholder="Branch..."
                type="text"
                label="Branch"
                name="branch"
                formControlName={userDetails?.brn_code}
                handleChange={(e) => {
                  console.log("***********========", e);
                  // setBranch(
                  // 	e.target.value +
                  // 		"," +
                  // 		branches.filter((i) => i.branch_code == e.target.value)[0]
                  // 			?.branch_name
                  // )
                  setBranch(
                    e.target.value +
                      "," +
                      [
                        { branch_code: "A", branch_name: "All Branches" },
                        ...branches,
                      ].filter((i) => i.branch_code == e.target.value)[0]
                        ?.branch_name
                  );
                  console.log(branches);
                  console.log(
                    e.target.value +
                      "," +
                      [
                        { branch_code: "A", branch_name: "All Branches" },
                        ...branches,
                      ].filter((i) => i.branch_code == e.target.value)[0]
                        ?.branch_name
                  );
                }}
                mode={2}
                disabled={true}
                // data={branches?.map((item, i) => ({
                // 	code: item?.branch_code,
                // 	name: item?.branch_name,
                // }))}
                data={[
                  { code: "A", name: "All Branches" },
                  ...branches?.map((item, i) => ({
                    code: item?.branch_code,
                    name: item?.branch_name,
                  })),
                ]}
              />
            </div>
            <div className="col-span-3">
              <TDInputTemplateBr
                placeholder="Employees..."
                type="text"
                label="Employees"
                name="employee"
                formControlName={employee}
                handleChange={(e) => {
                  console.log("***********========", e);
                  // setBranch(
                  // 	e.target.value +
                  // 		"," +
                  // 		branches.filter((i) => i.branch_code == e.target.value)[0]
                  // 			?.branch_name
                  // )
                  setEmployee(e.target.value);
                  console.log(branches);
                }}
                mode={2}
                // data={branches?.map((item, i) => ({
                // 	code: item?.branch_code,
                // 	name: item?.branch_name,
                // }))}
                  data={[
                    { code: "A", name: "All Employees" },
                    ...employees?.map((item, i) => ({
                      code: item?.emp_id,
                      name: item?.emp_name,
                    })),
                  ]}
                // data={employees?.map((item, i) => ({
                //   code: item?.emp_id,
                //   name: item?.emp_name,
                // }))}
              />
            </div>

            <div className="flex justify-center col-span-3">
              <button
                className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
                onClick={() => {
                  handleSubmit();
                }}
              >
                <SearchOutlined /> <span className={`ml-2`}>Search</span>
              </button>
            </div>
          </div>

          {/* {employee != "A" && employee && reportData.length > 0 && (
            <div className="grid grid-cols-3 gap-5 mt-5">
              <div className="max-w-sm p-6  col-span-1  bg-white border border-teal-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
                    {tot_present || 0}
                  </p>

                  <h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
                    No. of day(s) present
                  </h5>
                </a>
              </div>

              <div className="max-w-sm p-6 col-span-1 bg-white border border-pink-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-pink-500 dark:text-gray-400">
                    {tot_hours || 0}
                  </p>

                  <h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
                    Total hours worked
                  </h5>
                </a>
              </div>

              <div className="max-w-sm p-6 col-span-1 bg-white border border-teal-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <div className="flex justify-around items-center gap-2">
                    <p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
                      {tot_late_in || 0}
                    </p>
                    <p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
                      {tot_early_out || 0}
                    </p>
                  </div>

                  <div className="flex justify-around items-center gap-2">
                    <h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
                      Late-In(s)
                    </h5>
                    <h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
                      Early-Out(s)
                    </h5>
                  </div>
                </a>
              </div>
            </div>
          )} */}

          {/* For Recovery/Collection Results MR */}

          {reportData?.length > 0 && (
            <div
              className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-[500px]
                                  [&::-webkit-scrollbar]:w-1
                                  [&::-webkit-scrollbar-track]:rounded-full
                                  [&::-webkit-scrollbar-track]:bg-transparent
                                  [&::-webkit-scrollbar-thumb]:rounded-full
                                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                                  dark:[&::-webkit-scrollbar-track]:bg-transparent
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                              `}
            >
              <div
                className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
              >
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-sm font-normal text-slate-50 border-t border-b text-left bg-slate-800">
                      <th className="px-4 py-2 text-left">Sl. No.</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Employee ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      {/* <th className="px-4 py-2 text-left">Effective Hours</th> */}
                      <th className="px-4 py-2 text-left">Clock In/Clock Out</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-normal text-gray-700">
                    {reportData?.map((user, i) => (
                      <React.Fragment key={user.id}>
                        <tr
                          className={`cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${
                            i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
                          }`}
                          onClick={() => toggleDescription(i)}
                        >
                          <td className="px-4 py-2 text-left">{i + 1}</td>
                          <td className="px-4 py-2 text-left">
                            {new Date(user?.entry_dt)?.toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="px-4 py-2 text-left">{user.emp_id}</td>
                          <td className="px-4 py-2 text-left">
                            {user.emp_name}
                          </td>
                          <td className="px-4 py-2 text-left">
                            {/* {new Date(user?.out_date_time).getTime()
                              ? timeDifference(
                                  user?.in_date_time,
                                  user?.out_date_time
                                ).hours +
                                "h " +
                                timeDifference(
                                  user?.in_date_time,
                                  user?.out_date_time
                                ).minutes +
                                "m "
                              : "00h 00m"} */}
                                                                  <Tag color="green" className="mb-2">
                                      {user?.in_date_time
                                        ? new Date(user?.in_date_time)
                                            ?.toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })
                                            .replace("am", "AM")
                                            .replace("pm", "PM")
                                        : ""}
                                    </Tag> /  <Tag color="red" className="mb-2">
                                      {" "}
                                      {user?.out_date_time
                                        ? new Date(user?.out_date_time)
                                            ?.toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })
                                            .replace("am", "AM")
                                            .replace("pm", "PM")
                                        : ""}
                                    </Tag>
                          </td>
                          <td className="px-4 py-2 text-left">
                            {/* {user?.clock_status === "I" ? (
                                <span className="mr-1">✅</span>
                              ) : user?.clock_status === "O" ? (
                                <span className="mr-1">🕒</span>
                              ) : user?.clock_status === "E" ? (
                                <span className="mr-1">⌛</span>
                              ) : (
                                <span className="mr-1">🐌</span>
                              )} */}
                            {/* {user?.clock_status === "I"
                                ? "Timely In"
                                : user?.clock_status === "O"
                                ? "Timely Out"
                                : user?.clock_status === "E"
                                ? "Early Out"
                                : "Late In"} */}
                                <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                          user?.late_in === "L"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                            {user?.late_in === "L"
                              ? "Late In"
                              : user?.late_in === "E"
                              ? "Early Out"
                              : user?.clock_status == "I"
                              ? "Timely In"
                              : user?.clock_status == "O"
                              ? "Timely Out"
                              : ""}
                              </span>
                          </td>
                          <td className="p-2 text-left">
                            <div
                              className={`text-white bg-gray-100 border rounded-lg px-2 py-2 text-center inline-flex items-center ${
                                activeDescriptionId === i ? "flipped-icon" : ""
                              }`}
                            >
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  activeDescriptionId === i ? "rotate-180" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path>
                              </svg>
                            </div>
                          </td>
                        </tr>
                        {activeDescriptionId === i && (
                          <tr
                            // className={`transition-all duration-300 ease-in-out transform ${
                            className={`transition-all duration-300 ease-in-out transform ${
                              activeDescriptionId === i
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                            } overflow-hidden`}
                            style={{
                              height: activeDescriptionId === i ? "auto" : "0",
                              opacity: activeDescriptionId === i ? "1" : "0",
                            }}
                          >
                            <td colSpan={6} className="p-0">
                              <div className="m-4 mx-auto  w-full p-6 bg-white rounded-2xl shadow-md">
                                <div className="grid grid-cols-1  w-full sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                  <div>
                                    <h4 className="font-medium text-lg text-teal-500 mb-2">
                                      Clock In
                                    </h4>
                                    <Tag color="green" className="mb-2">
                                      {user?.in_date_time
                                        ? new Date(user?.in_date_time)
                                            ?.toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })
                                            .replace("am", "AM")
                                            .replace("pm", "PM")
                                        : ""}
                                    </Tag>

                                    <p className="text-sm text-gray-700">
                                      {user?.in_addr}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-lg text-teal-500 mb-2">
                                      Clock Out
                                    </h4>
                                    <Tag color="red" className="mb-2">
                                      {" "}
                                      {user?.out_date_time
                                        ? new Date(user?.out_date_time)
                                            ?.toLocaleTimeString("en-GB", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              hour12: true,
                                            })
                                            .replace("am", "AM")
                                            .replace("pm", "PM")
                                        : ""}
                                    </Tag>
                                    <p className="text-sm text-gray-700">
                                      {user?.out_addr}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-lg text-teal-500 mb-2">
                                      Attendance Status
                                    </h4>
                                    <p
                                      className={`text-sm ${
                                        user?.attan_status === "A"
                                          ? "text-green-500"
                                          : user?.attan_status === "R"
                                          ? "text-red-500"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {user?.attan_status === "A"
                                        ? "Approved"
                                        : user?.attan_status === "R"
                                        ? "Rejected"
                                        : "Pending"}
                                    </p>
                                  </div>
                                  {/* <div>
                                                                          <h4 className="font-medium text-lg text-teal-500 mb-2">
                                                                              Clock Status
                                                                          </h4>
                                                                          <span
                                                                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                                                                  user?.clock_status === "I"
                                                                                      ? "bg-green-100 text-green-800"
                                                                                      : user?.clock_status === "O"
                                                                                      ? "bg-blue-100 text-blue-800"
                                                                                      : user?.clock_status === "E"
                                                                                      ? "bg-yellow-100 text-yellow-800"
                                                                                      : "bg-red-100 text-red-800"
                                                                              }`}
                                                                          >
                                                                              {user?.clock_status === "I" ? (
                                                                                  <span className="mr-1">✅</span>
                                                                              ) : user?.clock_status === "O" ? (
                                                                                  <span className="mr-1">🕒</span>
                                                                              ) : user?.clock_status === "E" ? (
                                                                                  <span className="mr-1">⌛</span>
  
                                                                              ) : (
                                                                                  <span className="mr-1">🐌</span>
                                                                              )}
                                                                              {user?.clock_status === "I"
                                                                                  ? "Timely In"
                                                                                  : user?.clock_status === "O"
                                                                                  ? "Timely Out"
                                                                                  : user?.clock_status === "E"
                                                                                  ? "Early Out"
                                                                                  : "Late In"}
                                                                          </span>
                                                                      </div> */}
                                  <div>
                                    <h4 className="font-medium text-lg text-teal-500 mb-2">
                                      Rejection Remarks
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                      {user?.attn_reject_remarks || "N/A"}
                                    </p>
                                  </div>
                                  {user?.late_in == "L" && (
                                    <div>
                                      <h4 className="font-medium text-lg text-teal-500 mb-2">
                                        Status
                                      </h4>
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                          user?.late_in === "L"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        Late In
                                      </span>
                                    </div>
                                  )}
                                  {user?.late_in == "E" && (
                                    <div>
                                      <h4 className="font-medium text-lg text-teal-500 mb-2">
                                        Status
                                      </h4>
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                          user?.late_in === "E"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        Early Out
                                      </span>
                                    </div>
                                  )}
                                  <div className="col-span-5 flex justify-center items-center">
                                    <Popconfirm
                                      title={`Reject Attendance for ${user?.emp_name}`}
                                      description={
                                        <>
                                          <div>
                                            Are you sure you want to reject this
                                            attendance?
                                          </div>
                                          <TDInputTemplateBr
                                            placeholder="Type remarks for rejection..."
                                            type="text"
                                            label="Reason for Rejection*"
                                            name="remarksForDelete"
                                            formControlName={remarksForDelete}
                                            handleChange={(e) =>
                                              setRemarksForDelete(
                                                e.target.value
                                              )
                                            }
                                            mode={3}
                                          />
                                        </>
                                      }
                                      onConfirm={() => {
                                        console.log(user?.in_date_time);
                                        confirm(
                                          user?.emp_id,
                                          user?.in_date_time.split("T")[0] +
                                            " " +
                                            new Date(user?.in_date_time)
                                              ?.toLocaleTimeString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                              })
                                              .replace("am", "")
                                              .replace("pm", "")
                                        );
                                      }}
                                      onCancel={cancel}
                                      okText="Reject"
                                      cancelText="Cancel"
                                    >
                                      {user?.attan_status !== "R" && (
                                        <button className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full hover:bg-red-600 hover:border-red-600 transition ease-in-out duration-300">
                                          <CheckCircleOutlined />
                                          <span className="ml-2">
                                            Reject Attendance
                                          </span>
                                        </button>
                                      )}
                                    </Popconfirm>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ///////////////////////////////////////////////////////////////// */}

          {/* {reportData.length !== 0 && (
            <div className="flex justify-end gap-4">
              <Tooltip title="Export to Excel">
                <button
                  onClick={() => exportToExcel(reportData)}
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
                  onClick={() => {
                    console.log(metadataDtls);
                    printTableRegular(
                      reportData,
                      "Attendance Report",
                      metadataDtls,
                      fromDate,
                      toDate
                    );
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
          )} */}
        </main>
      </Spin>
    </div>
  );
}

export default TranceferCO;
