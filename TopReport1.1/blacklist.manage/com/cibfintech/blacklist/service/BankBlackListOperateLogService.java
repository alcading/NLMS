/*
 * Created on 2017-08-29
 *
 * To change the template for this generated file go to
 * Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
package com.cibfintech.blacklist.service;

import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;

import resource.bean.blacklist.NsBankBLOperateLog;
import resource.blacklist.dao.BlackListDAO;
import resource.blacklist.dao.BlackListDAOUtils;
import resource.dao.base.HQLDAO;

import com.huateng.ebank.business.common.BaseDAOUtils;
import com.huateng.ebank.business.common.ErrorCode;
import com.huateng.ebank.business.common.GlobalInfo;
import com.huateng.ebank.business.common.PageQueryCondition;
import com.huateng.ebank.business.common.PageQueryResult;
import com.huateng.ebank.framework.exceptions.CommonException;
import com.huateng.ebank.framework.util.ApplicationContextUtils;
import com.huateng.ebank.framework.util.DataFormat;
import com.huateng.ebank.framework.util.DateUtil;
import com.huateng.ebank.framework.util.ExceptionUtil;

/**
 * @author Administrator
 *
 *         To change the template for this generated type comment go to
 *         Window&gt;Preferences&gt;Java&gt;Code Generation&gt;Code and Comments
 */
public class BankBlackListOperateLogService {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(BankBlackListOperateLogService.class);

	/**
	 * get instance.
	 *
	 * @return
	 */
	public synchronized static BankBlackListOperateLogService getInstance() {
		return (BankBlackListOperateLogService) ApplicationContextUtils.getBean(BankBlackListOperateLogService.class.getName());
	}

	public BankBlackListOperateLogService() {
	}

	@SuppressWarnings({ "unchecked", "deprecation" })
	public void saveBankBLOperateLog(String operateType, String queryType, String queryNum, String measssage) throws CommonException {
		HQLDAO hqldao = BaseDAOUtils.getHQLDAO();
		GlobalInfo gi = GlobalInfo.getCurrentInstance();
		NsBankBLOperateLog bankBLOperateLog = new NsBankBLOperateLog();
		bankBLOperateLog.setId(UUID.randomUUID().toString().replaceAll("-", "").toUpperCase());
		bankBLOperateLog.setBrNo(gi.getBrno());
		bankBLOperateLog.setTlrNo(gi.getTlrno());
		bankBLOperateLog.setTlrIP(gi.getIp());
		bankBLOperateLog.setOperateType(operateType);
		bankBLOperateLog.setQueryType(queryType);
		bankBLOperateLog.setQueryRecordNumber(queryNum);
		bankBLOperateLog.setCreateDate(DateUtil.getCurrentDate());
		bankBLOperateLog.setMessage(measssage);
		try {
			hqldao.getHibernateTemplate().save(bankBLOperateLog);
		} catch (Exception e) {
			logger.error("update(BankBlackListOperateLog)", e);
			ExceptionUtil.throwCommonException(e.getMessage(), ErrorCode.ERROR_CODE_TLR_INFO_INSERT, e);
		}
	}

	public PageQueryResult queryBankBLOperateLogDetail(int pageIndex, int pageSize, String qtlrNo, String qtlrIP, String qbrNo, String stdate, String endate)
			throws CommonException {
		StringBuffer sb = new StringBuffer("");
		// sb.append("select log from TlrLoginLog log where 1=1");
		sb.append(" from NsBankBLOperateLog blog  where 1=1  ");
		if (!DataFormat.isEmpty(qtlrNo)) {
			sb.append(" and  blog.tlrNo=  ").append(qtlrNo.trim());
		}
		if (!DataFormat.isEmpty(qtlrIP)) {
			sb.append(" and  blog.tlrIP= ? ").append(qtlrIP.trim());
		}
		if (!DataFormat.isEmpty(qbrNo)) {
			sb.append(" and blog.brNo = ? ").append(qbrNo.trim());
		}

		if (!DataFormat.isEmpty(stdate)) {
			sb.append(" and blog.createDate>=? ").append(DateUtil.stringToDate2(stdate));
		}
		if (!DataFormat.isEmpty(endate)) {
			sb.append(" and blog.createDate<? ").append(DateUtil.getStartDateByDays(DateUtil.stringToDate2(endate), -1));
		}
		sb.append(" order by blog.brNo");

		BlackListDAO rootDAO = BlackListDAOUtils.getBlackListDAO();
		// HQLDAO rootDAO = BaseDAOUtils.getHQLDAO();

		PageQueryCondition queryCondition = new PageQueryCondition();
		queryCondition.setQueryString(sb.toString());
		queryCondition.setPageIndex(pageIndex);
		queryCondition.setPageSize(pageSize);
		PageQueryResult pageQueryResult = rootDAO.pageQueryByQL(queryCondition);
		return pageQueryResult;
	}

	/*
	 * 查询商行黑名单操作日志中的操作状态为查询的，商行标识号，查询总数 的记录 并且设定操作时间区间 以 商行标识号分组
	 * 
	 * @param startDate 开始时间
	 * 
	 * @param endDate 结束时间
	 */
	public List sumQueryBankBlacklist(String startDate, String endDate) throws CommonException {
		HQLDAO hqldao = BaseDAOUtils.getHQLDAO();
		StringBuffer sb = new StringBuffer("select log.brNo, sum(log.queryRecordNumber) from NsBankBLOperateLog log where 1=1");
		sb.append(" and log.operateType='Q'");
		sb.append(" and log.createDate>=to_date('").append(startDate).append("','yyyy-mm-dd')");
		sb.append(" and log.createDate<to_date('").append(endDate).append("','yyyy-mm-dd')");
		sb.append(" group by log.brNo");
		List list = hqldao.queryByQL2List(sb.toString());
		return list;
	}
}
