const express = require('express'),
visit_operationRouter = express.Router(),
path = require('path');
fs = require('fs');
dateFormat = require('dateformat');
const { db_Insert, db_Select } = require("../../model/mysqlModel");

const handleImageUpload_visit = async (file, member_code) => {
    return new Promise((resolve, reject) => {
        try {
            let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            let dir = "assets";
            let subDir = `visit_option`;
            const fullPath = path.join(dir, subDir);
            const ownFile_name = `${member_code}.${file.name.split(".").pop()}`;
            const uploadPath = path.join(fullPath, ownFile_name);

            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }

            file.mv(uploadPath, async (err) => {
                if (err) {
                    // Cleanup if file move fails
                    return reject({ suc: 0, msg: "File move failed", error: err });
                }

                resolve(ownFile_name);
            });
        } catch (err) {
            reject({ suc: 0, msg: "Error during image upload", error: err });
        }
    });
};

//FETCH OVERDUE LIST CO OR BM WISE APP
visit_operationRouter.post("/fetch_od_list", async (req, res) => {
    try{
    const {id,branch_code,emp_id,limit,offset,filter_type} = req.body;
    // console.log(req.body,'data_visit');

    // ================= FETCH CURRENT MAX TRF DATE =================
    let maxDateQry = await db_Select(
        "MAX(trf_date) AS max_trf_date",
        "td_od_loan",
        `branch_code = '${branch_code}'`,
        null
    );

    let max_trf_date = maxDateQry.msg[0].max_trf_date;
    // console.log(max_trf_date,'max_trf_date');
    

    if(max_trf_date){
    const yr = max_trf_date.getFullYear();
    const mn = String(max_trf_date.getMonth() + 1).padStart(2,'0');
    const dt = String(max_trf_date.getDate()).padStart(2,'0');

    max_trf_date = `${yr}-${mn}-${dt}`;
} 
    // console.log(max_trf_date,'max_trf_datelll');
    

    if(!max_trf_date){
        return res.send({
            suc: 0,
            msg: "No overdue data found",
            data: []
        });
    }

    var select = "c.group_code,c.group_name,b.member_code,d.client_name AS member_name,d.client_mobile,Round(COALESCE(a.od_amt,0),2) AS overdue_amount,DATE_FORMAT(a.trf_date,'%Y-%m-%d')AS disb_dt,DATE_FORMAT(a.od_date,'%Y-%m-%d')AS od_dt,TIMESTAMPDIFF(MONTH, a.od_date, CURDATE()) AS overdue_month,DATE_FORMAT(e.datetime_visit,'%Y-%m-%d %H:%i:%s')AS date_time_visit";
    table_name = `td_od_loan a JOIN td_loan b ON b.loan_id = a.loan_id AND b.branch_code = a.branch_code JOIN md_group c ON c.group_code = b.group_code AND c.branch_code = b.branch_code JOIN md_member d ON d.member_code = b.member_code AND d.branch_code = b.branch_code LEFT JOIN (
    SELECT loan_id, branch_code, MAX(datetime_visit) AS datetime_visit
    FROM td_visit_operation
    GROUP BY loan_id, branch_code
    ) e 
    ON a.loan_id = e.loan_id
    AND a.branch_code = e.branch_code`;
    whr = `a.od_amt > 0 AND a.branch_code = '${branch_code}' AND DATE(a.trf_date) = '${max_trf_date}'`;

    if (id === '1') {
    whr += ` AND b.modified_by = '${emp_id}'`;
    }

    // if(id === '2' || id === '13'){
    // whr +=` AND a.branch_code = '${branch_code}'`
    // }

    // ========================== HAVING FILTER ==================
    let having = '';

    if(filter_type === '6'){
        having = ` HAVING overdue_month <= 6`;
    }
    
    if(filter_type === '12'){
        having = ` HAVING overdue_month > 6 AND overdue_month <= 12`;
    }
    
    if(filter_type === '24'){
        having = ` HAVING overdue_month > 12 AND overdue_month <= 24`;
    }
    
    if(filter_type === '25'){
        having = ` HAVING overdue_month > 24`;
}

    // order = `ORDER BY a.trf_date DESC,a.loan_id DESC LIMIT ${offset}, ${limit}`;
    order = `${having} ORDER BY CASE WHEN e.datetime_visit IS NULL THEN 1 ELSE 0 END,
            e.datetime_visit DESC,
            overdue_month DESC,
            a.loan_id DESC
            LIMIT ${offset}, ${limit}`;
    var fetch_od_list = await db_Select(select,table_name,whr,order);

    if(fetch_od_list.suc === 1 && fetch_od_list.msg.length > 0){
    return res.send({
    suc: 1,
    msg: "Fetch overdue loan list",
    data: fetch_od_list.msg
    });
    }else{
    return res.send({
    suc: 0,
    msg: "No overdues data found",
    data: []
    });
    }
    }catch(error){
    console.error("Error in while fetch od list in app:", error);
    return res.send({
    success: false,
    msg: "Internal server error",
    errorCode: "SERVER_ERROR"
    });
    }
});

