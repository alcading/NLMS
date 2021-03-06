package com.huateng.report.common.generator;

import com.huateng.common.DateUtil;
import com.huateng.commquery.cfieldmodel.BaseGenerator;
import com.huateng.ebank.business.common.service.CommonService;
import com.huateng.ebank.framework.exceptions.CommonException;
import com.huateng.ebank.framework.report.common.ReportConstant;
import com.huateng.ebank.framework.util.DataFormat;

/**
 * 生成复核任务表序号
 * 
 * @author NING-PENG
 *
 */
public class GetSysTaskNoGentator extends BaseGenerator {

	@Override
	public String gen(Object arg0) throws CommonException {
		StringBuffer result = new StringBuffer();
		String current = DateUtil.get8Date();
		result.append(current);
		result.append(
				DataFormat.intToString(CommonService.getInstance().getSeqno(ReportConstant.TASK_VALUE_NO, "0"), 6));
		return result.toString();
	}

}
