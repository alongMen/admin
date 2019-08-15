import { API } from '@/utils/http';

/**
 * 获取上传token
 *
 * @param {*} folder
 * @returns
 */
export const get_upload_token = (folder, fileExtension) => {
  return API.get(`/api/v1.0/File/Token/${folder}/${fileExtension}`);
};

/**
 * 登陆
 * @param {*} params
 */
export const login = params => {
  return API.post('/api/v1.0/Connect/token', params);
};

/**
 * 验证码
 */
export const get_captcha = () => {
  return API.get('/Captcha/api/ImageCaptcha/Captcha');
};

/**
 * 银行列表
 */
export const get_banks = () => {
  return API.get('/api/v1.0/CDictionary/BankNameList');
};

/**
 * 二维码名称列表
 */
export const get_qrcodes = () => {
  return API.get('/api/v1.0/CDictionary/SweepCodeNameList');
};

/**
 * 游戏类型（fish那些）
 */
export const get_geme_type = () => {
  return API.get('/api/v1.0/CGame/GameTypeList');
};

/**
 * 游戏平台类型
 */
export const get_game_platform = () => {
  return API.get('/api/v1.0/CGame/GamePlatformList');
};

/**
 * 获取广告列表
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_advertise_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BAdvertisement/${page}/${limit}`, query);
};

/**
 * 添加一条广告
 *
 * @param {*} params
 */
export const create_advertise = params => {
  return API.post('/api/v1.0/BAdvertisement', params);
};

/**
 * 修改一条广告
 *
 * @param {*} params
 */
export const update_advertise = (id, params) => {
  return API.put(`/api/v1.0/BAdvertisement/${id}`, params);
};

/**
 * 删除一条广告
 *
 * @param {*} id
 */
export const remove_advertise = id => {
  return API.delete(`/api/v1.0/BAdvertisement/${id}`);
};

/**
 * 获取公告列表
 */
export const get_news_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BNews/${page}/${limit}`, query);
};

/**
 * 获取公告详情
 */
export const get_news_detail = id => {
  return API.get(`/api/v1.0/BNews/Detail/${id}`);
};

/**
 * 发布公告
 */
export const publish_news = id => {
  return API.patch(`/api/v1.0/BNews/${id}`);
};

/**
 * 创建公告
 */
export const create_news_list = body => {
  return API.post(`/api/v1.0/BNews`, body);
};

/**
 * 更新公告
 */
export const update_news_list = (id, body) => {
  return API.put(`/api/v1.0/BNews/${id}`, body);
};

/**
 * 操作日志
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_operation_log_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BOperationLog/${page}/${limit}`, query);
};

/**
 * 获取登录日志
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const get_login_log_list = (page, limit, query) => {
  return API.get(`/api/v1.0/LoginLog/${page}/${limit}`, query);
};

/**
 * 获取邮件配置列表
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const get_mail_config_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BEmailConfig/${page}/${limit}`, query);
};

/**
 * 添加邮件配置
 *
 * @param {*} params
 */
export const create_mail_config = params => {
  return API.post(`/api/v1.0/BEmailConfig`, params);
};

/**
 * 设置默邮件状态
 */
export const default_mail_config = id => {
  return API.patch(`/api/v1.0/BEmailConfig/Default/${id}`);
};

/**
 * 修改邮件配置
 *
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const update_mail_config = (id, params) => {
  return API.put(`/api/v1.0/BEmailConfig/${id}`, params);
};

/**
 * 删除邮件
 *
 * @param {*} id
 * @returns
 */
export const remove_mail_config = id => {
  return API.delete(`/api/v1.0/BEmailConfig/${id}`);
};

/**
 * 邮件配置
 *
 * @param {*} id
 * @returns
 */
export const set_state_mail_config = (id, state) => {
  return API.patch(`/api/v1.0/BEmailConfig/${id}/${state}`);
};

/**
 * 获取站点列表
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const get_site_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BSiteManage/${page}/${limit}`, query);
};

/**
 * 创建站点
 *
 * @param {*} params
 * @returns
 */
export const create_site = params => {
  return API.post(`/api/v1.0/BSiteManage`, params);
};

/**
 * 修改网站
 *
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const update_site = (id, params) => {
  return API.put(`/api/v1.0/BSiteManage/${id}`, params);
};

/**
 * 修改网站状态
 *
 * @param {*} id
 * @param {*} state
 * @returns
 */
