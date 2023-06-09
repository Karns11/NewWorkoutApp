import { useState } from "react";
import { Form } from "react-bootstrap";

const SearchBox = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    setKeyword(e.target.value); //setKyword anytime input changes
    onSearch(e.target.value); //call onSearch callback function anytime input changes
  };

  return (
    <Form className="d-flex mb-4">
      <Form.Control
        type="text"
        name="q"
        onChange={handleSearch}
        value={keyword}
        placeholder="Type to search for friends by name..."
        className="mr-sm-2 ms-sm-5"
      ></Form.Control>
    </Form>
  );
};

export default SearchBox;
