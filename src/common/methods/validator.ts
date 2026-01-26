  export const isMobile = (data:string) => {
    if (!data) {
      return {status:false,message : "شماره تلفن همراه را وارد کنید"};
    }
    var mobile = toEnDigit(data.toString().trim());
    if (mobile === "") {
      return {status:false,message : "شماره تلفن همراه را وارد کنید"};
    } else if (isNaN(+mobile)) {
      return {status:false,message : "شماره تلفن همراه را بصورت عدد وارد کنید"};
    } else if (mobile.length !== 11) {
      return {status:false,message : "تعداد نویسه های شماره تلفن همراه باید 11 نویسه باشد"};
    } else {
      let regex = /^(?:0|98|\+98|\+980|0098|098|00980)?(9\d{9})$/;
      if (regex.exec(mobile)) return {status:true,message:''};
      else {
        return {status:false,message : "شماره تلفن همراه معتبر نمی باشد"};
      }
    }
  }
  const toEnDigit = (data:string) => {
    const persianNumbers = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
    const arabicNumbers = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠'];
    const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    return data.toString()
      .split('')
      .map(
        (c) =>
          englishNumbers[persianNumbers.indexOf(c)] ||
          englishNumbers[arabicNumbers.indexOf(c)] ||
          c,
      )
      .join('')
      .toString();
  }
  export const isNationalCode = (data:string) => {
    if (!data) {
      return {status:false,message : "کد ملی را وارد کنید"};
    }

    data = toEnDigit(data.toString().trim())
    if (data == "") {
      return {status:false,message : "کد ملی را وارد کنید"};
    }
    else if (isNaN(+data)) {
      return {status:false,message : "کد ملی را بصورت عدد وارد کنید"};
    }
    else if (data.length != 10) {
      return {status:false,message : "تعداد نویسه های کد ملی باید 10 نویسه باشد"};
    }
    else {
      switch (data) {
        case "0000000000":
        case "1111111111":
        case "22222222222":
        case "33333333333":
        case "4444444444":
        case "5555555555":
        case "6666666666":
        case "7777777777":
        case "8888888888":
        case "9999999999":
          return {status:false,message : "کد ملی وارد شده معتبر نمی باشد"};
      }
      if (data.length === 10) {
        var m = data;
        var chArray = data.toString().split('');
        var num0 = (+chArray[0]) * 10;
        var num2 = (+chArray[1]) * 9;
        var num3 = (+chArray[2]) * 8;
        var num4 = (+chArray[3]) * 7;
        var num5 = (+chArray[4]) * 6;
        var num6 = (+chArray[5]) * 5;
        var num7 = (+chArray[6]) * 4;
        var num8 = (+chArray[7]) * 3;
        var num9 = (+chArray[8]) * 2;
        var a = +chArray[9];

        var b = (((((((num0 + num2) + num3) + num4) + num5) + num6) + num7) + num8) + num9;
        var c = b % 11;

        if (!(((c < 2) && (a == c)) || ((c >= 2) && ((11 - c) == a)))) {
          return {status:false,message : "کد ملی وارد شده معتبر نمی باشد"};
        } else {
          return {status:true,message : ''};
        }
      }
      else {
        return {status:false,message : "کد ملی وارد شده باید 10 رقم باشد"};
      }
    }
  }
  export const isPhone = (data:string) => {
    if (!data) {
      return {status:false,message : "شماره تلفن ثابت را وارد کنید"};
    }
    let phone = toEnDigit(data.toString().trim())
    if (phone == "") {
      return {status:false,message : "شماره تلفن ثابت را وارد کنید"};
    } else if (isNaN(+phone)) {
      return {status:false,message : "شماره تلفن ثابت را بصورت عدد وارد کنید"};
    } else if (phone.length != 11) {
      return {status:false,message : "تعداد نویسه های شماره تلفن ثابت باید 11 نویسه باشد"};
    } else {
      let regex = /^0[0-9]{2,}[0-9]{7,}$/
      if (regex.exec(phone)) return {status:true,message : ""};
      else {
        return {status:false,message : "شماره تلفن ثابت معتبر نمی باشد"};
      }
    }
  }

