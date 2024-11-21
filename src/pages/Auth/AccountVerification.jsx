import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { verifyUserAPI } from "~/apis";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";

const AccountVerification = () => {
  const [searchParams] = useSearchParams();
  const { email, token } = Object.fromEntries([...searchParams]);
  const [verify, setVerify] = useState(false);

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then((res) => {
        setVerify(true);
      });
    }
  }, [email, token]);
  if (!email || !token) return <Navigate to="/404" />;
  if (!verify) {
    return <PageLoadingSpinner caption="Verifying your account..." />;
  }
  // verify thành công => đá về login và kèm theo giá trị verifyEmail
  return <Navigate to={`/login?verifyEmail=${email}`} />;
};

export default AccountVerification;
