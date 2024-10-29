const { db_Select } = require('../../model/mysqlModel');

const express = require('express'),
masterRouter = express.Router(),
dateFormat = require('dateformat');

masterRouter.get("/get_group", async (req, res) => {
 var data = req.query;

 var select = "*",
 table_name = "md_group",
 whr = `branch_code = '${data.branch_code}' AND approval_status = 'U'`,
 order = null;
 var group_dt = await db_Select(select,table_name,whr,order);
 res.send(group_dt) 
});

masterRouter.get("/get_group_add", async (req, res) => {
    var data = req.query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Fetch data in chunks
    let offset = 0;
    const limit = 100; // Define chunk size

    const fetchChunk = async () => {
        var select = "*",
        table_name = "md_group",
        whr = `branch_code = '${data.branch_code}' AND approval_status = 'U'`,
        order = `LIMIT ${limit} OFFSET ${offset}`;
        var group_dt = await db_Select(select,table_name,whr,order);

        if(group_dt.suc > 0){
            for(let dt of group_dt.msg){
                res.write(`data: ${JSON.stringify(dt)}\n\n`);
            }

            offset += limit;

            // Check if more data is available, else end the stream
            if (group_dt.msg.length < limit) {
                res.end();
            } else {
                setTimeout(fetchChunk, 1000); // Delay before sending the next chunk
            }
        }else{
            res.end();
        }
    };
    fetchChunk();
});


masterRouter.get("/get_religion", async (req, res) => {
    var religion_dt = [
        {
            id: "Hinduism",
            name: "Hinduism"
        },
        {
            id: "Islam",
            name: "Islam"
        },
        {
            id: "Christianity",
            name: "Christianity"
        },
        {
            id: "Jainism",
            name: "Jainism"
        },
        {
            id: "Buddhism",
            name: "Buddhism"
        },
        {
            id: "Sikhism",
            name: "Sikhism"
        },
        {
            id: "Others",
            name: "Others"
        },
    ]
    res.send(religion_dt) 
   });


masterRouter.get("/get_caste", async (req, res) => {
    var caste_dt = [
        {
            id: "General",
            name: "General"
        },
        {
            id: "SC",
            name: "SC"
        },
        {
            id: "ST",
            name: "ST"
        },
        {
            id: "OBC",
            name: "OBC"
        },
        {
            id: "OBCA",
            name: "OBCA"
        },
        {
            id: "OBCB",
            name: "OBCB"
        },
        {
            id: "Others",
            name: "Others"
        },
        {
            id: "Minority",
            name: "Minority"
        },
    ]
    res.send(caste_dt) 
   });


masterRouter.get("/get_education", async (req, res) => {
    var edu_dt = [
        {
            id: "Secondary",
            name: "Secondary"
        },
        {
            id: "Intermidiate",
            name: "Intermidiate"
        },
        {
            id: "Graduate",
            name: "Graduate"
        },
        {
            id: "Post Graduate",
            name: "Post Graduate"
        },
        {
            id: "Voccational",
            name: "Voccational"
        },
        {
            id: "Others",
            name: "Others"
        },
    ]
    res.send(edu_dt) 
   });   


//    masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;

//     var select = "*",
//     table_name = "td_grt_basic",
//     whr = data.flag == 'M' ? `client_mobile = '${data.user_dt}' : 'data no found'` : data.flag == 'A' ? `aadhar_no = '${data.user_dt}' : 'data no found'` : data.flag == 'P' ? `pan_no = '${data.user_dt}' : 'data no found'` : '',
//     order = null;
//     var valid_data = await db_Select(select,table_name,whr,order);
//     res.send(valid_data)
// });

// masterRouter.post("/fetch_validation", async (req, res) => {
//     var data = req.body;

//     var select = "a.*, b.group_name",
//         table_name = "td_grt_basic a, md_group b",
//         whr = `a.prov_grp_code = b.group_code
//         AND data.flag == 'M' ? `a.client_mobile = '${data.user_dt}'` :  data.flag == 'A' ? `a.aadhar_no = '${data.user_dt}'` :  data.flag == 'P' ? `a.pan_no = '${data.user_dt}'` : '',
//         order = null;
//         var res_dt = await db_Select(select,table_name,whr,order)
//         res.send(res_dt)
// });