export const switch_site = (id, state) => {
  return API.patch(`/api/v1.0/BSiteManage/${id}/${state}`);
};

/**
 * 修改网站状态
 *
 * @param {*} id
 * @returns
 */
export const publish_site = id => {
  return API.post(`/api/v1.0/BSiteManage/Publish/${id}`);
};

/**
 * 删除网站
 *
 * @param {*} id
 * @returns
 */
export const remove_site = id => {
  return API.delete(`/api/v1.0/BSiteManage/${id}`);
};

/**
 * 获取所有权限列表
 *
 */
export const get_all_permission_list = () => {
  return API.get(`/api/v1.0/Role/Permission`);
};

/**
 * 添加一个角色
 *
 * @param {*} params
 * @returns
 */
export const create_role = params => {
  return API.post(`/api/v1.0/Role`, params);
};

/**
 * 修改角色
 *
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const update_role = (id, params) => {
  return API.put(`/api/v1.0/Role/${id}`, params);
};

/**
 * 获取角色列表
 *
 * @returns
 */
export const get_role_list = () => {
  return API.get(`/api/v1.0/Role`);
};

/**
 * 获取角色权限详情
 *
 * @param {*} id
 * @returns
 */
export const get_role_permission_detail = id => {
  return API.get(`/api/v1.0/Role/RolePermission/${id}`);
};

/**
 * 设置角色权限
 *
 * @param {*} params
 * @returns
 */
export const set_role_permission = params => {
  return API.post(`/api/v1.0/Role/RolePermission`, params);
};

/**
 * 查询员工列表
 *
 * @param {*} page
 * @param {*} limit
 * @returns
 */
export const get_staff_list = (page, limit, query) => {
  return API.get(`/api/v1.0/User/${page}/${limit}`, query);
};

/**
 * 创建员工
 *
 * @param {*} params
 * @returns
 */
export const create_staff = params => {
  return API.post(`/api/v1.0/User`, params);
};

/**
 * 更改员工
 *
 * @param {*} id
 * @param {*} params
 * @returns
 */
export const update_staff = (id, params) => {
  return API.put(`/api/v1.0/User/${id}`, params);
};

/**
 * 修改密码
 * @param {*} id
 * @param {*} password
 */
export const change_staff_password = (id, param) => {
  return API.post(`/api/v1.0/User/ChangePassword/${id}`, param);
};

/**
 * 修改当前用户密码
 * @param {*} password
 */
export const change_current_staff_password = param => {
  return API.post(`/api/v1.0/User/ChangePassword`, param);
};

/**
 * 设置员工状态
 * @param {*} id
 * @param {*} status
 */
export const set_state_staff = (id, status) => {
  return API.patch(`/api/v1.0/User/${id}/${status}`);
};

/**
 * 查询会员等级
 */
export const get_member_level_list = (page, limit) => {
  return API.get(`/api/v1.0/BMemberGrade`);
};

/**
 * 创建会员等级
 */
export const create_menber_lervel = body => {
  return API.post(`/api/v1.0/BMemberGrade/`, body);
};

/**
 * 更改会员等级
 */
export const update_menber_lervel = (id, body) => {
  return API.put(`/api/v1.0/BMemberGrade/${id}`, body);
};

/**
 * 设置会员等级状态
 */
export const state_menber_lervel = (id, state) => {
  return API.patch(`/api/v1.0/BMemberGrade/${id}/${state}`);
};

/**
 * 设置会员登录密码
 */
export const set_member_pass = (UserId,query) => {
  return API.post(`/api/v1.0/BMember/ChangePassword/${UserId}`,query);
};

/**
 * 设置会员支付密码
 */
export const set_member_paypass = (UserId,query) => {
  return API.post(`/api/v1.0/BMember/ChangePayPassword/${UserId}`,query);
};

/**
 * 设置默认会员等级
 */
export const default_menber_lervel = id => {
  return API.patch(`/api/v1.0/BMemberGrade/Default/${id}`);
};

/**
 * 获取会员等级充值列表
 */
export const get_menber_lervel_payment_config = id => {
  return API.get(`/api/v1.0/BMemberGrade/PaymentConfig/${id}`);
};

/**
 * 设置会员等级充值
 */
export const select_menber_lervel_payment_config = (id, params) => {
  return API.patch(`/api/v1.0/BMemberGrade/PaymentConfig/${id}`, params);
};

