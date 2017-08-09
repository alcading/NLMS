<#import "/templets/commonQuery/CommonQueryTagMacro.ftl" as CommonQueryMacro>
<#assign op=RequestParameters["op"]?default("")>
<@CommonQueryMacro.page title="���⸶��/�ж�֪ͨ��">
<@CommonQueryMacro.CommonQuery id="BopKDsCollection" init="true" submitMode="all" navigate="false">
		<table width="95%" cellpadding="2">
			<tr>
				<td  width="75%" valign="top">
					<table width="100%" cellpadding="0" cellspacing="0">
						<tr>
							<td>
								<@CommonQueryMacro.GroupBox id="guoup1" label="������Ϣ" expand="true">
									<table frame=void class="grouptable" width="100%">
										<tr>
											<td align="center" colspan="2" nowrap class="labeltd">�걨����</td>
											<td class="datatd">
												<@CommonQueryMacro.SingleField fId="rptno"/>
												<input id="btLoadPage" extra="button" style='width=20px;height=17px;' onclick="loadCDsPage();" type='button' value='...'/>
											</td>
											<td align="center" colspan="2" nowrap class="labeltd">�տ�������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="oppuser"/></td>
										</tr>
										<tr>
											<td rowspan="4" align="center" nowrap class="labeltd">��������Ϣ</td>
											<td align="center" nowrap class="labeltd">����������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="custype"/></td>
											<td rowspan="3" align="center" nowrap class="labeltd">������Ϣ</td>
											<td align="center" nowrap class="labeltd">������ʺ�/���п���</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="lcyacc"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">��֯��������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="custcod"/></td>
											<td align="center" nowrap class="labeltd">������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="lcyamt"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">��������֤������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="idcode"/></td>
											<td align="center" nowrap class="labeltd">�������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="exrate"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">����������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="custnm"/></td>
											<td rowspan="2" align="center" nowrap class="labeltd">�ֻ���Ϣ</td>
											<td align="center" nowrap class="labeltd">����ʺ�/���п���</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="fcyacc"/></td>
										</tr>
										<tr>
											<td rowspan="3" align="center" nowrap class="labeltd">������Ϣ</td>
											<td align="center" nowrap class="labeltd">�������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="txccy"/></td>
											<td align="center" nowrap class="labeltd">�ֻ���</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="fcyamt"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="txamt"/></td>
											<td rowspan="2" align="center" nowrap class="labeltd">�ֻ���Ϣ</td>
											<td align="center" nowrap class="labeltd">�����ʺ�/���п���</td>
											<td class="datatd" ><@CommonQueryMacro.SingleField fId="othacc"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">���㷽ʽ</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="method"/></td>
											<td align="center" nowrap class="labeltd">�������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="othamt"/></td>
										</tr>
										<tr>
											<td rowspan="2" align="center" nowrap class="labeltd">ʵ�ʸ�����Ϣ</td>
											<td align="center" nowrap class="labeltd">ʵ�ʸ������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="actuccy"/></td>
											<td rowspan="3" align="center" nowrap class="labeltd">����֤/������Ϣ</td>
											<td align="center" nowrap class="labeltd">����֤/�������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="lcbgno"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">ʵ�ʸ�����</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="actuamt"/></td>
											<td align="center" nowrap class="labeltd">����</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="tenor"/></td>
										</tr>
										<tr>
											<td rowspan="2" align="center" nowrap class="labeltd">�۷���Ϣ</td>
											<td align="center" nowrap class="labeltd">�۷ѱ���</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="outchargeccy"/></td>
											<td align="center" nowrap class="labeltd">��֤����</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="issdate"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">�۷ѽ��</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="outchargeamt"/></td>
											<td align="center" colspan="2" nowrap class="labeltd">����ҵ����</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="buscode"/></td>
										</tr>
									</table>
								</@CommonQueryMacro.GroupBox>
							</td>
						</tr>
						<tr>
							<td>
								<@CommonQueryMacro.GroupBox id="guoup2" label="�걨��Ϣ" expand="true">
									<table frame=void class="grouptable" width="100%">
										<tr>
											<td align="center" colspan="2" nowrap class="labeltd">�տ��˳�פ����/��������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="country"/></td>
											<td align="center"  colspan="2" nowrap class="labeltd">�Ƿ�˰�������¸���</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="isref"/></td>
										
										</tr>
										<tr>
										    <td align="center" rowspan="3" nowrap class="labeltd">������Ϣ1</td>
											<td align="center" nowrap class="labeltd">���ױ���1</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="txcode"/></td>
											<td align="center" rowspan="3" nowrap class="labeltd">������Ϣ2</td>
											<td align="center" nowrap class="labeltd">���ױ���2</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="txcode2"/></td>				
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">���׸���1</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="txrem"/></td>
											<td align="center" nowrap class="labeltd">���׸���2</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="tx2rem"/></td>
											
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">��Ӧ���1</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="tc1amt"/></td>
											<td align="center" nowrap class="labeltd">��Ӧ���2</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="tc2amt"/></td>
											
										</tr>
										<tr>
										    <td align="center"  colspan="2"nowrap class="labeltd">��ϵ��</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="crtuser"/></td>
											<td align="center" colspan="2" nowrap class="labeltd">��������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="paytype"/></td>
												
										</tr>
										<tr>
										
											<td align="center" colspan="2" nowrap class="labeltd">��ϵ�˵绰</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="inptelc"/></td>											
											<td align="center" colspan="2" nowrap class="labeltd">�걨����</td>
											<td class="datatd" ><@CommonQueryMacro.SingleField fId="rptdate"/></td>
										</tr>
										<tr>
											<td align="center" colspan="2" nowrap class="labeltd">����������/��������/ҵ����</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="regno"/></td>
											<td align="center" colspan="2" 	nowrap class="labeltd">ҵ����ˮ��</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="filler2"/></td>
										</tr>
									</table>
								</@CommonQueryMacro.GroupBox>
							</td>
						</tr>
					</table>
				</td>

				<td width="8px"></td>
				<td width="25%"  valign="top" id="sysMsgGroup">
					<table width="100%" cellpadding="0" cellspacing="0">
						<tr>
							<td>
								<@CommonQueryMacro.GroupBox id="BOPCfaLounexguRecordAD1" label="ϵͳ��Ϣ"  expand="true">
									<table frame=void class="grouptable" width="100%">
										<tr>
											<td  align="center" nowrap class="labeltd">��������</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="actiontype"/></td>
										</tr>
										<tr>
											<td  align="center" nowrap class="labeltd">��¼״̬</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="recStatus"/></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">����״̬ </td>
											<td nowrap class="datatd" > <@CommonQueryMacro.SingleField fId="approveStatus" /></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">������� </td>
											<td nowrap class="datatd" > <@CommonQueryMacro.SingleField fId="approveResult" /></td>
										</tr>
										<tr>
											<td align="center" nowrap class="labeltd">��ִ״̬ </td>
											<td nowrap class="datatd" > <@CommonQueryMacro.SingleField fId="repStatus" /><a id="repHerf" href="javascript:doRepDet()">��ִ���</a></td>
										</tr>
										<tr>
											<td  align="center" nowrap class="labeltd">����ʱ��</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="crtTm"/></td>
										</tr>
										<tr>
											<td  align="center" nowrap class="labeltd">������ʱ��</td>
											<td class="datatd"><@CommonQueryMacro.SingleField fId="lstUpdTm"/></td>
										</tr>
									</table>
								</@CommonQueryMacro.GroupBox>
							</td>
						</tr>

						<tr>
							<td>
								<@CommonQueryMacro.GroupBox id="BOPCfaLounexguRecordAD2" label="�޸�/ɾ����Ϣ"   expand="true">
									<table frame=void class="grouptable" width="100%" >
										<tr>
											<td  align="center" nowrap class="labeltd">�޸�/ɾ��ԭ��</td>
											<td class="datatd" ><@CommonQueryMacro.SingleField fId="actiondesc"/></td>
										</tr>
									</table>
								</@CommonQueryMacro.GroupBox>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="left" colspan="3">
					<@CommonQueryMacro.Button id= "btSave"/>&nbsp;&nbsp;
					<@CommonQueryMacro.Button id= "btBack"/>&nbsp;&nbsp;
				</td>
			</tr>
		</table>
