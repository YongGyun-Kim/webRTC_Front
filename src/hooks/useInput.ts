import { useState } from "react";

const useInput = (defaultValue: String) => {
  const [value, setValue] = useState(defaultValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setValue(value);
  };

  return [value, onChange];
};

export default useInput;