/**
 * 获取代理等级列表
 */
export const get_agent_level_list = (page, limit) => {
  return API.get(`/api/v1.0/BAgentGrade`);
};

/**
 * 创建代理等级
 */
export const create_agent_lervel = body => {
  return API.post(`/api/v1.0/BAgentGrade/`, body);
};

/**
 * 更新代理等级
 */
export const update_agent_lervel = (id, body) => {
  return API.put(`/api/v1.0/BAgentGrade/${id}`, body);
};

/**
 * 设置代理等级状态
 */
export const state_agent_lervel = (id, state) => {
  return API.patch(`/api/v1.0/BAgentGrade/${id}/${state}`);
};

/**
 * 设置默认代理等级
 */
export const default_agent_lervel = id => {
  return API.patch(`/api/v1.0/BAgentGrade/Default/${id}`);
};

/**
 * 获取银行卡黑名单列表
 */
export const get_bankcard_black_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BBankCardBlack/${page}/${limit}`, query);
};

/**
 * 创建银行卡黑名单
 */
export const create_bankcard_black = body => {
  return API.post(`/api/v1.0/BBankCardBlack`, body);
};

/**
 * 删除银行卡黑名单
 */
export const delete_bankcard_black = id => {
  return API.delete(`/api/v1.0/BBankCardBlack/${id}`);
};

/**
 * 获取所有开启的收款账号
 */
export const get_receipt_account_all = query => {
  return API.get(`/api/v1.0/BMemberGrade/ReceiptAccount`, query);
};

/**
 * 获取收款账号列表
 */
export const get_receipt_account_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BReceiptAccount/${page}/${limit}`, query);
};

/**
 * 创建收款账号
 */
export const create_receipt_account = body => {
  return API.post(`/api/v1.0/BReceiptAccount/`, body);
};

/**
 * 更新收款账号
 */
export const update_receipt_account = (id, body) => {
  return API.put(`/api/v1.0/BReceiptAccount/${id}`, body);
};

/**
 * 设置收款账号状态
 */
export const state_receipt_account = (id, state) => {
  return API.patch(`/api/v1.0/BReceiptAccount/${id}/${state}`);
};

/**
 * 获取当前等级下的收款账号ids
 */
export const get_receipt_account_by_grade_id = gradeId => {
  return API.get(`/api/v1.0/BMemberGrade/PaymentConfig/${gradeId}`);
};

/**
 * 设置当前等级下的收款账号ids
 */
export const set_receipt_account_by_grade_id = query => {
  return API.post(`/api/v1.0/BMemberGrade/PaymentConfig`, query);
};

/**
 * 获取余额调整列表
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const get_balance_adjust_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BBalanceChange/${page}/${limit}`, query);
};

/**
 * 添加一条余额调整
 *
 * @param {*} params
 * @returns
 */
export const create_balance_adjust = params => {
  return API.post(`/api/v1.0/BBalanceChange`, params);
};

/**
 * 修改余额调整审核状态
 *
 * @param {*} id
 * @param {*} state
 * @param {*} remark
 * @returns
 */
export const handle_balance_adjust_status = (id, state, remark) => {
  return API.patch(`/api/v1.0/BBalanceChange/${id}/${state}`, {
    remark: remark,
  });
};

/**
 * 获取会员财务信息
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const member_finance_info_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BMemberwallet/${page}/${limit}`, query);
};

/**
 * 获取提款审核列表
 *
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 * @returns
 */
export const get_draw_verify_list = (page, limit, query) => {
  return API.get(`/api/v1.0/BWithdrawal/${page}/${limit}`, query);
};

/**
 * 风控审核
 *
 * @param {*} id
 * @param {*} state
 * @param {*} remark
 * @returns
 */
export const patch_withdraw_audit_verify = (id, state, remark) => {
  return API.patch(`/api/v1.0/BWithdrawal/Audit/${id}/${state}`, {
    remark: remark,
  });
};

/**
 * 财务审核
 *
 * @param {*} id
 * @param {*} state
 * @param {*} remark
 * @returns
 */
export const patch_withdraw_finance_verify = (
  id,
  state,
  remark,
  outAccountId,
) => {
  return API.patch(`/api/v1.0/BWithdrawal/Finance/${id}/${state}`, {
    remark: remark,
    outAccountId: outAccountId,
  });
};

/**
 * 获取提现规则列表分页
 */