// FETCH MEMBER,LOAN AND OVERDUE DETAILS
visit_operationRouter.post("/fetch_details_fr_view", async (req, res) => {
    try{
    const {branch_code,member_code,group_code} = req.body;
    // console.log(req.body,'data_fetch');
    
    // =========================== FETCH MEMBER DETAILS ================
    var select = "a.member_code,a.client_name AS member_name,a.client_mobile,a.client_addr,c.group_name",
    table_name = "md_member a LEFT JOIN td_grt_basic b ON a.branch_code = b.branch_code AND a.member_code = b.member_code LEFT JOIN md_group c ON a.branch_code = c.branch_code AND b.prov_grp_code = c.group_code",
    whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND b.prov_grp_code = '${group_code}'`,
    order = null;
    var fetch_memb_dtls = await db_Select(select,table_name,whr,order);

    if(fetch_memb_dtls.suc === 1 && fetch_memb_dtls.msg.length > 0){
  
    // ======================== FETCH LOAN DETAILS =============
    var select = `a.loan_id,DATE_FORMAT(a.disb_dt,'%Y-%m-%d')AS disb_dt,DATE_FORMAT(a.instl_start_dt,'%Y-%m-%d')AS instl_start_dt,DATE_FORMAT(a.instl_end_dt,'%Y-%m-%d')AS instl_end_dt,a.scheme_id,b.scheme_name,a.tot_emi,ROUND(COALESCE(a.prn_disb_amt,0),2) AS member_disb_amount, (
            SELECT ROUND(COALESCE(SUM(x.prn_disb_amt),0),2)
            FROM td_loan x
            WHERE x.branch_code = a.branch_code
            AND x.group_code = a.group_code
        ) AS group_disb_amount`,
    table_name = "td_loan a LEFT JOIN md_scheme b ON a.scheme_id = b.scheme_id",
    whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND a.group_code = '${group_code}' AND a.outstanding > 0`,
    order = null;
    var fetch_loan_dtls = await db_Select(select,table_name,whr,order);

    var loan_id = fetch_loan_dtls.suc === 1 && fetch_loan_dtls.msg.length > 0 ? fetch_loan_dtls.msg[0].loan_id
    : 0;
    console.log(loan_id,'loan');
    
     // ================= OVERDUE DETAILS =================
    //  var select = `a.loan_id,DATE_FORMAT(a.od_date,'%Y-%m-%d')AS overdue_date,ROUND(COALESCE(a.od_amt,0),2)
    //         AS member_overdue_amount,ROUND(COALESCE(a.outstanding,0),2)AS member_outstanding,(
    //         SELECT ROUND(COALESCE(SUM(x.od_amt),0),2)
    //         FROM td_od_loan x
    //         INNER JOIN td_loan y
    //             ON y.loan_id = x.loan_id
    //         WHERE y.branch_code = '${branch_code}'
    //         AND y.group_code = '${group_code}'
    //         AND x.trf_date = (
    //         SELECT MAX(t.trf_date)
    //         FROM td_od_loan t
    //         INNER JOIN td_loan l
    //         ON l.loan_id = t.loan_id
    //         WHERE l.group_code = '${group_code}'
    //         )
    //     ) AS group_overdue_amount,
    //     (
    //         SELECT ROUND(COALESCE(SUM(x.outstanding),0),2)
    //         FROM td_od_loan x
    //         INNER JOIN td_loan y
    //             ON y.loan_id = x.loan_id
    //         WHERE y.branch_code = '${branch_code}'
    //         AND y.group_code = '${group_code}'
    //         AND x.trf_date = (
    //         SELECT MAX(t.trf_date)
    //         FROM td_od_loan t
    //         INNER JOIN td_loan l
    //         ON l.loan_id = t.loan_id
    //         WHERE l.group_code = '${group_code}'
    //         )
    //     ) AS group_outstanding`,
    var select = `a.loan_id,DATE_FORMAT(a.od_date,'%Y-%m-%d')AS overdue_date,ROUND(COALESCE(a.od_amt,0),2)
            AS member_overdue_amount,ROUND(COALESCE(a.outstanding,0),2)AS member_outstanding,(
            SELECT ROUND(COALESCE(SUM(x.od_amt),0),2)
            FROM td_od_loan x
            INNER JOIN td_loan y
                ON y.loan_id = x.loan_id
            WHERE y.branch_code = '${branch_code}'
            AND y.group_code = '${group_code}'
            AND x.trf_date = (
            SELECT MAX(t.trf_date)
            FROM td_od_loan t
            INNER JOIN td_loan l
            ON l.loan_id = t.loan_id
            WHERE l.group_code = '${group_code}'
            )
        ) AS group_overdue_amount,
        (
            SELECT ROUND(COALESCE(SUM(x.outstanding),0),2)
            FROM td_od_loan x
            INNER JOIN td_loan y
                ON y.loan_id = x.loan_id
            WHERE y.branch_code = '${branch_code}'
            AND y.group_code = '${group_code}'
            AND x.trf_date = (
            SELECT MAX(t.trf_date)
            FROM td_od_loan t
            INNER JOIN td_loan l
            ON l.loan_id = t.loan_id
            WHERE l.group_code = '${group_code}'
            )
        ) AS group_outstanding`,
    table_name = `td_od_loan a
        INNER JOIN (
            SELECT
                loan_id,
                MAX(trf_date) AS max_trf_date
            FROM td_od_loan
            GROUP BY loan_id
        ) z
            ON a.loan_id = z.loan_id
            AND a.trf_date = z.max_trf_date`,
    whr = `a.branch_code = '${branch_code}' AND a.loan_id = '${loan_id}'`,
    order = null;
    var fetch_overdue_dtls = await db_Select(select,table_name,whr,order);

     return res.send({
        suc: 1,
        msg: "Fetch details successfully",
        member_details: fetch_memb_dtls.msg[0],
        loan_details: fetch_loan_dtls.suc === 1 ? fetch_loan_dtls.msg : [],
        overdue_details: fetch_overdue_dtls.suc === 1 ? fetch_overdue_dtls.msg : []
    });
    }else{
         return res.send({
            suc: 0,
            msg: "No member details found"
     });
    }
    }catch(error){
     console.error("Error in while fetch details for view in app:", error);
    return res.send({
    success: false,
    msg: "Internal server error",
    errorCode: "SERVER_ERROR"
    });   
    }
});

