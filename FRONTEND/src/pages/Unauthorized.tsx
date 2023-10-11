import { useNavigate } from "react-router-dom";

import { Button, Result } from "antd";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, bạn không được phép truy cập vào trang này."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay trở lại
        </Button>
      }
    />
  );
};

export default Unauthorized;