masterRouter.post("/fetch_validation", async (req, res) => {
    var data = req.body;

    var select = "a.*, b.group_name";
    var table_name = "md_member a, md_group b";
    
    var whr = `a.branch_code = b.branch_code `;
    if (data.flag == 'M') {
        whr += `AND a.client_mobile = '${data.user_dt}'`;
    } else if (data.flag == 'A') {
        whr += `AND a.aadhar_no = '${data.user_dt}'`;
    } else if (data.flag == 'P') {
        whr += `AND a.pan_no = '${data.user_dt}'`;
    }

    var order = null;

    try {
        var res_dt = await db_Select(select, table_name, whr, order);
        var response_set = {}
        if(res_dt.suc > 0){
            if(res_dt.msg.length > 0){
                var default_chk = await db_Select('a.outstanding,b.branch_name', 'td_loan a LEFT JOIN md_branch b ON a.branch_id = b.branch_code', `sub_customer_id=${res_dt.msg[0].member_code}`, `HAVING outstanding > 0`)
                if(default_chk.suc > 0){
                    if(default_chk.msg.length > 0){
                        response_set = {suc: 0, msg: [], status: `You are in ${default_chk.msg[0].branch_name} Branch and You are not eligible to get a new Loan. You have Rs. ${default_chk.msg[0].outstanding} outstanding.`}
                    }else{
                        response_set = {suc: 1, msg: res_dt.msg, status: `Existing User in ${default_chk.msg[0].branch_name} Branch and Eligible to apply a new loan.`}
                    }
                }else{
                    response_set = {suc: 1, msg: res_dt.msg, status: 'Error to fetch outstanding data'}
                }
                
            }else{
                response_set = {suc: 1, msg: [], status: 'Fresh User'}
            }
        }
        res.send(response_set);
    } catch (error) {
        // Handle errors
        res.send({ suc: 0, msg: [], status: 'Error to fect user data' });
    }
});



masterRouter.get("/get_state", async (req, res) => {
    var data = req.query;
   
    var select = "*",
    table_name = "md_state",
    whr = null,
    order = null;
    var state_dt = await db_Select(select,table_name,whr,order);
    res.send(state_dt) 
   });


masterRouter.get("/get_district", async (req, res) => {
    var data = req.query;
   
    var select = "*",
    table_name = "md_district",
    whr = `state_id = '${data.state_id}'`,
    order = null;
    var district_dt = await db_Select(select,table_name,whr,order);
    res.send(district_dt) 
   });

masterRouter.get("/get_block", async (req, res) => {
    var data = req.query;
   
    var select = "*",
    table_name = "md_block",
    whr = `dist_id = '${data.dist_id}'`,
    order = null;
    var block_dt = await db_Select(select,table_name,whr,order);
    res.send(block_dt) 
   });   

masterRouter.get("/get_purpose", async (req, res) => {
    var data = req.query;
   
    var select = "*",
    table_name = "md_purpose",
    whr = null,
    order = null;
    var purpose_dt = await db_Select(select,table_name,whr,order);
    res.send(purpose_dt) 
   });

masterRouter.get("/get_sub_purpose", async (req, res) => {
    var data = req.query;
   
    var select = "*",
    table_name = "md_sub_purpose",
    whr = `purp_id = '${data.purp_id}'`,
    order = null;
    var sub_purpose_dt = await db_Select(select,table_name,whr,order);
    res.send(sub_purpose_dt) 
   });   

//    masterRouter.get("/get_study", async (req, res) => {
//     var edu_dt = [
//         {
//             id: "Studying",
//             name: "Studying"
//         },
//         {
//             id: "Working",
//             name: "Working"
//         }
//     ]
//     res.send(edu_dt) 
//    }); 

module.exports = {masterRouter}