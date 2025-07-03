import React, { useEffect, useState } from "react";
import { routePaths } from "../Assets/Data/Routes";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { url } from "../Address/BaseUrl";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

import { Paginator } from "primereact/paginator";
import { motion } from "framer-motion";
import nodata from "../../src/Assets/Images/nodata.png";
import {
  EditOutlined,
  MonitorOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import SkeletonLoading from "../Components/SkeletonLoading";
import CompositeSearch from "../Components/CompositeSearch";
import Radiobtn from "../Components/Radiobtn";
import { UploadFileOutlined } from "@mui/icons-material";

function UploadViewTemplate({ flag, title }) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const rdBtn = [
    { label: "Uploaded", value: 1 },
    { label: "Yet to upload", value: 2 },
  ];
  const [value, setValue] = useState(0);
  const [po_data, setPoData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [copy, setCopy] = useState([]);
  const params=useParams()
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("id");
    localStorage.removeItem("po_issue_date");
    localStorage.removeItem("po_status");
    localStorage.removeItem("po_no");
    localStorage.removeItem("po_comments");
    localStorage.removeItem("order_id");
    localStorage.removeItem("order_date");
    localStorage.removeItem("order_type");
    localStorage.removeItem("proj_name");
    localStorage.removeItem("vendor_name");
    localStorage.removeItem("itemList");
    localStorage.removeItem("terms");
    localStorage.removeItem("termList");
    localStorage.removeItem("ship_to");
    localStorage.removeItem("bill_to");
    localStorage.removeItem("ware_house_flag");
    localStorage.removeItem("notes");
    localStorage.removeItem("mdcc_flag");
    localStorage.removeItem("mdcc");
    localStorage.removeItem("insp_flag");
    localStorage.removeItem("insp");
    localStorage.removeItem("drawing_flag");
    localStorage.removeItem("drawing");
    localStorage.removeItem("dt");
  }, []);
  
  const search = (value) => {
    setLoading(true);
    if (flag == "T") {
      axios.post(url + "/api/gettcbypo", { po: value }).then((res) => {
        console.log(res);
        setLoading(false);
        setCopy(res?.data?.msg);
        setPoData(res?.data?.msg);
      });
    } else {
      axios.post(url + "/api/getmdccbypo", { po: value }).then((res) => {
        console.log(res);
        setLoading(false);
        setCopy(res?.data?.msg);
        setPoData(res?.data?.msg);
      });
    }
  };
  const onChange = (e) => {
    console.log("radio checked", e);
    if (e == 1) {
      setPoData(
        copy.filter(
          (e) =>
            (e.po_status == "A" || e.po_status == "U") && e.fresh_flag == "Y"
        )
      );
      console.log(po_data);
    } else {
      setPoData(
        copy.filter(
          (e) => e.po_status != "A" && e.po_status != "U" && e.fresh_flag == "Y"
        )
      );
      console.log(po_data);
    }
  };
  useState(() => {
    axios
      .post(url + "/api/getvendor", { id: 0 })
      .then((res) => {
        console.log(res);
        setVendors(res?.data.msg);
        vendorList.length = 0;
        setVendorList([]);
        for (let i of res?.data?.msg) {
          vendorList.push({
            name: i.vendor_name,
            code: i.sl_no,
          });
        }
        setVendorList(vendorList);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
    axios.post(url + "/api/getproject", { id: 0 }).then((res) => {
      console.log(res);
      setProjects(res?.data.msg);
      setProjectList([]);
      projectList.length = 0;
      for (let i of res?.data?.msg) {
        projectList.push({
          name: i.proj_name,
          code: i.sl_no,
        });
      }
      setProjectList(projectList);
    });
  }, []);
  const onAdvSearch = (val1, val2) => {
    console.log(val1, val2);
    setValue(0);
    setPoData(
      copy?.filter(
        (e) =>
          e?.vendor_name?.toLowerCase().includes(val1?.toLowerCase()) &&
          e?.proj_name?.toLowerCase().includes(val2?.toLowerCase())
      )
    );
  };
  return (
    <>
      <div className="flex items-center  justify-end h-14 -mt-[72px] w-auto dark:bg-[#22543d] md:flex-row space-y-3 md:space-y-0 rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, type: "just" }}
          className="w-full hidden md:block  md:w-auto sm:flex sm:flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0"
        >
          <Tooltip title={`Upload new ${title}`}>
            <Link
              to={
                flag == "M"
                  ? routePaths.MDCCFORM + 0
                  : routePaths.TESTCERTFORM + 0
              }
              type="submit"
              className="flex items-center justify-center border-2 border-white border-r-0 text-white bg-green-900 hover:bg-primary-800 text-nowrap rounded-l-md transition ease-in-out  active:scale-90 text-sm p-1 px-2 dark:bg-gray-800 dark:text-white dark:hover:bg-primary-700 focus:outline-none shadow-lg  hover:duration-500 hover:shadow-lg dark:focus:ring-primary-800 ml-2 capitalize"
            >
              <UploadFileOutlined className="text-sm" /> {`Upload new ${title}`}
            </Link>
          </Tooltip>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, type: "just" }}
          className={
            "bg-white border-2 border-l-0 text-green-900 font-semibold text-lg rounded-r-full p-0.5 shadow-lg"
          }
        >
          <Tooltip title="Print this table" arrow>
            <PrinterOutlined />
          </Tooltip>
        </motion.button>
      </div>

      {/* <div className="flex justify-between items-center">
     <Radiobtn data={rdBtn} val={value} onChangeVal={(value)=>{console.log(value);onChange(value)}}/>
      
       <CompositeSearch data={{set_one:vendorList,set_two:projectList,set_one_lbl:'Vendors',set_two_lbl:'Projects'}} onReset={()=>{setPoData(copy);setValue(0)}} onSubmit={(values)=>{console.log(values); onAdvSearch(values.val_one,values.val_two)}}/>
      </div> */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
      >
        <div className="flex flex-col p-1 bg-green-900 rounded-full my-3 dark:bg-[#22543d] md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 ">
          <div className="w-full relative flex justify-normal">
            <div className="flex items-center justify-between w-11/12">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "just" }}
                className="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-5"
              >
                {title}
              </motion.h2>

              <label for="simple-search" className="sr-only">
                Search by PO No.
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
                  className="bg-white border rounded-full border-emerald-500 text-gray-800 text-sm  block w-full  pl-10 dark:bg-gray-800 md:ml-4  duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search by PO No."
                  required=""
                  onChange={(text) => {
                    setSearchVal(text.target.value);
                    if (!text.target.value) {
                      setCopy([]);
                      setPoData([]);
                    }
                  }}
                />
              </div>
              <button
                disabled={loading || searchVal == ""}
                className="rounded-full absolute right-0 flex justify-center items-center bg-white text-green-900 h-10 w-10"
                onClick={() => {
                  search(searchVal);
                }}
              >
                <MonitorOutlined className="text-green-900" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      {loading && <SkeletonLoading />}

      {copy.length == 0 && loading == false && (
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
            className="h-12 text-green-900 -mt-16  2xl:ml-48 2xl:h-24 font-bold"
          >
             You can either create or search to view any record here!
          </motion.h2>
        </div>
      )}
      <div className="relative overflow-x-auto">
        {!loading && copy.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
          >
            <p className="text-md italic font-bold text-green-900 my-2 mx-3">
              Search results for "{searchVal}":
            </p>
            <table className="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
              <thead className=" text-md  text-gray-700 capitalize   bg-[#C4F1BE] dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    #
                  </th>
                  <th scope="col" className="p-4">
                    PO No.
                  </th>
                  <th scope="col" className="p-4">
                    Date
                  </th>

                  <th scope="col" className="p-4">
                    Created By
                  </th>
                  <th scope="col" className="p-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {po_data &&
                  po_data?.slice(first, rows + first).map((item) => (
                    <tr className="bg-white text-nowrap border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.sl_no}
                      </th>
                      <td className="px-6 py-4">{item.po_no}</td>
                      <td className="px-6 py-4">{item.test_dt}</td>

                      <td className="px-6 py-4">{item.created_by}</td>
                      <td className="px-3 py-4 flex gap-3">
                      
                        <Link
                          to={
                            flag == "M"
                              ? routePaths.MDCCFORM + item.sl_no
                              : routePaths.TESTCERTFORM + item.sl_no
                          }
                        >
                          <EditOutlined className="text-md text-green-900" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Paginator
              first={first}
              rows={rows}
              totalRecords={po_data?.length}
              rowsPerPageOptions={[3, 5, 10, 15, 20, 30, po_data?.length]}
              onPageChange={onPageChange}
            />
          </motion.section>
        )}
      </div>
    </>
  );
}

export default UploadViewTemplate;