// SAVE DATA td_visit_operation table
visit_operationRouter.post("/save_visi_option", async (req, res) => {
try {    
const {branch_code,group_code,member_code,loan_id,od_date,od_amt_grp,od_amt_mem,outstanding_gp,outstanding_mem,promise_date,promise_amt,remarks,created_by,visit_lat,visit_long} = req.body;
// console.log(req.body,'save_visit');

let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

let upload_img = '';
// ================= IMAGE UPLOAD =================

if (req.files && req.files.upload_img) {
upload_img = await handleImageUpload_visit(
req.files.upload_img,
member_code
);
}

var table_name = "td_visit_operation",
fields = "(branch_code, datetime_visit, group_code, member_code, loan_id, od_date, od_amt_grp, od_amt_mem, outstanding_gp, outstanding_mem, upload_img, promise_date, promise_amt, remarks,created_by, visit_lat, visit_long)",
values = `('${branch_code}','${datetime}','${group_code}','${member_code}','${loan_id}','${od_date}','${od_amt_grp}','${od_amt_mem}','${outstanding_gp}','${outstanding_mem}','${upload_img}','${promise_date}','${promise_amt}','${remarks.replace(/'/g, "''")}','${created_by}','${visit_lat}','${visit_long}')`,
whr = null,
flag =  0;
var visit_data = await db_Insert(table_name, fields, values, whr, flag);
return res.send({
suc: 1,
msg: "Visit operation data saved successfully",
})
}catch(error){
 console.error("Error in while save visit option details in app:", error);
 return res.send({
 success: false,
 msg: "Internal server error",
 errorCode: "SERVER_ERROR"
 });   
}
});