export const get_withdraw_rule_list_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BWithdrawalRule/${page}/${limit}`, query);
};

/**
 * 获取提现规则列表全部
 */
export const get_withdraw_rule_list_all = query => {
  return API.get(`/api/v1.0/BWithdrawalRule`, query);
};

/**
 * 创建提现规则
 */
export const create_withdraw_rule = query => {
  return API.post(`/api/v1.0/BWithdrawalRule`, query);
};

/**
 * 更新提现规则
 */
export const update_withdraw_rule = (id, body) => {
  return API.put(`/api/v1.0/BWithdrawalRule/${id}`, body);
};

/**
 * 设置提现规则状态
 */
export const state_withdraw_rule = (id, state) => {
  return API.patch(`/api/v1.0/BWithdrawalRule/${id}/${state}`);
};

/**
 * 设置提现规则状态
 */
export const delete_withdraw_rule = id => {
  return API.delete(`/api/v1.0/BWithdrawalRule/${id}`);
};

/**
 * 获取提现规则手续费明细
 */
export const get_withdraw_rule_fees = withdrawalRuleId => {
  return API.get(`/api/v1.0/BWithdrawalRule/Detail/${withdrawalRuleId}`);
};

/**
 * 创建一条提现规则手续费明细
 */
export const create_withdraw_rule_fee = query => {
  return API.post(`/api/v1.0/BWithdrawalRule/Detail/`, query);
};

/**
 * 修改一条提现规则手续费明细
 */
export const update_withdraw_rule_fee = (id, query) => {
  return API.put(`/api/v1.0/BWithdrawalRule/Detail/${id}`, query);
};

/**
 * 删除一条提现规则手续费明细
 */
export const delete_withdraw_rule_fee = id => {
  return API.delete(`/api/v1.0/BWithdrawalRule/Detail/${id}`);
};

/**
 * 删除一条提现规则手续费明细
 */
export const set_withdraw_rule_by_level = (gradeId, withdrawalRuleId) => {
  return API.patch(
    `/api/v1.0/BMemberGrade/WithdrawalConfig/${gradeId}/${withdrawalRuleId}`,
  );
};

/**
 * 获取所有站内信配置列表
 */
export const get_notice_config_all = query => {
  return API.get(`/api/v1.0/BNoticeConfig`, query);
};

/**
 * 删除站内信配置
 */
export const delete_notice_config = id => {
  return API.delete(`/api/v1.0/BNoticeConfig/${id}`);
};

/**
 * 默认站内信配置
 */
export const set_default_notice_config = id => {
  return API.patch(`/api/v1.0/BNoticeConfig/${id}`);
};

/**
 * 创建站内信配置
 */
export const create_notice_config = body => {
  return API.post(`/api/v1.0/BNoticeConfig`, body);
};

/**
 * 更新站内信配置
 */
export const update_notice_config = (id, body) => {
  return API.put(`/api/v1.0/BNoticeConfig/${id}`, body);
};

/**
 * 获取返水列表
 */
export const get_rakeback_platform_type_list = (gradeId, query) => {
  return API.get(`/api/v1.0/BBackWater/${gradeId}`, query);
};

/**
 * 获取某返水详情
 */
export const get_rakeback_detail = profitRuleId => {
  return API.get(`/api/v1.0/BBackWater/Detail/${profitRuleId}`);
};

/**
 * 设置某返水状态
 */
export const set_state_rakeback = (profitRuleId, state) => {
  return API.patch(`/api/v1.0/BBackWater/${profitRuleId}/${state}`);
};

/**
 * 一键设置启用返水状态
 */
export const set_all_enable_rakeback = gradeId => {
  return API.patch(`/api/v1.0/BBackWater/OneKeyEnable/${gradeId}`);
};

/**
 * 创建一条返水阶梯
 */
export const create_rakeback_ladder = query => {
  return API.post(`/api/v1.0/BBackWater/Detail`, query);
};

/**
 * 修改一条返水阶梯
 */
export const update_rakeback_ladder = (id, query) => {
  return API.put(`/api/v1.0/BBackWater/Detail/${id}`, query);
};

/**
 * 删除一条返水阶梯
 */
export const delete_rakeback_ladder = (id, query) => {
  return API.delete(`/api/v1.0/BBackWater/Detail/${id}`, query);
};

/**
 * 创建某返水单次限额
 */
export const create_rakeback_all = query => {
  return API.post(`/api/v1.0/BBackWater`, query);
};

/**
 * 修改某返水单次限额
 */
export const update_rakeback_single_limit = (profitRuleId, query) => {
  return API.put(`/api/v1.0/BBackWater/${profitRuleId}`, query);
};

/**
 * 获取游戏平台+游戏类型的交集
 */
export const get_game_platform_type_list = query => {
  return API.get(`/api/v1.0/BGame`, query);
};

/**
 * 获取佣金列表
 */
export const get_commission_platform_type_list = (gradeId, query) => {
  return API.get(`/api/v1.0/BCommission/${gradeId}`, query);
};

/**
 * 获取某佣金详情
 */
export const get_commission_detail = profitRuleId => {
  return API.get(`/api/v1.0/BCommission/Detail/${profitRuleId}`);
};

/**
 * 设置某佣金状态
 */
export const set_state_commission = (profitRuleId, state) => {
  return API.patch(`/api/v1.0/BCommission/${profitRuleId}/${state}`);
};

/**
 * 一键设置启用佣金状态
 */
export const set_all_enable_commission = gradeId => {
  return API.patch(`/api/v1.0/BCommission/OneKeyEnable/${gradeId}`);
};

/**
 * 创建一条佣金阶梯
 */
export const create_commission_ladder = query => {
  return API.post(`/api/v1.0/BCommission/Detail`, query);
};

/**
 * 修改一条佣金阶梯
 */
export const update_commission_ladder = (id, query) => {
  return API.put(`/api/v1.0/BCommission/Detail/${id}`, query);
};

/**
 * 删除一条佣金阶梯
 */
export const delete_commission_ladder = (id, query) => {
  return API.delete(`/api/v1.0/BCommission/Detail/${id}`, query);
};

/**
 * 创建某佣金单次限额
 */
export const create_commission_all = query => {
  return API.post(`/api/v1.0/BCommission`, query);
};

/**
 * 修改某佣金单次限额
 */
export const update_commission_single_limit = (profitRuleId, query) => {
  return API.put(`/api/v1.0/BCommission/${profitRuleId}`, query);
};

/**
 * 获取所有启用的收款账号
 */
export const get_outbound_account_all = query => {
  return API.get(`/api/v1.0/BOutboundAccount`, query);
};

/**
 * 获取收款账号分页
 */
export const get_outbound_account_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BOutboundAccount/${page}/${limit}`, query);
};

