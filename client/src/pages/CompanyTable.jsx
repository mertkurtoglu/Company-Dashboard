import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Space, Table, Button, Modal, Form, message } from "antd";
const { Search } = Input;

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
      key: "companyName",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Company Legal Number",
      dataIndex: "number",
      key: "legalNumber",
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: "Incorporation Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (website) => (
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      ),
    },
    {
      title: "",
      key: "action",
      render: (company) => (
        <Space style={{ display: "flex", justifyContent: "center" }} size="middle">
          <Button onClick={() => showModal(company)}>Edit</Button>
          <Button onClick={() => handleRemove(company._id)} danger>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/company/")
      .then((res) => {
        if (res.status === 200) {
          setCompanies(res.data.companies);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch companies:", err);
      });
  }, []);

  const handleRemove = async (_id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/company/${_id}`);
      if (response.status === 200) {
        const updatedCompanies = companies.filter((company) => company._id !== _id);
        setCompanies(updatedCompanies);
        message.success("Company removed successfully!");
      }
    } catch (error) {
      console.error("Error remove company:", error);
      message.error("Failed to remove the company. Please try again.");
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const showModal = (company = null) => {
    if (company) {
      form.setFieldsValue({
        _id: company._id,
        name: company.name,
        number: company.number,
        country: company.country,
        website: company.website,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const { _id, name, number, country, website } = values;

    try {
      let response;
      if (_id) {
        // Update the existing company
        response = await axios.put(`http://localhost:8080/company/${_id}`, {
          name,
          number,
          country,
          website,
        });
      } else {
        // Add a new company
        const currentDate = new Date().toISOString();
        response = await axios.post("http://localhost:8080/company", {
          name,
          number,
          country,
          website,
          date: currentDate,
        });
      }

      if (response.status === 200) {
        if (_id) {
          const updatedCompanies = companies.map((company) => {
            if (company._id === _id) {
              return {
                ...company,
                name,
                number,
                country,
                website,
              };
            }
            return company;
          });

          setCompanies(updatedCompanies);
          message.success("Company updated successfully!");
        } else {
          setCompanies([...companies, response.data]);
          message.success("Company added successfully!");
        }

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error processing company:", error);
      message.error(
        _id ? "Failed to update the company. Please try again." : "Failed to add the company. Please try again."
      );
    }
  };

  const filteredCompanies = companies.filter((company) => {
    return (
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.number.toString().includes(searchTerm) ||
      company.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <Modal title="Company" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="normal_login"
          className="login-form"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item name="_id" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="name" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Name" placeholder="Name" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="number" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Number" placeholder="Number" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="country" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Country" placeholder="Country" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="website" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Website" placeholder="Website" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item>
            <Form.Item name="date" hidden>
              <Input type="hidden" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ fontSize: "18px", height: "50px", width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Button style={{ marginRight: "10px" }} onClick={() => showModal()}>
          Add Company
        </Button>
        <Search placeholder="Search Companies, Legal Numbers or Countries" onChange={handleSearch} />
      </div>
      <Table
        style={{ border: "solid 1px lightgrey", borderRadius: "10px" }}
        columns={columns}
        dataSource={filteredCompanies}
        showSorterTooltip={true}
      />
    </div>
  );
};

export default CompanyTable;
