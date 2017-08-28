package com.cibfintech.report.blacklist.getter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import resource.bean.pub.RoleInfo;

import com.cibfintech.report.blacklist.service.BankBlackListService;
import com.huateng.common.err.Module;
import com.huateng.common.err.Rescode;
import com.huateng.commquery.result.Result;
import com.huateng.commquery.result.ResultMng;
import com.huateng.ebank.business.common.GlobalInfo;
import com.huateng.ebank.business.common.PageQueryResult;
import com.huateng.ebank.business.common.SystemConstant;
import com.huateng.ebank.framework.exceptions.CommonException;
import com.huateng.ebank.framework.report.common.ReportConstant;
import com.huateng.ebank.framework.web.commQuery.BaseGetter;
import com.huateng.exception.AppException;
import com.huateng.report.utils.ReportEnum;
import com.huateng.service.pub.UserMgrService;

@SuppressWarnings("unchecked")
public class BankBlackListGetter extends BaseGetter {
	/*
	 * 获取商行黑名单
	 * 
	 * @author huangcheng
	 */
	@Override
	public Result call() throws AppException {
		try {
			this.setValue2DataBus(ReportConstant.QUERY_LOG_BUSI_NAME,
					"商行黑名单管理查询");
			PageQueryResult pageResult = getData();
			ResultMng.fillResultByList(getCommonQueryBean(),
					getCommQueryServletRequest(), pageResult.getQueryResult(),
					getResult());
			result.setContent(pageResult.getQueryResult());
			result.getPage().setTotalPage(
					pageResult.getPageCount(getResult().getPage()
							.getEveryPage()));
			result.init();
			return result;
		} catch (AppException appEx) {
			throw appEx;
		} catch (Exception ex) {
			throw new AppException(Module.SYSTEM_MODULE,
					Rescode.DEFAULT_RESCODE, ex.getMessage(), ex);
		}
	}

	protected PageQueryResult getData() throws Exception {
		String qPartyId = getCommQueryServletRequest().getParameter("qPartyId");
		String qCertificateType = getCommQueryServletRequest().getParameter(
				"qCertificateType");
		String qCertificateNumber = getCommQueryServletRequest().getParameter(
				"qCertificateNumber");
		int pageSize = this.getResult().getPage().getEveryPage();
		int pageIndex = this.getResult().getPage().getCurrentPage();
		GlobalInfo globalinfo = GlobalInfo.getCurrentInstance();
		List<RoleInfo> roleInfos = UserMgrService.getInstance().getUserRoles(
				globalinfo.getTlrno());

		String operateStates = getOperateStates(roleInfos);

		PageQueryResult pqr = BankBlackListService.getInstance()
				.pageQueryByHql(pageIndex, pageSize, qPartyId,
						qCertificateType, qCertificateNumber, operateStates);
		return pqr;
	}

	private String getOperateStates(List<RoleInfo> roleInfos) {
		Set<String> operateStates = new HashSet<String>();
		for (RoleInfo roleInfo : roleInfos) {
			String roleType = roleInfo.getRoleType();
			if (roleType.equals(SystemConstant.ROLE_TYPE_SYS_MNG)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.ED.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.VR.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.AP.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.PB.value);
			} else if (roleType.equals(SystemConstant.ROLE_TYPE_BANK_MGR)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.ED.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.VR.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.AP.value);
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.PB.value);
			} else if (roleType.equals(SystemConstant.ROLE_TYPE_INPUT)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.ED.value);
			} else if (roleType.equals(SystemConstant.ROLE_TYPE_AUDIT)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.VR.value);
			} else if (roleType.equals(SystemConstant.ROLE_TYPE_APPROVE)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.AP.value);
			} else if (roleType.equals(SystemConstant.ROLE_TYPE_PUBLISH)) {
				operateStates.add(ReportEnum.REPORT_OPERATE_STATE.PB.value);
			}
		}

		String str = "(";
		for (String op : operateStates) {
			str += op + ",";
		}
		str += "0)";
		if (operateStates.isEmpty()) {
			str = "(" + ReportEnum.REPORT_OPERATE_STATE.N.value + ")";
		}
		return str;
	}
}