/**
 * 创建收款账号
 */
export const create_outbound_account = query => {
  return API.post(`/api/v1.0/BOutboundAccount`, query);
};

/**
 * 设置收款账号状态
 */
export const set_state_outbound_account = (id, state) => {
  return API.patch(`/api/v1.0/BOutboundAccount/${id}/${state}`);
};

/**
 * 获取代理申请列表分页
 */
export const get_agent_apply_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BAgentApply/${page}/${limit}`, query);
};

/**
 * 审核代理申请
 */
export const set_state_agent_apply = (id, state, remark) => {
  return API.put(`/api/v1.0/BAgentApply/${id}`, {
    agentApplyStatus: state,
    remark: remark,
  });
};

/**
 * 获取会员分页
 */
export const get_member_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BMember/${page}/${limit}`, query);
};

/**
 * 创建会员
 */
export const create_member = query => {
  return API.post(`/api/v1.0/BMember`, query);
};

/**
 * 备注会员
 */
export const remark_member = (id, query) => {
  return API.patch(`/api/v1.0/BMember/Remark/${id}`, query);
};

/**
 * 启用禁用会员
 */
export const set_state_member = (id, state) => {
  return API.patch(`/api/v1.0/BMember/${id}/${state}`);
};

/**
 * 获取代理分页
 */
export const get_agent_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BAgent/${page}/${limit}`, query);
};

/**
 * 备注代理
 */
export const remark_agent = (id, query) => {
  return API.patch(`/api/v1.0/BAgent/Remark/${id}`, query);
};

/**
 * 启用禁用代理
 */
export const set_state_agent = (id, state) => {
  return API.patch(`/api/v1.0/BAgent/${id}/${state}`);
};

/**
 * 查询线下转账分页
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_charge_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BRecharge/${page}/${limit}`, query);
};

/**
 * 审核线下转账
 */
export const set_state_charge = (id, state, remark) => {
  return API.patch(`/api/v1.0/BRecharge/${id}/${state}`, { remark: remark });
};