</@CommonQueryMacro.CommonQuery>
<script language="JavaScript">

	 function txcode_DropDown_beforeOpen(dropDown){
         MtsInOutCodeTreeSelect_DropDownDataset.setParameter("headDataTypeNo","01");
         MtsInOutCodeTreeSelect_DropDownDataset.setParameter("codeType","BOP-OUT");
	 }
	
	 function txcode2_DropDown_beforeOpen(dropDown){
         MtsInOutCodeTreeSelectTwo_DropDownDataset.setParameter("headDataTypeNo","01");
         MtsInOutCodeTreeSelectTwo_DropDownDataset.setParameter("codeType","BOP-OUT");
     }
	
	

	var op = "${op}";

	function initCallGetter_post(){
		
		//�ϱ��ɹ�  ɾ��/�޸�ԭ�� ����   �ϱ�δ����  ɾ��/�޸���ֻ��  add by  huangcheng
		var subSuccess = BopKDsCollection_dataset.getValue("subSuccess");
		if(subSuccess=="0"&&"modify"==op){
			BopKDsCollection_dataset.setFieldReadOnly("actiondesc",true);			
		}
	   //end
		if(op == "new"){
			document.getElementById("sysMsgGroup").style.display="none";
		}
		if (op == "delete") {
			BopKDsCollection_dataset.setFieldReadOnly("filler2",true);
			BopKDsCollection_dataset.setFieldReadOnly("country",true);
			BopKDsCollection_dataset.setFieldReadOnly("paytype",true);
			BopKDsCollection_dataset.setFieldReadOnly("txcode",true);
			BopKDsCollection_dataset.setFieldReadOnly("tc1amt",true);
			BopKDsCollection_dataset.setFieldReadOnly("txrem",true);
			BopKDsCollection_dataset.setFieldReadOnly("txcode2",true);
			BopKDsCollection_dataset.setFieldReadOnly("tc2amt",true);
			BopKDsCollection_dataset.setFieldReadOnly("tx2rem",true);
			BopKDsCollection_dataset.setFieldReadOnly("isref",true);
			BopKDsCollection_dataset.setFieldReadOnly("crtuser",true);
			BopKDsCollection_dataset.setFieldReadOnly("inptelc",true);
			BopKDsCollection_dataset.setFieldReadOnly("rptdate",true);
			BopKDsCollection_dataset.setFieldReadOnly("regno",true);
			BopKDsCollection_dataset.setFieldReadOnly("actiondesc",false);
			document.getElementById("btLoadPage").style.display="none";
		}
		if (op == "modify") {
			BopKDsCollection_dataset.setFieldReadOnly("filler2",true);
			//document.getElementById("btLoadPage").style.display="none";
		}
		if (op == "detail"){
			BopKDsCollection_dataset.setFieldReadOnly("filler2",true);
			BopKDsCollection_dataset.setFieldReadOnly("country",true);
			BopKDsCollection_dataset.setFieldReadOnly("paytype",true);
			BopKDsCollection_dataset.setFieldReadOnly("txcode",true);
			BopKDsCollection_dataset.setFieldReadOnly("tc1amt",true);
			BopKDsCollection_dataset.setFieldReadOnly("txrem",true);
			BopKDsCollection_dataset.setFieldReadOnly("txcode2",true);
			BopKDsCollection_dataset.setFieldReadOnly("tc2amt",true);
			BopKDsCollection_dataset.setFieldReadOnly("tx2rem",true);
			BopKDsCollection_dataset.setFieldReadOnly("isref",true);
			BopKDsCollection_dataset.setFieldReadOnly("crtuser",true);
			BopKDsCollection_dataset.setFieldReadOnly("inptelc",true);
			BopKDsCollection_dataset.setFieldReadOnly("rptdate",true);
			BopKDsCollection_dataset.setFieldReadOnly("regno",true);
			BopKDsCollection_dataset.setFieldReadOnly("actiondesc",true);
			//���水ť����
			document.getElementById("btSave").style.display="none";
			document.getElementById("btLoadPage").style.display="none";
		}
		// ������Ϣֻ��
		if( op != "new") {
			BopKDsCollection_dataset.setFieldReadOnly("filler2",true);
		}
		BopKDsCollection_dataset.setFieldReadOnly("rptno",true);
		BopKDsCollection_dataset.setFieldReadOnly("oppuser",true);
		BopKDsCollection_dataset.setFieldReadOnly("custype",true);
		BopKDsCollection_dataset.setFieldReadOnly("lcyacc",true);
		BopKDsCollection_dataset.setFieldReadOnly("idcode",true);
		BopKDsCollection_dataset.setFieldReadOnly("lcyamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("custcod",true);
		BopKDsCollection_dataset.setFieldReadOnly("exrate",true);
		BopKDsCollection_dataset.setFieldReadOnly("custnm",true);
		BopKDsCollection_dataset.setFieldReadOnly("fcyacc",true);
		BopKDsCollection_dataset.setFieldReadOnly("txccy",true);
		BopKDsCollection_dataset.setFieldReadOnly("fcyamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("txamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("othacc",true);
		BopKDsCollection_dataset.setFieldReadOnly("buscode",true);
		BopKDsCollection_dataset.setFieldReadOnly("othamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("actuccy",true);
		BopKDsCollection_dataset.setFieldReadOnly("actuamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("outchargeccy",true);
		BopKDsCollection_dataset.setFieldReadOnly("outchargeamt",true);
		BopKDsCollection_dataset.setFieldReadOnly("method",true);
		BopKDsCollection_dataset.setFieldReadOnly("lcbgno",true);
		BopKDsCollection_dataset.setFieldReadOnly("issdate",true);
		BopKDsCollection_dataset.setFieldReadOnly("tenor",true);
		// ϵͳ��Ϣֻ��
		BopKDsCollection_dataset.setFieldReadOnly("actiontype",true);
		BopKDsCollection_dataset.setFieldReadOnly("recStatus",true);
		BopKDsCollection_dataset.setFieldReadOnly("approveStatus",true);
		BopKDsCollection_dataset.setFieldReadOnly("repStatus",true);
		BopKDsCollection_dataset.setFieldReadOnly("crtTm",true);
		BopKDsCollection_dataset.setFieldReadOnly("lstUpdTm",true);
		BopKDsCollection_dataset.setFieldReadOnly("approveResult",true);
		
		//TODO �жϻ�ִ��ϸ
		var repStatus = BopKDsCollection_dataset.getValue("repStatus");
		if (repStatus != "02") {
			document.getElementById("repHerf").href="#";
			document.getElementById("repHerf").style.color="#999999";
		}
	}
	
	function loadCDsPage(){
		//����ǩԼ��Ϣѡ���
		showPickup("������Ϣ","${contextPath}/fpages/bop/collandaudit/ckp/ftl/winloadpage/BopCDsLoadPage.ftl?type=report");
	}
	
	function btSave_onClickCheck(){
		if (op == "new" || op == "modify") {
			
		}
		if (op == "delete") {
			var actiondesc = BopKDsCollection_dataset.getValue("actiondesc");
			if (actiondesc.length == 0) {
				alert("����дɾ��ԭ��");
				return false;
			}
		}
		BopKDsCollection_dataset.setParameter("op", op);
		return true;
	}
	
	function doRepDet(){
		var id = BopKDsCollection_dataset.getValue("id");
		var appType = BopKDsCollection_dataset.getValue("appType");
		var currentfile = BopKDsCollection_dataset.getValue("currentfile");
		var busiCode = ""; //���ô����Ӻ��촦���ó�ҵ���߼�����
		showPickup("��ִ���","${contextPath}/fpages/commonloadpage/jsp/ReportBackErr.jsp?id=" + id + "&appType=" + appType + "&currentfile=" + currentfile, 600, 500);
	}
	
	function btBack_onClick(){
		closeWin();
	}					
	
	function btSave_postSubmit(button){
		alert("����ɹ���");
		closeWin(true);
	}
</script>
</@CommonQueryMacro.page>