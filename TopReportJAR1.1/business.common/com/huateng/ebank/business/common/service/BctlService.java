/*
 * ==================================================================
 * The Huateng Software License
 *
 * Copyright (c) 2004-2005 Huateng Software System.  All rights
 * reserved.
 * ==================================================================
 */
package com.huateng.ebank.business.common.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.Hibernate;
import org.hibernate.type.Type;

import resource.bean.pub.Bctl;
import resource.dao.pub.BctlDAO;

import com.huateng.ebank.business.common.BaseDAOUtils;
import com.huateng.ebank.business.common.DAOUtils;
import com.huateng.ebank.business.common.ErrorCode;
import com.huateng.ebank.business.common.GlobalInfo;
import com.huateng.ebank.business.common.SystemConstant;
import com.huateng.ebank.framework.exceptions.CommonException;
import com.huateng.ebank.framework.util.ApplicationContextUtils;
import com.huateng.ebank.framework.util.DataFormat;
import com.huateng.ebank.framework.util.DateUtil;
import com.huateng.ebank.framework.util.ExceptionUtil;

/**
 * @author valley
 * @date 2004-11-16
 * @desc 机构控制表访问service
 */

public class BctlService {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(BctlService.class);

	private Bctl headBranch = null;

	private Object headBranchLocker = new Object();

	/**
	 * Default constructor
	 */
	protected BctlService() {
	}

	/**
	 * get instance.
	 *
	 * @return
	 */
	public synchronized static BctlService getInstance() {
		return (BctlService) ApplicationContextUtils.getBean(BctlService.class.getName());
	}

	/**
	 * Description: 根据内部机构号查询机构信息
	 *
	 * @param brcode
	 *            内部机构号
	 * @return Bctl 机构信息PO
	 * @exception 输入机构号为空，输入机构号在机构表中不存在
	 * @author shen_antonio
	 * @version v1.0,2008-8-19
	 */
	public Bctl getBctlByBrcode(String brcode) throws CommonException {
		if (StringUtils.isEmpty(brcode)) {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号为空");
			return null;
		} else {
			BctlDAO dao = BaseDAOUtils.getBctlDAO();
			Bctl bctl = dao.query(brcode);
			if (bctl == null) {
				ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号[" + brcode + "] 不存在");
				return null;
			}
			return bctl;
		}
	}

	/**
	 * Description: 根据外部机构号查询机构信息
	 *
	 * @param brno
	 *            外部机构号
	 * @return Bctl
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-8-19
	 */
	public Bctl getBctlByBrno(String brno) throws CommonException {
		if (StringUtils.isEmpty(brno)) {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号为空");
			return null;
		} else {
			BctlDAO dao = BaseDAOUtils.getBctlDAO();
			List list = dao.queryByCondition("po.brno = ?", new Object[] { brno }, null);
			if (list.size() != 1) {
				ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号[" + brno + "] 不存在，或者有多个");
				return null;
			}
			return (Bctl) list.get(0);
		}
	}

	/**
	 * 判断输入的机构是否为总行
	 *
	 * @author yjw
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public boolean isHeadBrcode(String brcode) throws CommonException {
		if (!StringUtils.isEmpty(brcode)) {
			return brcode.equals(getHeadBranch());
		}
		return false;
	}

	/**
	 * 判断是否是总行或者总行审批中心
	 *
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public boolean isHead(String brcode) throws CommonException {
		Bctl po = null;
		BctlDAO dao = DAOUtils.getBctlDAO();
		po = (Bctl) dao.query(brcode);
		String brclass = DataFormat.trim(po.getBrclass());
		if (po != null) {
			return (brclass.equals(SystemConstant.BRCODE_CLASS_HEAD_CENTER)
					|| brclass.equals(SystemConstant.BRCODE_CLASS_HEAD));
		} else
			// 如果不存在该记录，返回false
			return false;
	}

	/**
	 * 得到总行号
	 *
	 * @return 总行号
	 * @throws CommonException
	 */
	public String getHeadBranch() throws CommonException {
		synchronized (headBranchLocker) {
			if (null == headBranch) {
				BctlDAO dao = BaseDAOUtils.getBctlDAO();
				headBranch = dao.getHeadBranch();
			}
		}
		return headBranch.getBrcode().trim();
	}

	/**
	 *
	 * Description: 判断是否为省分行
	 *
	 * @param
	 * @return boolean
	 * @exception @author
	 *                hyurain_yang
	 * @version v1.0,2008-9-6
	 */
	/*
	 * public boolean isProBranch(String brcode) throws CommonException { Bctl
	 * po = null; BctlDAO dao = BaseDAOUtils.getBctlDAO(); po = (Bctl)
	 * dao.query(brcode); if (po != null) { if
	 * (StringUtils.equals(po.getBlnBranchClass(), "1")) return true; else
	 * return false; } else // 如果不存在该记录，返回false return false; }
	 */

	/**
	 * 判断输入的机构是否为分行
	 *
	 * @Description: 以brclass为1为分行作为判断条件
	 * @author shen_antonio
	 * @param brcode(内部机构号)
	 * @return
	 * @throws CommonException
	 */
	public boolean isBranch(String brcode) throws CommonException {

		Bctl po = null;
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		po = (Bctl) dao.query(brcode);
		if (po != null) {
			boolean returnboolean = po.getBrclass().trim().equals(SystemConstant.BRCODE_CLASS_BRANCH);
			return returnboolean;
		} else
			// 如果不存在该记录，返回false
			return false;
	}