/**
 * 查询游戏记录分页
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_game_record_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BGameRecord/${page}/${limit}`, query);
};

/**
 * 查询游戏分页
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_game_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BGame/${page}/${limit}`, query);
};

/**
 *
 * @param {*} id
 * @param {*} state
 */
export const set_state_game = (id, state) => {
  return API.patch(`/api/v1.0/BGame/${id}/${state}`);
};

/**
 * 查询活动列表
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_activity_list_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BActivity/${page}/${limit}`, query);
};

/**
 * 创建活动
 * @param {*} query
 */
export const add_activity_list_page = query => {
  return API.post(`/api/v1.0/BActivity/Create`, query);
};

/**
 * 删除活动
 * @param {*} id
 */
export const del_activity_list_page = id => {
  return API.delete(`/api/v1.0/BActivity/delete/${id}`);
};

/**
 * 发布活动
 * @param {*} id
 */
export const publish_activity_list_page = (Id, status) => {
  return API.patch(`/api/v1.0/BActivity/Set/${Id}/${status}`);
};

/**
 * 修改活动
 * @param {*} id
 */
export const edit_activity_list_page = (Id, query) => {
  return API.put(`/api/v1.0/BActivity/Edit/${Id}`, query);
};

/**
 * 获取活动详情
 * @param {*} query
 */
export const get_activity_detail_page = Id => {
  return API.get(`/api/v1.0/BActivity/details/${Id}`);
};

/**
 * 创建活动详情
 * @param {*} query
 */
export const add_activity_detail_page = query => {
  return API.post(`/api/v1.0/BActivity/Details/Create`, query);
};

/**
 * 删除活动详情
 * @param {*} id
 */
export const del_activity_detail_page = id => {
  return API.delete(`/api/v1.0/BActivity/Details/Delete/${id}`);
};

/**
 * 修改活动详情
 * @param {*} id
 */
export const edit_activity_detail_page = (Id, query) => {
  return API.put(`/api/v1.0/BActivity/Details/Edit/${Id}`, query);
};

/**
 * 获取任务
 * @param {*} query
 */