// FETCH LIST IN CO,BM AND HO LEVEL
visit_operationRouter.post("/fetch_list_save_visit_operation", async (req, res) => {
try{
const {id,branch_code,emp_id,from_dt,to_dt} = req.body;
console.log(req.body,'fetch_web');

var select = "a.branch_code,a.group_code,b.group_name,a.member_code,c.client_name AS member_name,a.loan_id",
table_name = "td_visit_operation a LEFT JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN md_member c ON a.branch_code = c.branch_code AND a.member_code = c.member_code",
whr = `DATE(a.datetime_visit) BETWEEN '${from_dt}' AND '${to_dt}'`;
if (id === '1') {
whr += ` AND a.branch_code = '${branch_code}' AND a.created_by = '${emp_id}'`;
}

if(id === '4' || id === '2' || id === '13'){
whr += ` AND a.branch_code = '${branch_code}'`;
}
order = `ORDER BY a.datetime_visit DESC`;
fetch_list = await db_Select(select,table_name,whr,order);

if(fetch_list.suc === 1 && fetch_list.msg.length > 0){
return res.send({
suc: 1,
msg: "Visit operation data fetch successfully",
data: fetch_list.msg  
});
}else{
return res.send({
suc: 0,
msg: "No data found in visit operation",
data: []  
})
}
}catch(error){
 console.error("Error in while fetch list of visit operation:", error);
 return res.send({
 success: false,
 msg: "Internal server error",
 errorCode: "SERVER_ERROR"
 });   
}
});

