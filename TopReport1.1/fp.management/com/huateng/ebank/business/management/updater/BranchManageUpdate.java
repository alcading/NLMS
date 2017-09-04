package com.huateng.ebank.business.management.updater;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import resource.bean.pub.Bctl;

import com.huateng.common.err.Module;
import com.huateng.common.err.Rescode;
import com.huateng.commquery.result.MultiUpdateResultBean;
import com.huateng.commquery.result.UpdateResultBean;
import com.huateng.commquery.result.UpdateReturnBean;
import com.huateng.ebank.business.management.operation.BranchManageUpdateOperation;
import com.huateng.ebank.framework.operation.OPCaller;
import com.huateng.ebank.framework.operation.OperationContext;
import com.huateng.ebank.framework.web.commQuery.BaseUpdate;
import com.huateng.exception.AppException;

public class BranchManageUpdate extends BaseUpdate {

	private static final String DATASET_ID = "BranchManage";

	public UpdateReturnBean saveOrUpdate(MultiUpdateResultBean multiUpdateResultBean, HttpServletRequest request, HttpServletResponse response)
			throws AppException {
		try {
			UpdateReturnBean updateReturnBean = new UpdateReturnBean();
			UpdateResultBean updateResultBean = multiUpdateResultBean.getUpdateResultBeanByID(BranchManageUpdate.DATASET_ID);

			List updateList = new ArrayList();
			List insertList = new ArrayList();
			List delList = new ArrayList();

			Bctl bean = null;
			while (updateResultBean.hasNext()) {
				bean = new Bctl();
				mapToObject(bean, updateResultBean.next());
				switch (updateResultBean.getRecodeState()) {
				case UpdateResultBean.INSERT:
					insertList.add(bean);
					break;
				case UpdateResultBean.MODIFY:
					updateList.add(bean);
					break;
				case UpdateResultBean.DELETE:
					delList.add(bean);
					break;
				default:
					break;
				}
			}
			OperationContext context = new OperationContext();
			context.setAttribute(BranchManageUpdateOperation.INSERT_LIST, insertList);
			context.setAttribute(BranchManageUpdateOperation.UPDATE_LIST, updateList);
			context.setAttribute(BranchManageUpdateOperation.DEL_LIST, delList);
			OPCaller.call(BranchManageUpdateOperation.ID, context);
			return updateReturnBean;
		} catch (AppException appEx) {
			throw appEx;
		} catch (Exception ex) {
			throw new AppException(Module.SYSTEM_MODULE, Rescode.DEFAULT_RESCODE, ex.getMessage(), ex);
		}
	}

}
