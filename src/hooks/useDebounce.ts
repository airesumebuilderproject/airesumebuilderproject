import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 2000) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // ✅ Pehle ka timeout clear hoga
  }, [value, delay]);

  return debouncedValue;
}


// ----------------------------------- OG CODE  :
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