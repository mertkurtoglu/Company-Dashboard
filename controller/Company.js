const Company = require("../models/Company");

const handleError = (error, res) => {
  console.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = {
  async index(req, res) {
    try {
      const companies = await Company.find().sort({ name: 1 });

      if (!companies.length) {
        return res.status(401).json({ message: "No companies" });
      }

      return res.status(200).json({ message: "Successful", companies });
    } catch (error) {
      return handleError(error, res);
    }
  },

  async add(req, res) {
    try {
      const company = new Company(req.body);
      const savedCompany = await company.save();
      res.status(200).send(savedCompany);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const { _id } = req.params;
      const company = await Company.findOneAndUpdate({ _id }, req.body, { new: true });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      return res.status(200).json({ message: "Company updated successfully", company });
    } catch (error) {
      return handleError(error, res);
    }
  },

  async remove(req, res) {
    try {
      const { _id } = req.params;
      const company = await Company.findOneAndDelete({ _id });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      return res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  },
};
