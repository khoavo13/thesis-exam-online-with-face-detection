import { useNavigate } from "react-router-dom";

import { Button, Result } from "antd";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, Trang không tồn tại."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay trở lại
        </Button>
      }
    />
  );
};

export default NotFound;
