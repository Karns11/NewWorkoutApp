import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");

  return (
    <Form className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search friends..."
        className="mr-sm-2 ms-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
