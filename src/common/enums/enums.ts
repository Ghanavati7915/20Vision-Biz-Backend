// Generated Prisma enums as TypeScript enums

//#region دسترسی ها
export enum Permissions {
   Monitoring = "Monitoring",
   Chat = "Chat",
}
//#endregion
//#region نوع شهر - استان - کشور
export enum CityType {
   Country = "Country",
   Province = "Province",
   City = "City",
}
//#endregion
//#region موجودیت
export enum Entity {
   Personal = "Personal",
   Company = "Company",
}
//#endregion
//#region نوع موجودیت
export enum EntityType {
   Primary = "Primary",
   Contact = "Contact",
}
//#endregion
//#region جنسیت
export enum Gender {
   Male = "Male",
   FeMale = "FeMale",
}
//#endregion
//#region طرح ها
export enum Plan {
   Bronze = "Bronze",
   Silver = "Silver",
   Gold = "Gold",
}
//#endregion
//#region نوع خط تلفن
export enum PhoneTypes {
   LandLine = "LandLine", // تلفن ثابت
   Mobile = "Mobile", // همراه
}
//#endregion
//#region اپراتور تلفن
export enum PhoneOperators {
   Unknown = "Unknown", // نامشخص
   Telecommunications = "Telecommunications", // مخابرات
   Irancell = "Irancell", // ایرانسل
   HamrahAval = "HamrahAval", // همراه اول
   Rightell = "Rightell", // رایتل
}
//#endregion
//#region نوع فاکتور
export enum FactorType {
  PreFactor = "PreFactor", //پیش فاکتور
  Preview = "Preview",//پیش نمایش
  Master = "Master",//رسمی
}
//#endregion
//#region نوع سفارش
export enum OrderType {
  Sent = 'Sent', //ارسال شده ( خرید )
  Received = 'Received',//دریافت شده ( فروش )
}
//#endregion
//#region انواع ارز ها
export enum CurrencyTypes {
   IRRial = "IRRial",
   USDollar = "USDollar",
}
//#endregion
//#region انواع حساب بانکی
export enum BankAccountTypes {
   CurrentAccount = "CurrentAccount", // حساب جاری
   ShortTerm = "ShortTerm", // کوتاه مدت
   LongTerm = "LongTerm", // بلند مدت
   Deposit = "Deposit", // سپرده
}
//#endregion
//#region نوع شرکت
export enum CompanyType {
   Personal = "Personal", //حقیقی
   Legal = "Legal", //حقوقی
   CivilPartnership = "CivilPartnership", //مشارکت مدنی
   NonIranianNationals = "NonIranianNationals", //اتباع غیر ایرانی
   Consumer = "Consumer", //مصرف کننده نهایی
}
//#endregion
//#region وضعیت شرکت
export enum CompanyStateType {
   Private = "Private", //خصوصی
   Public = "Public", //دولتی
   Holding = "Holding", //هلدینگ
   Multinational = "Multinational", //چند ملیتی
}
//#endregion
//#region نوع مالکیت شرکت
export enum OrganType {
   SpecialShares = "SpecialShares", //سهامی خاص
   PublicShares = "PublicShares", //سهامی عام
   LimitedLiability = "LimitedLiability", //مسئولیت محدود
   Solidarity = "Solidarity", //تضامنی
   Relative = "Relative", //نسبی
   MixedShares = "MixedShares", //مختلط سهامی
   MixedNonEquity = "MixedNonEquity", //مختلط غیر سهامی
   Cooperative = "Cooperative", //تعاونی
}
//#endregion
//#region مدل شعبه
export enum BranchTypeModels {
   Home = "Home", // خانه
   OfficeCenter = "OfficeCenter", // دفتر مرکزی
   Factory = "Factory", // کارخانه
   WareHouse = "WareHouse", // انبار
   SaleOffice = "SaleOffice", // دفتر فروش
}
//#endregion

//#region شبکه های اجتماعی
export enum SocialApps {
  Telegram = 'Telegram',
  Instagram = 'Instagram',
}
//#endregion