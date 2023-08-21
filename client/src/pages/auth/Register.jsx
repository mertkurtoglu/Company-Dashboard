import React from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    axios
      .post("http://localhost:8080/register", values)
      .then((res) => {
        if (res.status === 201) {
          message.success("Registration Successful");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Registration Failed:", err);
        form.resetFields();
        message.error("Registration Failed");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: "500px", padding: "30px 30px 0px 30px" }}>
        <Form
          name="normal_login"
          className="login-form"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <h1 style={{ display: "flex", justifyContent: "center", fontWeight: "bold", marginBottom: "25px" }}>
            Sign up for an account
          </h1>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              style={{ fontSize: "18px", height: "50px" }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              style={{ fontSize: "18px", height: "50px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              style={{ fontSize: "18px", height: "50px" }}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="agreement" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: "16px" }}>I have read the agreement</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ fontSize: "18px", height: "50px", width: "100%" }}
            >
              Sign up
            </Button>
            <p style={{ fontSize: "16px", display: "flex", justifyContent: "center", marginTop: "15px" }}>
              Already a member ? <a href="/">Sign in now!</a>
            </p>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
