const Footer = () => {
  return (
    <div className="mt-[10px] ">
      <div className="bg-redLight py-[10px] flex">
        <div className="flex-[15] flex flex-col items-end">
          <div>
            <h1>THỐNG KÊ TRUY NHẬP</h1>
            <div className="flex justify-between mt-[10px]">
              <i className="fa-solid fa-users text-mainRed"></i>
              <p className="mx-[10px]">Đang truy nhập</p>
              <p>10</p>
            </div>
            <div className="flex justify-between">
              <i className="fa-solid fa-user-graduate text-mainRed mr-[6px]"></i>
              <p className="mx-[10px]">SV đăng nhập</p>
              <p>10</p>
            </div>
            <div className="flex justify-between">
              <i className="fa-solid fa-user-tie text-mainRed mr-[6px]"></i>
              <p className="mx-[10px]">GV đăng nhập</p>
              <p>10</p>
            </div>
          </div>
        </div>

        <div className="flex-[3]  px-[20px] "></div>
      </div>

      <div className="bg-mainRed text-center py-[10px] text-white">
        <h1>Copyright © 2024 Học viện Công nghệ Bưu chính Viễn thông</h1>
        <h1>Version: BCVT-2024.04B.42</h1>
      </div>
    </div>
  );
};

export default Footer;