export const get_Mission_list_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BMission/${page}/${limit}`, query);
};

/**
 * 创建任务
 * @param {*} query
 */
export const add_Mission_list_page = query => {
  return API.post(`/api/v1.0/BMission`, query);
};

/**
 * 删除任务
 * @param {*} id
 */
export const del_Mission_list_page = id => {
  return API.delete(`/api/v1.0/BMission/${id}`);
};

/**
 * 修改任务
 * @param {*} id
 */
export const edit_Mission_list_page = (id, query) => {
  return API.put(`/api/v1.0/BMission/${id}`, query);
};

/**
 * 修改任务状态
 * @param {*} id
 */
export const state_Mission_list_page = (id, status) => {
  return API.patch(`/api/v1.0/BMission/${id}/${status}`);
};

/**
 * 获取任务详情
 * @param {*} query
 */
export const get_Mission_detail_page = (MissionId, page, limit) => {
  return API.get(`/api/v1.0/BMission/Detail/${MissionId}/${page}/${limit}`);
};

/**
 * 创建任务详情
 * @param {*} query
 */
export const add_Mission_detail_page = query => {
  return API.post(`/api/v1.0/BMission/Detail`, query);
};

/**
 * 删除任务详情
 * @param {*} id
 */
export const del_Mission_detail_page = id => {
  return API.delete(`/api/v1.0/BMission/Detail/${id}`);
};

/**
 * 修改任务详情
 * @param {*} id
 */
export const edit_Mission_detail_page = (MissionDetailId, query) => {
  return API.put(`/api/v1.0/BMission/Detail/${MissionDetailId}`, query);
};

/**
 * 查询活跃度列表
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_BLiveness_list_page = (page, limit, query) => {
  return API.get(`/api/v1.0/BLiveness/${page}/${limit}`, query);
};

/**
 * 创建活跃度
 * @param {*} query
 */
export const add_BLiveness_list_page = query => {
  return API.post(`/api/v1.0/BLiveness`, query);
};

/**
 * 修改活跃度
 * @param {*} query
 */
export const edit_BLiveness_list_page = (id, query) => {
  return API.put(`/api/v1.0/BLiveness/${id}`, query);
};

/**
 * 删除活跃度
 * @param {*} id
 */
export const del_BLiveness_list_page = id => {
  return API.delete(`/api/v1.0/BLiveness/${id}`);
};

/**
 * 获取用户权限列表
 *
 */
export const get_user_permission = () => {
  return API.get('/api/v1.0/UserPermission');
};

/**
 * 查询签到列表
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_BSignIn_list_page = () => {
  return API.get(`/api/v1.0/BSignIn`);
};

/**
 * 创建签到
 * @param {*} query
 */
export const add_BSignIn = query => {
  return API.post(`/api/v1.0/BSignIn`, query);
};

/**
 * 修改签到
 * @param {*} query
 */
export const edit_BSignIn = (id, query) => {
  return API.put(`/api/v1.0/BSignIn/${id}`, query);
};

/**
 * switch签到
 * @param {*} query
 */
export const switch_BSignIn = (id, status) => {
  return API.put(`/api/v1.0/BSignIn/${id}/${status}`);
};

/**
 * 查询活跃度列表
 * @param {*} page
 * @param {*} limit
 * @param {*} query
 */
export const get_activity_draw_settings = () => {
  return API.get(`/api/v1.0/BMarketingWithdrawal`);
};

/**
 * 创建活跃度
 * @param {*} query
 */
export const add_activity_draw_setting = query => {
  return API.post(`/api/v1.0/BMarketingWithdrawal`, query);
};

/**
 * 修改活跃度
 * @param {*} query
 */
export const edit_activity_draw_setting = (id, query) => {
  return API.put(`/api/v1.0/BMarketingWithdrawal/${id}`, query);
};

/**
 * 删除活跃度
 * @param {*} id
 */
export const del_activity_draw_setting = id => {
  return API.delete(`/api/v1.0/BMarketingWithdrawal/${id}`);
};

/**
 * 获取站点信息
 */
export const get_site_info = () => {
  return API.get(`/api/v1.0/Connect`);
};

/**
 * 获取ip设置列表
 */
export const get_ip_setting = (page, limit, query) => {
  return API.get(`/api/v1.0/IPWhite/${page}/${limit}`, query);
};

/**
 * 添加ip设置
 */
export const add_ip_setting = params => {
  return API.post(`/api/v1.0/IPWhite`, params);
};

/**
 * 更新ip设置
 */
export const update_ip_setting = (id, params) => {
  return API.put(`/api/v1.0/IPWhite/${id}`, params);
};

/**
 * 更新ip设置
 */
export const del_ip_setting = (id, params) => {
  return API.delete(`/api/v1.0/IPWhite/${id}`, params);
};

export const get_receipt_account_secret = ReceiptAccountId => {
  return API.get(`/api/v1.0/BReceiptAccount/Secret/${ReceiptAccountId}`);
};

export const get_receipt_account_secret_provider = () => {
  return API.get(`/api/v1.0/BReceiptAccount/Secret`);
};

export const get_all_provider_name = () => {
  return API.get(`/api/v1.0/CEnumeration/ProviderName`);
};

/**
 * 获取代理报表
 */
export const get_RAgent_sheet = (page,limit,query)=>{
  return API.get(`/api/v1.0/RAgent/${page}/${limit}`,query)
}

/**
 * 获取下级代理报表
 */
export const get_RAgent_child_sheet = (Id,query)=>{
  return API.get(`/api/v1.0/RAgent/Child/${Id}`,query)
}

/**
 * 获取运营总报表
 */
export const get_RFinance_sheet = (query)=>{
  return API.get(`/api/v1.0/RFinance/Operational`,query)
}


/**
 * 获取充提报表
 */
export const get_RechargeWithdraw_sheet = (query)=>{
  return API.get(`/api/v1.0/RFinance/RechargeWithdraw`,query)
}


/**
 * 获取游戏报表
 */
export const get_RGame_sheet = (query)=>{
  return API.get(`/api/v1.0/RGame/WinLose`,query)
}

/**
 * 获取任务报表
 */
export const get_Mission_sheet = (query)=>{
  return API.get(`/api/v1.0/RMarketing/Mission`,query)
}

/**
 * 获取活动报表
 */
export const get_Activity_sheet = (query)=>{
  return API.get(`/api/v1.0/RMarketing/Activity`,query)
}


/**
 * 获取活跃度报表 
 */
export const get_Liveness_sheet = (query)=>{
  return API.get(`/api/v1.0/RMarketing/Liveness`,query)
}



