<#import "/templets/commonQuery/CommonQueryTagMacro.ftl" as CommonQueryMacro>
<#assign info = Session["USER_SESSION_INFO"]>
<@CommonQueryMacro.page title="银行机构信息维护">
<@CommonQueryMacro.CommonQuery id="BankInfoEntry" init="true" submitMode="current">
	<table width="100%" align="left">
		<tr>
   			<td valign="top" colspan="2">
   				<@CommonQueryMacro.Interface id="intface" label="银行机构查询" colNm=4 showButton="true" />
        	</td>
        </tr>
		<tr>
   			<td valign="top">
   				<@CommonQueryMacro.PagePilot id="PagePilot"/>
   			</td>
  		</tr>
  		<tr>
      		<td colspan="2">
          		<@CommonQueryMacro.DataTable id ="datatable1" paginationbar="btAdd,-,btStatus" 
          			fieldStr="brno,brname,status,opr" width="100%"  readonly="true"/><br/>
        	</td>
        </tr>
  		<tr align="center" style="display:none">
			<td><@CommonQueryMacro.Button id= "btDel" /></td>
			<td><@CommonQueryMacro.Button id= "btModify" /></td>
		</tr>
   </table>
</@CommonQueryMacro.CommonQuery>

<script language="javascript">
	var roleType = "${info.roleTypeList}";

	BankInfoEntry_dataset.setParameter("statu", "T");
	//定位一条记录
	function locate(id) {
		var record = BankInfoEntry_dataset.find(["brcode"], [id]);
		if (record) {
			BankInfoEntry_dataset.setRecord(record);
		}
	}
	
	function datatable1_opr_onRefresh(cell, value, record) {
		if (record) {//当存在记录时
			var lock = record.getValue("lock");
			var id = record.getValue("brcode");
			if (roleType.indexOf("12") > -1 || roleType.indexOf("13") > -1
					|| roleType.indexOf("14") > -1
					|| roleType.indexOf("15") > -1) {
				cell.innerHTML = "<center><a href=\"Javascript:void(0);\" style=\"color:#666666\" title=\"记录已锁定，不能操作\">修改</a></center>";
			} else {
				cell.innerHTML = "<center><a href=\"JavaScript:openModifyWindow('" + id
						+ "')\">修改</a>" + " <a href=\"JavaScript:doDel('" + id
						+ "')\">删除</a></center>";
			}
		} else {//当不存在记录时
			cell.innerHTML = "&nbsp;";
		}
	}

	function doDel(id) {
		locate(id);
		btDel.click();
	}

	function btDel_onClickCheck(button) {
		var del = BankInfoEntry_dataset.getValue("del");
		if (del == 'false') {
			if (confirm("确认删除该条记录？")) {
				BankInfoEntry_dataset.setParameter("delet", "T");
				return true;
			} else {
				return false;
			}
		} else {
			if (confirm("确认恢复该条记录？")) {
				BankInfoEntry_dataset.setParameter("delet", "F");
				return true;
			} else {
				return false;
			}
		}
	}

	function btDel_postSubmit(button) {
		var del = BankInfoEntry_dataset.getValue("del");
		if (del == 'false') {
			alert("删除记录成功 !");
		} else {
			alert("删除记录失败 !");
		}
		button.url = "#";
		//刷新当前页
		flushCurrentPage();
	}
	
	//修改功能
	function openModifyWindow(id) {
		locate(id);
		BankInfoEntry_dataset.setParameter("brcode", id);
		window.location.href = "${contextPath}/fpages/blacklistManage/ftl/BankInfoManage.ftl?opType=edit&brcode="+id;
	}

	function btAdd_onClick(button) {
		BankInfoEntry_dataset.insertRecord();
		window.location.href = "${contextPath}/fpages/blacklistManage/ftl/BankInfoManage.ftl?opType=add";
	}
	//展示对比功能的js
	function datatable1_brno_onRefresh(cell, value, record) {
		if (record != null) {
			var sta = record.getValue("st");
			var id = record.getValue("brcode");
			var brno = record.getValue("brno");
			cell.innerHTML = "<a href=\"Javascript:showDetail('" + id + "','"
					+ sta + "')\">" + brno + "</a>";
		} else {
			cell.innerHTML = ""
		}
	}

	function showDetail(id, sta) {
		var paramMap = new Map();
		paramMap.put("id", id);
		paramMap.put("st", sta);
		paramMap.put("action", "detail");
		paramMap.put("flag", "0");
		loadPageWindows("partWin", "机构管理",
				"/fpages/blacklistManage/ftl/branchManageDetail.ftl", paramMap,
				"winZone");
	}

	function btStatus_onClickCheck(button) {
		var status = BankInfoEntry_dataset.getValue("status");
		if (status == '0') {
			if (confirm("确认将该机构设置为有效?")) {
				BankInfoEntry_dataset.setParameter("statu", "1");
				return true;
			} else {
				return false;
			}
		} else {
			if (confirm("确认将该机构设置为无效?")) {
				BankInfoEntry_dataset.setParameter("statu", "0");
				return true;
			} else {
				return false;
			}
		}
	}

	function btStatus_postSubmit(button) {
		alert("设置成功");
		flushCurrentPage();
	}

	function BankInfoEntry_dataset_afterScroll(dataset) {
		/*
		var  v_brcode = BankInfoEntry_dataset.getValue("brcode");
		var  v_brclass = BankInfoEntry_dataset.getValue("brclass");
		 //数据库中的记录。
		 if ( v_brcode!="" ){
		   BankInfoEntry_dataset.setFieldReadOnly("brno",true);
		   BankInfoEntry_dataset.setFieldReadOnly("brname",false);
		 }else{
		   BankInfoEntry_dataset.setFieldReadOnly("brno",false);
		   BankInfoEntry_dataset.setFieldReadOnly("brname",false);
		 }
		 if ( v_brclass =="1" ){
		 	BankInfoEntry_dataset.setFieldReadOnly("blnUpBrcode",true);
		 }else{
		 	BankInfoEntry_dataset.setFieldReadOnly("blnUpBrcode",false);
		 }
		 return true;
		 */
		var lock = BankInfoEntry_dataset.getValue("lock");
		if (isTrue(lock)) {
			btStatus.disable(true);
		} else {
			btStatus.disable(false);
		}
	}

	function BankInfoEntry_dataset_afterChange(dataset, field) {
		if (field.name == "postno") {
			v_postno = BankInfoEntry_dataset.getValue("postno");
			if (isNaN(v_postno)) {
				alert("字段【邮政编码】必须为数字");
				BankInfoEntry_dataset.setValue2("postno", "");
				return false;
			} else if (v_postno.indexOf('-') != -1) {
				alert("字段【邮政编码】必须为数字");
				BankInfoEntry_dataset.setValue2("postno", "");
				return false;
			} else if (v_postno.length < 6 && v_postno.length != 0) {
				alert("字段【邮政编码】必须为6位");
				BankInfoEntry_dataset.setValue2("postno", "");
				return false;
			}
			return true;
		}
		if (field.name == "teleno") {
			var v_teleno = BankInfoEntry_dataset.getValue("teleno");
			var validChar = "0123456789-";
			for (var i = 0; i < v_teleno.length; i++) {
				var c = v_teleno.charAt(i);
				if (validChar.indexOf(c) == -1) {
					alert("字段【联系电话】只能包含-和数字");
					BankInfoEntry_dataset.setValue2("teleno", "");
					return false;
				}
			}
		}
	}

	//去掉页面“归属分行”字段，但当选中“上级机构”字段时，自动给“归属分行”赋值
	function blnUpBrcode_DropDown_onSelect(dropDown, record, editor) {
		var blnUpBrcode = record.getValue("brcode").trim();
		BankInfoEntry_dataset.setValue2("blnBranchBrcode",
				blnUpBrcode);
		return true;

	}

	function signWindow_floatWindow_beforeClose(subwindow) {
		BankInfoEntry_dataset.cancelRecord();
		return true;
	}

	function signWindow_floatWindow_beforeHide(subwindow) {
		return signWindow_floatWindow_beforeClose(subwindow);
	}

	function BankInfoEntry_dataset_afterInsert(dataset, mode) {
		BankInfoEntry_dataset.setValue2("status", "1");
	}

	//刷新当前页
	function flushCurrentPage() {
		BankInfoEntry_dataset
				.flushData(BankInfoEntry_dataset.pageIndex);
	}
</script>
</@CommonQueryMacro.page>