	/**
	 * @Title: 判断输入的机构是否为支行
	 * @Description: 以brclass为2为支行作为判断
	 * @param brcode
	 *            机构号
	 * @return 是否为支行
	 */
	public boolean isSubBrcode(String brcode) throws CommonException {
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		Bctl po = dao.query(brcode);
		return po.getBrclass().trim().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH);
	}

	/**
	 * 得到机构名称
	 *
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public String getBranchName(String brcode) throws CommonException {
		String brname = "";
		String brno = "";
		try {
			Bctl bctl = BaseDAOUtils.getBctlDAO().query(brcode);
			brname = bctl.getBrname();
			brno = bctl.getBrno();
		} catch (Exception e) {

		}
		if (DataFormat.isEmpty(brname) || DataFormat.isEmpty(brno)) {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT);
		}
		return brname;
	}

	/**
	 * 根据内部号得到机构级别
	 *
	 * @param brcode
	 *            内部机构号
	 * @return
	 * @throws CommonException
	 */
	public String getBrclass(String brcode) throws CommonException {
		return BaseDAOUtils.getBctlDAO().query(brcode).getBrclass();
	}

	/**
	 * 判断机构blnBrcode是否是在机构upBrcode的管辖范围内
	 *
	 * @param blnBrcode
	 * @param upBrcode
	 * @return
	 * @throws CommonException
	 */
	public boolean isBlnBrcode(String blnBrcode, String upBrcode) throws CommonException {
		if (upBrcode.equals(blnBrcode))
			return true;

		String headBranch = getHeadBranch();
		if (upBrcode.equals(headBranch))
			return true;

		if (blnBrcode.equals(headBranch)) {
			return upBrcode.equals(headBranch);
		}

		String tempUpBrcode = BaseDAOUtils.getBctlDAO().query(blnBrcode).getBlnUpBrcode();
		if (tempUpBrcode.equals(upBrcode))
			return true;
		else if (tempUpBrcode.equals(headBranch))
			return false;
		else
			return isBlnBrcode(tempUpBrcode, upBrcode);
	}

	/**
	 * 得到分行列表
	 *
	 * @return
	 * @throws CommonException
	 */
	public List getBranchList() throws CommonException {

		return BaseDAOUtils.getBctlDAO().queryByCondition("po.brclass = '" + SystemConstant.BRCODE_CLASS_BRANCH
				+ "' and po.status = '" + SystemConstant.VALID_FLAG_VALID + "' order by po.brcode");
	}

	/**
	 * 得到归属的直属支行
	 *
	 */
	public List getSubBranchList() throws CommonException {
		return BaseDAOUtils.getBctlDAO()
				.queryByCondition("po.brclass = '" + SystemConstant.BRCODE_CLASS_SUBBRANCH + "' order by po.brcode");
	}

	/**
	 * 得到下属机构列表
	 *
	 * @param brcode
	 * @return 包含Bctl的List
	 */
	public List getBlnBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		return bctlDAO.queryByCondition("po.blnUpBrcode = '" + brcode + "' order by po.brcode");
	}

	/**
	 * 得到所有下属机构(包含自己),如果自己是支行,返回自己
	 *
	 * @param brcode
	 * @return 包含Bctl的List
	 */
	public List getAllBlnBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		Bctl bctl = bctlDAO.query(brcode);
		List result = new ArrayList();
		result.add(bctl);
		if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_HEAD)) {
			List list = bctlDAO.queryByCondition(" po.brcode <> ? order by po.brcode", new Object[] { brcode }, null);
			result.addAll(list);
			return result;
		}
		if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH))
			return result;
		else if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_BRANCH)) {
			// 省分行或者直属分行
			if (SystemConstant.BRCODE_BRANCH_CLASS_1.equals(bctl.getBlnBranchClass())
					|| SystemConstant.BRCODE_BRANCH_CLASS_2.equals(bctl.getBlnBranchClass())) {
				List list = bctlDAO.queryByCondition(" po.blnManageBrcode = ? order by po.brcode",
						new Object[] { brcode }, null);
				result.addAll(list);
			} else {
				List list = bctlDAO.queryByCondition(" po.blnBranchBrcode = ? order by po.brcode",
						new Object[] { brcode }, null);
				result.addAll(list);
			}
		} else {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号[" + brcode + "] 机构级别错误");
		}
		return result;
	}

	/**
	 * 得到所有下属机构(包含自己),如果自己是支行,返回自己 总行：获得分行 分行：下属支行 Description: TODO
	 *
	 * @param brcode
	 *            机构号
	 * @param downBrcode
	 *            下级机构号(部分)
	 * @return List
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-9-16
	 */
	public List getAllDownBrcodeList(String brcode, String downBrno) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		Bctl bctl = bctlDAO.query(brcode);
		List result = new ArrayList();
		result.add(bctl);
		if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_HEAD)) {
			List list = bctlDAO.queryByCondition(
					" po.brclass = ? and (brtype IS NULL or po.brtype <> ?) and po.brno LIKE ? order by po.brcode",
					new Object[] { SystemConstant.BRCODE_CLASS_BRANCH, SystemConstant.BRTYPE_2, downBrno }, null);
			return list;
		}
		if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH))
			return result;
		else if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_BRANCH)) {
			// 省分行或者直属分行
			if (bctl.getBlnBranchClass().equals(SystemConstant.BRCODE_BRANCH_CLASS_1)
					|| bctl.getBlnBranchClass().equals(SystemConstant.BRCODE_BRANCH_CLASS_2)) {
				List list = bctlDAO.queryByCondition(
						" po.blnManageBrcode = ? and (brtype IS NULL or po.brtype <> ?) and po.brno LIKE ? order by po.brclass,po.brcode",
						new Object[] { brcode, SystemConstant.BRTYPE_2, downBrno }, null);
				result = list;
			} else {
				List list = bctlDAO.queryByCondition(
						" po.blnBranchBrcode = ? and po.brclass = ? and po.brno LIKE ?  order by po.brcode",
						new Object[] { brcode, SystemConstant.BRCODE_CLASS_SUBBRANCH, downBrno }, null);
				result.addAll(list);
			}
		} else {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "机构号[" + brcode + "] 机构级别错误");
		}
		return result;
	}

	/**
	 *
	 * Description: TODO
	 *
	 * @param
	 * @return List
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-8-19
	 */
	public List getAllBrnListForCDSH() throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List list = bctlDAO.queryByCondition("1=1 order by po.brclass,po.brcode");
		for (int i = 0; i < list.size(); i++) {
			Bctl bctl = (Bctl) list.get(i);
			list.set(i, bctl);
		}
		return list;
	}

	/**
	 * 得到所有有效的机构
	 * 
	 * @return
	 * @throws CommonException
	 */
	public List getAllEnableBctl() throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List list = bctlDAO.queryByCondition("po.status='" + SystemConstant.VALID_FLAG_VALID
				+ "' and po.lock = 'F' and po.del = 'F' order by po.brclass");

		return list;
	}

	/**
	 * 输入内部机构号获得核心机构号
	 *
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public String getExtBrno(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		Bctl bctl = bctlDAO.query(brcode);
		if (null != bctl) {
			return bctl.getBrno();
		}
		return null;
	}

	/**
	 * 输入核心机构号获得内部机构号
	 *
	 * @param brno
	 * @return
	 * @throws CommonException
	 */
	public String getInBrno(String brno) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List list = bctlDAO.queryByCondition("po.brno = '" + brno + "'");
		String brcode = "";
		if (list.size() != 0) {
			Bctl bctl = (Bctl) list.get(0);
			brcode = bctl.getBrcode();
			return brcode;
		} else {
			ExceptionUtil.throwCommonException(ErrorCode.ERROR_CODE_BCTL_SELECT, "没有该机构");
		}
		return brcode;
	}

	/**
	 * 取得直属下属支行列表，如果本身就是支行，则返回自己
	 *
	 * @param brcode
	 * @return 包含Bctl的List
	 */
	public List getSubBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		if (isSubBrcode(brcode)) {
			List list = new ArrayList();
			list.add(bctlDAO.query(brcode));
			return list;
		} else {
			return bctlDAO.queryByCondition("po.blnUpBrcode = '" + brcode + "' and po.brclass = '"
					+ SystemConstant.BRCODE_CLASS_SUBBRANCH + "' order by po.brcode");
		}
	}

	/**
	 * 取得所有下属支行列表，如果本身就是支行，则返回自己
	 *
	 * @param brcode
	 * @return 包含Bctl的List
	 */
	public List getAllSubBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List result = new ArrayList();
		if (isSubBrcode(brcode)) {
			result.add(bctlDAO.query(brcode));
		} else {
			List list = bctlDAO.queryByCondition("po.blnUpBrcode = '" + brcode + "' order by po.brcode");
			for (int i = 0; i < list.size(); i++) {
				Bctl bctl = (Bctl) list.get(i);
				if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH)) {
					result.add(bctl);
				} else if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_HEAD)) {

				} else {
					result.addAll(getAllSubBrcodeList(bctl.getBrcode()));
				}

			}
		}
		return result;
	}

	/**
	 * 取得所有下属支行列表，如果本身就是支行，则返回自己
	 *
	 * @param brcode
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 */
	public String getAllSubBrcodeStr(String brcode) throws CommonException {
		List list = getAllSubBrcodeList(brcode);
		if (list.size() == 0)
			return "''";

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			String brcodei = DataFormat.trim(((Bctl) list.get(i)).getBrcode());
			if (i == 0) {
				buffer.append("'").append(brcodei).append("'");
			} else {
				buffer.append(", '").append(brcodei).append("'");
			}
		}
		return buffer.toString();
	}

	/**
	 * 取得所有下属支行列表，如果本身就是支行，则返回同一个个贷中心下所有支行
	 *
	 * @param brcode
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 */
	public String getInqSubBrcodeStr(String brcode) throws CommonException {
		if (isSubBrcode(brcode))
			return getAllSubBrcodeStr(BaseDAOUtils.getBctlDAO().query(brcode).getBlnUpBrcode());
		else
			return getAllSubBrcodeStr(brcode);
	}

	/**
	 * 得到所有下属机构列表(包含自己)
	 *
	 * @param brcode
	 *            机构号
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 */
	public String getAllBlnBrcodeStr(String brcode) throws CommonException {
		List list = getAllBlnBrcodeList(brcode);
		if (list.size() == 0)
			return "''";

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			String brcodei = DataFormat.trim(((Bctl) list.get(i)).getBrcode());
			if (i == 0) {
				buffer.append("'").append(brcodei).append("'");
			} else {
				buffer.append(", '").append(brcodei).append("'");
			}
		}
		return buffer.toString();
	}

	/**
	 * 内部机构号查找机构信息
	 *
	 * @author yjw
	 * @param Brcode
	 * @return
	 * @throws CommonException
	 */
	public Bctl queryByBrcode(String Brcode) throws CommonException {
		Bctl Bctl = null;
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		Bctl = dao.query(Brcode);
		return Bctl;
	}

	/**
	 * 外部机构号查找机构信息
	 *
	 * @author yjw
	 * @param Brno
	 * @return
	 * @throws CommonException
	 */
	public Bctl queryByBrno(String brno) throws CommonException {
		Bctl Bctl = null;
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		List bctlList = dao.queryByCondition("po.brno=?", new Object[] { brno }, new Type[] { Hibernate.STRING });
		if (bctlList.size() == 0)
			return Bctl;
		else
			return (Bctl) bctlList.get(0);
	}

	/**
	 * 机构号查询地区号
	 *
	 * @param Brcode
	 * @return
	 * @throws CommonException
	 */
	public String getRegId(String brcode) throws CommonException {
		if (this.isHeadBrcode(brcode))
			return "000";
		Bctl bctl = this.queryByBrcode(brcode);
		return bctl.getRegionalism();
	}

	/**
	 * 增删改机构信息
	 *
	 * @author yjw
	 * @param custcd
	 * @param insertList
	 * @param updateList
	 * @param delList
	 * @throws CommonException
	 */
	public void bctlInfo(List insertList, List updateList, List delList) throws CommonException {
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		CommonService commonService = CommonService.getInstance();

		// 删除操作.把状态设置为无效
		for (Iterator it = delList.iterator(); it.hasNext();) {
			Bctl bean = (Bctl) it.next();
			Bctl bctlDel = dao.query(bean.getBrcode());
			// 不删除不存在的表
			if (null != bctlDel) {
				// 不能删除总行
				if (SystemConstant.BRCODE_CLASS_HEAD.equals(bean.getBrclass())) {
					ExceptionUtil.throwCommonException("不能删除总行", ErrorCode.ERROR_CODE_BCTL_INSERT);
				}
				bctlDel.setStatus(SystemConstant.FLAG_OFF);
				bctlDel.setLastUpdTlr(GlobalInfo.getCurrentInstance().getTlrno());
				bctlDel.setLastUpdDate(DateUtil.getCurrentDate());
				dao.update(bctlDel);
			}
		}

		// 修改操作.
		for (Iterator it = updateList.iterator(); it.hasNext();) {
			Bctl bean = (Bctl) it.next();
			Bctl bctlModify = dao.query(bean.getBrcode());
			// 不更新不存在的表
			if (null != bctlModify) {

				// 不能修改总行的级别
				if (SystemConstant.BRCODE_CLASS_HEAD.equals(bctlModify.getBrclass())// 原级别为总行
						&& !SystemConstant.BRCODE_CLASS_HEAD.equals(bean.getBrclass())) {// 修改后级别非总行
					ExceptionUtil.throwCommonException("不能修改总行的级别", ErrorCode.ERROR_CODE_BCTL_INSERT);
				}

				if (DataFormat.isEmpty(bean.getBlnUpBrcode())) {
					if (!SystemConstant.BRCODE_CLASS_HEAD.equals(bctlModify.getBrclass())) {// 原级别不为总行
						ExceptionUtil.throwCommonException("[机构代码]为" + bean.getBrno() + "的记录，字段[上级机构]不应为空.",
								ErrorCode.ERROR_CODE_INFO_NOT_INPUT);
					}
				}
				if (DataFormat.isEmpty(bean.getBrclass())) {
					ExceptionUtil.throwCommonException("[机构代码]为" + bean.getBrno() + "的记录，字段[机构级别]不应为空.",
							ErrorCode.ERROR_CODE_INFO_NOT_INPUT);
				}

				/** Modified by LettoGuan 2010-11-24 机构信息维护可修改机构名称 Start */
				bctlModify.setBrname(bean.getBrname());
				/** Modified by LettoGuan 2010-11-24 机构信息维护可修改机构名称 End */
				bctlModify.setAddress(bean.getAddress());
				bctlModify.setPostno(bean.getPostno());
				bctlModify.setTeleno(bean.getTeleno());
				bctlModify.setBrclass(bean.getBrclass());
				bctlModify.setBlnBranchBrcode(bean.getBlnBranchBrcode());
				bctlModify.setBlnManageBrcode(bean.getBlnManageBrcode());
				bctlModify.setBlnUpBrcode(bean.getBlnUpBrcode());
				bctlModify.setTxnBrcode(bean.getTxnBrcode());
				bctlModify.setBrattr(bean.getBrattr());
				bctlModify.setOtherAreaFlag(bean.getOtherAreaFlag());
				bctlModify.setLastUpdTlr(GlobalInfo.getCurrentInstance().getTlrno());
				bctlModify.setLastUpdDate(DateUtil.getCurrentDate());
				bctlModify.setBrtype(bean.getBrtype());
				bctlModify.setBillMailAddr(bean.getBillMailAddr());
				bctlModify.setAccumFundExchno(bean.getAccumFundExchno());
				bctlModify.setAccumFundBrid(bean.getAccumFundBrid());
				bctlModify.setEffectDate(bean.getEffectDate());
				bctlModify.setExpireDate(bean.getExpireDate());
				// add by zhaozhiguo 2012/2/16 FPP-9 用户,岗位及机构的管理页面优化调整 begin
				bctlModify.setStatus(bean.getStatus());
				// add by zhaozhiguo 2012/2/16 FPP-9 用户,岗位及机构的管理页面优化调整 end
				dao.update(bctlModify);

			}

		}

		// 增加操作.
		for (Iterator it = insertList.iterator(); it.hasNext();) {
			Bctl bean = (Bctl) it.next();
			List list = dao.queryByCondition(
					"po.brno = '" + bean.getBrno() + "'" + " and po.status = " + SystemConstant.VALID_FLAG_VALID);

			if (list.size() > 0) {// 已存在不能添加
				ExceptionUtil.throwCommonException("机构代码重复", ErrorCode.ERROR_CODE_BCTL_INSERT);
			} else {
				bean.setBrcode(commonService.getBrcodeID());
				bean.setStatus(SystemConstant.FLAG_ON);
				bean.setLastUpdTlr(GlobalInfo.getCurrentInstance().getTlrno());
				bean.setLastUpdDate(DateUtil.getCurrentDate());
				dao.insert(bean);
			}
		}

	}

	/**
	 *
	 * Description: 通过内部机构号获得外部机构号
	 *
	 * @param
	 * @return String
	 * @exception @author
	 *                hyurain_yang
	 * @version v1.0,2008-8-7
	 */
	public String getBrnoByBrcode(String brcode) {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		Bctl bctl = null;
		String brno = "";
		try {
			bctl = bctlDAO.query(brcode);
			brno = bctl.getBrno();
		} catch (CommonException e) {
			e.printStackTrace();
			return brno;
		}
		return brno;
	}

	/**
	 * 得到归属分行号
	 *
	 * @param brcode
	 *            机构号
	 * @return 分行号
	 * @throws CommonException
	 */
	public String getBranchBrcode(String brcode) throws CommonException {
		Bctl bctl = getBlnBranchBrcode(brcode);
		if (bctl == null) {
			return brcode;
		} else {
			return bctl.getBrcode();
		}
	}

	/**
	 * Description: 得到管瞎分行号
	 *
	 * @param
	 * @return String
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-9-3
	 */
	public String getBranchManageBrcode(String brcode) throws CommonException {
		Bctl bctl = getMngBranchBrcode(brcode);
		if (bctl == null) {
			return brcode;
		} else {
			return bctl.getBrcode();
		}
	}

	/**
	 * Description: 通过支行brcode获取上级辖属行信息；如果传入分行，返回自身信息；如果传入总行，返回null
	 *
	 * @param subBrcode
	 * @return Bctl
	 * @exception @author
	 *                richmond_liu
	 * @version v1.0,2008-8-19
	 */
	public Bctl getBlnBranchBrcode(String subBrcode) throws CommonException {
		Bctl bctl = getBctlByBrcode(subBrcode);
		if (isHeadBrcode(subBrcode)) {
			return null;
		}
		Bctl blnBrh = getBctlByBrcode(bctl.getBlnBranchBrcode());
		return blnBrh;
	}

	/**
	 * Description:
	 * 通过支行brcode获取所属省分行信息；如果传入辖属分行，返回省分行；如果传入省分行和直辖分行，返回自身信息；如果输入总行，返回null
	 *
	 * @param
	 * @return Bctl
	 * @exception @author
	 *                richmond_liu
	 * @version v1.0,2008-8-19
	 */
	public Bctl getMngBranchBrcode(String subBrcode) throws CommonException {
		Bctl bctl = getBctlByBrcode(subBrcode);
		if (isHeadBrcode(subBrcode)) {
			return null;
		}
		Bctl mngBrh = getBctlByBrcode(bctl.getBlnManageBrcode());
		return mngBrh;
	}

	/**
	 * Description: 通过brcode获取所属放款中心信息，如果传入总行brcode返回null
	 *
	 * @param
	 * @return Bctl
	 * @exception @author
	 *                richmond
	 * @version v1.0,2008-8-19
	 */
	/**
	 * @deprecated
	 */
	public Bctl getLoanCenterBrcode(String brcode) throws CommonException {

		if (isHeadBrcode(brcode)) {
			return null;
		}

		Bctl bctl = getBctlByBrcode(brcode);
		Bctl blnBrh = getBctlByBrcode(bctl.getBlnBranchBrcode());
		String brno = blnBrh.getBrno().replaceAll("999", "951");
		Bctl lc = getBctlByBrno(brno);
		return lc;
	}

	/**
	 *
	 * Description: 输入省分行号或者直属行号,获取管辖分行列表,如果不是省分行或者直属分行,返回null
	 *
	 * @param
	 * @return List
	 * @exception @author
	 *                hyurain_yang
	 * @version v1.0,2008-9-6
	 * @throws CommonException
	 */
	public List getAttachBranch(String brcode) throws CommonException {
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		List returnList = dao.queryByCondition("po.blnManageBrcode=? and po.blnBranchClass in (?,?)",
				new Object[] { brcode, SystemConstant.RPT_BRCODE_CLASS_1, SystemConstant.RPT_BRCODE_CLASS_2 }, null);
		if (returnList.isEmpty()) {
			return null;
		}
		return returnList;
	}

	/**
	 *
	 * Description: 输入省分行号,返回自己及下属所有管辖支行列表
	 *
	 * @param
	 * @return List
	 * @exception @author
	 *                hyurain_yang
	 * @version v1.0,2008-9-6
	 * @throws CommonException
	 */
	public List getsubbranchAttachProbranch(String brcode) throws CommonException {
		List allSubbranchList = new ArrayList();
		List branchList = getAttachBranch(brcode);
		if (branchList == null) {
			ExceptionUtil.throwCommonException("机构号[" + brcode + "]不是省分行或者直属分行", ErrorCode.ERROR_CODE_BCTL_SELECT);
			return null;
		}
		BctlDAO dao = BaseDAOUtils.getBctlDAO();
		List subbranchList = dao.queryByCondition("po.blnManageBrcode=? and po.brclass=?",
				new Object[] { brcode, SystemConstant.BRCODE_CLASS_SUBBRANCH }, null);// 查询省分行下属支行
		allSubbranchList.addAll(subbranchList);
		return allSubbranchList;
	}

	/**
	 *
	 * Description: 判断操作员所属机构
	 *
	 * @see 如果是总行 返回0
	 * @see 如果是省分行或者直属行 返回1
	 * @see 如果是其他分行 返回2
	 * @see 如果是支行 返回3
	 *
	 * @param
	 * @return int
	 * @exception @author
	 *                hyurain_yang
	 * @version v1.0,2008-9-6
	 * @throws CommonException
	 */
	public int returnTlrAttachBr(String brcode) throws CommonException {
		Bctl bctl = this.getBctlByBrcode(brcode);
		if (bctl == null) {
			logger.error("机构号[" + brcode + "]不存在");
			ExceptionUtil.throwCommonException("机构号[" + brcode + "]不存在", ErrorCode.ERROR_CODE_BCTL_SELECT);
		} else {
			if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_HEAD)) {
				return 0;
			} else if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_BRANCH)) {
				if (bctl.getBlnBranchClass().equals(SystemConstant.BRCODE_BRANCH_CLASS_1)
						|| bctl.getBlnBranchClass().equals(SystemConstant.BRCODE_BRANCH_CLASS_2)) {
					return 1;
				} else {
					return 2;
				}
			} else if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH)) {
				return 3;
			} else {
				logger.error("机构号[" + brcode + "]机构级别错误");
				ExceptionUtil.throwCommonException("机构号[" + brcode + "]机构级别错误", ErrorCode.ERROR_CODE_BCTL_SELECT);
			}
		}
		return 0;
	}

	/**
	 * 得到所有下属机构(包含自己),不包含支行
	 *
	 * @param
	 * @return List
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-9-16
	 */
	public List getAllDownBrcodeListWithoutSubBranch(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List result = new ArrayList();
		// 加入本行
		result.add(bctlDAO.query(brcode));
		// 加入所有下属机构(不包含支行)
		List list = bctlDAO.queryByCondition(
				"po.blnUpBrcode = '" + brcode + "' and po.status = '" + SystemConstant.VALID_FLAG_VALID
						+ "' and po.brclass <> '" + SystemConstant.BRCODE_CLASS_SUBBRANCH + "' order by po.brcode");
		for (int i = 0; i < list.size(); i++) {
			Bctl bctl = (Bctl) list.get(i);
			result.addAll(getAllDownBrcodeListWithoutSubBranch(bctl.getBrcode()));
		}
		return result;
	}

	/**
	 * 得到所有下属机构(包含自己),如果自己是支行,返回自己
	 *
	 * @param
	 * @return List
	 * @exception @author
	 *                shen_antonio
	 * @version v1.0,2008-9-16
	 */
	public List getAllDownBrcodeList(String brcode) throws CommonException {
		try {
			BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
			// this.getBranchList();
			List result = new ArrayList();
			Bctl b = bctlDAO.query(brcode.trim());
			if (b == null) {
				return result;
			}

			result.add(b);

			List list = bctlDAO.queryByCondition(
					"po.blnUpBrcode = '" + brcode + "' and po.status = '" + SystemConstant.VALID_FLAG_VALID
							+ "' and po.brclass <> '" + SystemConstant.BRCODE_CLASS_HEAD + " order by po.brcode");
			for (int i = 0; i < list.size(); i++) {
				Bctl bctl = (Bctl) list.get(i);
				result.addAll(getAllDownBrcodeList(bctl.getBrcode()));
			}
			return result;
		} catch (Exception e) {
			logger.info(e.getMessage());
			throw new CommonException(e.getMessage(), e);
		}
	}

	/**
	 * 取得所有下属个贷中心
	 *
	 * @param brcode
	 *            分行号
	 * @return 包含Bctl的List
	 */
	// 取得所有下属个贷中心和支行
	public List getAllDownPLCenterList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List result = bctlDAO.queryByCondition(
				"po.blnUpBrcode = '" + brcode + "' and po.status = '" + SystemConstant.VALID_FLAG_VALID
						+ "' and po.brclass = '" + SystemConstant.BRCODE_CLASS_PL_CENTER + "' order by po.brcode");

		return result;
	}

	/**
	 * 取得所有个贷中心
	 * 
	 * @return 包含Bctl的List
	 */
	public List getAllPLCenterList() throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List result = bctlDAO.queryByCondition(" po.status = '" + SystemConstant.VALID_FLAG_VALID
				+ "' and po.brclass = '" + SystemConstant.BRCODE_CLASS_PL_CENTER + "' order by po.brcode");

		return result;
	}

	/**
	 * if (!BctlService.getInstance().getBrclass(
	 * globalInfo.getBrcode()).equals( SystemConstant.BRCODE_CLASS_HEAD)) {
	 * sqlstr.append("and li.brcode in (").append(
	 * bs.getInqSubBrcodeStr(globalInfo.getBrcode())).append(") ");
	 * 
	 * @param param
	 * @param type
	 *            根据业务设定，该值为1时：取得所有下属支行列表；为2时：得到所有下属机构列表(包含自己)
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public String getQueryBranchCondition(String param, String type, String brcode) throws CommonException {
		StringBuffer buffer = new StringBuffer();
		if (this.isHeadBrcode(brcode)) {
			buffer.append(" and 1=1 ");
			return buffer.toString();
		}
		if (type.equals("1")) { // 取得所有下属支行列表，
			String subBrcodeList = this.getInqSubBrcodeStr(brcode);
			buffer.append(" and ").append(param).append(" in (").append(subBrcodeList).append(") ");
			return buffer.toString();
		}
		if (type.equals("2")) {// 得到所有下属机构列表(包含自己)
			String brcodeList = this.getAllBlnBrcodeStr(brcode);
			buffer.append(" and ").append(param).append(" in (").append(brcodeList).append(") ");
			return buffer.toString();
		} else
			return "";

	}

	/**
	 *
	 * @title 根据brcode 和brclass递归查询归属上级行 ADD OR BY MODIFY CHEN MAIK 20080823
	 * @param brclass
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public String getUpBrcode(String brclass, String brcode) throws CommonException {
		String upBrcode = "";
		String brcodeTmp = "";// 递归查询归属后的机构号
		String bctlBrclass = "";
		List listini = new ArrayList();

		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		listini = bctlDAO.queryByCondition("po.brcode='" + brcode + "'");
		Bctl bctl = (Bctl) listini.get(0);
		upBrcode = DataFormat.trim(bctl.getBlnUpBrcode());// 归属上级行
		bctlBrclass = DataFormat.trim(bctl.getBrclass());
		if (brclass.equals(bctlBrclass)) {
			return brcode;
		} else {
			while (!brclass.equals(bctlBrclass)) {
				List list = new ArrayList();
				list = bctlDAO.queryByCondition("po.brcode='" + upBrcode + "'");
				Bctl bctl0 = (Bctl) list.get(0);
				upBrcode = DataFormat.trim(bctl0.getBlnUpBrcode());// 归属上级行
				brcodeTmp = DataFormat.trim(bctl0.getBrcode());// 机构号
				bctlBrclass = DataFormat.trim(bctl0.getBrclass());
			}
			return brcodeTmp;
		}

	}

	/**
	 * 取得所有下属个贷中心和分中心
	 *
	 * @param brcode
	 *            分行号
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 */
	public String getAllPLCenterStr(String brcode) throws CommonException {
		List list = getAllPLCenterList(brcode);
		if (list.size() == 0)
			return "''";

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			String brcodei = DataFormat.trim(((Bctl) list.get(i)).getBrcode());
			if (i == 0) {
				buffer.append("'").append(brcodei).append("'");
			} else {
				buffer.append(", '").append(brcodei).append("'");
			}
		}
		return buffer.toString();
	}

	/**
	 * 取得所有下属个贷中心和分中心列表
	 *
	 * @param brcode
	 *            分行号
	 * @return 包含Bctl的List
	 */
	// 取得所有下属个贷中心和支行
	public List getAllPLCenterList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		List result = new ArrayList();

		List list = bctlDAO.queryByCondition(
				"po.blnUpBrcode = '" + brcode + "' and po.status = '" + SystemConstant.VALID_FLAG_VALID
						+ "' and po.brclass <> '" + SystemConstant.BRCODE_CLASS_BRANCH + "' order by po.brcode");
		for (int i = 0; i < list.size(); i++) {
			Bctl bctl = (Bctl) list.get(i);
			result.add(bctl);
			if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_PL_CENTER)) {
				result.addAll(getAllPLCenterList(bctl.getBrcode()));
			}
		}

		return result;
	}

	/**
	 * 得到区域审批中心的所有下属分行(包含自己)
	 *
	 * @param brcode
	 * @return
	 */
	public String getAllBlanchBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = BaseDAOUtils.getBctlDAO();
		Bctl bctl = bctlDAO.query(brcode);
		// List result = new ArrayList();
		StringBuffer buffer = new StringBuffer();
		if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUB_PL_CENTER)) {
			buffer.append("'").append(bctl.getBrcode()).append("'");
		}
		List list = bctlDAO
				.queryByCondition("po.plBrcode = '" + brcode + "' and po.status = '" + SystemConstant.VALID_FLAG_VALID
						+ "' and po.brclass = '" + SystemConstant.BRCODE_CLASS_BRANCH + "' order by po.brcode");

		if (list.size() != 0) {
			for (int j = 0; j < list.size(); j++) {
				String brcodei = DataFormat.trim(((Bctl) list.get(j)).getBrcode());
				buffer.append(", '").append(brcodei).append("'");
			}
			return buffer.toString();
		} else {
			return buffer.toString();
		}
	}

	/**
	 * @desc: 判断是否为审批中心
	 * @param bctl
	 * @return
	 * @return: boolean
	 * @Date: 2008-5-15
	 * @Author: farly.yu
	 */
	public boolean isCenterBrcode(String brcode) throws CommonException {
		Bctl po = null;
		BctlDAO dao = DAOUtils.getBctlDAO();
		po = (Bctl) dao.query(brcode);
		String brclass = DataFormat.trim(po.getBrclass());
		if (po != null) {
			return (brclass.equals(SystemConstant.BRCODE_CLASS_HEAD_CENTER)
					|| brclass.equals(SystemConstant.BRCODE_CLASS_AREA_CENTER)
					|| brclass.equals(SystemConstant.BRCODE_CLASS_PL_CENTER)
					|| brclass.equals(SystemConstant.BRCODE_CLASS_SUB_PL_CENTER));
		} else
			// 如果不存在该记录，返回false
			return false;
	}

	/**
	 * 获得当前分行下的所有帐务机构
	 *
	 * @param brcode
	 * @return
	 * @throws CommonException
	 */
	public List getAllActBrcodeInBlanch(String brcode) throws CommonException {
		brcode = brcode.trim();
		BctlDAO bctlDAO = DAOUtils.getBctlDAO();
		String blanchBrcode = BctlService.getInstance().getBranchBrcode(brcode);

		List list = bctlDAO.queryByCondition("po.blnBranchBrcode = '" + blanchBrcode + "' and po.brattr = '"
				+ SystemConstant.FLAG_ON + "' and po.status = '"// brattr:1-帐务机构；0-非帐务机构
				+ SystemConstant.VALID_FLAG_VALID + "' order by po.brno");

		return list;
	}

	/**
	 * @desc: 根据外部机构号查询机构是否存在
	 * @param brno
	 * @return
	 * @throws CommonException
	 * @return: boolean
	 * @Date: 2011-02-19
	 * @Author: lilinfeng add
	 */
	public boolean isExistBrno(String brno) throws CommonException {
		if (brno == null)
			return false;
		if (DataFormat.isEmpty(brno))
			return false;
		if (queryByBrno(brno) == null)
			return false;
		return true;
	}

	/**
	 * 取得所有下属支行和网点列表，如果本身就是网点，则返回自己
	 *
	 * @param brcode
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 *             lilinfeng add
	 */
	public String getAllSubAndNetBrcodeStr(String brcode) throws CommonException {

		List list = new ArrayList();
		if (isCenterBrcode(brcode)) {
			Bctl bctl = (Bctl) DAOUtils.getBctlDAO().query(brcode);
			// 如果是区域审批中心,查找该区域审批中心下的所有分行,然后查找不同分行下的机构
			if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_AREA_CENTER)) {
				List branchList = DAOUtils.getBctlDAO().queryByCondition("po.blnAreaBrcode = '" + brcode + "'");
				Bctl branchBctl = null;
				if (branchList != null && branchList.size() > 0) {
					for (int i = 0; i < branchList.size(); i++) {
						branchBctl = (Bctl) branchList.get(i);
						if (branchBctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_BRANCH)) {
							list.addAll(getAllSubAndNetBrcodeList(branchBctl.getBrcode()));
						}
					}
				}

			} else {
				// 如果是支行或分行审批中心,查找分行下的机构
				list = getAllSubAndNetBrcodeList(bctl.getBlnUpBrcode());
			}
			list.add(bctl);
		} else {
			list = getAllSubAndNetBrcodeList(brcode);
		}
		if (list.size() == 0)
			return "' '";

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			String brcodei = DataFormat.trim(((Bctl) list.get(i)).getBrcode());
			if (i == 0) {
				buffer.append("'").append(brcodei).append("'");
			} else {
				buffer.append(", '").append(brcodei).append("'");
			}
		}
		return buffer.toString();

	}

	/**
	 * 取得所有下属支行和网点列表，如果是网点，则返回自己
	 *
	 * @param brcode
	 * @return 包含Bctl的List lilinfeng add
	 */
	public List getAllSubAndNetBrcodeList(String brcode) throws CommonException {
		BctlDAO bctlDAO = DAOUtils.getBctlDAO();
		Bctl bctl1 = bctlDAO.query(brcode);
		List result = new ArrayList();
		// if (isNetBrcode(brcode)) {
		// result.add(bctl1);
		// } else {
		// 如果是分行 , 查找归属分行是当前分行的所有网点和支行(快速查找)
		if (bctl1.getBrclass().equals(SystemConstant.BRCODE_CLASS_BRANCH)) {
			List<Bctl> list = bctlDAO.queryByCondition("po.blnBranchBrcode = '" + brcode + "' and po.status = '"
					+ SystemConstant.VALID_FLAG_VALID + "' and ( po.brclass = '" + SystemConstant.BRCODE_CLASS_SUBBRANCH
					+ "' or  po.brclass = '" + SystemConstant.BRCODE_CLASS_NETBRANCH + "' )  order by po.brcode");
			result.addAll(list);
			return result;
		} else {
			if (bctl1.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH)) {
				result.add(bctl1);
			}
			List list = bctlDAO.queryByCondition("po.blnUpBrcode = '" + brcode + "' and po.status = '"
					+ SystemConstant.VALID_FLAG_VALID + "' order by po.brcode");
			if (list != null && list.size() > 0) {
				for (int i = 0; i < list.size(); i++) {
					Bctl bctl = (Bctl) list.get(i);
					if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_NETBRANCH)) {
						result.add(bctl);
					}
					if (bctl.getBrclass().equals(SystemConstant.BRCODE_CLASS_SUBBRANCH)) {
						// yjw modify
						// 不能重复加入支行,getAllSubAndNetBrcodeList()方法会将该支行机构加进去
						// result.add(bctl);
						result.addAll(getAllSubAndNetBrcodeList(bctl.getBrcode()));
					} else {
						result.addAll(getAllSubAndNetBrcodeList(bctl.getBrcode()));
					}
				}
			}
		}
		// }
		return result;
	}

	/**
	 * 得到所有下属机构列表(包含自己) add by jianxue.zhang 返回内部机构号
	 * 
	 * @param brcode
	 *            机构号
	 * @return 形式为'xxxx', 'xxxx', 'xxxx'的字符串
	 * @throws CommonException
	 */
	public String getAllBlnBrNoStr(String brcode) throws CommonException {
		List list = getAllBlnBrcodeList(brcode);
		if (list.size() == 0)
			return "''";

		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < list.size(); i++) {
			String brcodei = DataFormat.trim(((Bctl) list.get(i)).getBrno());
			if (i == 0) {
				buffer.append("'").append(brcodei).append("'");
			} else {
				buffer.append(", '").append(brcodei).append("'");
			}
		}
		return buffer.toString();
	}

}