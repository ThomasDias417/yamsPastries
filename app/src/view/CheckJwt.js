import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const CheckJwt = (token) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        if (decodedToken.exp < currentTime) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      }
    };

    checkExpiration();

    const intervalId = setInterval(checkExpiration, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  return { isExpired };
};

export default CheckJwt;