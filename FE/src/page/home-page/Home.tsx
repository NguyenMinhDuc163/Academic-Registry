import HomeImg from "../../assets/img/HomeImage.png";
const POST = [
  {
    title:
      "Thông báo V/v: Yêu cầu sinh viên kiểm tra điểm học kỳ I năm học 2023-2024 được cập nhật trên QLĐT",
    time: "26/03/2024 14:46",
  },
  {
    title:
      "Thông báo V/v: Đăng ký học các học phần tốt nghiệp các ngành khối kinh tế và truyền thông đa phương tiện khóa 2020",
    time: "25/03/2024 14:46",
  },
  {
    title:
      "Thông báo: V/v Hệ thống QLĐT đang cập nhật điểm học kỳ 1 năm học 2023-2024",
    time: "01/03/2024 11:24",
  },
  {
    title: "Thông báo: Mở hệ thống đăng ký môn học học kỳ 2 năm học 2023-2024",
    time: "11/12/2023 00:00",
  },
  {
    title:
      "Thông báo: Mở hệ thống cho sinh viên đăng ký thời khóa biểu các lớp học phần trong đợt học lớp riêng Học kỳ I – năm học 2023-2024",
    time: "19/10/2023 08:37",
  },
  {
    title: "Thông báo V/v: Mở hệ thống Đăng ký chuyên ngành D20VT",
    time: "16/10/2023 11:11",
  },
  {
    title:
      "Thông báo V/v: Đăng ký môn học thay thế tốt nghiệp/ Đồ án tốt nghiệp các ngành khối kỹ thuật khóa 2019",
    time: "18/09/2023 16:04",
  },
  {
    title:
      "Thông báo V/v: Yêu cầu sinh viên kiểm tra điểm học kỳ II và học kỳ phụ (hè) năm học 2022-2023 được cập nhật trên QLĐT",
    time: "17/08/2023 09:31",
  },
  {
    title: "Thông báo: Về việc đăng ký học ghép học kỳ 1 năm học 2023 - 2024",
    time: "03/08/2023 14:11",
  },
];
const TUTORIAL = [
  {
    title:
      "Hướng dẫn sử dụng cổng thông tin điện tử quản lý đào tạo cho giảng viên và cố vấn học tập",
    time: "01/08/2023 10:59 ",
  },
  {
    title:
      "Hướng dẫn sử dụng cổng thông tin điện tử quản lý đào tạo cho sinh viên",
    time: "01/07/2023 00:00  ",
  },
];
const Home = () => {
  return (
    <div>
      <div className=" rounded-md overflow-hidden relative shadow-lg">
        <div className="text-white bg-mainRed text-[0.8rem] px-[20px] py-[6px]">
          THÔNG BÁO
        </div>
        <div className="flex pr-[14px]">
          <div className="flex-[4] px-[8px]">
            <img
              src={HomeImg}
              alt="HomeImg"
              className="py-[4px] rounded-lg object-cover"
            />
            <p className=" italic text-[0.8em] text-end ">02/04/2024 11:42</p>
            <div className="text-justify font-semibold text-[0.95em]">
              Thông báo: V/v Đăng ký thời khóa biểu các lớp học phần trong đợt
              học lớp riêng Học kỳ II – năm học 2023-2024
            </div>
            <img
              src="https://qldt.ptit.edu.vn/assets/images/new-icon.gif"
              alt="gif"
              className="h-[24px] px-[10px]"
            />
          </div>

          <div className="flex-[8] ml-[4px] border-l-[1px] my-[8px] border-[#ccccccd1] ">
            {POST.map((item) => (
              <div
                key={item.title.toString()}
                className="flex  items-start pb-[4px]  border-[#ccccccd1] border-b-[1px]"
              >
                <div className="flex-[10] text-justify px-[10px]">
                  <i className="fa-solid fa-angles-right text-mainRed mr-[6px] text-[14px]"></i>
                  <span className="text-[0.9em]">{item.title}</span>

                  <img
                    src="https://qldt.ptit.edu.vn/assets/images/new-icon.gif"
                    alt="gif"
                    className="h-[24px] px-[10px] inline"
                  />
                </div>
                <div className="text-[0.8em] opacity-80 italic flex-[2] mt-[6px] text-end">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[10px] rounded-md overflow-hidden shadow-md pb-[6px]">
        <div className="text-white bg-mainRed text-[0.8rem] px-[20px] py-[6px] ">
          HƯỚNG DẪN
        </div>
        <div>
          {TUTORIAL.map((item,idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex-[8] flex items-center px-[10px]">
                <i className="fa-solid fa-angles-right text-mainRed mr-[8px] text-[14px]"></i>
                <div>{item.title}</div>
              </div>
              <p className="text-end flex-[2] text-[0.8em] italic opacity-80 px-[10px]">
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
