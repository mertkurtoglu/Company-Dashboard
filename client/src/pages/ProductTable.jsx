import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Space, Table, Button, Modal, Form, message } from "antd";
const { Search } = Input;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "productName",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "productCategory",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Product Amount",
      dataIndex: "amount",
      key: "productAmount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Amount Unit",
      dataIndex: "unit",
      key: "amountUnit",
      sorter: (a, b) => a.unit.localeCompare(b.unit),
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "companyName",
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "",
      key: "action",
      render: (product) => (
        <Space style={{ display: "flex", justifyContent: "center" }} size="middle">
          <Button onClick={() => showModal(product)}>Edit</Button>
          <Button onClick={() => handleRemove(product._id)} danger>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/product")
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRemove = async (_id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/product/${_id}`);
      if (response.status === 200) {
        const updatedProducts = products.filter((product) => product._id !== _id);
        setProducts(updatedProducts);
        message.success("Product removed successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to remove the product. Please try again.");
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const showModal = (product = null) => {
    if (product) {
      form.setFieldsValue({
        _id: product._id,
        name: product.name,
        category: product.category,
        amount: product.amount,
        unit: product.unit,
        company: product.company,
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
    const { _id, name, category, amount, unit, company } = values;

    try {
      let response;
      if (_id) {
        response = await axios.put(`http://localhost:8080/product/${_id}`, {
          name,
          category,
          amount,
          unit,
          company,
        });
      } else {
        // Add a new product
        response = await axios.post("http://localhost:8080/product", {
          name,
          category,
          amount,
          unit,
          company,
        });
      }

      if (response.status === 200) {
        if (_id) {
          const updatedProducts = products.map((product) => {
            if (product._id === _id) {
              return {
                ...product,
                name,
                category,
                amount,
                unit,
                company,
              };
            }
            return product;
          });

          setProducts(updatedProducts);
          message.success("Product updated successfully!");
        } else {
          setProducts([...products, response.data]);
          message.success("Product added successfully!");
        }

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error processing product:", error);
      message.error(
        _id ? "Failed to update the product. Please try again." : "Failed to add the product. Please try again."
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Modal title="Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
          <Form.Item name="category" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Category" placeholder="Category" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="amount" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Amount" placeholder="Amount" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="unit" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Unit" placeholder="Unit" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item name="company" rules={[{ required: false }]} style={{ marginBottom: "20px" }}>
            <Input label="Company" placeholder="Company" style={{ fontSize: "18px", height: "50px" }} />
          </Form.Item>
          <Form.Item>
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
          Add Product
        </Button>
        <Search placeholder="Search Products, Categories or Companies" onChange={handleSearch} />
      </div>
      <Table
        style={{ border: "solid 1px lightgrey", borderRadius: "10px" }}
        columns={columns}
        dataSource={filteredProducts} // Use filtered products
        showSorterTooltip={true}
      />
    </div>
  );
};

export default ProductTable;
