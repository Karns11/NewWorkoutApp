import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useAddToNewsletterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Message from "./Message";
import Loader from "./Loader";

const Newslettter = () => {
  const [email, setEmail] = useState("");

  const [addToNewsletter, { isLoading, error }] = useAddToNewsletterMutation();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await addToNewsletter({ email });
      toast.success("Successfully signed up for newsletter");
      setEmail("");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="w-full py-16 text-white px-4 bg-black">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3">
        <div className="lg:col-span-2 my-4">
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Want to stay up to date with the latest news?
          </h1>
          <p>Sign up to our newsletter!</p>
        </div>
        <div className="my-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            {/* <input
              className="p-3 flex w-full rounded-md text-black"
              type="email"
              placeholder="Enter Email"
            /> */}
            <Form onSubmit={handleNewsletterSubmit} className="w-100">
              <Form.Group controlId="email" className="my-2">
                <Form.Control
                  className="p-3 flex w-full rounded-md text-black"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="bg-[#00df9a] text-black rounded-md font-medium w-[200px] ml-4 mb-6 px-6 py-3"
                >
                  Notify Me
                </button>
              </div>
            </Form>
            {isLoading && <Loader />}
          </div>
        </div>
      </div>
      {error && <Message variant="danger">{error}</Message>}
    </div>
  );
};

export default Newslettter;
