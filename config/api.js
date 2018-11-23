
// 局域网测试使用
var WxApiRoot = 'http://192.168.0.144:8082/wx/';
// 云平台部署时使用
//var WxApiRoot = 'https://heizhu360.datbc.com/wx/wx/';

// 局域网测试时使用
//var StorageApi = 'http://192.168.1.28:8081/storage/storage/create';
// 云平台部署时使用
var StorageApi = 'https://heizhu360.datbc.com/pic/storage/storage/create';


module.exports = {
    IndexUrl: WxApiRoot + 'home/index', //首页数据接口
    AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
    AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
    AuthRegister: WxApiRoot + 'auth/register', //账号注册
    AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
    RegionList: WxApiRoot + 'region/list',  //获取区域列表
    ExitLogin: WxApiRoot + 'auth/exitLogin',//退出登录
    StorageUpload: StorageApi,  //图片上传
    GetDictionary: WxApiRoot + 'dictionary/get',//获取字典值
    SaveExcellentPig: WxApiRoot + 'excellent/save',//新增修改种猪信息
    ListExcellentPig: WxApiRoot + 'excellent/list',//查询种猪列表
    DetailExcellentPig: WxApiRoot + 'excellent/detail', //查询种猪详情
    UpdateExcellentPig: WxApiRoot + 'excellent/update',//修改状态
    QrCodeCheck: WxApiRoot + 'qrCode/check',//校验二维码
    QrCodeSubstitution: WxApiRoot + 'qrCode/substitution',//扫码密文
    QrCodeDecrypt: WxApiRoot + 'qrCode/decrypt',//检疫检验证明扫码
    ExcellentPigDelete: WxApiRoot + 'excellent/delete',//种猪删除
    ExcellentVaccineAdd: WxApiRoot + 'excellent/vaccine/save',//疫苗新增修改
    ListExcellentVaccine: WxApiRoot + 'excellent/vaccine/list',//疫苗列表
    ListExcellentMatingSow: WxApiRoot + 'excellent/mating/sow',//待配种母猪
    ListExcellentMatingBoar: WxApiRoot + 'excellent/mating/boar',//待配种公猪
    ExcellentPigMatingCheck: WxApiRoot + 'excellent/mating/check',//交配校验族谱
    ExcellentPigMatingAdd: WxApiRoot + 'excellent/mating/save',//配种新增
    ListExcellentPigMating: WxApiRoot + 'excellent/mating/list',//交配列表
    SowDetail: WxApiRoot + 'excellent/mating/sowDetail',//母猪最新配种记录
    ExcellentPigChildbirthSave: WxApiRoot + 'excellent/childbirth/save',//母猪生产保存
    ExcellentPigChildbirthList: WxApiRoot + 'excellent/childbirth/list',//母猪生产列表
    ExcellentPigSowDetail: WxApiRoot + 'excellent/childbirth/sowDetail',//母猪最新生产详情
    OrdinaryPigRegisterSave: WxApiRoot + 'ordinary/register/save',//个体识别保存
    ChangeCCExcellentPig: WxApiRoot + 'excellent/changeCC',//种猪转栏
    CheckQuarantine: WxApiRoot +'ordinary/quarantine/get',//检疫合格证明二维码结果
    QuarantineSave: WxApiRoot +'ordinary/quarantine/save',//检疫合格证明保存
    SlaughterSave: WxApiRoot + 'ordinary/slaughter/save',//屠宰记录新增
    OrdinaryWeightAdd: WxApiRoot + 'ordinary/weight/save',//肉猪称重保存
    OrdinaryWeightlist: WxApiRoot + 'ordinary/weight/list',//肉猪称重记录
    DataClassification: WxApiRoot + 'reportForm/classification',//栏舍存栏报表
    DataPigAge: WxApiRoot + 'reportForm/pigAge',//种猪猪龄报表
    DataChildbirthSummary: WxApiRoot + 'reportForm/childbirthSummary',//分娩报表
    DataBirthNumber: WxApiRoot + 'reportForm/birthNumber',//母猪胎龄
    PhotoSave: WxApiRoot + 'photo/save',//照片保存
    PhotoList: WxApiRoot + 'photo/list',//照片列表
    FeedingList: WxApiRoot + 'ordinary/feeding/list'//采食记录
};