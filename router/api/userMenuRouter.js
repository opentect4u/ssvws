const { db_Select } = require('../../model/mysqlModel')

const userMenuRouter = require('express').Router()

userMenuRouter.post('/get_menu', async (req, res) => {
    var user_type_id = req.body.user_type_id
    var select = 'a.user_type_id, a.menu_id, b.sl_no, b.key_id as "key", b.icon_name icon, b.link, b.label_name label, b.has_child',
    table_name = 'td_user_menu a, md_menu b',
    whr = `a.menu_id=b.id AND b.menu_type = 'P' AND a.user_type_id = ${user_type_id} AND a.active_flag = 'Y' AND b.active_flag = 'Y'`,
    order = 'ORDER BY b.id';
    var parent_menu_list = await db_Select(select, table_name, whr, order)

    if(parent_menu_list.suc > 0 && parent_menu_list.msg.length > 0){
        for(let dt of parent_menu_list.msg){
            if(dt.has_child != 'N'){
                var select = 'a.user_type_id, b.sl_no, b.key_id as "key", b.icon_name icon, b.link, b.label_name label, b.has_child',
                table_name = 'td_user_menu a, md_menu b',
                whr = `a.menu_id=b.id AND b.menu_type = 'C' AND a.user_type_id = ${user_type_id} AND b.parent_id = ${dt.menu_id} AND a.active_flag = 'Y' AND b.active_flag = 'Y'`,
                order = 'ORDER BY b.sl_no';
                var child_menu_list = await db_Select(select, table_name, whr, order)
                if(child_menu_list.suc > 0 && child_menu_list.msg.length > 0){
                    for(let cdt of child_menu_list.msg){
                        if(cdt.has_child != 'N'){
                            var select = 'a.user_type_id, b.sl_no, b.key_id as "key", b.icon_name icon, b.link, b.label_name label, b.has_child',
                            table_name = 'td_user_menu a, md_menu b',
                            whr = `a.menu_id=b.id AND b.menu_type = 'C' AND a.user_type_id = ${user_type_id} AND b.parent_id = ${dt.menu_id} AND a.active_flag = 'Y' AND b.active_flag = 'Y'`,
                            order = 'ORDER BY b.sl_no';
                            var sub_child_menu_list = await db_Select(select, table_name, whr, order)
                            cdt['children'] = sub_child_menu_list.suc > 0 ? (sub_child_menu_list.msg.length > 0 ? sub_child_menu_list.msg : []) : []
                        }
                    }
                    dt['children'] = child_menu_list.msg
                }
            }
        }
    }

    res.send(parent_menu_list)
})

module.exports = {userMenuRouter}