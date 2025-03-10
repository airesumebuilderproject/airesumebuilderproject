import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 1000) {
  // 🔹 Delay ko 1000ms (1 sec) kar diya taaki API calls ka gap aur zyada ho
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // 🔹 Previous timeout clear taaki duplicate calls na ho
    };
  }, [value, delay]);

  return debouncedValue;
}

// import { useEffect, useState } from "react";

// export default function useDebounce<T>(value: T, delay: number = 250) {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => clearTimeout(handler);
//   }, [value, delay]);

//   return debouncedValue;
// }