package com.cibfintech.blacklist.updater;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import resource.bean.blacklist.BankBlackList;

import com.cibfintech.blacklist.operation.BankBlackListOperation;
import com.huateng.commquery.result.MultiUpdateResultBean;
import com.huateng.commquery.result.UpdateResultBean;
import com.huateng.commquery.result.UpdateReturnBean;
import com.huateng.ebank.framework.operation.OPCaller;
import com.huateng.ebank.framework.operation.OperationContext;
import com.huateng.ebank.framework.web.commQuery.BaseUpdate;
import com.huateng.exception.AppException;

/**
 * @author huangcheng
 *
 */
public class BankBlackListUpdate extends BaseUpdate {

	private static final String DATASET_ID = "BankBlackListManage";
	private final static String PARAM_ACTION = "opType";
	private final static String PARAM_ACTION_SURE = "sure";

	@Override
	public UpdateReturnBean saveOrUpdate(MultiUpdateResultBean arg0, HttpServletRequest arg1, HttpServletResponse arg2) throws AppException {

		// 返回对象
		UpdateReturnBean updateReturnBean = new UpdateReturnBean();

		// 返回结果对象
		UpdateResultBean updateResultBean = multiUpdateResultBean.getUpdateResultBeanByID(DATASET_ID);

		// 返回黑名单对象
		BankBlackList bankblacklist = new BankBlackList();

		OperationContext oc = new OperationContext();
		if (updateResultBean.hasNext()) {
			// 属性拷贝
			Map map = updateResultBean.next();
			BaseUpdate.mapToObject(bankblacklist, map);
			String opType = updateResultBean.getParameter(PARAM_ACTION);
			String sure = updateResultBean.getParameter(PARAM_ACTION_SURE);
			sure = (null == sure || "" == sure) ? "" : sure;
			opType = (null == opType || "" == opType) ? "" : opType;

			if (opType.equals(BankBlackListOperation.IN_EDIT)) {
				oc.setAttribute(BankBlackListOperation.CMD, BankBlackListOperation.CMD_EDIT);
			}
			if (opType.equals(BankBlackListOperation.IN_ADD)) {
				oc.setAttribute(BankBlackListOperation.CMD, BankBlackListOperation.CMD_ADD);
			}
			if (opType.equals(BankBlackListOperation.IN_VERIFY)) {
				oc.setAttribute(BankBlackListOperation.CMD, BankBlackListOperation.CMD_VERIFY);
			}
			if (opType.equals(BankBlackListOperation.IN_APPROVE)) {
				oc.setAttribute(BankBlackListOperation.CMD, BankBlackListOperation.CMD_APPROVE);
			}
			if (opType.equals(BankBlackListOperation.IN_SHARE)) {
				oc.setAttribute(BankBlackListOperation.CMD, BankBlackListOperation.CMD_SHARE);
			}
			oc.setAttribute(BankBlackListOperation.IN_PARAM, opType);
			oc.setAttribute(BankBlackListOperation.IN_PARAM_SURE, sure);
			oc.setAttribute(BankBlackListOperation.IN_BANK_BLACK_LIST, bankblacklist);
			// call方式开启operation事务
			OPCaller.call(BankBlackListOperation.ID, oc);
			return updateReturnBean;
		}

		return null;
	}

}