// FETCH DATA IN CO,BM,HO LEVEL WITH LAT AND LONG
visit_operationRouter.post("/fetch_visit_view_data", async (req, res) => {
try{
const {branch_code,group_code,member_code,loan_id} = req.body;
// console.log(req.body,'view_visit');

//MEMBER DETAILS WITH LAT AND LONG
var select = `DATE_FORMAT(a.datetime_visit,'%Y-%m-%d %H:%i:%s')AS datetime_visit,IFNULL(NULLIF(a.group_code,''),'N/A') AS group_code,IFNULL(NULLIF(b.group_name,''),'N/A') AS group_name,IFNULL(NULLIF(a.member_code,''),'N/A') AS member_code,IFNULL(NULLIF(c.client_name,''),'N/A') AS member_name,IFNULL(NULLIF(c.client_mobile,''),'N/A') AS client_mobile,IFNULL(NULLIF(c.client_addr,''),'N/A') AS client_addr`,
table_name = "td_visit_operation a LEFT JOIN md_group b ON a.branch_code = b.branch_code AND a.group_code = b.group_code LEFT JOIN md_member c ON a.branch_code = c.branch_code AND a.member_code = c.member_code",
whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND a.group_code = '${group_code}'`,
order = null;
var fetch_mem_view = await db_Select(select,table_name,whr,order);

if(fetch_mem_view.suc === 1 && fetch_mem_view.msg.length > 0){

// LOAN DETAILS
var select = `IFNULL(NULLIF(a.loan_id,''),'N/A') AS loan_id,DATE_FORMAT(b.disb_dt,'%Y-%m-%d')AS disb_dt,DATE_FORMAT(b.instl_start_dt,'%Y-%m-%d')AS instl_start_dt,DATE_FORMAT(b.instl_end_dt,'%Y-%m-%d')AS instl_end_dt,IFNULL(NULLIF(b.scheme_id,''),'N/A') AS scheme_id,IFNULL(NULLIF(c.scheme_name,''),'N/A') AS scheme_name,IFNULL(NULLIF(b.tot_emi,''),'N/A') AS tot_emi,ROUND(COALESCE(b.prn_disb_amt,0),2) AS member_disb_amount, (
            SELECT ROUND(COALESCE(SUM(x.prn_disb_amt),0),2)
            FROM td_loan x
            WHERE x.branch_code = b.branch_code
            AND x.group_code = b.group_code
        ) AS group_disb_amount`,
table_name = "td_visit_operation a LEFT JOIN td_loan b ON a.branch_code = b.branch_code AND a.group_Code = b.group_code AND a.loan_id = b.loan_id AND a.member_code = b.member_code LEFT JOIN md_scheme c ON b.scheme_id = c.scheme_id",
whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND a.group_code = '${group_code}' AND a.loan_id = '${loan_id}' AND b.outstanding > 0`,
order = null;
var fetch_loan_view = await db_Select(select,table_name,whr,order);

// OVERDUE DETAILS
var select = `a.loan_id,DATE_FORMAT(a.od_date,'%Y-%m-%d')AS overdue_date,ROUND(COALESCE(a.od_amt_mem,0),2)
            AS member_overdue_amount,ROUND(COALESCE(a.outstanding_mem,0),2)AS member_outstanding,ROUND(COALESCE(a.od_amt_grp,0),2) AS group_overdue_amount,ROUND(COALESCE(a.outstanding_gp,0),2)AS group_outstanding`,
table_name = "td_visit_operation a",
whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND a.group_code = '${group_code}' AND a.loan_id = '${loan_id}'`,
order = null;
var fetch_od_view = await db_Select(select,table_name,whr,order);

// ACTION DETAILS
var select = `CONCAT('/visit_option/', a.upload_img) AS upload_img,DATE_FORMAT(a.promise_date,'%Y-%m-%d')AS promise_date,a.promise_amt,a.remarks,a.visit_lat,a.visit_long`,
table_name = "td_visit_operation a",
whr = `a.branch_code = '${branch_code}' AND a.member_code = '${member_code}' AND a.group_code = '${group_code}' AND a.loan_id = '${loan_id}'`,
order = null;
var fetch_action_view = await db_Select(select,table_name,whr,order);

return res.send({
suc: 1,
msg: "Fetch Visit Operation details successfully",
member_details: fetch_mem_view.msg[0],
loan_details: fetch_loan_view.suc === 1 ? fetch_loan_view.msg : [],
overdue_details: fetch_od_view.suc === 1 ? fetch_od_view.msg : [],
action_details: fetch_action_view.suc === 1 ? fetch_action_view.msg : []
});
}else{
return res.send({
suc: 0,
msg: "No member details found"
});
}
}catch(error){
 console.error("Error in while fetch submit visit operation data:", error);
 return res.send({
 success: false,
 msg: "Internal server error",
 errorCode: "SERVER_ERROR"
 });   
}
});

module.exports = {visit_operationRouter}